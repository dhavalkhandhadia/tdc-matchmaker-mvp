import {
  DietaryPreference,
  FamilyType,
  FamilyValues,
  Gender,
  HabitFrequency,
  JourneyStage,
  ManglikStatus,
  MaritalStatus,
  MatchmakerNote,
  Profile,
  YesNoMaybe,
} from "./types";

export function cmToFeetInches(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}" (${cm} cm)`;
}

// 12 Curated Assigned Customers (6 Male, 6 Female)
export const ASSIGNED_CUSTOMERS: Profile[] = [
  {
    id: "cust-1",
    firstName: "Aarav",
    lastName: "Mehta",
    gender: "Male",
    dob: "1995-04-14",
    age: 31,
    country: "India",
    city: "Mumbai",
    heightCm: 180,
    heightDisplay: cmToFeetInches(180),
    email: "aarav.mehta@finbridge.in",
    phone: "+91 98201 44510",
    undergradCollege: "SRCC, Delhi University",
    degree: "B.Com (Hons) & CFA Charterholder",
    incomeLPA: 42,
    incomeDisplay: "₹42 LPA",
    company: "Kotak Investment Banking",
    designation: "Vice President",
    maritalStatus: "Never Married",
    languages: ["English", "Hindi", "Gujarati"],
    siblings: "1 Younger Sister (Married)",
    caste: "Jain Oswal",
    religion: "Jain",
    wantKids: "Yes",
    openToRelocate: "Maybe",
    openToPets: "Yes",
    dietaryPreference: "Vegetarian",
    familyValues: "Moderate",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Gujarati",
    manglikStatus: "No",
    bio: "Investment banker based in South Mumbai who enjoys weekend padel, specialty coffee, and travel. Looking for an ambitious yet grounded partner who values family warmth and shared growth.",
    hobbies: ["Padel Tennis", "Specialty Coffee", "Financial Markets", "Wildlife Travel"],
    avatarColor: "from-rose-600 to-amber-600",
    isAssignedCustomer: true,
    journeyStage: "Sourcing Matches",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "2 hours ago",
  },
  {
    id: "cust-2",
    firstName: "Neha",
    lastName: "Iyer",
    gender: "Female",
    dob: "1997-08-22",
    age: 29,
    country: "India",
    city: "Bengaluru",
    heightCm: 164,
    heightDisplay: cmToFeetInches(164),
    email: "neha.iyer@razorpay-demo.com",
    phone: "+91 98450 31902",
    undergradCollege: "BITS Pilani",
    degree: "B.E. Computer Science & MBA (ISB)",
    incomeLPA: 36,
    incomeDisplay: "₹36 LPA",
    company: "Razorpay",
    designation: "Senior Product Manager",
    maritalStatus: "Never Married",
    languages: ["English", "Tamil", "Hindi", "Kannada"],
    siblings: "1 Elder Brother (Working in US)",
    caste: "Brahmin Iyer",
    religion: "Hindu",
    wantKids: "Yes",
    openToRelocate: "Yes",
    openToPets: "Yes",
    dietaryPreference: "Vegetarian",
    familyValues: "Liberal",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Tamil",
    manglikStatus: "Doesn't Matter",
    bio: "Fintech PM who loves Carnatic fusion music, golden retrievers, and long distance running. Seeking an emotionally mature, intellectually curious partner with strong career footing and progressive values.",
    hobbies: ["Half Marathons", "Carnatic Fusion", "Dog Rescue", "Board Games"],
    avatarColor: "from-purple-600 to-rose-600",
    isAssignedCustomer: true,
    journeyStage: "Matches Sent",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "35 mins ago",
  },
  {
    id: "cust-3",
    firstName: "Rohan",
    lastName: "Kapoor",
    gender: "Male",
    dob: "1994-11-05",
    age: 32,
    country: "India",
    city: "Delhi NCR",
    heightCm: 183,
    heightDisplay: cmToFeetInches(183),
    email: "rohan.kapoor@mckinsey-demo.com",
    phone: "+91 98111 77820",
    undergradCollege: "IIT Delhi",
    degree: "B.Tech Mechanical Engineering",
    incomeLPA: 55,
    incomeDisplay: "₹55 LPA",
    company: "McKinsey & Company",
    designation: "Engagement Manager",
    maritalStatus: "Never Married",
    languages: ["English", "Hindi", "Punjabi"],
    siblings: "Only Child",
    caste: "Khatri",
    religion: "Hindu",
    wantKids: "Yes",
    openToRelocate: "Yes",
    openToPets: "Yes",
    dietaryPreference: "Non-Vegetarian",
    familyValues: "Moderate",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Punjabi",
    manglikStatus: "No",
    bio: "Strategy consultant who splits time between Gurgaon and client sites. Passionate about golf, culinary travel, and modern art. Looking for a warm, articulate partner who enjoys building a lively home.",
    hobbies: ["Golf", "Culinary Travel", "Single Malt Tasting", "Squash"],
    avatarColor: "from-emerald-600 to-teal-700",
    isAssignedCustomer: true,
    journeyStage: "In Dates / Feedback",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "1 day ago",
  },
  {
    id: "cust-4",
    firstName: "Ananya",
    lastName: "Deshmukh",
    gender: "Female",
    dob: "1998-02-19",
    age: 28,
    country: "India",
    city: "Pune",
    heightCm: 162,
    heightDisplay: cmToFeetInches(162),
    email: "ananya.deshmukh@studioarch.in",
    phone: "+91 97654 22190",
    undergradCollege: "CEPT University, Ahmedabad",
    degree: "B.Arch (Sustainable Design)",
    incomeLPA: 22,
    incomeDisplay: "₹22 LPA",
    company: "Morphogenesis Studio",
    designation: "Lead Architect",
    maritalStatus: "Never Married",
    languages: ["English", "Marathi", "Hindi"],
    siblings: "1 Younger Brother (Studying)",
    caste: "Maratha",
    religion: "Hindu",
    wantKids: "Yes",
    openToRelocate: "Yes",
    openToPets: "Yes",
    dietaryPreference: "Eggetarian",
    familyValues: "Moderate",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Never",
    motherTongue: "Marathi",
    manglikStatus: "No",
    bio: "Architect and heritage conservation enthusiast. I love pottery, Sahyadri treks, and quiet bookshop mornings. Looking for a kind, family-oriented partner with a stable career and sense of humor.",
    hobbies: ["Ceramics & Pottery", "Heritage Walks", "Trekking", "Watercolors"],
    avatarColor: "from-amber-600 to-orange-600",
    isAssignedCustomer: true,
    journeyStage: "Profile Verified",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "4 hours ago",
  },
  {
    id: "cust-5",
    firstName: "Vikramaditya",
    lastName: "Reddy",
    gender: "Male",
    dob: "1993-06-30",
    age: 33,
    country: "India",
    city: "Hyderabad",
    heightCm: 178,
    heightDisplay: cmToFeetInches(178),
    email: "vikram.reddy@microsoft-demo.com",
    phone: "+91 90001 88214",
    undergradCollege: "IIT Madras",
    degree: "M.Tech Artificial Intelligence",
    incomeLPA: 48,
    incomeDisplay: "₹48 LPA",
    company: "Microsoft India",
    designation: "Principal Applied Scientist",
    maritalStatus: "Divorced",
    languages: ["English", "Telugu", "Hindi"],
    siblings: "1 Elder Sister (Married)",
    caste: "Reddy",
    religion: "Hindu",
    wantKids: "No",
    openToRelocate: "Maybe",
    openToPets: "Yes",
    dietaryPreference: "Non-Vegetarian",
    familyValues: "Liberal",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Telugu",
    manglikStatus: "Doesn't Matter",
    bio: "AI researcher who loves acoustic guitar, sci-fi literature, and European road trips. Amicably divorced after a brief marriage; seeking an independent, child-free partner who values deep companionship.",
    hobbies: ["Acoustic Guitar", "Sci-Fi Reading", "Astrophotography", "Cycling"],
    avatarColor: "from-indigo-600 to-blue-700",
    isAssignedCustomer: true,
    journeyStage: "Sourcing Matches",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "5 hours ago",
  },
  {
    id: "cust-6",
    firstName: "Zoya",
    lastName: "Merchant",
    gender: "Female",
    dob: "1996-12-10",
    age: 29,
    country: "India",
    city: "Mumbai",
    heightCm: 168,
    heightDisplay: cmToFeetInches(168),
    email: "zoya.merchant@nykaa-demo.com",
    phone: "+91 98209 64123",
    undergradCollege: "St. Xavier's College, Mumbai",
    degree: "B.A. Economics & MSc Marketing (LSE)",
    incomeLPA: 30,
    incomeDisplay: "₹30 LPA",
    company: "Nykaa",
    designation: "AVP Brand Strategy",
    maritalStatus: "Never Married",
    languages: ["English", "Hindi", "Gujarati", "French"],
    siblings: "1 Younger Sister",
    caste: "Khoja",
    religion: "Muslim",
    wantKids: "Maybe",
    openToRelocate: "Yes",
    openToPets: "Yes",
    dietaryPreference: "Non-Vegetarian",
    familyValues: "Liberal",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Gujarati",
    manglikStatus: "Doesn't Matter",
    bio: "LSE alumna leading luxury brand strategy in Mumbai. Passionate about pilates, contemporary theatre, and coastal travel. Looking for a worldly, open-minded partner who values equality and shared adventures.",
    hobbies: ["Reformer Pilates", "Theatre", "Scuba Diving", "Art Curation"],
    avatarColor: "from-pink-600 to-rose-700",
    isAssignedCustomer: true,
    journeyStage: "Sourcing Matches",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "1 hour ago",
  },
  {
    id: "cust-7",
    firstName: "Kabir",
    lastName: "Gill",
    gender: "Male",
    dob: "1996-03-18",
    age: 30,
    country: "India",
    city: "Chandigarh",
    heightCm: 185,
    heightDisplay: cmToFeetInches(185),
    email: "kabir.gill@gillagro.in",
    phone: "+91 98760 11239",
    undergradCollege: "Ashoka University",
    degree: "B.Sc. Economics & Finance",
    incomeLPA: 38,
    incomeDisplay: "₹38 LPA",
    company: "Verdant Agritech Ventures",
    designation: "Founder & CEO",
    maritalStatus: "Never Married",
    languages: ["English", "Punjabi", "Hindi"],
    siblings: "1 Elder Brother (Married)",
    caste: "Jat Sikh",
    religion: "Sikh",
    wantKids: "Yes",
    openToRelocate: "No",
    openToPets: "Yes",
    dietaryPreference: "Eggetarian",
    familyValues: "Moderate",
    familyType: "Joint",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Punjabi",
    manglikStatus: "Doesn't Matter",
    bio: "Building a climate-smart agritech startup out of Chandigarh & Delhi. Horse rider, mountain lover, and big believer in warm family dinners. Looking for someone cheerful and open to settling in North India.",
    hobbies: ["Equestrian Show Jumping", "Himalayan Drives", "Farm-to-Table Cooking"],
    avatarColor: "from-cyan-600 to-blue-600",
    isAssignedCustomer: true,
    journeyStage: "Onboarding",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "Just now",
  },
  {
    id: "cust-8",
    firstName: "Dr. Meera",
    lastName: "Menon",
    gender: "Female",
    dob: "1995-07-08",
    age: 31,
    country: "India",
    city: "Chennai",
    heightCm: 160,
    heightDisplay: cmToFeetInches(160),
    email: "meera.menon@apollohospitals-demo.com",
    phone: "+91 94440 59812",
    undergradCollege: "CMC Vellore",
    degree: "MBBS, MD Dermatology",
    incomeLPA: 28,
    incomeDisplay: "₹28 LPA",
    company: "Apollo Hospitals",
    designation: "Consultant Dermatologist",
    maritalStatus: "Never Married",
    languages: ["English", "Malayalam", "Tamil", "Hindi"],
    siblings: "1 Younger Sister (Doctor)",
    caste: "Nair",
    religion: "Hindu",
    wantKids: "Yes",
    openToRelocate: "Maybe",
    openToPets: "No",
    dietaryPreference: "Non-Vegetarian",
    familyValues: "Moderate",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Never",
    motherTongue: "Malayalam",
    manglikStatus: "No",
    bio: "Consultant dermatologist with regular clinic hours and a calm lifestyle. Love classical Bharatanatyam, filter coffee, and literary fiction. Seeking a grounded, non-smoking professional who values mutual respect.",
    hobbies: ["Bharatanatyam", "Literary Fiction", "Botanical Gardening", "Yoga"],
    avatarColor: "from-violet-600 to-indigo-600",
    isAssignedCustomer: true,
    journeyStage: "Matches Sent",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "6 hours ago",
  },
  {
    id: "cust-9",
    firstName: "Siddharth",
    lastName: "Bhattacharya",
    gender: "Male",
    dob: "1997-01-25",
    age: 29,
    country: "India",
    city: "Bengaluru",
    heightCm: 176,
    heightDisplay: cmToFeetInches(176),
    email: "siddharth.b@google-demo.com",
    phone: "+91 99001 43210",
    undergradCollege: "Jadavpur University",
    degree: "B.E. Electronics & Telecom",
    incomeLPA: 34,
    incomeDisplay: "₹34 LPA",
    company: "Google India",
    designation: "Staff Software Engineer",
    maritalStatus: "Never Married",
    languages: ["English", "Bengali", "Hindi"],
    siblings: "Only Child",
    caste: "Brahmin",
    religion: "Hindu",
    wantKids: "Maybe",
    openToRelocate: "Yes",
    openToPets: "Yes",
    dietaryPreference: "Non-Vegetarian",
    familyValues: "Liberal",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Bengali",
    manglikStatus: "Doesn't Matter",
    bio: "Systems engineer at Google, vinyl record collector, and amateur ramen chef. Looking for an intellectually curious partner who enjoys deep conversations, indie cinema, and spontaneous travel.",
    hobbies: ["Vinyl Records", "Ramen Cooking", "Indie Cinema", "Badminton"],
    avatarColor: "from-slate-700 to-rose-700",
    isAssignedCustomer: true,
    journeyStage: "Profile Verified",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "3 hours ago",
  },
  {
    id: "cust-10",
    firstName: "Tara",
    lastName: "Singhal",
    gender: "Female",
    dob: "1994-09-12",
    age: 31,
    country: "India",
    city: "Delhi NCR",
    heightCm: 166,
    heightDisplay: cmToFeetInches(166),
    email: "tara.singhal@azbp-demo.com",
    phone: "+91 98103 99412",
    undergradCollege: "NLSIU Bengaluru",
    degree: "B.A. LL.B (Hons)",
    incomeLPA: 40,
    incomeDisplay: "₹40 LPA",
    company: "AZB & Partners",
    designation: "Principal Associate (M&A)",
    maritalStatus: "Divorced",
    languages: ["English", "Hindi"],
    siblings: "1 Younger Brother",
    caste: "Agarwal",
    religion: "Hindu",
    wantKids: "No",
    openToRelocate: "Yes",
    openToPets: "Yes",
    dietaryPreference: "Vegetarian",
    familyValues: "Liberal",
    familyType: "Nuclear",
    smokingHabit: "Never",
    drinkingHabit: "Socially",
    motherTongue: "Hindi",
    manglikStatus: "Doesn't Matter",
    bio: "Corporate M&A lawyer with a soft spot for Indie dogs, jazz bars, and Himalayan retreats. Looking for an accomplished, emotionally secure partner who respects career ambition and personal space.",
    hobbies: ["Jazz Music", "Dog Fostering", "Pilates", "Wine Appreciation"],
    avatarColor: "from-rose-700 to-pink-600",
    isAssignedCustomer: true,
    journeyStage: "In Dates / Feedback",
    isVerified: true,
    assignedMatchmaker: "Ananya Sharma",
    lastActive: "2 days ago",
  },
];

// Deterministic Seeded Generator for 210 Dummy Pool Profiles (105 Female + 105 Male)
const FEMALE_FIRST_NAMES = [
  "Aanya", "Diya", "Kavya", "Riya", "Shreya", "Ishita", "Pooja", "Nandini", "Kritika", "Sanya",
  "Aditi", "Tanvi", "Avani", "Mira", "Niharika", "Prerna", "Roshni", "Simran", "Vaishnavi", "Suhani",
  "Gauri", "Radhika", "pallavi", "Trisha", "Meghna", "Anushka", "Bhavya", "Charvi", "Devika", "Esha",
  "Ira", "Jhanvi", "Kiara", "Lavanya", "Mansi", "Navya", "Ojaswi", " Parul", "Ridhi", "Sakshi",
  "Urvi", "Vidhi", "Yashika", "Aarohi", "Barkha", "Chhavi", "Damini", "Ekta", "Falguni", "Garima",
  "Hina", "Indu", "Juhi", "Komal", "Lipika", "Madhuri", "Natasha", "Payal", "Rupal", "Sonal",
  "Tanya", "Upasana", "Vandana", "Zarina", "Amrita", "Bipasha", "Chitra", "Deepika", "Gayatri", "Harshita"
];

const MALE_FIRST_NAMES = [
  "Aditya", "Arjun", "Dhruv", "Ishaan", "Karan", "Nikhil", "Pranav", "Rishabh", "Samarth", "Varun",
  "Abhishek", "Yash", "Harsh", "Kunal", "Manish", "Neeraj", "Parth", "Rajat", "Sahil", "Tushar",
  "Uday", "Vihaan", "Vivaan", "Zaid", "Akash", "Bhavesh", "Chirag", "Deepak", "Gaurav", "Himanshu",
  "Jatin", "Kartik", "Lakshya", "Mayank", "Naveen", "Omkar", "Piyush", "Raghav", "Shashank", "Tarun",
  "Utkarsh", "Vineet", "Anirudh", "Bharat", "Chetan", "Darshan", "Eshan", "Farhan", "Girish", "Hardik",
  "Jayesh", "Keshav", "Lokesh", "Mihir", "Naman", "Prateek", "Ritvik", "Saurabh", "Tejas", "Vedant"
];

const LAST_NAMES_BY_COMMUNITY: {
  lastName: string;
  religion: string;
  caste: string;
  motherTongue: string;
  defaultDiet: DietaryPreference;
}[] = [
  { lastName: "Sharma", religion: "Hindu", caste: "Brahmin", motherTongue: "Hindi", defaultDiet: "Vegetarian" },
  { lastName: "Agarwal", religion: "Hindu", caste: "Baniya / Agarwal", motherTongue: "Hindi", defaultDiet: "Vegetarian" },
  { lastName: "Jain", religion: "Jain", caste: "Jain Digambar", motherTongue: "Hindi", defaultDiet: "Jain" },
  { lastName: "Shah", religion: "Jain", caste: "Jain Shwetambar", motherTongue: "Gujarati", defaultDiet: "Vegetarian" },
  { lastName: "Patel", religion: "Hindu", caste: "Patidar", motherTongue: "Gujarati", defaultDiet: "Vegetarian" },
  { lastName: "Malhotra", religion: "Hindu", caste: "Khatri", motherTongue: "Punjabi", defaultDiet: "Non-Vegetarian" },
  { lastName: "Arora", religion: "Hindu", caste: "Arora", motherTongue: "Punjabi", defaultDiet: "Eggetarian" },
  { lastName: "Subramanian", religion: "Hindu", caste: "Brahmin Iyer", motherTongue: "Tamil", defaultDiet: "Vegetarian" },
  { lastName: "Krishnan", religion: "Hindu", caste: "Brahmin Iyengar", motherTongue: "Tamil", defaultDiet: "Vegetarian" },
  { lastName: "Kulkarni", religion: "Hindu", caste: "Deshastha Brahmin", motherTongue: "Marathi", defaultDiet: "Vegetarian" },
  { lastName: "Joshi", religion: "Hindu", caste: "Brahmin", motherTongue: "Marathi", defaultDiet: "Vegetarian" },
  { lastName: "Nair", religion: "Hindu", caste: "Nair", motherTongue: "Malayalam", defaultDiet: "Non-Vegetarian" },
  { lastName: "Reddy", religion: "Hindu", caste: "Reddy", motherTongue: "Telugu", defaultDiet: "Non-Vegetarian" },
  { lastName: "Rao", religion: "Hindu", caste: "Kamma / Velama", motherTongue: "Telugu", defaultDiet: "Eggetarian" },
  { lastName: "Mukherjee", religion: "Hindu", caste: "Bengali Brahmin", motherTongue: "Bengali", defaultDiet: "Non-Vegetarian" },
  { lastName: "Sen", religion: "Hindu", caste: "Kayastha", motherTongue: "Bengali", defaultDiet: "Non-Vegetarian" },
  { lastName: "Sandhu", religion: "Sikh", caste: "Jat Sikh", motherTongue: "Punjabi", defaultDiet: "Non-Vegetarian" },
  { lastName: "Bedi", religion: "Sikh", caste: "Khatri Sikh", motherTongue: "Punjabi", defaultDiet: "Eggetarian" },
  { lastName: "Khan", religion: "Muslim", caste: "Sunni", motherTongue: "Hindi", defaultDiet: "Non-Vegetarian" },
  { lastName: "D'Souza", religion: "Christian", caste: "Roman Catholic", motherTongue: "English", defaultDiet: "Non-Vegetarian" },
  { lastName: "Gupta", religion: "Hindu", caste: "Vaishya", motherTongue: "Hindi", defaultDiet: "Vegetarian" },
  { lastName: "Verma", religion: "Hindu", caste: "Kayastha", motherTongue: "Hindi", defaultDiet: "Eggetarian" },
];

const CITIES = [
  "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Chandigarh", "Ahmedabad", "Kolkata"
];

const COLLEGES_AND_CAREERS = [
  { college: "SRCC, Delhi University", degree: "B.Com (Hons)", company: "Deloitte India", designation: "Strategy Consultant" },
  { college: "IIT Bombay", degree: "B.Tech Computer Science", company: "Google", designation: "Senior Software Engineer" },
  { college: "BITS Pilani", degree: "B.E. Electronics & MBA", company: "Swiggy", designation: "Product Manager" },
  { college: "St. Xavier's College, Mumbai", degree: "B.A. Economics", company: "J.P. Morgan", designation: "Investment Banking Associate" },
  { college: "Lady Shri Ram College (LSR)", degree: "B.A. Psychology (Hons)", company: "Unilever (HUL)", designation: "Brand Manager" },
  { college: "IIM Bangalore / NIT Trichy", degree: "B.Tech & MBA", company: "Bain & Company", designation: "Case Team Leader" },
  { college: "NIFT Mumbai", degree: "B.Des Fashion Communication", company: "Reliance Luxury Brands", designation: "Lead Merchandiser" },
  { college: "Christ University, Bengaluru", degree: "BBA Finance", company: "Goldman Sachs", designation: "Senior Analyst" },
  { college: "Symbiosis Law School, Pune", degree: "B.A. LL.B", company: "Cyril Amarchand Mangaldas", designation: "Senior Associate" },
  { college: "Manipal Institute of Technology", degree: "B.Tech Information Tech", company: "Atlassian", designation: "Frontend Architect" },
  { college: "Ashoka University", degree: "B.Sc. Economics & Finance", company: "Peak XV Partners", designation: "Venture Capital Associate" },
  { college: "KEM Hospital & Seth GS Medical", degree: "MBBS, MD Pediatrics", company: "Fortis Healthcare", designation: "Consultant Physician" },
  { college: "NMIMS Mumbai", degree: "MBA Marketing", company: "Zomato", designation: "Growth Lead" },
  { college: "VIT Vellore", degree: "B.Tech Data Science", company: "Amazon", designation: "Applied Data Scientist" },
];

const HOBBY_SETS = [
  ["Specialty Coffee", "Pilates", "Travel Photography"],
  ["Badminton", "Indie Music", "Cooking Italian"],
  ["Running", "Book Clubs", "Mountain Trekking"],
  ["Classical Dance", "Art Galleries", "Baking"],
  ["Tennis", "Board Games", "Podcasts"],
  ["Yoga", "Sustainable Living", "Pottery"],
  ["Swimming", "Quiz Nights", "Food Blogging"],
];

const AVATAR_GRADIENTS = [
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-fuchsia-500 to-rose-600",
];

function generatePoolProfiles(): Profile[] {
  const profiles: Profile[] = [];

  // Generate 105 Female profiles and 105 Male profiles (Total = 210 Dummy Profiles)
  const configurations: { gender: Gender; count: number; prefix: string }[] = [
    { gender: "Female", count: 105, prefix: "pool-f" },
    { gender: "Male", count: 105, prefix: "pool-m" },
  ];

  for (const config of configurations) {
    for (let i = 0; i < config.count; i++) {
      const firstNames = config.gender === "Female" ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
      const firstName = firstNames[i % firstNames.length].trim();
      const comm = LAST_NAMES_BY_COMMUNITY[(i * 3 + (config.gender === "Female" ? 1 : 5)) % LAST_NAMES_BY_COMMUNITY.length];
      const city = CITIES[(i * 2 + (config.gender === "Female" ? 0 : 3)) % CITIES.length];
      const career = COLLEGES_AND_CAREERS[(i * 5 + 2) % COLLEGES_AND_CAREERS.length];

      // Age distribution:
      // Female pool: 24 to 33 (so male clients aged 29-33 have plenty of younger options)
      // Male pool: 27 to 36 (so female clients aged 28-31 have plenty of compatible options)
      const age =
        config.gender === "Female"
          ? 24 + (i % 10) // 24..33
          : 27 + (i % 10); // 27..36

      const birthYear = 2026 - age;
      const birthMonth = String(1 + (i % 12)).padStart(2, "0");
      const birthDay = String(5 + (i % 23)).padStart(2, "0");

      // Height distribution:
      // Female: 155 cm to 174 cm
      // Male: 168 cm to 188 cm
      const heightCm =
        config.gender === "Female"
          ? 155 + (i % 19)
          : 168 + (i % 21);

      // Income distribution (LPA):
      // Female: 12 LPA to 44 LPA (skewed so plenty earn 14-35 LPA, matching male client rule)
      // Male: 20 LPA to 65 LPA (skewed so plenty earn 25-60 LPA, matching female client rule)
      const incomeLPA =
        config.gender === "Female"
          ? 12 + ((i * 3) % 32)
          : 22 + ((i * 4) % 44);

      // Marital status: mostly Never Married, ~12% Divorced so divorced clients have great matches too
      const maritalStatus: MaritalStatus = i % 9 === 0 ? "Divorced" : "Never Married";

      // Views on kids: 65% Yes, 20% Maybe, 15% No
      const wantKids: YesNoMaybe =
        i % 7 === 0 ? "No" : i % 4 === 0 ? "Maybe" : "Yes";

      // Relocation: 55% Yes, 25% Maybe, 20% No
      const openToRelocate: YesNoMaybe =
        i % 5 === 0 ? "No" : i % 4 === 1 ? "Maybe" : "Yes";

      // Pets: 60% Yes, 25% Maybe, 15% No
      const openToPets: YesNoMaybe =
        i % 6 === 0 ? "No" : i % 4 === 2 ? "Maybe" : "Yes";

      const familyValues: FamilyValues =
        i % 5 === 0 ? "Traditional" : i % 2 === 0 ? "Moderate" : "Liberal";

      const familyType: FamilyType = i % 4 === 0 ? "Joint" : "Nuclear";

      const drinkingHabit: HabitFrequency =
        i % 3 === 0 ? "Never" : "Socially";

      const smokingHabit: HabitFrequency =
        i % 12 === 0 ? "Socially" : "Never";

      const manglikStatus: ManglikStatus =
        i % 8 === 0 ? "Yes" : i % 3 === 0 ? "No" : "Doesn't Matter";

      const languages = Array.from(
        new Set(["English", comm.motherTongue, "Hindi"])
      );

      const hobbies = HOBBY_SETS[i % HOBBY_SETS.length];
      const siblings =
        i % 3 === 0
          ? "Only Child"
          : i % 2 === 0
          ? "1 Younger Sibling"
          : "1 Elder Sibling (Married)";

      profiles.push({
        id: `${config.prefix}-${i + 1}`,
        firstName,
        lastName: comm.lastName,
        gender: config.gender,
        dob: `${birthYear}-${birthMonth}-${birthDay}`,
        age,
        country: "India",
        city,
        heightCm,
        heightDisplay: cmToFeetInches(heightCm),
        email: `${firstName.toLowerCase()}.${comm.lastName.toLowerCase()}${i + 1}@verified-tdc.in`,
        phone: `+91 98${String(10000000 + i * 7919).slice(0, 8)}`,
        undergradCollege: career.college,
        degree: career.degree,
        incomeLPA,
        incomeDisplay: `₹${incomeLPA} LPA`,
        company: career.company,
        designation: career.designation,
        maritalStatus,
        languages,
        siblings,
        caste: comm.caste,
        religion: comm.religion,
        wantKids,
        openToRelocate,
        openToPets,
        dietaryPreference: comm.defaultDiet,
        familyValues,
        familyType,
        smokingHabit,
        drinkingHabit,
        motherTongue: comm.motherTongue,
        manglikStatus,
        bio: `${career.designation} at ${career.company} (${career.college} alum) based in ${city}. Enjoys ${hobbies[0].toLowerCase()} and ${hobbies[1].toLowerCase()}. Values ${familyValues.toLowerCase()} family outlook and meaningful conversations.`,
        hobbies,
        avatarColor: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
        isAssignedCustomer: false,
        journeyStage: "Profile Verified",
        isVerified: true,
        assignedMatchmaker: "TDC Network Pool",
        lastActive: `${(i % 12) + 1}h ago`,
      });
    }
  }

  return profiles;
}

export const DUMMY_POOL_PROFILES: Profile[] = generatePoolProfiles();

export const INITIAL_NOTES: MatchmakerNote[] = [
  {
    id: "note-1",
    customerId: "cust-1",
    author: "Ananya Sharma (Senior Matchmaker)",
    category: "Discovery Call",
    content: "Spoke with Aarav for 35 mins. Very clear that he wants someone career-oriented but with a warm, grounded temperament. Prefers vegetarian/Jain or eggetarian, definitely wants children in the next 2–3 years, and prefers Mumbai or someone open to moving to Mumbai.",
    createdAt: "2026-10-10 11:30 AM",
  },
  {
    id: "note-2",
    customerId: "cust-1",
    author: "Ananya Sharma (Senior Matchmaker)",
    category: "Parent Alignment",
    content: "Brief check-in with Aarav's mother. Family is progressive Nuclear Jain; horoscope is not a dealbreaker as long as values and dietary comfort align.",
    createdAt: "2026-10-11 04:15 PM",
  },
  {
    id: "note-3",
    customerId: "cust-2",
    author: "Ananya Sharma (Senior Matchmaker)",
    category: "Discovery Call",
    content: "Neha values intellectual stimulation and emotional availability above all. Looking for a partner with strong career trajectory (₹35L+ preferred), pet-friendly (she has a Golden Retriever), and liberal/moderate outlook.",
    createdAt: "2026-10-09 03:00 PM",
  },
  {
    id: "note-4",
    customerId: "cust-3",
    author: "Ananya Sharma (Senior Matchmaker)",
    category: "Date Feedback",
    content: "Rohan had a coffee meet last week; felt the conversation was too formal. Wants someone spontaneous who enjoys travel and social gatherings.",
    createdAt: "2026-10-11 06:45 PM",
  },
];
