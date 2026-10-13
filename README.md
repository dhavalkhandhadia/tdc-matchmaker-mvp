# The Date Crew — Matchmaker MVP

A matchmaking assessment demo with a public brand homepage and a matchmaker workspace. All clients, pool profiles and portraits are fictional.

## Try it

- [Live demo](https://tdc-space.vercel.app)
- [Matchmaker sign-in](https://tdc-space.vercel.app/login)
- [Source repository](https://github.com/dhavalkhandhadia/tdc-matchmaker-mvp)
- Demo email: `ananya@thedatecrew.com`
- Demo password: `tdc2026` (or choose **Fill demo details**)

## Assessment coverage

Ten assigned clients have complete biodata, editable journey stages and call notes. Each has 105 opposite-gender sample profiles. Male suggestions always satisfy the four mandatory age, income, height and children rules. Female ranking considers career/income, values and children, relocation, age/height and lifestyle. Comparisons show the facts, scoring dimensions, alignment and discussion points.

**Send match** opens a mock introduction with candidate information. The editor supports three local tones, optional real Gemini generation, editing, saved-draft reopening and failure recovery. Saving records the draft in this browser; no real email is sent.

The requested three-paragraph explanation of the algorithm, AI and assumptions is in [ASSESSMENT.md](./ASSESSMENT.md). Design references and the reusable UI baseline are in [DESIGN_PLAYBOOK.md](./DESIGN_PLAYBOOK.md).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. To enable Gemini locally, put `GEMINI_API_KEY=your_key` in `.env.local`. The file is ignored by Git; production uses an encrypted Vercel environment variable.

## Verify

```bash
npm run check
npm run build
npm run start
```

With the production server running on port 3000, run `npm run check:api`. The checks cover profile completeness, matching boundaries, score ordering, draft lifecycle, validation and failed/corrupt browser storage.

On 13 October 2026, desktop and 375px browser checks covered the homepage, login, client book, details, filters, comparison, notes/stage persistence, introductions, failure states, saved drafts and 404 recovery. A real Gemini draft was generated on Vercel, saved and reopened after reload. All 220 square portrait assets were checked; the client header uses a larger 64/80px portrait. The production build and runtime checks passed, with no recorded browser runtime errors.

## Demo boundaries

The assessment permits static data, basic login and a mock match action. This implementation checks demo credentials in the client and stores sessions, notes, stages and drafts in localStorage. It is a sample-data prototype, not secure production access control or shared storage. Reloading with unsaved edits can lose those edits. Gemini is used only after an explicit click; provider errors retain the current draft. Real-device and full screen-reader testing remain outside this verification pass.
