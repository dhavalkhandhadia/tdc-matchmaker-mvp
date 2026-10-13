const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function readSource(relativePath) {
  const exports = {};
  const { outputText } = ts.transpileModule(readFileSync(join(__dirname, '..', relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  runInNewContext(outputText, { exports, require, Intl });
  return exports;
}

const { ASSIGNED_CUSTOMERS, DUMMY_POOL_PROFILES } = readSource('src/lib/seedData.ts');
const { getRankedMatchesForCustomer } = readSource('src/lib/matchingEngine.ts');
const { getComparisonRows } = readSource('src/lib/profileComparison.ts');

for (const customer of ASSIGNED_CUSTOMERS) {
  for (const match of getRankedMatchesForCustomer(customer, DUMMY_POOL_PROFILES).results) {
    const rows = getComparisonRows(customer, match);
    assert.equal(new Set(rows.map((row) => row.key)).size, rows.length);
    assert.ok(rows.every((row) => row.client.length && row.person.length && row.insight && row.status));
    assert.ok(!rows.some((row) => row.insight === 'Different'));
    assert.equal(rows.filter((row) => row.status === 'Rule met').length, customer.gender === 'Male' ? 4 : 0);
    for (const row of rows.filter((row) => row.scale)) {
      assert.ok(row.scale.client >= 0 && row.scale.person >= 0);
    }
    assert.equal(rows.find((row) => row.key === 'work').tone, 'context');
    assert.equal(rows.find((row) => row.key === 'education').tone, 'context');
  }
}

const kabir = ASSIGNED_CUSTOMERS.find((profile) => profile.firstName === 'Kabir');
const trisha = DUMMY_POOL_PROFILES.find((profile) => profile.id === 'pool-f-94');
const kabirMatch = getRankedMatchesForCustomer(kabir, [trisha]).results[0];
const maleRows = getComparisonRows(kabir, kabirMatch);
const maleRow = (key) => maleRows.find((row) => row.key === key);
assert.equal(maleRow('age').insight, '3 years younger');
assert.equal(maleRow('height').insight, '13 cm shorter');
assert.equal(maleRow('income').insight, '₹3 LPA less');
assert.equal(maleRow('age').icon, 'down');
assert.equal(maleRow('kids').status, 'Rule met');
assert.equal(maleRow('location').status, 'No move needed');
assert.equal(maleRow('location').person[1], 'Relocate: Maybe');

const maleEqual = getComparisonRows(kabir, {
  ...kabirMatch,
  candidate: { ...trisha, age: kabir.age, heightCm: kabir.heightCm, incomeLPA: kabir.incomeLPA, wantKids: 'Maybe' },
  dimensions: kabirMatch.dimensions.map((dimension) => ({ ...dimension, passedStrict: false })),
});
assert.equal(maleEqual.find((row) => row.key === 'age').insight, 'Same age');
assert.equal(maleEqual.find((row) => row.key === 'height').status, 'Rule not met');
assert.equal(maleEqual.find((row) => row.key === 'income').status, 'Rule not met');
assert.equal(maleEqual.find((row) => row.key === 'kids').status, 'Rule not met');

const neha = ASSIGNED_CUSTOMERS.find((profile) => profile.firstName === 'Neha');
const mihir = DUMMY_POOL_PROFILES.find((profile) => profile.id === 'pool-m-54');
const femaleMatch = getRankedMatchesForCustomer(neha, [mihir]).results[0];
const femaleRows = getComparisonRows(neha, femaleMatch);
assert.equal(femaleRows.find((row) => row.key === 'age').insight, '1 year older');
assert.equal(femaleRows.find((row) => row.key === 'height').insight, '15 cm taller');
assert.equal(femaleRows.find((row) => row.key === 'income').insight, '₹22 LPA more');
assert.equal(femaleRows.find((row) => row.key === 'income').status, 'Career fit');
assert.equal(femaleRows.find((row) => row.key === 'values').insight, 'Shared outlook');

const flexibleCandidate = { ...mihir, age: neha.age - 1, incomeLPA: neha.incomeLPA * 0.8, city: 'Delhi', wantKids: 'Maybe', openToRelocate: 'No' };
const fixedNeha = { ...neha, openToRelocate: 'No' };
const flexibleMatch = getRankedMatchesForCustomer(fixedNeha, [flexibleCandidate]).results[0];
const flexibleRows = getComparisonRows(fixedNeha, flexibleMatch);
assert.equal(flexibleRows.find((row) => row.key === 'age').status, 'Within preference');
assert.equal(flexibleRows.find((row) => row.key === 'income').status, 'Worth discussing');
assert.equal(flexibleRows.find((row) => row.key === 'kids').insight, 'One is undecided');
assert.equal(flexibleRows.find((row) => row.key === 'kids').status, 'Talk it through');
assert.equal(flexibleRows.find((row) => row.key === 'location').insight, 'Neither plans to move');
assert.equal(flexibleRows.find((row) => row.key === 'location').tone, 'discuss');
console.log('Comparison checks passed: all client rankings, male rule explanations, female preferences, neutral career context, children and relocation trade-offs.');
