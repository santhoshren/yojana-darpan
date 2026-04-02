import { SCHEMES } from '@/data/schemes';

/**
 * Core eligibility matching engine.
 * Takes user profile and returns matched schemes with match score.
 * Pure JS — no AI, no external API. Works forever.
 */
export function matchSchemes(profile) {
  const {
    age,
    gender,
    state,
    occupation,
    annualIncome,
    category, // GEN/SC/ST/OBC
    hasBPL,
    hasLand,
    landAcres,
    isStudent,
    isPregnant,
    hasDisability,
    isMinority,
    hasChildren,
    isSeniorCitizenInFamily,
    noOwnHouse,
    hasBusinessOrSelfEmployed,
  } = profile;

  const results = [];

  for (const scheme of SCHEMES) {
    const e = scheme.eligibility;
    let matchScore = 0;
    const matchReasons = [];
    const failReasons = [];

    // ── Age check ──────────────────────────────
    if (e.age_min !== undefined && age < e.age_min) {
      failReasons.push(`Minimum age ${e.age_min}`);
      continue;
    }
    if (e.age_max !== undefined && age > e.age_max) {
      failReasons.push(`Maximum age ${e.age_max}`);
      continue;
    }
    if (e.age_min || e.age_max) {
      matchScore += 10;
      matchReasons.push('Age matches');
    }

    // ── Gender check ───────────────────────────
    if (e.gender && !e.gender.includes(gender) && e.gender.length > 0) {
      // Some schemes are gender+category (Stand Up India)
      if (!e.gender_or_category) {
        failReasons.push('Gender requirement not met');
        continue;
      }
    }
    if (e.gender?.includes(gender)) {
      matchScore += 15;
      matchReasons.push('Gender matches');
    }

    // ── Occupation check ────────────────────────
    if (e.occupation && !e.occupation.includes('any')) {
      if (!e.occupation.includes(occupation)) {
        failReasons.push('Occupation not eligible');
        continue;
      }
      matchScore += 20;
      matchReasons.push('Occupation matches');
    } else {
      matchScore += 5;
      matchReasons.push('Open to all occupations');
    }

    // ── Income check ────────────────────────────
    if (e.income_max !== undefined) {
      if (annualIncome > e.income_max) {
        failReasons.push(`Income limit ₹${(e.income_max / 100000).toFixed(1)}L exceeded`);
        continue;
      }
      matchScore += 15;
      matchReasons.push('Income is within limit');
    }

    // ── Category (caste) check ──────────────────
    if (e.categories && e.categories.length > 0) {
      if (!e.categories.includes(category)) {
        failReasons.push('Category not eligible');
        continue;
      }
      matchScore += 10;
      matchReasons.push('Category eligible');
    }

    // ── BPL check ───────────────────────────────
    if (e.bpl && !hasBPL) {
      failReasons.push('BPL card required');
      continue;
    }
    if (e.bpl && hasBPL) {
      matchScore += 20;
      matchReasons.push('BPL card holder');
    }

    // ── Land check ──────────────────────────────
    if (e.land_required && !hasLand) {
      failReasons.push('Land ownership required');
      continue;
    }
    if (e.land_max && landAcres > e.land_max) {
      failReasons.push(`Max land ${e.land_max} acres`);
      continue;
    }

    // ── State check ─────────────────────────────
    if (e.states !== 'all' && Array.isArray(e.states)) {
      if (!e.states.includes(state)) {
        failReasons.push('State not covered');
        continue;
      }
      matchScore += 10;
      matchReasons.push(`Available in ${state}`);
    } else {
      matchScore += 5;
      matchReasons.push('Available in all states');
    }

    // ── Special conditions ──────────────────────
    if (e.no_pucca_house && !noOwnHouse) {
      // Not a hard fail — skip softly
    }
    if (e.epf_not_member) {
      matchScore += 5;
    }

    // Final result
    results.push({
      ...scheme,
      matchScore,
      matchReasons,
    });
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

/**
 * Calculate total potential benefit value from matched schemes
 */
export function calculateTotalBenefit(schemes) {
  return schemes.reduce((sum, s) => sum + (s.benefit_value || 0), 0);
}

/**
 * Group schemes by category
 */
export function groupByCategory(schemes) {
  return schemes.reduce((acc, scheme) => {
    const cat = scheme.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(scheme);
    return acc;
  }, {});
}
