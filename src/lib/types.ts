export type Gender = "Male" | "Female";

export type YesNoMaybe = "Yes" | "No" | "Maybe";

export type MaritalStatus = "Never Married" | "Divorced" | "Widowed" | "Awaiting Divorce";

export type JourneyStage =
  | "Onboarding"
  | "Profile Verified"
  | "Sourcing Matches"
  | "Matches Sent"
  | "In Dates / Feedback"
  | "Matched / Paused";

export type DietaryPreference =
  | "Vegetarian"
  | "Non-Vegetarian"
  | "Eggetarian"
  | "Jain"
  | "Vegan";

export type FamilyValues = "Traditional" | "Moderate" | "Liberal";
export type FamilyType = "Nuclear" | "Joint";
export type HabitFrequency = "Never" | "Socially" | "Regularly";
export type ManglikStatus = "Yes" | "No" | "Doesn't Matter";

export interface Profile {
  id: string;
  // 18 Mandatory Assessment Biodata Fields
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD
  age: number;
  country: string;
  city: string;
  heightCm: number;
  heightDisplay: string; // e.g., 5'10" (178 cm)
  email: string;
  phone: string;
  undergradCollege: string;
  degree: string;
  incomeLPA: number; // Annual income in Lakhs Per Annum (INR)
  incomeDisplay: string; // e.g., ₹28 LPA
  company: string;
  designation: string;
  maritalStatus: MaritalStatus;
  languages: string[];
  siblings: string; // e.g., "1 Younger Sister (Unmarried)"
  caste: string;
  religion: string;
  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;

  // Researched Indian Matchmaking Domain Extensions
  dietaryPreference: DietaryPreference;
  familyValues: FamilyValues;
  familyType: FamilyType;
  smokingHabit: HabitFrequency;
  drinkingHabit: HabitFrequency;
  motherTongue: string;
  manglikStatus: ManglikStatus;
  bio: string;
  hobbies: string[];
  avatarColor: string;

  // CRM Fields (for Assigned Customers)
  isAssignedCustomer?: boolean;
  journeyStage: JourneyStage;
  isVerified: boolean;
  assignedMatchmaker: string;
  lastActive: string;
}

export interface MatchmakerNote {
  id: string;
  customerId: string;
  author: string;
  category: "Discovery Call" | "Parent Alignment" | "Date Feedback" | "Match Preference";
  content: string;
  createdAt: string;
}

export interface SubScoreDimension {
  key: string;
  label: string;
  score: number; // 0 - 100
  weight: number; // e.g. 25 for 25%
  summary: string;
  passedStrict: boolean;
}

export type MatchTier = "High Potential Match" | "Strong Compatibility" | "Moderate Fit" | "Low Fit";

export interface MatchResult {
  candidate: Profile;
  totalScore: number; // 0 - 100
  tier: MatchTier;
  passesAllStrictRules: boolean;
  dimensions: SubScoreDimension[];
  greenFlags: string[];
  frictionFlags: string[];
  aiSummary: string;
}

export interface SentMatchRecord {
  id: string;
  customerId: string;
  candidateId: string;
  candidateName: string;
  score: number;
  emailSubject: string;
  emailBody: string;
  sentAt: string;
  status: "Draft recorded" | "Interested" | "Intro Call Scheduled";
}
