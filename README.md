# YojanaDarpan — Complete Deployment Guide

## 🎯 What You're Building
A free government scheme eligibility finder for India that earns ₹1-2 lakh/month from AdSense + affiliate income. 100% automated once set up.

---

## 📋 PREREQUISITES (All Free)
- GitHub account (free) — https://github.com
- Vercel account (free) — https://vercel.com
- Supabase account (free) — https://supabase.com
- Google AdSense account — https://adsense.google.com
- Resend account (free tier) — https://resend.com
- A domain name — ~₹700/year from GoDaddy/Namecheap (buy: yojanadarpan.in)

---

## STEP 1 — SET UP SUPABASE DATABASE (15 minutes)

1. Go to https://supabase.com → Create new project
2. Name it: `yojana-darpan`
3. Choose region: **South Asia (Mumbai)** — for fastest India response
4. Set a strong database password, save it
5. Wait 2 minutes for project to initialize

### Create Tables:
1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Copy the ENTIRE contents of `database/schema.sql`
3. Paste and click **Run**
4. You should see: "Success. No rows returned."

### Get your keys:
1. Go to **Project Settings → API**
2. Copy:
   - `Project URL` → save as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → save as `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## STEP 2 — PUSH CODE TO GITHUB (10 minutes)

1. Go to https://github.com → New Repository
2. Name: `yojana-darpan`
3. Set to **Private**
4. On your computer, open terminal in the project folder:

```bash
git init
git add .
git commit -m "Initial commit - YojanaDarpan"
git remote add origin https://github.com/YOUR_USERNAME/yojana-darpan.git
git push -u origin main
```

---

## STEP 3 — DEPLOY TO VERCEL (10 minutes)

1. Go to https://vercel.com → **Add New Project**
2. Click **Import from GitHub** → Select `yojana-darpan`
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add ALL variables from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL          = (from Step 1)
NEXT_PUBLIC_SUPABASE_ANON_KEY     = (from Step 1)
SUPABASE_SERVICE_ROLE_KEY         = (from Step 1)
RESEND_API_KEY                    = (from Step 5 below)
NEXT_PUBLIC_ADSENSE_CLIENT        = ca-pub-XXXXXXXX (from Step 6)
NEXT_PUBLIC_SITE_URL              = https://yojanadarpan.in
```

5. Click **Deploy**
6. Wait 3-5 minutes → Your site is LIVE at `your-project.vercel.app`!

---

## STEP 4 — CONNECT CUSTOM DOMAIN (5 minutes)

1. In Vercel → Project Settings → **Domains**
2. Add `yojanadarpan.in`
3. Vercel shows you DNS records to add
4. Go to your domain registrar (GoDaddy/Namecheap)
5. Add the DNS records Vercel shows
6. Wait 10-30 minutes → Site live at `yojanadarpan.in`
7. SSL certificate is **automatic** (free)

---

## STEP 5 — SET UP EMAIL ALERTS (10 minutes)

1. Go to https://resend.com → Create account
2. Add your domain (`yojanadarpan.in`) for sending
3. Follow their DNS verification steps
4. Go to **API Keys** → Create API Key
5. Copy the key → add to Vercel env as `RESEND_API_KEY`
6. Redeploy on Vercel (it picks up new env vars)

**Free tier: 3,000 emails/month — enough to start**

---

## STEP 6 — APPLY FOR GOOGLE ADSENSE (most important!)

1. Go to https://adsense.google.com
2. Sign in with Google account
3. Click **Get Started**
4. Enter your site URL: `https://yojanadarpan.in`
5. Add the AdSense verification code to your site:
   - In `src/app/layout.js`, replace `G-XXXXXXXXXX` with your actual GA4 ID
   - Replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense publisher ID
6. **Wait for approval: usually 2-4 weeks**
   - Your site needs real content (it already has it!)
   - Needs 20-30+ pages (you have hundreds from scheme pages!)
   - Needs Privacy Policy page (create one at https://privacypolicygenerator.info)

### While waiting for AdSense approval:
- Add more blog posts (use ChatGPT to write scheme guides)
- Share site on WhatsApp groups, Facebook
- Submit to Google Search Console for indexing

---

## STEP 7 — SET UP GITHUB ACTIONS SCRAPER (15 minutes)

This runs the scraper **automatically every day at 6 AM** — free forever on GitHub.

1. In your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add these repository secrets:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_KEY` = your service role key
   - `RESEND_API_KEY` = your Resend API key
   - `VERCEL_DEPLOY_HOOK` = (see below)

### Get Vercel Deploy Hook:
1. Vercel → Project Settings → **Git → Deploy Hooks**
2. Create hook named "Scraper Rebuild"
3. Copy the URL → add as `VERCEL_DEPLOY_HOOK` secret

### Test the scraper:
1. Go to GitHub repo → **Actions** tab
2. Click **Daily Scheme Scraper** → **Run workflow**
3. Watch it run in real-time
4. After success, check Supabase → your schemes table should have data!

---

## STEP 8 — SET UP GOOGLE SEARCH CONSOLE (5 minutes)

This gets Google to index all your scheme pages fast.

1. Go to https://search.google.com/search-console
2. Add property: `https://yojanadarpan.in`
3. Verify via DNS (add TXT record to your domain)
4. Go to **Sitemaps** → Submit: `https://yojanadarpan.in/sitemap.xml`
5. Google will start indexing within 1-7 days

---

## STEP 9 — AFFILIATE INCOME SETUP

### PM Mudra Loan (Biggest earner):
1. Apply at https://www.paisabazaar.com/affiliate/ 
2. Get affiliate link for business loans
3. Replace apply_url for Mudra scheme with your affiliate link
4. Earn ₹500-2000 per loan application

### Insurance Affiliates:
1. Apply at https://www.policybazaar.com/affiliate/
2. Replace health insurance scheme links
3. Earn ₹200-500 per lead

### Bank Affiliate Programs:
1. HDFC: https://affiliates.hdfc.com
2. SBI Cards: https://www.sbicard.com/affiliate

---

## STEP 10 — MONTHLY CHECKLIST

Every month, spend 2-3 hours on:
- [ ] Write 4 blog posts about new schemes (use ChatGPT)
- [ ] Check Google Search Console for traffic growth
- [ ] Check AdSense earnings dashboard
- [ ] Check Supabase → scraper ran successfully
- [ ] Respond to user comments on schemes

---

## 💰 INCOME TIMELINE

| Month | Traffic | AdSense | Affiliate | Total |
|-------|---------|---------|-----------|-------|
| 1-2   | 1,000   | ₹2,000  | ₹1,000    | ₹3,000 |
| 3-4   | 10,000  | ₹10,000 | ₹5,000    | ₹15,000 |
| 5-6   | 30,000  | ₹30,000 | ₹15,000   | ₹45,000 |
| 7-9   | 70,000  | ₹60,000 | ₹25,000   | ₹85,000 |
| 10-12 | 1,50,000 | ₹1,00,000 | ₹40,000 | ₹1,40,000 |

---

## 🆘 TROUBLESHOOTING

**Site not building?**
- Check Vercel build logs
- Most common: missing env variables

**AdSense not approved?**
- Add Privacy Policy page
- Add About Us page  
- Add more blog content (aim for 50+ articles)

**Scraper failing?**
- Check GitHub Actions logs
- Verify Supabase secrets are correct

**Slow site?**
- Vercel CDN handles this automatically
- Enable ISR (already set in code) for fast page loads

---

## 📞 SUPPORT

If you get stuck at any step:
1. Check Vercel docs: https://vercel.com/docs
2. Check Supabase docs: https://supabase.com/docs
3. Check Next.js docs: https://nextjs.org/docs

---

*Built with ❤️ for India. Helping people discover benefits they deserve.*
