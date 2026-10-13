# The Date Crew Matchmaker MVP

A hosted assessment demo of a private matchmaker workspace: an open client book, complete client context, considered comparisons and editable introduction drafts. The current interface uses DM Sans, rose-white surfaces and mulberry accents. The illustrative couple photograph appears at sign-in only. All people and profile details are seeded sample data.

## Assessment links

- Public demo: https://tdc-matchmaker-mvp-sigma.vercel.app
- Source: https://github.com/dhavalkhandhadia/tdc-matchmaker-mvp

## Demo sign-in

- Email: `ananya@thedatecrew.com`
- Password: `tdc2026`

The session, notes, journey stages, and recorded introductions are stored in this browser's `localStorage`. Credentials are checked in client code and the session can be edited locally. This is not production authentication, server access control or shared/encrypted storage. The Gemini endpoint has no server session check. Use sample data only. Recording an introduction saves an editable draft locally; it does not send email.

## Matching and introductions

The ranking engine compares each client with the opposite-gender sample pool (105 profiles per gender). It uses separate deterministic weighted rules for male and female clients and shows score dimensions, strict-fit counts, reasons, and trade-offs. Functional ranking checks passed. These explanations are not AI-generated merely because a field is named `aiSummary`; the scores are comparison guides, not predictions or decisions. Review preferences and profile details with the people involved.

The engine includes age, income, height, children, career, family values, relocation, diet, language, pets, and lifestyle fields. The client profile also includes contact, education, siblings, religion/caste, mother tongue, family structure, smoking/drinking, and Manglik status.

The introduction editor offers warm, crisp, and family-focused drafts. **Local drafts use profile facts and rule summaries; they do not incorporate call-note contents.** Review the notes and add relevant conversation context yourself. The misleading note acknowledgment has been removed.

If `GEMINI_API_KEY` is configured, a matchmaker can explicitly choose **Draft with Gemini**; that sends profile names, age, city, work, education, values, lifestyle preferences, match reasons, and up to five recent notes to Google Gemini. Contact details and dates of birth are excluded. The route targets `gemini-3.8-flash` with a 20-second per-request timeout and retries up to twice for transient 429/503 capacity responses. A dedicated local API key is configured in `.env.local` (ignored by Git). On 13 October 2026, the real editor generated and saved a draft from fictional Aarav/Riya data. Later calls also encountered temporary 503 responses; the editor preserved the existing text and surfaced a retry-safe error. Key presence is not provider health. Google receives the listed profile context and up to five recent notes only after the matchmaker chooses Gemini. Review and edit before saving.

Saved introductions reopen for editing, including historical records outside current eligibility. Automatic redrafting requires a current match. One record is stored per client/candidate pair; saving changes replaces that record. Tone is not stored, so no tone is selected when reopening a saved draft. Tone/provider replacement and closing an edited dialog require an explicit choice. `AbortController` cancels obsolete generation work and aborted responses cannot replace a newer editor state. Failed saves keep the text available. **Page navigation or reload can still lose unsaved edits**; there is no autosave or global navigation guard. No email is sent.

To configure Gemini on another machine, create a key in Google AI Studio and add it to a local `.env.local` file:

```env
GEMINI_API_KEY=your_key_here
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification record — 13 October 2026

- The latest production build completed with Next.js 16.4, React 19.3 and Tailwind CSS 4.3. `npm run typecheck`, the matching, API, introduction-lifecycle and storage self-checks passed; `npm audit` reports zero vulnerabilities.
- The public Vercel alias opened without team sign-in. Demo sign-in, the ten-client book, Aarav's shortlist and the introduction flow worked. Gemini generated a Chitra introduction that saved and reopened in the browser; no email was sent.
- Browser sign-in/sign-out, the desktop client book and client profile were checked. Invalid credentials showed an inline error while retaining the fields; Fill demo details replaced the values and cleared the error. At 375px, client-book filters, empty results and clear-filter recovery worked.
- A note and journey stage persisted after reload. Draft editing, saving, reopening and reload persistence were checked. Dirty-close and tone-replacement choices protected the text.
- Comparison closed with Escape and returned focus to the invoking control; its visible mulberry focus outline measured 2px. Reduced-motion emulation showed a 100ms modal fade. The recorded console collection returned `[]`.
- Actual 375px comparison and saved-introduction screens were inspected. The dialog was 341 CSS px wide and 730px high at a 375px visual viewport; inner content stayed within its scroll area. Editor input and textarea computed to 16px. The introduction save/cancel strip now stays visible while the long editor content scrolls.
- Actual 375px sign-in was inspected without horizontal overflow; field text computed to 16px and field height to 48px.
- After restoring marital status to the client-book age/city line, the actual 375px roster was inspected again without horizontal overflow. All checked roster inputs/selects computed to 16px text and 48px height.
- Matching checks passed five male seeds, rule boundaries, counts, summary consistency and female behavior. Introduction checks passed stale success/error handling, loading ownership, tone protection and legacy-draft access. Storage checks passed writes, blocked reads/writes, legacy migration and no-window behavior.

The root route redirects to the client book and unknown routes show branded recovery. The browser console collection returned `[]` for the checked flows. Screen captures and mockup boards are in the task workspace, outside this app folder:

- Desktop client book/story/comparison/introduction: `TDC_All_Pages_Client_Book.jpg`, `TDC_All_Pages_Client_Story.jpg`, `TDC_All_Pages_Comparison.jpg`, `TDC_All_Pages_Introduction.jpg`.
- Mobile sign-in, client book, profile, comparison, intro and not-found: `TDC_All_Pages_Mobile_*.jpg`.
- Desktop and mobile mockup concepts: `TDC_All_Pages_Mockup.png` and `TDC_All_Pages_Mobile_Mockup.png`.
- Successful provider result: `TDC_Gemini_Live_Result.jpg`.

Real-phone keyboard/touch/motion and complete assistive-technology/focus coverage remain unverified. No email is sent; the applicant will prepare that separately. A successful build does not make client-side authentication production-ready. Page navigation or reload can still lose unsaved edits. The source includes a custom Radix select for every app dropdown, themed text fields/textareas, checkboxes, disclosure markers, scrollbars, and modal states. Browser/OS-owned surfaces such as password managers, native permission prompts, IME menus and context menus remain system UI. Current all-page mobile captures and mockup boards are listed in the playbook. The Gemini result screenshot is `TDC_Gemini_Live_Result.jpg` in the task workspace outputs. See the playbook for design references, exact source values, mockup interpretation and remaining limits.

## Main code paths

- `src/lib/types.ts` — profile, note, match, and pipeline types
- `src/lib/seedData.ts` — assigned clients and generated sample pool
- `src/lib/matchingEngine.ts` — ranking and profile-based local draft builder
- `src/lib/storage.ts` — browser-local demo session and workflow state
- `src/app/dashboard/page.tsx` — searchable, filterable client roster
- `src/app/customers/[id]/page.tsx` — biodata, notes, candidate ranking, and actions
- `src/components/SendMatchModal.tsx` — editable introduction drafts and tone controls
- `src/app/api/ai/intro/route.ts` — validated draft endpoint with an opt-in Gemini call

See [DESIGN_PLAYBOOK.md](./DESIGN_PLAYBOOK.md) for the reusable UI design and delivery approach.
