import {
  MatchmakerNote,
  MatchResult,
  MatchTier,
  Profile,
  SubScoreDimension,
} from "./types";

function getTier(score: number): MatchTier {
  if (score >= 82) return "High Potential Match";
  if (score >= 68) return "Strong Compatibility";
  if (score >= 52) return "Moderate Fit";
  return "Low Fit";
}

function scoreKidsCompatibility(
  clientWant: Profile["wantKids"],
  candWant: Profile["wantKids"]
): { score: number; exact: boolean; compatible: boolean; summary: string } {
  if (clientWant === candWant) {
    return {
      score: 100,
      exact: true,
      compatible: true,
      summary: `Aligned on children (Both: ${candWant})`,
    };
  }
  if (clientWant === "Maybe" || candWant === "Maybe") {
    return {
      score: 68,
      exact: false,
      compatible: true,
      summary: `Flexible alignment (${clientWant} vs ${candWant})`,
    };
  }
  return {
    score: 0,
    exact: false,
    compatible: false,
    summary: `Conflict on children (${clientWant} vs ${candWant})`,
  };
}

function scoreLifestyleAndCulture(
  customer: Profile,
  candidate: Profile
): {
  score: number;
  greenFlags: string[];
  frictionFlags: string[];
  summary: string;
} {
  let points = 0;
  const greenFlags: string[] = [];
  const frictionFlags: string[] = [];

  // 1. Location & Relocation (35 pts)
  if (customer.city === candidate.city) {
    points += 35;
    greenFlags.push(`Same city (${customer.city})`);
  } else if (candidate.openToRelocate === "Yes") {
    points += 30;
    greenFlags.push(`Open to relocate from ${candidate.city}`);
  } else if (customer.openToRelocate === "Yes" || candidate.openToRelocate === "Maybe") {
    points += 20;
  } else {
    frictionFlags.push(`Different city (${candidate.city}) & not open to relocate`);
  }

  // 2. Dietary Compatibility (25 pts)
  const strictVeg = ["Vegetarian", "Jain", "Vegan"];
  const custVeg = strictVeg.includes(customer.dietaryPreference);
  const candVeg = strictVeg.includes(candidate.dietaryPreference);
  if (customer.dietaryPreference === candidate.dietaryPreference) {
    points += 25;
    greenFlags.push(`Shared diet (${candidate.dietaryPreference})`);
  } else if (custVeg && candVeg) {
    points += 22;
  } else if (!custVeg) {
    points += 20;
  } else {
    points += 8;
    frictionFlags.push(`Dietary difference (${customer.dietaryPreference} vs ${candidate.dietaryPreference})`);
  }

  // 3. Shared Languages & Marital Status (25 pts)
  const sharedLangs = candidate.languages.filter(
    (l) => l !== "English" && customer.languages.includes(l)
  );
  if (sharedLangs.length > 0) {
    points += 13;
    greenFlags.push(`Speaks ${sharedLangs.join(", ")}`);
  } else {
    points += 7;
  }

  if (customer.maritalStatus === candidate.maritalStatus) {
    points += 12;
  } else if (customer.maritalStatus === "Divorced" && candidate.maritalStatus === "Never Married") {
    points += 8;
  } else {
    points += 6;
  }

  // 4. Pets & Habits (15 pts)
  if (customer.openToPets === candidate.openToPets) {
    points += 15;
    if (customer.openToPets === "Yes") {
      greenFlags.push("Both love pets");
    }
  } else if (customer.openToPets === "Maybe" || candidate.openToPets === "Maybe") {
    frictionFlags.push("Pet preference mismatch");
    points += 10;
  } else {
    points += 5;
    frictionFlags.push("Pet preference mismatch");
  }

  return {
    score: Math.min(100, points),
    greenFlags,
    frictionFlags,
    summary:
      customer.city === candidate.city
        ? `Both in ${customer.city} • ${candidate.dietaryPreference}`
        : `${candidate.city} (Relocate: ${candidate.openToRelocate}) • ${candidate.dietaryPreference}`,
  };
}

/**
 * Male Customer Matching Algorithm
 * Prompt Rules: Match with women who are younger, earn less, shorter, and have matching views on children
 * + Indian Matchmaking cultural/lifestyle compatibility
 */
function evaluateMaleCustomerMatch(
  customer: Profile,
  candidate: Profile
): MatchResult {
  const greenFlags: string[] = [];
  const frictionFlags: string[] = [];

  // 1. Age Differential (Weight: 25%) — Must be younger for strict rule
  const ageDiff = customer.age - candidate.age; // positive means candidate is younger
  const isYounger = ageDiff > 0;
  let ageScore = 0;
  if (ageDiff >= 1 && ageDiff <= 5) {
    ageScore = 100;
    greenFlags.push(`${ageDiff} ${ageDiff === 1 ? "yr" : "yrs"} younger (${candidate.age} vs ${customer.age})`);
  } else if (ageDiff >= 6 && ageDiff <= 8) {
    ageScore = 82;
    greenFlags.push(`${ageDiff} yrs younger (${candidate.age} yrs)`);
  } else if (ageDiff === 0) {
    ageScore = 65;
    frictionFlags.push(`Same age (${candidate.age} yrs)`);
  } else if (ageDiff > 8) {
    ageScore = 60;
    frictionFlags.push(`Wide age gap (${ageDiff} yrs younger)`);
  } else {
    ageScore = Math.max(10, 45 + ageDiff * 15);
    frictionFlags.push(`Older than client (${candidate.age} vs ${customer.age})`);
  }

  // 2. Income Ratio (Weight: 20%) — Must earn less for strict rule
  const earnsLess = candidate.incomeLPA < customer.incomeLPA;
  const incomeRatio = candidate.incomeLPA / customer.incomeLPA;
  let incomeScore = 0;
  if (earnsLess && incomeRatio >= 0.4) {
    incomeScore = 100;
    greenFlags.push(`Earns less & strong career (${candidate.incomeDisplay} vs ${customer.incomeDisplay})`);
  } else if (earnsLess) {
    incomeScore = 86;
    greenFlags.push(`Earns less (${candidate.incomeDisplay} vs ${customer.incomeDisplay})`);
  } else if (candidate.incomeLPA === customer.incomeLPA) {
    incomeScore = 60;
    frictionFlags.push(`Equal income (${candidate.incomeDisplay})`);
  } else {
    incomeScore = 25;
    frictionFlags.push(`Earns more than client (${candidate.incomeDisplay} vs ${customer.incomeDisplay})`);
  }

  // 3. Height Differential (Weight: 15%) — Must be shorter for strict rule
  const heightDiff = customer.heightCm - candidate.heightCm;
  const isShorter = heightDiff > 0;
  let heightScore = 0;
  if (heightDiff >= 4 && heightDiff <= 16) {
    heightScore = 100;
    greenFlags.push(`Shorter (${candidate.heightDisplay})`);
  } else if (heightDiff >= 1 && heightDiff < 4) {
    heightScore = 85;
    greenFlags.push(`Slightly shorter (${candidate.heightDisplay})`);
  } else if (heightDiff > 16) {
    heightScore = 80;
    greenFlags.push(`Shorter (${candidate.heightDisplay})`);
  } else {
    heightScore = 15;
    frictionFlags.push(`Equal/taller height (${candidate.heightDisplay})`);
  }

  // 4. Views on Children (Weight: 20%) — Matching view on children
  const kidsEval = scoreKidsCompatibility(customer.wantKids, candidate.wantKids);
  if (kidsEval.exact) {
    greenFlags.push(kidsEval.summary);
  } else if (!kidsEval.compatible) {
    frictionFlags.push(kidsEval.summary);
  }

  // 5. Lifestyle & Indian Matchmaking Fit (Weight: 20%)
  const lifestyleEval = scoreLifestyleAndCulture(customer, candidate);
  greenFlags.push(...lifestyleEval.greenFlags);
  frictionFlags.push(...lifestyleEval.frictionFlags);

  const dimensions: SubScoreDimension[] = [
    {
      key: "age",
      label: "Age Differential (Younger)",
      score: ageScore,
      weight: 25,
      summary:
        ageDiff > 0
          ? `${candidate.age} yrs (${ageDiff} yrs younger)`
          : `${candidate.age} yrs (${Math.abs(ageDiff)} yrs older/same)`,
      passedStrict: isYounger,
    },
    {
      key: "income",
      label: "Income Alignment (Earns Less)",
      score: incomeScore,
      weight: 20,
      summary: `${candidate.incomeDisplay} vs Client's ${customer.incomeDisplay}`,
      passedStrict: earnsLess,
    },
    {
      key: "height",
      label: "Height Differential (Shorter)",
      score: heightScore,
      weight: 15,
      summary: `${candidate.heightDisplay} (${heightDiff > 0 ? `-${heightDiff}cm` : `+${Math.abs(heightDiff)}cm`})`,
      passedStrict: isShorter,
    },
    {
      key: "kids",
      label: "Children & Family Goals",
      score: kidsEval.score,
      weight: 20,
      summary: kidsEval.summary,
      passedStrict: kidsEval.exact,
    },
    {
      key: "lifestyle",
      label: "City, Diet & Cultural Fit",
      score: lifestyleEval.score,
      weight: 20,
      summary: lifestyleEval.summary,
      passedStrict: lifestyleEval.score >= 65,
    },
  ];

  const totalScore = Math.round(
    dimensions.reduce((acc, dim) => acc + (dim.score * dim.weight) / 100, 0)
  );

  const passesAllStrictRules =
    isYounger && earnsLess && isShorter && kidsEval.exact;

  const aiSummary = passesAllStrictRules
    ? `${candidate.firstName} meets the core age, income, height, and children rules: she is ${ageDiff} ${ageDiff === 1 ? "year" : "years"} younger and ${heightDiff} cm shorter, earns ${candidate.incomeDisplay}, and shares his view on children. ${frictionFlags[0] ? `Discuss ${frictionFlags[0].toLowerCase()}.` : `She has ${candidate.familyValues.toLowerCase()} family values and follows a ${candidate.dietaryPreference.toLowerCase()} diet.`}`
    : `${candidate.firstName} has a ${totalScore}/100 fit guide, with alignment on ${greenFlags.slice(0, 2).join(" and ").toLowerCase()}. Discuss ${frictionFlags[0] || "any preferences that matter to both people"}.`;

  return {
    candidate,
    totalScore,
    tier: getTier(totalScore),
    passesAllStrictRules,
    dimensions,
    greenFlags: greenFlags.slice(0, 5),
    frictionFlags: frictionFlags.slice(0, 3),
    aiSummary,
  };
}

/**
 * Female Customer Matching Algorithm
 * Prompt Rules: Thoughtful logic on profession, values, relocation preferences, children, and stability
 */
function evaluateFemaleCustomerMatch(
  customer: Profile,
  candidate: Profile
): MatchResult {
  const greenFlags: string[] = [];
  const frictionFlags: string[] = [];

  // 1. Profession, Education & Financial Parity/Growth (Weight: 25%)
  const incomeRatio = candidate.incomeLPA / customer.incomeLPA;
  let careerScore = 0;
  const strongCareer = incomeRatio >= 1.0;
  if (incomeRatio >= 1.15) {
    careerScore = 100;
    greenFlags.push(
      `Strong career & financial stability (${candidate.designation} • ${candidate.incomeDisplay})`
    );
  } else if (incomeRatio >= 0.95) {
    careerScore = 88;
    greenFlags.push(`Career & income parity (${candidate.incomeDisplay} at ${candidate.company})`);
  } else if (incomeRatio >= 0.75) {
    careerScore = 65;
    frictionFlags.push(`Slightly lower income (${candidate.incomeDisplay} vs ${customer.incomeDisplay})`);
  } else {
    careerScore = 35;
    frictionFlags.push(`Income gap (${candidate.incomeDisplay} vs ${customer.incomeDisplay})`);
  }

  // 2. Values, Lifestyle Habits & Views on Children (Weight: 25%)
  const kidsEval = scoreKidsCompatibility(customer.wantKids, candidate.wantKids);
  let valuesScore = kidsEval.score * 0.55; // up to 55 pts from kids alignment
  if (kidsEval.exact) {
    greenFlags.push(kidsEval.summary);
  } else if (!kidsEval.compatible) {
    frictionFlags.push(kidsEval.summary);
  }

  // Family values alignment (up to 30 pts)
  if (customer.familyValues === candidate.familyValues) {
    valuesScore += 30;
    greenFlags.push(`Shared ${candidate.familyValues.toLowerCase()} family values`);
  } else if (
    (customer.familyValues === "Liberal" && candidate.familyValues === "Moderate") ||
    (customer.familyValues === "Moderate" && candidate.familyValues !== "Traditional")
  ) {
    valuesScore += 22;
  } else {
    valuesScore += 8;
    frictionFlags.push(
      `Values contrast (${customer.familyValues} vs ${candidate.familyValues})`
    );
  }

  // Smoking / Drinking compatibility (up to 15 pts)
  if (customer.smokingHabit === candidate.smokingHabit) {
    valuesScore += 15;
  } else {
    valuesScore += 5;
    frictionFlags.push(`Smoking habit: ${candidate.smokingHabit}`);
  }
  valuesScore = Math.round(Math.min(100, valuesScore));

  // 3. Relocation & Geographic Compatibility (Weight: 20%)
  let relocationScore = 0;
  const locationViable =
    customer.city === candidate.city ||
    candidate.openToRelocate === "Yes" ||
    customer.openToRelocate === "Yes";

  if (customer.city === candidate.city) {
    relocationScore = 100;
    greenFlags.push(`Both based in ${customer.city}`);
  } else if (candidate.openToRelocate === "Yes") {
    relocationScore = 92;
    greenFlags.push(`Based in ${candidate.city}, open to relocate`);
  } else if (customer.openToRelocate === "Yes") {
    relocationScore = 84;
    greenFlags.push(`Client open to relocating to ${candidate.city}`);
  } else if (
    candidate.openToRelocate === "Maybe" ||
    customer.openToRelocate === "Maybe"
  ) {
    relocationScore = 58;
    frictionFlags.push(`Relocation discussion needed (${customer.city} ↔ ${candidate.city})`);
  } else {
    relocationScore = 10;
    frictionFlags.push(`Geographic deadlock (${customer.city} vs ${candidate.city})`);
  }

  // 4. Age & Height Comfort (Weight: 15%)
  const ageDiff = candidate.age - customer.age; // positive means male is older
  const heightDiff = candidate.heightCm - customer.heightCm; // positive means male is taller
  const ageHeightPassing = ageDiff >= -1 && ageDiff <= 6 && heightDiff >= 2;
  let ageHeightScore = 0;
  if (ageDiff >= 0 && ageDiff <= 5 && heightDiff >= 4) {
    ageHeightScore = 100;
    greenFlags.push(`Ideal age/height fit (${candidate.age} yrs, ${candidate.heightDisplay})`);
  } else if (ageHeightPassing) {
    ageHeightScore = 82;
  } else {
    ageHeightScore = 40;
    if (heightDiff < 0) frictionFlags.push(`Shorter than client (${candidate.heightDisplay})`);
    if (ageDiff > 6 || ageDiff < -2) frictionFlags.push(`Age gap (${candidate.age} yrs vs ${customer.age} yrs)`);
  }

  // 5. Culture, Diet & Pets Compatibility (Weight: 15%)
  const lifestyleEval = scoreLifestyleAndCulture(customer, candidate);
  for (const gf of lifestyleEval.greenFlags) {
    if (!greenFlags.includes(gf)) greenFlags.push(gf);
  }
  for (const ff of lifestyleEval.frictionFlags) {
    if (!frictionFlags.includes(ff)) frictionFlags.push(ff);
  }

  const dimensions: SubScoreDimension[] = [
    {
      key: "career",
      label: "Profession & Financial Synergy",
      score: careerScore,
      weight: 25,
      summary: `${candidate.designation} at ${candidate.company} (${candidate.incomeDisplay})`,
      passedStrict: strongCareer,
    },
    {
      key: "values",
      label: "Core Values & Children Stance",
      score: valuesScore,
      weight: 25,
      summary: `${candidate.familyValues} values • Kids: ${candidate.wantKids}`,
      passedStrict: kidsEval.compatible && valuesScore >= 75,
    },
    {
      key: "relocation",
      label: "City & Relocation Practicality",
      score: relocationScore,
      weight: 20,
      summary:
        customer.city === candidate.city
          ? `Same City (${customer.city})`
          : `${candidate.city} (Relocate: ${candidate.openToRelocate})`,
      passedStrict: locationViable,
    },
    {
      key: "ageHeight",
      label: "Age & Height Compatibility",
      score: ageHeightScore,
      weight: 15,
      summary: `${candidate.age} yrs • ${candidate.heightDisplay}`,
      passedStrict: ageHeightPassing,
    },
    {
      key: "culture",
      label: "Diet, Language & Pets Fit",
      score: lifestyleEval.score,
      weight: 15,
      summary: `${candidate.dietaryPreference} • Pets: ${candidate.openToPets}`,
      passedStrict: lifestyleEval.score >= 65,
    },
  ];

  const totalScore = Math.round(
    dimensions.reduce((acc, dim) => acc + (dim.score * dim.weight) / 100, 0)
  );

  const passesAllStrictRules =
    strongCareer &&
    kidsEval.compatible &&
    valuesScore >= 75 &&
    locationViable &&
    ageHeightPassing;

  const aiSummary = passesAllStrictRules
    ? `${candidate.firstName} meets the core career, values, location, and age/height rules for ${customer.firstName}: ${candidate.designation} at ${candidate.company} (${candidate.incomeDisplay}), ${candidate.familyValues.toLowerCase()} family values, and children preference: ${candidate.wantKids}. ${frictionFlags[0] ? `Discuss ${frictionFlags[0].toLowerCase()}.` : `${candidate.firstName} is based in ${candidate.city}.`}`
    : `${candidate.firstName} has a ${totalScore}/100 fit guide, with alignment on ${greenFlags.slice(0, 2).join(" and ").toLowerCase()}. Discuss ${frictionFlags[0] || "location and timeline preferences"}.`;

  return {
    candidate,
    totalScore,
    tier: getTier(totalScore),
    passesAllStrictRules,
    dimensions,
    greenFlags: greenFlags.slice(0, 5),
    frictionFlags: frictionFlags.slice(0, 3),
    aiSummary,
  };
}

/**
 * Main Entry Point: Ranks all opposite-gender profiles for a given customer
 */
export function getRankedMatchesForCustomer(
  customer: Profile,
  pool: Profile[],
  options?: {
    strictOnly?: boolean;
    searchQuery?: string;
    cityFilter?: string;
    dietFilter?: string;
  }
): {
  allOppositeCount: number;
  strictMatchCount: number;
  results: MatchResult[];
} {
  // Step 1: Filter opposite gender
  const oppositeGenderPool = pool.filter((p) => p.gender !== customer.gender);

  // Step 2: Evaluate each candidate with the gender-specific scoring pipeline
  const evaluated = oppositeGenderPool.map((candidate) =>
    customer.gender === "Male"
      ? evaluateMaleCustomerMatch(customer, candidate)
      : evaluateFemaleCustomerMatch(customer, candidate)
  );

  const strictMatchCount = evaluated.filter((r) => r.passesAllStrictRules).length;

  // Step 3: Enforce mandatory male rules before optional UI filters
  let filtered = evaluated;
  if (customer.gender === "Male" || options?.strictOnly) {
    filtered = filtered.filter((r) => r.passesAllStrictRules);
  }
  if (options?.cityFilter && options.cityFilter !== "All") {
    filtered = filtered.filter((r) => r.candidate.city === options.cityFilter);
  }
  if (options?.dietFilter && options.dietFilter !== "All") {
    filtered = filtered.filter(
      (r) => r.candidate.dietaryPreference === options.dietFilter
    );
  }
  if (options?.searchQuery && options.searchQuery.trim() !== "") {
    const q = options.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((r) => {
      const c = r.candidate;
      const haystack = `${c.firstName} ${c.lastName} ${c.city} ${c.company} ${c.designation} ${c.undergradCollege} ${c.religion} ${c.caste} ${c.dietaryPreference} ${c.languages.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  // Step 4: Sort by totalScore descending, tie-breaking by passesAllStrictRules
  filtered.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return Number(b.passesAllStrictRules) - Number(a.passesAllStrictRules);
  });

  return {
    allOppositeCount: oppositeGenderPool.length,
    strictMatchCount,
    results: filtered,
  };
}

/**
 * Builds a profile-based local introduction for matchmaker review.
 * shortcut: Local templates do not read notes; use Gemini for note-aware drafting.
 */
export function buildPersonalizedMatchIntro(
  customer: Profile,
  match: MatchResult,
  notes: MatchmakerNote[],
  tone: "warm" | "executive" | "family" = "warm"
): {
  subject: string;
  emailBody: string;
  aiBullets: string[];
} {
  const c = match.candidate;
  const sharedLangs = c.languages.filter((l) => customer.languages.includes(l));
  const subject = `An introduction to ${c.firstName} ${c.lastName} · ${match.totalScore}/100 fit guide`;
  const signoff = tone === "family" ? `Regards,\n${customer.assignedMatchmaker}\nThe Date Crew` : tone === "executive" ? `Best,\n${customer.assignedMatchmaker}\nThe Date Crew` : `Warmly,\n${customer.assignedMatchmaker}\nThe Date Crew`;
  const greeting = tone === "family" ? `Namaste ${customer.firstName} and family,` : `Hi ${customer.firstName},`;
  const intro = tone === "executive"
    ? `Sharing ${c.firstName} ${c.lastName}'s profile for your consideration. They are ${c.age} and based in ${c.city}.`
    : `I'd like to introduce ${c.firstName} ${c.lastName}, ${c.age}, based in ${c.city}.`;
  const emailBody = `${greeting}

${intro}

• ${c.maritalStatus} · ${c.heightDisplay}
• ${c.designation} at ${c.company} · ${c.degree}, ${c.undergradCollege}
• ${c.familyValues} family · ${c.dietaryPreference} · children: ${c.wantKids}
• Languages: ${c.languages.join(", ")}

Why I shortlisted this profile: ${match.aiSummary}

Fit guide: ${match.totalScore}/100 from profile rules; it is not a prediction. Would you like me to arrange an introductory call?

${signoff}`;

  const sharedLanguageSummary = sharedLangs.length
    ? `Shared languages: ${sharedLangs.join(", ")}`
    : "No shared non-English language is listed";
  const aiBullets = [
    `Core alignment: ${match.greenFlags.slice(0, 3).join(" · ")}`,
    `${sharedLanguageSummary}; ${customer.designation} at ${customer.company} and ${c.designation} at ${c.company}.`,
    match.frictionFlags.length > 0
      ? `Worth discussing: ${match.frictionFlags[0]}.`
      : "No trade-offs were flagged by the current rules; confirm individual preferences together.",
  ];

  return { subject, emailBody, aiBullets };
}
