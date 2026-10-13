const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function readSource(relativePath) {
  const exports = {};
  const source = readFileSync(join(__dirname, '..', relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  runInNewContext(outputText, { exports, require });
  return exports;
}

const { ASSIGNED_CUSTOMERS, DUMMY_POOL_PROFILES } = readSource('src/lib/seedData.ts');
const { getRankedMatchesForCustomer } = readSource('src/lib/matchingEngine.ts');
const maleClients = ASSIGNED_CUSTOMERS.filter((client) => client.gender === 'Male');
assert.equal(ASSIGNED_CUSTOMERS.length, 10);
assert.equal(new Set(DUMMY_POOL_PROFILES.map((profile) => profile.id)).size, 210);
const requiredFields = ['firstName', 'lastName', 'gender', 'dob', 'country', 'city', 'heightDisplay', 'email', 'phone', 'undergradCollege', 'degree', 'incomeDisplay', 'company', 'designation', 'maritalStatus', 'languages', 'siblings', 'caste', 'religion', 'wantKids', 'openToRelocate', 'openToPets'];
for (const profile of [...ASSIGNED_CUSTOMERS, ...DUMMY_POOL_PROFILES]) {
  for (const field of requiredFields) assert.ok(profile[field] != null && profile[field] !== '', `${profile.id}: ${field}`);
}
for (const customer of ASSIGNED_CUSTOMERS) {
  const ranked = getRankedMatchesForCustomer(customer, DUMMY_POOL_PROFILES);
  assert.equal(ranked.allOppositeCount, 105);
  if (customer.gender === 'Female') assert.equal(ranked.results.length, 105);
  ranked.results.forEach((result, index) => {
    assert.notEqual(result.candidate.gender, customer.gender);
    assert.ok(Number.isInteger(result.totalScore) && result.totalScore >= 0 && result.totalScore <= 100);
    assert.equal(result.dimensions.reduce((sum, dimension) => sum + dimension.weight, 0), 100);
    assert.ok(index === 0 || ranked.results[index - 1].totalScore >= result.totalScore, 'Ranking must descend by score');
    assert.ok(result.aiSummary && !result.aiSummary.includes('undefined'));
  });
}

for (const client of maleClients) {
  const ranked = getRankedMatchesForCustomer(client, DUMMY_POOL_PROFILES);
  assert.equal(ranked.allOppositeCount, 105);
  assert.equal(ranked.strictMatchCount, ranked.results.length);
  for (const { candidate } of ranked.results) {
    assert.ok(candidate.age < client.age, `${client.firstName}: age rule`);
    assert.ok(candidate.incomeLPA < client.incomeLPA, `${client.firstName}: income rule`);
    assert.ok(candidate.heightCm < client.heightCm, `${client.firstName}: height rule`);
    assert.equal(candidate.wantKids, client.wantKids, `${client.firstName}: children rule`);
  }
}

const client = maleClients[0];
const eligible = {
  ...DUMMY_POOL_PROFILES.find((profile) => profile.gender === 'Female'),
  id: 'eligible', age: client.age - 1, incomeLPA: client.incomeLPA - 1,
  heightCm: client.heightCm - 1, wantKids: client.wantKids,
  city: client.city, dietaryPreference: client.dietaryPreference,
  openToPets: client.openToPets, familyValues: 'Liberal',
};
const pool = [
  eligible,
  { ...eligible, id: 'same-age', age: client.age },
  { ...eligible, id: 'same-income', incomeLPA: client.incomeLPA },
  { ...eligible, id: 'same-height', heightCm: client.heightCm },
  { ...eligible, id: 'different-children', wantKids: 'Maybe' },
  { ...eligible, id: 'same-gender', gender: 'Male' },
];

for (const options of [undefined, { strictOnly: false }, { strictOnly: true }]) {
  const ranked = getRankedMatchesForCustomer(client, pool, options);
  assert.equal(ranked.results.map(({ candidate }) => candidate.id).join(','), 'eligible');
  assert.equal(ranked.allOppositeCount, 5);
  assert.equal(ranked.strictMatchCount, 1);
  assert.ok(!ranked.results[0].aiSummary.includes('She shares his'), 'Do not invent shared family values');
}

const female = ASSIGNED_CUSTOMERS.find((profile) => profile.gender === 'Female');
const femaleRanking = getRankedMatchesForCustomer(female, DUMMY_POOL_PROFILES);
assert.equal(femaleRanking.results.length, 105, 'Keep the female default ranking available');
assert.equal(femaleRanking.allOppositeCount, 105);
const undecided = {
  ...DUMMY_POOL_PROFILES.find((profile) => profile.gender === 'Male'),
  id: 'undecided', age: female.age + 1, heightCm: female.heightCm + 6,
  incomeLPA: female.incomeLPA * 1.2, city: female.city,
  familyValues: female.familyValues, smokingHabit: female.smokingHabit, wantKids: 'Maybe',
};
const undecidedMatch = getRankedMatchesForCustomer(female, [undecided]).results[0];
assert.ok(undecidedMatch.passesAllStrictRules);
assert.ok(undecidedMatch.aiSummary.includes('children preference: Maybe'), 'Describe an undecided preference without claiming exact agreement');
console.log(`Matching self-check passed: all 10 clients, 210 unique pool profiles, mandatory biodata, scores/order, ${maleClients.length} male rule sets, boundaries and truthful female explanations.`);
