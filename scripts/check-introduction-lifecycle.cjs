const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the component's own callbacks with controlled state and fetch promises.
const path = join(__dirname, '../src/components/SendMatchModal.tsx');
const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const callbacks = {};
let lifecycle;
function visit(node) {
  if (!lifecycle && ts.isCallExpression(node) && node.expression.getText(source) === 'useEffect') lifecycle = node;
  if (ts.isVariableDeclaration(node) && ['generateWithGemini', 'applyTone', 'requestClose', 'handleSaveDraft'].includes(node.name.getText(source))) callbacks[node.name.getText(source)] = node.initializer;
  ts.forEachChild(node, visit);
}
visit(source);
assert.ok(lifecycle.arguments[1].elements.some((node) => node.getText(source) === 'match'), 'Changing candidate must run lifecycle cleanup');

const requests = [];
const saved = [];
const focused = [];
let closes = 0;
const context = vm.createContext({
  AbortController, customer: { id: 'client', firstName: 'Client', lastName: 'One' },
  notes: [], existingDraft: undefined, generationRef: { current: null },
  subjectRef: { current: { focus: () => focused.push('subject') } },
  bodyRef: { current: { focus: () => focused.push('body') } },
  onClose: () => closes++, onSaveDraft: (draft) => { saved.push(draft); return true; },
  buildPersonalizedMatchIntro: (_customer, match, _notes, tone) => ({ subject: `${match.candidate.id}:${tone}`, emailBody: `${match.candidate.id} local draft`, aiBullets: [] }),
  fetch: (_url, options) => {
    if (!options) return Promise.resolve({ json: async () => ({ geminiAvailable: true }) });
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    requests.push({ signal: options.signal, resolve, reject });
    return promise;
  },
});
for (const key of ['tone', 'subject', 'messageBody', 'highlights', 'isGenerating', 'geminiAvailable', 'providerMessage', 'edited', 'pendingTone', 'discarding', 'pendingGemini', 'saveError']) {
  context[`set${key[0].toUpperCase()}${key.slice(1)}`] = (value) => { context[key] = value; };
}
const load = (node) => vm.runInContext(ts.transpileModule(`(${node.getText(source)})`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText, context);
const initialize = load(lifecycle.arguments[0]);
const generate = load(callbacks.generateWithGemini);
const applyTone = load(callbacks.applyTone);
const requestClose = load(callbacks.requestClose);
const saveDraft = load(callbacks.handleSaveDraft);
const tick = () => new Promise(setImmediate);
const match = (id) => ({ candidate: { id, firstName: id, lastName: 'Candidate' }, totalScore: 90 });
const response = (name) => ({ ok: true, json: async () => ({ subject: `${name} Gemini subject`, emailBody: `${name} Gemini draft`, aiBullets: [] }) });

async function check() {
  for (const lateResult of ['success', 'failure']) {
    context.existingDraft = undefined;
    context.match = match('A');
    const closeA = initialize();
    await tick();
    const generatingA = generate();
    const requestA = requests.at(-1);
    closeA();
    assert.equal(requestA.signal.aborted, true, 'Closing/changing candidate must abort the old request');

    context.match = match('B');
    const closeB = initialize();
    await tick();
    assert.equal(context.isGenerating, false, 'A new editor must not inherit the old loading state');
    const generatingB = generate();
    const requestB = requests.at(-1);
    if (lateResult === 'success') requestA.resolve(response('A'));
    else requestA.reject(new Error('Aborted old request'));
    await generatingA;
    assert.equal(context.messageBody, 'B local draft', 'A stale request must not overwrite B');
    assert.equal(context.providerMessage, 'Drafting with Gemini…', 'A stale error must not overwrite B status');
    assert.equal(context.isGenerating, true, 'An old finally block must not stop B loading');
    requestB.resolve(response('B'));
    await generatingB;
    assert.equal(context.messageBody, 'B Gemini draft');
    assert.equal(context.isGenerating, false);
    closeB();
  }

  context.existingDraft = { candidateId: 'B', candidateName: 'B Candidate', score: 90, emailSubject: 'Saved subject', emailBody: 'Saved body' };
  initialize();
  applyTone('executive');
  assert.equal(context.edited, true, 'Tone replacement must count as unsaved edits');
  requestClose();
  assert.equal(context.discarding, true);
  assert.equal(closes, 0, 'Closing after tone replacement must ask before discarding');

  context.match = null;
  initialize();
  context.candidateFullName = context.existingDraft.candidateName;
  assert.equal(context.subject, 'Saved subject');
  assert.equal(context.messageBody, 'Saved body');
  const requestCount = requests.length;
  await generate();
  assert.equal(requests.length, requestCount, 'An old draft outside the shortlist must not redraft');
  saveDraft({ preventDefault() {} });
  assert.equal(saved.at(-1).candidateId, 'B');
  assert.equal(saved.at(-1).emailBody, 'Saved body');
  const savedCount = saved.length;
  context.subject = '   ';
  saveDraft({ preventDefault() {} });
  assert.equal(saved.length, savedCount, 'An empty subject must not save');
  assert.equal(focused.at(-1), 'subject');
  context.subject = 'A valid subject';
  context.messageBody = '   ';
  saveDraft({ preventDefault() {} });
  assert.equal(saved.length, savedCount, 'An empty note must not save');
  assert.equal(focused.at(-1), 'body');

  const loginPath = join(__dirname, '../src/app/login/page.tsx');
  const loginSource = ts.createSourceFile(loginPath, readFileSync(loginPath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let loginCallback;
  function findLogin(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(loginSource) === 'handleLogin') loginCallback = node.initializer;
    ts.forEachChild(node, findLogin);
  }
  findLogin(loginSource);
  let loginError = '', sessionWrites = 0, destination = '', storageWorks = true;
  const loginContext = vm.createContext({
    email: '', password: '',
    emailRef: { current: { validity: { typeMismatch: false }, focus: () => focused.push('email') } },
    passwordRef: { current: { focus: () => focused.push('password') } },
    setError: (value) => { loginError = value; },
    setSession: () => { sessionWrites++; return storageWorks; },
    router: { push: (value) => { destination = value; } },
  });
  const signIn = vm.runInContext(ts.transpileModule(`(${loginCallback.getText(loginSource)})`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText, loginContext);
  signIn({ preventDefault() {} });
  assert.equal(loginError, 'Enter your work email.');
  assert.equal(focused.at(-1), 'email');
  loginContext.email = 'invalid';
  loginContext.emailRef.current.validity.typeMismatch = true;
  signIn({ preventDefault() {} });
  assert.equal(loginError, 'Enter a valid work email.');
  loginContext.email = 'ananya@thedatecrew.com';
  loginContext.emailRef.current.validity.typeMismatch = false;
  signIn({ preventDefault() {} });
  assert.equal(loginError, 'Enter your password.');
  assert.equal(focused.at(-1), 'password');
  loginContext.password = 'wrong';
  signIn({ preventDefault() {} });
  assert.equal(sessionWrites, 0, 'Invalid credentials must never create a session');
  loginContext.email = ' ANANYA@THEDATECREW.COM ';
  loginContext.password = 'tdc2026';
  storageWorks = false;
  signIn({ preventDefault() {} });
  assert.equal(destination, '', 'A blocked session save must not navigate');
  storageWorks = true;
  signIn({ preventDefault() {} });
  assert.equal(destination, '/dashboard');
  console.log('Introduction and form self-check passed: cancellation, edit protection, legacy drafts, required fields, focus recovery, sign-in validation and blocked storage.');
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
