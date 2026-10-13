const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function readSource(relativePath) {
  const exports = {};
  const source = readFileSync(join(__dirname, '..', relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  runInNewContext(outputText, { exports, require });
  return exports;
}

async function check() {
  const { ASSIGNED_CUSTOMERS, DUMMY_POOL_PROFILES } = readSource('src/lib/seedData.ts');
  const { getRankedMatchesForCustomer } = readSource('src/lib/matchingEngine.ts');
  const customer = ASSIGNED_CUSTOMERS[0];
  const match = getRankedMatchesForCustomer(customer, DUMMY_POOL_PROFILES).results[0];
  const baseline = { customer, match, notes: [], tone: 'warm', useGemini: false };
  const url = 'http://127.0.0.1:3000/api/ai/intro';
  const availability = await (await fetch(url)).json();
  assert.equal(typeof availability.geminiAvailable, 'boolean');
  for (const tone of ['warm', 'executive', 'family']) {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...baseline, tone }) });
    assert.equal(response.status, 200);
    const draft = await response.json();
    assert.ok(draft.subject.includes(match.candidate.firstName));
    assert.ok(draft.emailBody.includes(match.candidate.city));
    assert.ok(!draft.emailBody.includes('undefined'));
    assert.equal(draft.aiBullets.length, 3);
    assert.equal(draft.providerMessage, 'Local draft ready.');
  }
  for (const body of [null, [], true, {}, { ...baseline, tone: 'invalid' }, { ...baseline, useGemini: 'false' }, { ...baseline, match: { ...match, totalScore: 101 } }, { ...baseline, match: { ...match, greenFlags: [null] } }, { ...baseline, notes: Array(6).fill({ content: 'note' }) }, { ...baseline, customer: { ...customer, languages: null } }, { ...baseline, customer: { ...customer, company: null } }]) {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal(response.status, 400, 'Invalid request must return 400, not crash or call a provider');
  }
  const invalidJson = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(invalidJson.status, 400);
  if (!availability.geminiAvailable) {
    const missingKey = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...baseline, useGemini: true }) });
    assert.equal(missingKey.status, 503);
    assert.match((await missingKey.json()).error, /not configured/);
  }
  console.log('API self-check passed: real HTTP local drafts, all tones, invalid input, missing configuration. No live AI request made.');
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
