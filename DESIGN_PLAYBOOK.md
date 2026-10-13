# The Date Crew — Design & Delivery Playbook

Updated 13 October 2026 from the current UI source. This guide supersedes the earlier evergreen, cream, gold, Lora/Manrope and marketing-hero prescriptions. The primary product is a **private matchmaker workspace**: a client book, a client story, considered comparisons and editable introduction drafts.

This is a record of source decisions, the verified outcomes below and a reusable delivery process. The production build and the main browser flows have been checked. Verification is specific to the recorded viewport and action; a live Gemini draft succeeded once, while later 503 capacity responses showed that availability is intermittent. Real-phone behavior and complete accessibility are not established.

## The work and the tone

Help a matchmaker move from a client conversation to a thoughtful introduction without losing context. Make the person, their circumstances and the next useful action clear. Keep explanations short, respectful and concrete. A fit score supports a conversation; it is never a verdict or a relationship prediction.

The agreed direction is an open client book: soft rose-white, mulberry ink and accents, DM Sans, generous space and quiet separators. Warmth comes from language, personal context and thoughtful pacing. The large illustrative couple photograph belongs to sign-in only. Private working screens use initials and seeded record content; generated faces must never stand in for seeded clients.

Public-homepage research is retained as reference material. A promotional homepage, portrait gallery, success-story section or service-journey hero is not a requirement for this workspace. Do not restore rejected green/cream styling or a serif merely because a reference or the public brand site uses it.

## Current source of truth

- `src/app/layout.tsx`: DM Sans through `next/font/google`; Latin subset; weights 400, 500 and 600; `display: swap`; `--font-sans`.
- `src/app/globals.css`: semantic color tokens, focus styles, motion, coarse-pointer behavior and sign-in photograph shape. The tokens are mapped with Tailwind CSS 4's `@theme inline`; PostCSS uses `@tailwindcss/postcss`.
- `src/components/ui/primitives.tsx`: shared buttons, inputs, textareas, statuses, initials and fit guide. `src/components/ui/Select.tsx` is the shared Radix-backed, brand-styled dropdown. Reuse these instead of creating another component system.
- `src/components/ui/Dialog.tsx`: native modal dialog, backdrop dismissal, Escape handling, body scroll lock and internal scrolling.
- The login, dashboard and customer routes define page hierarchy. `SendMatchModal.tsx` defines editable drafts, replacement confirmation and provider feedback.
- `types.ts`, `seedData.ts`, `matchingEngine.ts`, `storage.ts` and `api/ai/intro/route.ts` define data, rules and persistence. Their contracts take precedence over labels or README aspirations.

### Color tokens

Use semantic classes and these source values. The palette lives in CSS variables so page styling stays visible and easy to tune in one place.

| Token | Value | Role |
| --- | --- | --- |
| `canvas` | `#FCF8FA` | Rose-white page |
| `surface` | `#FFFCFD` | Controls and dialogs |
| `wash` | `#F1E9F0` | Quiet grouped context |
| `ink` | `#3D2B3B` | Main reading |
| `muted` | `#766574` | Supporting text |
| `faint` | `#816E7D` | Supplementary metadata |
| `line` | `#E6DAE2` | Dividers |
| `line-strong` | `#CEBBC8` | Stronger boundaries |
| `accent` | `#784564` | Mulberry actions and emphasis |
| `accent-strong` | `#61334F` | Hover and stronger emphasis |
| `accent-soft` | `#EEDDE7` | Gentle accent surface |
| `calm` / `calm-soft` | `#5C6979` / `#E7EDF3` | Secondary calm cue |
| `warning` / `warning-soft` | `#8A5C45` / `#F5E8E2` | Recovery and caution |

### Type, hierarchy and shape

Use **DM Sans only**, including `.font-display`. Display headings are regular; controls use medium weight. Use tabular numerals where counts or scores benefit. Source sizes are sign-in headline 42/56/64px, client-book title 36/46px, client title 34/42px, roster names 21/24px, section headings 23–32px, client biography 16px with 28px leading, reading 13px and supplementary metadata 10–12px. Small metadata must not carry an essential explanation. These are implementation values, not a reason to shrink future content to fit.

The client book is an open page up to 1180px wide. Client detail is up to 1320px. Use an 8px cadence for major spacing with 4px subdivisions; current page gutters are 20px on small screens and usually 32–40px above them. Prefer typography and separators to repeated card shells.

Shared buttons are 44px high for small/medium and 48px for large, with pill corners. Inputs and custom select triggers are commonly 48px on pages; on small screens they use 16px text. Client rows and notes use 24px corners; textareas use 14–16px; dialogs use 28px. All six app dropdowns use the custom Radix select with the same pill, mulberry focus and rose-white menu treatment.

### Page composition

- **Sign-in:** a short emotional promise, a compact form and one illustrative image. The source image is `/images/tdc-bougainvillea-v1.png`, with an “Illustrative photography” caption. It does not depict a client or prove a successful match. The image uses an asymmetric curve on desktop and 28px corners below 768px.
- **Client book:** a short introductory line, one title, client/draft counts, one filter row and open person rows. Name, age, city, marital status, short biography and journey stage lead. Initials use gentle alternating tones. There is no marketing hero, large photograph or suggested-candidate mini-dashboard here.
- **Client story:** name, age/place, marital status, stage and a short biography establish context. Everyday facts remain visible. Personal/professional, family/everyday life and contact details expand under explicit labels. The shortlist uses open rows, two reasons and one discussion point; comparison supplies the fuller detail. Notes get one quiet surface.
- **Comparison and introduction:** preserve the client/candidate relationship in the title. A score has reasons and limitations nearby. Saved introductions reopen for editing; “Draft recorded” must not terminate access to the saved text.

### Browser controls

`globals.css` themes page and internal scrollbars, inputs, textareas, placeholders, autofill, invalid/disabled states, resize grips, disclosure markers and checkboxes. Select menus use `src/components/ui/Select.tsx` and Radix behavior for keyboard navigation, typeahead, focus and collision handling. The native modal keeps browser focus containment, Escape and backdrop semantics while the surface is styled by the app. Browser/OS-owned password-manager bubbles, permission prompts, IME candidates and context menus cannot be restyled by page CSS; do not claim those surfaces are custom.

### Illustrative image provenance

The sign-in photograph was generated with the **built-in ImageGen tool**, not the CLI. Source asset: `C:/Users/dhava/.codex/generated_images/01a13010-e0be-7cf2-8c8a-8f6494f07a47/exec-e5068b4f-bdd6-4331-a2b9-b7add4493fc4.png`; app asset: `public/images/tdc-bougainvillea-v1.png`.

**Prompt brief, not a verbatim prompt:** editorial photograph of a fictional Indian couple in their early thirties walking hand-in-hand along a bougainvillea street; candid expressions, natural skin, morning light and muted pink/plum clothes; no lettering, hearts or watermarks. This brand concept was generated before the private-workspace scope was clarified. The photograph remains an explicitly illustrative sign-in asset; the earlier concept is not the final workspace mockup or evidence of real clients.

## States to design before adding polish

This table records source behavior and the rule future changes must preserve. The verification record below distinguishes checked flows from source-only behavior.

| State | Visible response and recovery | Data and focus rule |
| --- | --- | --- |
| Signed out | Matchmaker sign-in and optional demo-details action | Label both fields; keep the normal form submission path |
| Bad credentials | Inline alert in reserved error space | Keep entered values; clear error when editing |
| Session storage blocked | Explain that the session could not be saved | Stay on sign-in; no successful navigation |
| Client book filtered/empty | Result count and clear-filter action | Keep query and filters visible; do not invent a loading delay |
| Unknown client route | Not-found behavior | Do not silently substitute another client |
| No shortlist results | Plain explanation and clear filters | Preserve the client context and full available pool count |
| Stage save succeeds/fails | Adjacent saved message or recovery alert | Commit the displayed stage only after persistence succeeds |
| Note empty/saved/failed | Disable empty submission; update count on success; inline failure | Clear text only after saving; failed saves retain text |
| Comparison opens/closes | Labeled native dialog with visible close | Contain focus, support Escape and restore the invoking control; Escape and focus return were checked |
| New or saved draft | Editable subject/body with local-save label | A saved draft reopens; one stored record per client/candidate pair; saved tone is unknown, so no tone is falsely selected |
| Historical draft outside the shortlist | Saved-introductions list and editable stored text | Keep access even if current eligibility no longer returns the candidate; automatic redrafting is unavailable without a current match |
| Tone or Gemini would replace text | Explicit keep/replace choice | Never erase edits through an incidental choice |
| Unsaved draft close | Keep-editing or discard choice | Keep-editing receives focus; return to subject when resuming |
| Gemini checking/unavailable | Reserved provider message and unavailable action | Local editing/saving remains usable; key presence is not provider health |
| Gemini drafting | Real indeterminate status; editing, tone and save disabled | Keep the existing draft while awaiting response; no fabricated progress |
| Gemini success/failure | Review-ready message or unchanged-draft explanation | Apply returned text only on success; retain current text on failure; abort on replacement/unmount and ignore aborted responses |
| Draft save succeeds/fails | Close and announce only on success; inline retry explanation on failure; keep Save/Cancel visible as the editor scrolls | Failed save keeps the dialog and text open |
| Sign-out fails | Inline storage recovery alert | Do not claim sign-out or navigate until local removal succeeds |

## Mobile, keyboard and motion rules

**Mobile:** search spans the first row; gender/stage filters share the next. Client rows reflow rather than requiring horizontal scrolling. Client-book filters and empty-state recovery were checked at 375px. On client detail, shortlist precedes the longer dossier below the large breakpoint, with section links for Shortlist, About and Call notes. Comparison shows each field label above two values on small screens instead of squeezing a desktop three-column table. Long values wrap. Dialogs use `width: calc(100% - 24px)` and at most `90dvh`, with an internal scrollbar. Current CSS forces form text to `16px !important` at widths below 768px and on coarse pointers so utility classes cannot shrink it. Actual 375px sign-in, client book, profile, comparison, introduction and not-found screens were inspected. The profile section links remained visible while scrolling. Comparison and introduction dialogs fit the viewport; the introduction Save/Cancel strip stays pinned while its content scrolls. Form text is 16px on small screens. Browser device emulation and screenshots are useful evidence, but real-phone keyboard-open layouts and 320–390px device behavior still need checking.

**Focus:** source defaults to a 2px mulberry `:focus-visible` outline with 4px offset; pressable controls, fields, links and summaries use a 3px offset, and shared primitives also provide rings. A visible mulberry 2px outline, comparison Escape dismissal and return focus to the invoking control were checked in the browser. Keep labels associated with fields, summaries operable by keyboard and visible close controls in dialogs. Native `showModal()` provides modal behavior; full focus containment, scroll restoration and comparison-to-draft transitions still need their own evidence. Announce saved states with `role=status`; actionable errors use `role=alert`. Do not remove an outline without an equally visible replacement. Summaries and `.touch-link` have 44px minimum height; coarse pointers get 16px form text and 44px button minimums.

**Motion:** `.pressable` uses 150ms transitions and `scale(.97)` on press; client rows use `scale(.995)`. Fine-pointer hover moves the row arrow 4px. Modal entry is 220ms from 6px down and `.96` scale; backdrop fades for 180ms. Source ease-out is `cubic-bezier(.23, 1, .32, 1)`; ease-in-out is `cubic-bezier(.645, .045, .355, 1)`. Use these for continuity and feedback, not decoration. Do not animate layout, reshuffle persistent content or flash whole screens on entry.

Reduced-motion source removes press/row/arrow transforms and transitions, uses a 100ms linear modal fade and a 100ms backdrop fade, and disables smooth scrolling. Browser emulation confirmed the modal's 100ms fade. Verify remaining loading/utility animations separately; that result is not proof that every animation is covered. An immediate response is preferable to adding artificial delay.

## Prototype boundaries and truthful labels

- **Authentication:** the demo account is `ananya@thedatecrew.com` / `tdc2026`. Credentials are checked in client code; session data is editable in `localStorage`; the navbar redirects after a client effect. This is not secure authentication, access control or a production privacy boundary. The Gemini endpoint currently has no server session/authorization check. Do not put real client data into this prototype on the strength of the word “private.”
- **Persistence:** session, notes, journey stages and draft records live in four existing `tdc_*_v1` localStorage keys. They are limited to the browser/origin, readable by page JavaScript, not encrypted or shared, and may disappear when storage is cleared. There is no backend synchronization or conflict handling. Saves return `boolean` or a saved object/`null`; callers must handle failure before changing UI state. Unreadable/corrupt storage can fall back to seeded/default data. Legacy “Sent via Email” entries are read as “Draft recorded.”
- **Drafts:** saving records an editable local introduction. It does not email anyone, schedule an introduction or confirm recipient consent. Re-saving replaces the prior record for that client/candidate pair. Historical records remain accessible through Saved introductions even when their candidate is outside current eligibility; stored text/name/score can be reviewed and edited, while automatic redrafting needs a current match. Tone is not stored in the existing schema, so a reopened draft has no selected tone. Choosing a new tone explicitly replaces text after confirmation. Unsaved edits remain in component state and can be lost on page navigation or a full reload; the dialog's dirty-close protection is not a global navigation guard or continuous autosave. Notes can currently be added/viewed; an existing-note edit/delete workflow is not implemented.
- **Matching and AI usage:** the seeded pool contains 105 profiles per gender. The engine compares opposite-gender profiles using separate male/female rules. Male results apply mandatory rules; female results offer “Core fits only.” Scores, tiers, reasons and `aiSummary` are deterministic weighted rule outputs, not a learned compatibility model or independent verification. Functional ranking checks passed. A real Gemini introduction was generated and saved from fictional profiles in the local app; the hosted preview still needs one provider check after deployment. Do not imply AI-generated ranking merely because a field is named `aiSummary`. Preserve the assessment behavior and make its assumptions reviewable.
- **Local drafting:** the warm/crisp/family generator uses profile facts and deterministic rule summaries. It does **not** incorporate call-note contents. The misleading note acknowledgment was removed; the editor now says “Local draft uses profile details. Review call notes before saving.” The matchmaker must review and incorporate relevant conversation context.
- **Gemini:** the explicit action sends a selected profile subset, fit reasons and up to five recent notes to Google; email, phone and birth date are excluded. The source targets `gemini-3.8-flash` with a 20-second timeout and retries transient 429/503 responses twice. The local editor successfully generated and saved one draft from fictional Aarav/Riya profiles; later calls also received temporary 503 capacity errors. The hosted preview is configured with a server-side Vercel secret; verify one live draft before handoff. GET only reports whether `GEMINI_API_KEY` exists, not provider health. The editor preserves the current draft on errors. `AbortController` cancels obsolete work so an old response cannot replace newer editor state. Human review is required; prompting is not proof of factual accuracy.
- **Sample truth:** seeded people, “verified” flags and dates are fictional demo data. Keep sample labeling; do not frame generated photography, rule scores or a local draft as evidence of a real person, delivered communication or relationship outcome.

## Research evidence and limits

The visual decisions above are project decisions. References provide questions and principles, not permission to copy assets or evidence of usability.

**Directly inspected image:** [Uniite Matchmaking — Rahul Ninave](https://dribbble.com/shots/26292951-Uniite-Matchmaking-Website-Logo-Design), [original composite](https://cdn.dribbble.com/userupload/44158436/file/original-6eea4269a05f7a4627ab2d24d5816ede.png). Its homepage places one candid black-and-white Indian couple beside a short promise and one action. A partially visible approach page links questionnaire, consultation, coaching and patient search vertically. The right edge is cropped. Take the believable human moment and clear next step; its cream/serif styling and public-service layout are not current workspace requirements. No live interactions were inspected.

**Directly inspected Canva image:** [Pink Minimalist Romantic Couple Photo Collage Document](https://www.canva.com/templates/EAHGy5TMZg4-pink-minimalist-romantic-couple-photo-collage-document/). The actual pink snapshot collage was inspected. Take the candid relationship moments; leave its hearts, script lettering and scrapbook treatment behind. This was an image inspection, not an evaluation of Canva's editable template or a working product flow.

**Directly inspected Muse image:** [Muse — UI/UX Case Study for Queer Dating Platform](https://www.behance.net/gallery/233241105/Muse-UIUX-Case-Study-for-Queer-Dating-Platform). A project CDN image was opened and zoomed in the main research pass: portrait-first mobile context and concise personal cues, without analytics chrome. This supports reducing administrative clutter around people. It does not justify copying the assets, adopting a profile-discovery workflow or claiming the prototype's interactions were checked. Font-family identification remains unverified.

**Directly inspected luxury-matchmaker image:** [Luxury Matchmaking Website Design — VIP Elite Brand Experience](https://dribbble.com/shots/27137691-Luxury-Matchmaking-Website-Design-VIP-Elite-Brand-Experience). The actual black-and-gold photographic hero was inspected. Its useful lesson is a human photograph carrying the emotional promise; the elitist positioning and black/gold palette do not fit this private working tool. No live interactions were inspected.

**Indexed image discovery only:** [Birdy](https://www.behance.net/gallery/92617449/Birdy) and [feel.](https://www.behance.net/gallery/169749233/feel-landing-page-for-love) suggested an ownable emotional motif and narrative organization respectively. Their original pixels were not directly inspected; font families and fine layout details remain unverified. [Canva dating templates](https://www.canva.com/templates/s/dating/) and [dating-wrapped templates](https://www.canva.com/presentations/templates/dating-wrapped/) were discovery galleries only. Pinterest pin pages were inaccessible through the web tool. Do not describe an indexed gallery or inaccessible pin as an inspected project.

**Retained reference registry, not freshly verified:** [The Date Crew site](https://www.thedatecrew.com/) remains useful for voice and positioning, not a mandatory green/serif visual anchor. Prior discovery links include [Match Mantra](https://www.behance.net/gallery/232040513/Designing-Connections-that-Matter-Match-Mantra-), [Matchify](https://www.behance.net/gallery/208843863/Matchify-UIUX-Case-Study-A-Matrimony-app), [Aisle](https://www.behance.net/gallery/227359237/Aisle-The-Dating-App-Case-Study), [matchmaking service design](https://dribbble.com/shots/26239468-Matchmaking-Service-Website-UI-Design), [modern matchmaking landing page](https://dribbble.com/shots/27271259-Matrimonial-Platforms-Modern-Matchmaking-Landing-Page), [matchmaking homepage](https://dribbble.com/shots/4211174-Matchmaking-website-home-page-design), [matrimonial hero pin](https://in.pinterest.com/pin/exploring-hero-section-designs-for-matrimonial-sites-in-2024--1144899536507087214/), [Indian matchmaking UI pin](https://in.pinterest.com/pin/indian-matrimonial-app-uiux-design--994099317729536781/) and [Indian wedding templates](https://www.canva.com/templates/s/indian-wedding/). Keep them for future focused investigation; no current image/interaction checks are claimed for these links.

**Craft reading in the main pass:** Emil Kowalski's [You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) and **Train Your Judgement** were read. The latter's exact URL was not retained, so no guessed link is supplied. Their useful process is to justify motion and train judgment by comparing actual outcomes; frequent work can be immediate. [Family](https://family.co/) was read as full page text: clear words and staged detail can make advanced tasks approachable. This is text evidence, not a fresh interactive audit. [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste), [Benji Taylor — Family Values](https://benji.org/family-values) and [Annotating for agents](https://benji.org/annotating) remain prior reference links, not freshly verified pages in this documentation pass.

**Local sources rechecked read-only:** `C:\Coding\Course Seminar\AGENTS.md`, lines 5–10, specifies an 8px rhythm, 24px outer inset, safe content/control/text areas and space for expanding shapes and shadows. Its Inter/Baskerville and glass styling belong to that project; TDC keeps DM Sans and mulberry. The Markdown index at `C:\Users\dhava\Downloads\animations-web-video\animations-web-video\NEW [Cursor Skill] emil-design-engineering\SKILL.md` and its `animations.md`, `forms-controls.md`, `touch-accessibility.md` and `ui-polish.md` were read. Concrete lessons: stable dynamic geometry; at least 44px touch targets; 16px form text on phones; hover as enhancement; restrained entry/exit motion; and matching easing/duration for paired modal/overlay elements. Do not copy every prescription mechanically: TDC retains appropriate login autocomplete and its own focus color. Its current 220ms modal/180ms backdrop remains the source value; matching the pair is a future review question, not a claimed change.

**Othello rechecked through accessible Codex history and its implementation record:** exact thread title **“Update Othello deployment domain”**, ID `01a1112d-e144-7472-8e54-aa6bc74182e7`, project `C:\Coding\Othello_1`. The latest completed UI turn was feedback-v21 / 0.2.12. `C:\Users\dhava\.codex\worktrees\othello-mobile-flutter\Othello_1\docs\mobile-rebuild\feedback-v21\IMPLEMENTED.md` was read. It records a focus trace sharing the ticket's concave path while preserving one native input; a slow “Copying…” label that initially increased button height and was corrected; explicit local success/error recovery; and scene framing revised after actual-render comparison. It keeps confirmed business state separate from decorative animation. Those are transferable engineering lessons, not permission to import game art, ticket shapes, sound or haptics. No Othello browser/device checks or images were reopened in this read-only pass; its recorded test/render results are that project's evidence, not TDC verification.

### Mockup files and what they mean

The desktop four-screen mockup is `outputs/TDC_All_Pages_Mockup.png` in the task workspace; the companion four-screen mobile board is `outputs/TDC_All_Pages_Mobile_Mockup.png`. Both were made with the built-in ImageGen tool after the private matchmaker experience was selected. Treat them as composition studies for client book, story, comparison, introduction and recovery. Image generation invented some labels, stage names and profile details; the app follows the assessment, actual seed data and real journey stages. It is not a pixel-match brief. Use the verified screen captures listed below when checking implementation.

## Reusable process

1. **Read the product and preserve its contracts.** Inspect the brief, current routes, types, storage, ranking, endpoint and every caller affected. Write down each value's source of truth. Fix a shared bug where it originates. Do not infer implemented behavior from a README or component name.
2. **Map the main task and states.** Name the intended user, next action, data at risk and recovery path. Use the state table above. Preserve required biodata through progressive disclosure rather than deleting fields or reducing text to tiny sizes.
3. **Research one question.** Ask how a reference handles scanning, trust, continuity or feedback. Open a specific project and inspect its actual images. Record URL, image inspected, date, lesson and limits. Search snippets are discovery evidence. Avoid turning marketing shots into product requirements.
4. **Choose a coherent direction.** Write one sentence for tone, one content hierarchy and a small token set. This project's current direction is DM Sans/rose-white/mulberry/open client book. Reuse installed primitives. A mockup explores composition; every label/action still needs mapping back to actual functionality. Do not add new navigation, dependencies, wrappers or features without a task need.
5. **Build the main path and its edges together.** Connect actions to truthful outcomes. Preserve text on failure, require explicit replacement of edits, keep context stable and make keyboard/reduced-motion behavior intentional. Add a focused assert/self-check for nontrivial logic when verification is authorized. Keep confirmed state in the application; visual feedback must not invent success.
6. **Review with one Before/After/Why table.** Use the compact table below for the whole pass, including functional changes that affect trust. Label source intent separately from rendered evidence. Do not produce several overlapping review tables.
7. **Verify only what you can evidence.** When authorized, typecheck/build, then walk sign-in → client book → client → note → stage → filters → compare → draft → save → reopen/edit → reload → sign out. Exercise invalid credentials, blocked storage, empty results, unsaved close, tone replacement and Gemini unavailable/failure. Check desktop and phone widths, keyboard focus, reduced motion, console and persistence. A green build is not a browser result; a configured API key is not a successful generation.
8. **Report the remaining limits.** Say what changed, why, what was actually checked and what remains unverified. Record an intentional code limit with `shortcut: <the limit>, <when to upgrade>` only where relevant. Update this guide when a real decision changes, not for speculative future features.

## Current review: Before / After / Why

This records source changes and design decisions alongside the specifically verified outcomes below.

| Area | Before | After | Why |
| --- | --- | --- | --- |
| Type and palette | Evergreen/cream, Lora/Manrope and clay/gold prescriptions | DM Sans only, rose-white, mulberry and quiet secondary tones | Supersede the rejected visual direction consistently |
| Workspace entry | Mission hero and large café image above the roster | Open client book with concise introduction and useful counts | Bring the matchmaker's working content into immediate view |
| People | Suggested-candidate mini-dashboard; marital status was absent from the revised client-book row | Initials, name, age/city/marital status, biography and stage; final 375px roster checked | Establish the client's story and restore the required assessment field |
| Shortlist copy | Candidate role/company repeated immediately before a biography opening with the same facts | One concise biography opening | Remove repetition and preserve a calmer reading hierarchy |
| Photography | Large image repeated in working screens | One explicitly illustrative scene at sign-in | Give warmth to entry while keeping private work focused |
| Stored actions | Errors swallowed or success implied without persistence | Boolean/object-or-null saves with retained inputs and recovery messages | Protect work and make success truthful |
| Saved introductions | Recorded action could disable further access | Reopen the saved draft and save changes for the same pair | Support review and revision without duplicate records |
| Historical draft context | Access depended on the candidate remaining eligible; a default tone could imply stored metadata | Keep stored text accessible outside eligibility and leave unknown saved tone unselected | Preserve work and represent the stored schema honestly |
| Draft replacement | New tone/provider output could overwrite edited text | Explicit keep/replace and unsaved-close choices | Keep the matchmaker in control of their words |
| Local draft claims | Note acknowledgment implied conversation content had been applied | Profile-based draft with an explicit reminder to review notes | Avoid claiming an unimplemented note-content feature |
| Evidence | Reference styling or a successful build could imply UI completion | Named image/text inspections, recorded browser flows and explicit unchecked limits | Make the handoff assessable without overstating validation |

## Functional scope to preserve

Keep assigned-client browsing, search by person/city/work, gender/stage filters, complete biodata, note categories/timestamps, journey stages, opposite-gender ranking, mandatory/strict-fit behavior, counts, reasons/trade-offs, comparison, local drafting, optional Gemini drafting, saved-draft reopening and sign-out. Keep all assessment fields available: contact, education, work, income, height, family, siblings, religion/caste, mother tongue/languages, diet, smoking/drinking, children, relocation, pets and Manglik status. The current binary-gender seed and gender-specific assessment rules are prototype scope; do not silently change them during a visual pass.

Use concise labels such as Client book, Compare details, Draft introduction, Open saved draft and Save draft. Keep the distinction between sample verification, deterministic fit, external AI and actual delivery visible. Preserve the data schema unless the task explicitly changes it.

## Verification record

Evidence recorded 13 October 2026. The latest source was rebuilt and served with `npm run start`; the standalone app root is `C:\Users\dhava\.gemini\antigravity\scratch\tdc-matchmaker-mvp`. The task workspace stores the mockups, screenshots, assessment audit and this guide.

- **Assessment behavior:** ten assigned clients; 105 opposite-gender profiles in each sample pool; all required biodata is present across the header and expandable sections. Matching checks passed mandatory male age/income/height/children rules, boundary values, score ordering/counts and candid female explanations. Career is represented by a limited income proxy. Scores are deterministic fit guides, not predictions.
- **Forms and storage:** invalid login stayed inline; demo details signed in; sign-out returned to login. Notes and journey stage persisted. Empty filters recovered. Saved drafts reopened, edited, saved and reloaded. Dirty-close and tone/provider replacement choices retained existing text. Storage checks covered successful writes, blocked reads/writes, migration and unavailable-window behavior.
- **Browser pages:** root redirected to the client book; the unknown route showed the branded recovery page; the custom dropdowns supported keyboard selection and typeahead; comparison closed with Escape and restored focus. Focus, reduced-motion and checked browser console results are recorded in the current app README.
- **All-page controls:** the six native selects were replaced with one custom accessible Radix select. Inputs, textareas, checkboxes, disclosure markers, scrollbars, modal headers and error/success feedback use the site theme. Native browser and OS surfaces such as autofill suggestions, permission dialogs, IME lists and context menus remain browser/system UI.
- **Small screens:** 375px browser emulation covered sign-in, client book, profile, comparison, intro editor and not-found recovery. The sticky mobile section links were visible during profile scrolling. Comparison and intro fit the viewport; the intro's sticky footer remained inside the dialog at y=673–770 CSS px in an 812px viewport. This is browser emulation evidence, not physical-device validation.
- **Gemini:** `.env.local` holds the dedicated key and is excluded by `.gitignore`; it is not part of the checkpoint, screenshots or source docs. The provider-presence endpoint returned true. The actual introduction editor generated a draft for fictional Aarav/Riya records, and the draft was saved and reopened. Other calls returned temporary Google 503 capacity errors; the text remained intact and the app now retries 429/503 twice before showing its safe failure state. A successful generation proves this credential/model path worked at that moment, not guaranteed provider uptime. Do not commit or deploy without separately configuring a server-side secret and server authentication.
- **Checks and build:** `npm run build`, `scripts/check-api.cjs`, `scripts/check-matching.cjs`, `scripts/check-introduction-lifecycle.cjs` and the storage self-check all passed. The API self-check exercises real local HTTP and invalid bodies but deliberately makes no paid/live AI call. Latest production build completed after the sticky editor footer and retry changes.
- **Still outstanding:** the assessment's hosted demo URL and GitHub repository URL do not exist yet. No résumé/application email was sent. The prototype has client-side demo authentication, browser-local storage and mock email behavior; it is not production security or shared persistence. Browser navigation/reload can still lose unsaved draft edits. The styled error boundary was built but not deliberately triggered; real-device, exhaustive screen-reader and every browser-owned popup checks remain unverified.

### Review screenshots

All paths below are in `C:\Users\dhava\Documents\Codex\2026-10-12\c-users-dhava-gemini-antigravity-scratch\outputs`. The two PNG boards are explorations; the JPGs are actual browser captures.

- Desktop: `TDC_All_Pages_Client_Book.jpg`, `TDC_All_Pages_Client_Story.jpg`, `TDC_All_Pages_Comparison.jpg`, `TDC_All_Pages_Introduction.jpg`.
- Mobile at 375px: `TDC_All_Pages_Mobile_Sign_In.jpg`, `TDC_All_Pages_Mobile_Client_Book.jpg`, `TDC_All_Pages_Mobile_Profile.jpg`, `TDC_All_Pages_Mobile_Comparison.jpg`, `TDC_All_Pages_Mobile_Introduction.jpg`, `TDC_All_Pages_Mobile_Not_Found.jpg`.
- Live provider: `TDC_Gemini_Live_Result.jpg` shows an actual generated draft with the opt-in disclosure and visible Save/Cancel actions.
- Mockup boards: `TDC_All_Pages_Mockup.png` and `TDC_All_Pages_Mobile_Mockup.png`.

## Five craft checks to finish a review

1. **Keyboard path:** comparison Escape dismissal and return to the invoking control were verified. Dirty-close and tone-replacement choices preserved text. Labels, native form submission and native dialogs were source-reviewed. This is not an exhaustive all-controls keyboard or assistive-technology pass.
2. **Focus ring:** a visible mulberry 2px outline was verified in the browser. Source gives fields, pressable controls, links and summaries a 3px offset and the global default a 4px offset. Do not infer that every focus target or contrast combination was measured.
3. **Reduced motion:** browser emulation confirmed the modal's 100ms fade. Source removes press/row/arrow transforms and transitions and disables smooth scrolling. Remaining loading/utility animations and actual-device motion are not comprehensively verified.
4. **375px overflow:** actual client-book, sign-in, comparison and saved-introduction layouts were inspected without horizontal overflow. Final roster inputs/selects were 16px/48px; sign-in fields were 16px/48px; editor input/textarea were 16px. These viewport checks do not establish real-phone keyboard-open behavior.
5. **Hover-only dependencies:** current UI and CSS inspection found no essential action that depends on hover. Critical actions remain visible; fine-pointer hover enhances row background and arrow movement only. Coarse-pointer rules are present, but no actual-phone check is claimed.
