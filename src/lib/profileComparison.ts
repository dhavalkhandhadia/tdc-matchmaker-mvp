import { MatchResult, Profile } from './types';

export interface ComparisonRow {
  key: string;
  label: string;
  client: string[];
  person: string[];
  insight: string;
  status: string;
  tone: 'aligned' | 'discuss' | 'context';
  icon: 'up' | 'down' | 'equal' | 'children' | 'location' | 'work' | 'values' | 'shared';
  scale?: { client: number; person: number };
}

const childrenView = { Yes: 'Wants children', No: 'Does not want children', Maybe: 'Undecided' };

export function getComparisonRows(customer: Profile, match: MatchResult): ComparisonRow[] {
  const candidate = match.candidate;
  const maleClient = customer.gender === 'Male';
  const passed = (key: string) => match.dimensions.find((dimension) => dimension.key === key)?.passedStrict === true;
  const verdict = (key: string, femaleFits: boolean, femaleLabel: string): Pick<ComparisonRow, 'status' | 'tone'> => {
    const fits = maleClient ? passed(key) : femaleFits;
    return {
      status: maleClient ? (fits ? 'Rule met' : 'Rule not met') : (fits ? femaleLabel : 'Worth discussing'),
      tone: fits ? 'aligned' : 'discuss',
    };
  };
  const ageGap = candidate.age - customer.age;
  const heightGap = candidate.heightCm - customer.heightCm;
  const incomeGap = candidate.incomeLPA - customer.incomeLPA;
  const sharedLanguages = candidate.languages.filter((language) => customer.languages.includes(language));
  const sameChildren = customer.wantKids === candidate.wantKids;
  const flexibleChildren = customer.wantKids === 'Maybe' || candidate.wantKids === 'Maybe';
  const sameCity = customer.city === candidate.city;
  const canMove = candidate.openToRelocate === 'Yes' || customer.openToRelocate === 'Yes';
  const maybeMove = candidate.openToRelocate === 'Maybe' || customer.openToRelocate === 'Maybe';
  const sameValues = customer.familyValues === candidate.familyValues;
  const sameHabits = customer.smokingHabit === candidate.smokingHabit && customer.drinkingHabit === candidate.drinkingHabit;

  return [
    {
      key: 'age', label: 'Age', client: [`${customer.age} years`], person: [`${candidate.age} years`],
      insight: ageGap === 0 ? 'Same age' : `${Math.abs(ageGap)} ${Math.abs(ageGap) === 1 ? 'year' : 'years'} ${ageGap < 0 ? 'younger' : 'older'}`,
      icon: ageGap === 0 ? 'equal' : ageGap < 0 ? 'down' : 'up',
      scale: { client: customer.age, person: candidate.age },
      ...verdict('age', ageGap >= -1 && ageGap <= 6, 'Within preference'),
    },
    {
      key: 'height', label: 'Height', client: [customer.heightDisplay], person: [candidate.heightDisplay],
      insight: heightGap === 0 ? 'Same height' : `${Math.abs(heightGap)} cm ${heightGap < 0 ? 'shorter' : 'taller'}`,
      icon: heightGap === 0 ? 'equal' : heightGap < 0 ? 'down' : 'up',
      scale: { client: customer.heightCm, person: candidate.heightCm },
      ...verdict('height', heightGap >= 2, 'Within preference'),
    },
    {
      key: 'income', label: 'Annual income', client: [customer.incomeDisplay], person: [candidate.incomeDisplay],
      insight: incomeGap === 0 ? 'Same income' : `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Math.abs(incomeGap))} LPA ${incomeGap < 0 ? 'less' : 'more'}`,
      icon: incomeGap === 0 ? 'equal' : incomeGap < 0 ? 'down' : 'up',
      scale: { client: customer.incomeLPA, person: candidate.incomeLPA },
      ...verdict('income', passed('career'), 'Career fit'),
    },
    {
      key: 'kids', label: 'Children', client: [childrenView[customer.wantKids]], person: [childrenView[candidate.wantKids]],
      insight: sameChildren ? 'Same preference' : flexibleChildren ? 'One is undecided' : 'Different plans',
      icon: 'children',
      ...verdict('kids', sameChildren, 'Aligned'),
      ...(!maleClient && !sameChildren && flexibleChildren ? { status: 'Talk it through', tone: 'discuss' as const } : {}),
    },
    {
      key: 'values', label: 'Family values', client: [customer.familyValues], person: [candidate.familyValues],
      insight: sameValues ? 'Shared outlook' : 'Two outlooks', status: sameValues ? 'Aligned' : 'Discuss values',
      tone: sameValues ? 'aligned' : maleClient ? 'context' : 'discuss', icon: 'values',
    },
    {
      key: 'location', label: 'Location',
      client: [`${customer.city}, ${customer.country}`, `Relocate: ${customer.openToRelocate}`],
      person: [`${candidate.city}, ${candidate.country}`, `Relocate: ${candidate.openToRelocate}`],
      insight: sameCity ? 'Same city' : candidate.openToRelocate === 'Yes' ? `${candidate.firstName} can move` : customer.openToRelocate === 'Yes' ? `${customer.firstName} can move` : maybeMove ? 'Explore a move' : 'Neither plans to move',
      status: sameCity ? 'No move needed' : canMove ? 'Location works' : 'Worth discussing',
      tone: sameCity || canMove ? 'aligned' : 'discuss', icon: 'location',
    },
    {
      key: 'work', label: 'Work', client: [customer.designation, customer.company], person: [candidate.designation, candidate.company],
      insight: 'Career context', status: 'Titles need not match', tone: 'context', icon: 'work',
    },
    {
      key: 'education', label: 'Education', client: [customer.degree, customer.undergradCollege], person: [candidate.degree, candidate.undergradCollege],
      insight: 'Education background', status: 'Context only', tone: 'context', icon: 'shared',
    },
    {
      key: 'languages', label: 'Languages', client: customer.languages, person: candidate.languages,
      insight: sharedLanguages.length ? `${sharedLanguages.length} shared ${sharedLanguages.length === 1 ? 'language' : 'languages'}` : 'No shared language listed',
      status: sharedLanguages.length ? sharedLanguages.join(' · ') : 'Ask about communication',
      tone: sharedLanguages.length ? 'aligned' : 'discuss', icon: 'shared',
    },
    {
      key: 'family', label: 'Family background', client: [customer.religion, customer.caste, customer.familyType], person: [candidate.religion, candidate.caste, candidate.familyType],
      insight: 'Family context', status: 'No automatic requirement', tone: 'context', icon: 'values',
    },
    {
      key: 'marital', label: 'Marital status', client: [customer.maritalStatus], person: [candidate.maritalStatus],
      insight: customer.maritalStatus === candidate.maritalStatus ? 'Same status' : 'Life history',
      status: 'Discuss expectations', tone: 'context', icon: 'shared',
    },
    {
      key: 'diet', label: 'Diet', client: [customer.dietaryPreference], person: [candidate.dietaryPreference],
      insight: customer.dietaryPreference === candidate.dietaryPreference ? 'Shared diet' : 'Two food preferences',
      status: customer.dietaryPreference === candidate.dietaryPreference ? 'Aligned' : 'Discuss everyday meals',
      tone: customer.dietaryPreference === candidate.dietaryPreference ? 'aligned' : 'context', icon: 'shared',
    },
    {
      key: 'pets', label: 'Open to pets', client: [customer.openToPets], person: [candidate.openToPets],
      insight: customer.openToPets === candidate.openToPets ? 'Same preference' : customer.openToPets === 'Maybe' || candidate.openToPets === 'Maybe' ? 'One is undecided' : 'Different preferences',
      status: customer.openToPets === candidate.openToPets ? 'Aligned' : 'Worth discussing',
      tone: customer.openToPets === candidate.openToPets ? 'aligned' : 'discuss', icon: 'shared',
    },
    {
      key: 'habits', label: 'Habits',
      client: [`Smoking: ${customer.smokingHabit}`, `Drinking: ${customer.drinkingHabit}`],
      person: [`Smoking: ${candidate.smokingHabit}`, `Drinking: ${candidate.drinkingHabit}`],
      insight: sameHabits ? 'Shared habits' : 'Habits to discuss', status: sameHabits ? 'Aligned' : 'Worth discussing',
      tone: sameHabits ? 'aligned' : 'discuss', icon: 'shared',
    },
  ];
}
