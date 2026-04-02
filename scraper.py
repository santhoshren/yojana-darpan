"""
YojanaDarpan - Automated Scheme Scraper
Runs daily via GitHub Actions to keep scheme data fresh.
Scrapes MyScheme.gov.in and stores in Supabase.
"""

import os
import json
import time
import hashlib
import requests
from datetime import datetime

# ─── Config ──────────────────────────────────────────────────
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
MYSCHEME_API = "https://www.myscheme.gov.in/api/v2/schemes"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}

myscheme_headers = {
    "User-Agent": "Mozilla/5.0 (compatible; YojanaDarpan-Bot/1.0; +https://yojanadarpan.in/bot)",
    "Accept": "application/json",
}


def slugify(text: str) -> str:
    """Convert text to URL-safe slug"""
    import re
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text[:120]  # max 120 chars


def fetch_myscheme_list(page: int = 1, limit: int = 50) -> dict:
    """Fetch scheme list from MyScheme API"""
    try:
        resp = requests.get(
            MYSCHEME_API,
            params={"page": page, "limit": limit},
            headers=myscheme_headers,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"⚠️  MyScheme API error (page {page}): {e}")
        return {}


def transform_scheme(raw: dict) -> dict:
    """Transform raw MyScheme API response to our DB format"""
    name = raw.get("schemeName") or raw.get("name") or "Unknown Scheme"
    slug = slugify(name)

    # Build eligibility JSON
    eligibility = {
        "occupation": raw.get("beneficiaryTypes", ["any"]) or ["any"],
        "income_max": raw.get("maxIncomeLimit") or None,
        "age_min": raw.get("minAge") or 18,
        "age_max": raw.get("maxAge") or None,
        "categories": raw.get("casteCategories") or ["GEN", "SC", "ST", "OBC"],
        "states": raw.get("applicableStates") or "all",
    }

    # Determine if central or state
    state_name = raw.get("stateName") or None
    is_central = not bool(state_name) or state_name == "Central"

    return {
        "name": name,
        "slug": slug,
        "ministry": raw.get("ministryName") or raw.get("nodal_ministry") or "",
        "category": raw.get("schemeCategory") or raw.get("category") or "General",
        "benefit_type": raw.get("benefitType") or "cash",
        "benefit_amount": raw.get("benefitAmount") or raw.get("benefit") or "Varies",
        "benefit_value": int(raw.get("maxBenefitValue") or 0),
        "description": raw.get("shortDescription") or raw.get("description") or "",
        "eligibility_json": json.dumps(eligibility),
        "documents_json": json.dumps(raw.get("documentsRequired") or []),
        "how_to_apply_json": json.dumps(raw.get("applicationProcess") or []),
        "tags": raw.get("tags") or [],
        "apply_url": raw.get("schemeUrl") or raw.get("applicationUrl") or "https://myscheme.gov.in",
        "is_central": is_central,
        "state": None if is_central else state_name,
        "is_active": True,
        "updated_at": datetime.utcnow().isoformat(),
    }


def upsert_schemes_to_supabase(schemes: list[dict]) -> int:
    """Upsert batch of schemes to Supabase"""
    if not schemes:
        return 0

    url = f"{SUPABASE_URL}/rest/v1/schemes"
    resp = requests.post(
        url,
        headers={**headers, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=schemes,
        timeout=30,
    )

    if resp.status_code in (200, 201):
        return len(schemes)
    else:
        print(f"⚠️  Supabase upsert error: {resp.status_code} {resp.text[:200]}")
        return 0


def send_alert_emails(new_schemes: list[dict]):
    """Notify alert subscribers about new schemes"""
    if not new_schemes:
        return

    resend_key = os.environ.get("RESEND_API_KEY")
    if not resend_key:
        return

    # Fetch active alert subscribers
    url = f"{SUPABASE_URL}/rest/v1/alerts?is_active=eq.true&select=email,whatsapp,profile_json"
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code != 200:
        return

    subscribers = resp.json()
    emails = [s["email"] for s in subscribers if s.get("email")]

    if not emails:
        return

    # Build email content
    scheme_list = "\n".join([
        f"• {s['name']}: {s['benefit_amount']}" for s in new_schemes[:5]
    ])

    # Send via Resend batch API
    resp = requests.post(
        "https://api.resend.com/emails/batch",
        headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"},
        json=[
            {
                "from": "YojanaDarpan Alerts <alerts@yojanadarpan.in>",
                "to": email,
                "subject": f"🆕 {len(new_schemes)} New Government Schemes Added",
                "html": f"""
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
                  <h2 style="color:#E87722">New Government Schemes Added!</h2>
                  <p>{len(new_schemes)} new schemes have been added to YojanaDarpan:</p>
                  <pre style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:13px">{scheme_list}</pre>
                  <a href="https://yojanadarpan.in/find"
                     style="display:inline-block;background:#E87722;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
                    Check Your Eligibility →
                  </a>
                  <p style="color:#888;font-size:12px;margin-top:30px">
                    <a href="https://yojanadarpan.in/unsubscribe?email={email}">Unsubscribe</a>
                  </p>
                </div>
                """,
            }
            for email in emails[:100]  # Limit to 100 per run
        ],
        timeout=30,
    )

    if resp.status_code in (200, 201):
        print(f"✅ Alert emails sent to {min(len(emails), 100)} subscribers")
    else:
        print(f"⚠️  Email send failed: {resp.text[:100]}")


def get_existing_slugs() -> set:
    """Get all existing scheme slugs from Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/schemes?select=slug&limit=10000"
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code == 200:
        return {r["slug"] for r in resp.json()}
    return set()


def run_scraper():
    """Main scraper loop"""
    print(f"\n{'='*60}")
    print(f"🚀 YojanaDarpan Scraper Started: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*60}\n")

    existing_slugs = get_existing_slugs()
    print(f"📊 Existing schemes in DB: {len(existing_slugs)}")

    total_scraped = 0
    total_new = 0
    new_schemes = []
    page = 1

    while True:
        print(f"📥 Fetching page {page}...")
        data = fetch_myscheme_list(page=page, limit=50)

        raw_schemes = data.get("data") or data.get("schemes") or data.get("results") or []

        if not raw_schemes:
            print(f"✅ No more data at page {page}. Stopping.")
            break

        batch = []
        for raw in raw_schemes:
            try:
                transformed = transform_scheme(raw)
                batch.append(transformed)

                if transformed["slug"] not in existing_slugs:
                    new_schemes.append(transformed)
                    total_new += 1
            except Exception as e:
                print(f"⚠️  Transform error: {e}")

        if batch:
            count = upsert_schemes_to_supabase(batch)
            total_scraped += count
            print(f"✅ Page {page}: {count} schemes upserted ({total_new} new so far)")

        # Rate limiting — be nice to government servers
        time.sleep(1.5)

        # Check if there are more pages
        total_pages = data.get("totalPages") or data.get("total_pages") or 1
        if page >= total_pages:
            break
        page += 1

    print(f"\n{'='*60}")
    print(f"📈 Scraper Complete:")
    print(f"   Total upserted: {total_scraped}")
    print(f"   New schemes:    {total_new}")
    print(f"{'='*60}\n")

    # Send notifications for new schemes
    if new_schemes:
        print(f"📧 Sending alerts for {len(new_schemes)} new schemes...")
        send_alert_emails(new_schemes)

    return total_scraped, total_new


if __name__ == "__main__":
    run_scraper()
