const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

const appRoot = path.resolve(__dirname, '..');
const ts = createRequire(path.join(appRoot, 'package.json'))('typescript');
const source = fs.readFileSync(path.join(appRoot, 'src/lib/storage.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const data = new Map();
let blocked = false;
const failIfBlocked = () => { if (blocked) throw new Error('Storage blocked'); };
const context = {
  exports: {}, window: {},
  require: (id) => { assert.equal(id, './seedData'); return { ASSIGNED_CUSTOMERS: [], INITIAL_NOTES: [] }; },
  localStorage: {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => { failIfBlocked(); data.set(key, value); },
    removeItem: (key) => { failIfBlocked(); data.delete(key); },
  },
};
vm.runInNewContext(compiled, context);
const storage = context.exports;
const session = { username: 'demo', name: 'Demo', role: 'Matchmaker', loggedInAt: '2026-10-13' };
const note = { customerId: 'customer', author: 'Demo', category: 'Discovery Call', content: 'Keep this note' };
const draft = { customerId: 'customer', candidateId: 'candidate', candidateName: 'Demo', score: 80, emailSubject: 'Hello', emailBody: 'An introduction' };

assert.equal(storage.setSession(session), true);
assert.equal(data.get('tdc_matchmaker_session_v1'), JSON.stringify(session));
for (const corrupt of ['{}', '[]', 'null', '{"name":12}', '{"name":""}']) {
  data.set('tdc_matchmaker_session_v1', corrupt);
  assert.equal(storage.getSession(), null, 'Malformed session must not crash navigation');
}
storage.setSession(session);
assert.equal(storage.updateCustomerStage('customer', 'Sourcing Matches'), true);
assert.ok(storage.addCustomerNote(note));
assert.ok(storage.recordSentMatch(draft));
const before = JSON.stringify([...data]);
blocked = true;
assert.equal(storage.setSession(session), false);
assert.equal(storage.clearSession(), false);
assert.equal(storage.updateCustomerStage('customer', 'Matched / Paused'), false);
assert.equal(storage.addCustomerNote(note), null);
assert.equal(storage.recordSentMatch(draft), null);
assert.equal(JSON.stringify([...data]), before, 'Failed writes preserve stored data');

const legacy = JSON.parse(data.get('tdc_sent_matches_v1'));
legacy[0].status = 'Sent via Email';
data.set('tdc_sent_matches_v1', JSON.stringify(legacy));
assert.equal(storage.getSentMatches()[0].status, 'Draft recorded', 'Blocked migration writes preserve readable drafts');
context.localStorage.getItem = () => { throw new Error('Storage access blocked'); };
assert.equal(storage.addCustomerNote(note), null);
assert.equal(storage.recordSentMatch(draft), null);
assert.equal(storage.updateCustomerStage('customer', 'Matches Sent'), false);
delete context.window;
assert.equal(storage.setSession(session), false);
assert.equal(storage.addCustomerNote(note), null);
assert.equal(storage.recordSentMatch(draft), null);
console.log('Storage self-check passed: successful saves, blocked writes/reads, legacy migration and unavailable window.');
