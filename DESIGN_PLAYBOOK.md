# The Date Crew — Design & Delivery Playbook

Updated 13 October 2026 from the current UI source. This guide supersedes the earlier evergreen, cream, gold and Lora/Manrope prescriptions. The app has two connected surfaces: a **public matchmaking homepage** and a **private matchmaker workspace** with a client book, client stories, considered comparisons and editable introduction drafts.

This is a record of source decisions, the verified outcomes below and a reusable delivery process. The production build and the public browser flows have been checked. A Gemini draft was generated, saved and reopened from the hosted app using fictional profiles; other requests have returned transient 503 capacity responses. Real-phone behavior and complete accessibility are not established.

## The work and the tone

Help a matchmaker move from a client conversation to a thoughtful introduction without losing context. Make the person, their circumstances and the next useful action clear. Keep explanations short, respectful and concrete. A fit score supports a conversation; it is never a verdict or a relationship prediction.

The shared direction is rose-white, mulberry ink and accents, DM Sans, generous space and quiet separators. The public homepage uses that same system with a human, editorial composition and one illustrative couple photograph. The private workspace stays open and task-focused. Its generated portraits are fictional illustrations for the fictional seed profiles only; label the demo data clearly and replace these assets before using actual client records.

Do not restore the rejected green/cream palette or add a serif merely because a reference or the public brand site uses it. The homepage's application link leads to The Date Crew's public application flow; matchmaker sign-in stays at `/login`.

## Current source of truth

- `src/app/layout.tsx`: DM Sans through `next/font/google`; Latin subset; weights 400, 500 and 600; `display: swap`; `--font-sans`.
- `src/app/globals.css`: semantic color tokens, focus styles, motion, coarse-pointer behavior and sign-in photograph shape. The tokens are mapped with Tailwind CSS 4's `@theme inline`; PostCSS uses `@tailwindcss/postcss`.
- `src/app/page.tsx`: public landing page; it preserves the established internal palette and links the two user paths: service enquiry and matchmaker sign-in.
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

- **Public homepage:** the rose-white canvas, DM Sans and mulberry call to action carry through from the workspace. One candid illustrative Indian couple image anchors a concise promise, with the service approach and next steps below. Use one clear application action; keep matchmaker sign-in easy to find.
- **Sign-in:** a short emotional promise, a compact form and one illustrative image. The source image is `/images/tdc-bougainvillea-v1.png`, with an “Illustrative photography” caption. It does not depict a client or prove a successful match. The image uses an asymmetric curve on desktop and 28px corners below 768px.
- **Client book:** a short introductory line, one title, client/draft counts, one filter row and open person rows. Name, age, city, marital status, short biography and journey stage lead. Fictional sample portraits use gentle circular crops; keep a clear note that demo profiles and portraits are fictional. There is no marketing hero or suggested-candidate mini-dashboard here.
- **Client story:** name, age/place, marital status, stage and a short biography establish context. Everyday facts remain visible. Personal/professional, family/everyday life and contact details expand under explicit labels. The shortlist uses open rows, two reasons and one discussion point; comparison supplies the fuller detail. Notes get one quiet surface.
- **Comparison and introduction:** preserve the client/candidate relationship in the title. A score has reasons and limitations nearby. Saved introductions reopen for editing; “Draft recorded” must not terminate access to the saved text.
- **Recovery and empty results:** keep route context and the next action visible. The 404 page pairs one recovery action with a small signpost; client-book and shortlist empty states keep their filters and use one quiet botanical accent. Loading, app errors, validation and Gemini fallback reuse the same type, surfaces and warm warning token.

### Browser controls

`globals.css` themes page and internal scrollbars, inputs, textareas, placeholders, autofill, invalid/disabled states, resize grips, disclosure markers and checkboxes. Select menus use `src/components/ui/Select.tsx` and Radix behavior for keyboard navigation, typeahead, focus and collision handling. The native modal keeps browser focus containment, Escape and backdrop semantics while the surface is styled by the app. Browser/OS-owned password-manager bubbles, permission prompts, IME candidates and context menus cannot be restyled by page CSS; do not claim those surfaces are custom.

### Illustrative image provenance

The sign-in photograph was generated with the **built-in ImageGen tool**, not the CLI. Source asset: `C:/Users/dhava/.codex/generated_images/01a13010-e0be-7cf2-8c8a-8f6494f07a47/exec-e5068b4f-bdd6-4331-a2b9-b7add4493fc4.png`; app asset: `public/images/tdc-bougainvillea-v1.png`.

**Prompt brief, not a verbatim prompt:** editorial photograph of a fictional Indian couple in their early thirties walking hand-in-hand along a bougainvillea street; candid expressions, natural skin, morning light and muted pink/plum clothes; no lettering, hearts or watermarks. This brand concept was generated before the private-workspace scope was clarified. The photograph remains an explicitly illustrative sign-in asset; the earlier concept is not the final workspace mockup or evidence of real clients.

The signpost and single bougainvillea sprig were also generated with built-in ImageGen, then saved as transparent WebP assets: `public/images/tdc-wayfinding-v1.webp` for not-found recovery and `public/images/tdc-empty-bougainvillea-v1.webp` for client-book and shortlist empty states. They contain no client likeness or text. The signpost points toward a useful next step; the sprig is decorative and remains subordinate to the message. Original PNG generations remain in the Codex generated-images folder.

**Homepage mockup and portrait provenance (13 October 2026):** the revised rose-white/mulberry concept is `output/TDC_Landing_Page_Mockup.png`; the implemented hero uses `/images/tdc-landing-couple.webp` (1000×1250, 4:5). Both couple images are illustrative generated images, not client photographs. Fictional portrait WebPs in `public/images/profiles/` are keyed directly to the seeded profile IDs (`cust-*`, `pool-f-*`, `pool-m-*`). The client book, client story, comparison and shortlist reuse `ProfileAvatar`; the empty fallback remains initials when no supported sample ID is provided. The output folder contains the composition reference, while HTML copy, responsive behavior and live links remain authoritative.
Browser asset check (13 October 2026): all three referenced images load in the local production build. The couple source is 1536×1024; Next serves optimized versions, and object-cover crops at 707×660 desktop and 340×340 mobile retain both people. The signpost source is transparent 1024×1536 and stays contained in 280×420 desktop / 176×230 mobile boxes. The transparent 1536×1024 sprig is contained at 96×64, preserving its 3:2 ratio. No image is stretched or broken; the 10px document-width difference is the reserved scrollbar gutter. The older tdc-editorial-cafe.png file has no source reference and is not shown in the current UI.

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
- **Matching and AI usage:** the seeded pool contains 105 profiles per gender. The engine compares opposite-gender profiles using separate male/female rules. Male results apply mandatory rules; female results offer “Core fits only.” Scores, tiers, reasons and `aiSummary` are deterministic weighted rule outputs, not a learned compatibility model or independent verification. Functional ranking checks passed. A Gemini introduction was generated, saved and reopened from the public hosted app using fictional Aarav/Chitra profiles. Do not imply AI-generated ranking merely because a field is named `aiSummary`. Preserve the assessment behavior and make its assumptions reviewable.
- **Local drafting:** the warm/crisp/family generator uses profile facts and deterministic rule summaries. It does **not** incorporate call-note contents. The misleading note acknowledgment was removed; the editor now says “Local draft uses profile details. Review call notes before saving.” The matchmaker must review and incorporate relevant conversation context.
- **Gemini:** local `.env.local` is excluded by `.gitignore`; the production key is configured separately in Vercel. Neither key is in source, screenshots or handoff files. On 13 October, the local production-mode editor generated, saved and reopened a fictional Aarav/Riya draft using stable Gemini 3.5 Flash-Lite. Gemini 3.8 and 3.6 returned high-demand 503s; Flash-Lite returned HTTP 200. The route retry behavior is included in the current production deployment; the final pass repeated a real hosted generation and saved/reopened the resulting draft. The route retries 429/503 twice and preserves text on failure. The prototype endpoint still lacks server-side session authorization; keep its sample data fictional.
- **Sample truth:** seeded people, “verified” flags and dates are fictional demo data. Keep sample labeling; do not frame generated photography, rule scores or a local draft as evidence of a real person, delivered communication or relationship outcome.

## Research evidence and limits

The visual decisions above are project decisions. References provide questions and principles, not permission to copy assets or evidence of usability.

**Directly inspected image:** [Uniite Matchmaking — Rahul Ninave](https://dribbble.com/shots/26292951-Uniite-Matchmaking-Website-Logo-Design), [original composite](https://cdn.dribbble.com/userupload/44158436/file/original-6eea4269a05f7a4627ab2d24d5816ede.png). Its homepage places one candid black-and-white Indian couple beside a short promise and one action. A partially visible approach page links questionnaire, consultation, coaching and patient search vertically. The right edge is cropped. Take the believable human moment and clear next step; its cream/serif styling and public-service layout are not current workspace requirements. No live interactions were inspected.

**Directly inspected Canva image:** [Pink Minimalist Romantic Couple Photo Collage Document](https://www.canva.com/templates/EAHGy5TMZg4-pink-minimalist-romantic-couple-photo-collage-document/). The actual pink snapshot collage was inspected. Take the candid relationship moments; leave its hearts, script lettering and scrapbook treatment behind. This was an image inspection, not an evaluation of Canva's editable template or a working product flow.

**Directly inspected Muse image:** [Muse — UI/UX Case Study for Queer Dating Platform](https://www.behance.net/gallery/233241105/Muse-UIUX-Case-Study-for-Queer-Dating-Platform). A project CDN image was opened and zoomed in the main research pass: portrait-first mobile context and concise personal cues, without analytics chrome. This supports reducing administrative clutter around people. It does not justify copying the assets, adopting a profile-discovery workflow or claiming the prototype's interactions were checked. Font-family identification remains unverified.

**Directly inspected luxury-matchmaker image:** [Luxury Matchmaking Website Design — VIP Elite Brand Experience](https://dribbble.com/shots/27137691-Luxury-Matchmaking-Website-Design-VIP-Elite-Brand-Experience). The actual black-and-gold photographic hero was inspected. Its useful lesson is a human photograph carrying the emotional promise; the elitist positioning and black/gold palette do not fit this private working tool. No live interactions were inspected.

**Indexed image discovery only:** [Birdy](https://www.behance.net/gallery/92617449/Birdy) and [feel.](https://www.behance.net/gallery/169749233/feel-landing-page-for-love) suggested an ownable emotional motif and narrative organization respectively. Their original pixels were not directly inspected; font families and fine layout details remain unverified. [Canva dating templates](https://www.canva.com/templates/s/dating/) and [dating-wrapped templates](https://www.canva.com/presentations/templates/dating-wrapped/) were discovery galleries only. Pinterest pin pages were inaccessible through the web tool. Do not describe an indexed gallery or inaccessible pin as an inspected project.

**Comparison-specific research (13 October 2026):** Reviewed the page descriptions for Dribbble's [Metriserve Indian matrimonial app](https://dribbble.com/shots/26349980-Metriserve-Matrimonial-App) and Behance's [Match Mantra](https://www.behance.net/gallery/232040513/Designing-Connections-that-Matter-Match-Mantra-), plus Canva's [comparison](https://www.canva.com/templates/s/comparison/) and [couple](https://www.canva.com/templates/s/couple/) galleries. The useful direction is culturally legible profile detail, a direct paired comparison and soft relationship-led color; these were listing/page-text reviews, not a full Figma or interactive audit. The TDC comparison now marks each field as **In common**, **Some overlap** or **Different**, then presents the match engine's fit reasons as separate short lists. Partial overlap matters for composite fields: e.g. matching family values can coexist with different communities. Difference markers stay neutral; they do not imply a problem.

**Retained reference registry, not freshly verified:** [The Date Crew site](https://www.thedatecrew.com/) remains useful for voice and positioning, not a mandatory green/serif visual anchor. Prior discovery links include [Match Mantra](https://www.behance.net/gallery/232040513/Designing-Connections-that-Matter-Match-Mantra-), [Matchify](https://www.behance.net/gallery/208843863/Matchify-UIUX-Case-Study-A-Matrimony-app), [Aisle](https://www.behance.net/gallery/227359237/Aisle-The-Dating-App-Case-Study), [matchmaking service design](https://dribbble.com/shots/26239468-Matchmaking-Service-Website-UI-Design), [modern matchmaking landing page](https://dribbble.com/shots/27271259-Matrimonial-Platforms-Modern-Matchmaking-Landing-Page), [matchmaking homepage](https://dribbble.com/shots/4211174-Matchmaking-website-home-page-design), [matrimonial hero pin](https://in.pinterest.com/pin/exploring-hero-section-designs-for-matrimonial-sites-in-2024--1144899536507087214/), [Indian matchmaking UI pin](https://in.pinterest.com/pin/indian-matrimonial-app-uiux-design--994099317729536781/) and [Indian wedding templates](https://www.canva.com/templates/s/indian-wedding/). Keep them for future focused investigation; no current image/interaction checks are claimed for these links.

**Product research supplement (13 October 2026):** The official [Jeevansathi advanced search](https://www.jeevansathi.com/m0/search/AdvancedSearch) exposes religion, sect, caste, mother tongue, location, income, marital status, children, Manglik status and education filters. [Shaadi.com profile guidance](https://www.shaadi.com/matrimony/devendra-kula-vellalar-coimbatore-matrimony) highlights community, mother tongue, family values and lifestyle, and acknowledges family-managed profiles. Official [Bumble prompt guidance](https://bumble.com/the-buzz/bumble-profile-prompts) presents prompts and interest badges as compact personality and conversation cues. TDC already holds the relevant fields: religion/caste, mother tongue, family outlook/type, city, income, marital status, children, Manglik, education, diet and interests. Applied judgment: keep these details progressively disclosed and matchmaker-reviewed; use shared values and specific discussion points as context, not extra hard filters. This is a follow-up research pass; the original brief’s requested “before starting” timing cannot be proven retroactively.

**Craft reading in the main pass:** Emil Kowalski's [You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) and **Train Your Judgement** were read. The latter's exact URL was not retained, so no guessed link is supplied. Their useful process is to justify motion and train judgment by comparing actual outcomes; frequent work can be immediate. [Family](https://family.co/) was read as full page text: clear words and staged detail can make advanced tasks approachable. This is text evidence, not a fresh interactive audit. [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste), [Benji Taylor — Family Values](https://benji.org/family-values) and [Annotating for agents](https://benji.org/annotating) remain prior reference links, not freshly verified pages in this documentation pass.

**Local sources rechecked read-only:** `C:\Coding\Course Seminar\AGENTS.md`, lines 5–10, specifies an 8px rhythm, 24px outer inset, safe content/control/text areas and space for expanding shapes and shadows. Its Inter/Baskerville and glass styling belong to that project; TDC keeps DM Sans and mulberry. The Markdown index at `C:\Users\dhava\Downloads\animations-web-video\animations-web-video\NEW [Cursor Skill] emil-design-engineering\SKILL.md` and its `animations.md`, `forms-controls.md`, `touch-accessibility.md` and `ui-polish.md` were read. Concrete lessons: stable dynamic geometry; at least 44px touch targets; 16px form text on phones; hover as enhancement; restrained entry/exit motion; and matching easing/duration for paired modal/overlay elements. Do not copy every prescription mechanically: TDC retains appropriate login autocomplete and its own focus color. Its current 220ms modal/180ms backdrop remains the source value; matching the pair is a future review question, not a claimed change.

**Othello rechecked through accessible Codex history and its implementation record:** exact thread title **“Update Othello deployment domain”**, ID `01a1112d-e144-7472-8e54-aa6bc74182e7`, project `C:\Coding\Othello_1`. The latest completed UI turn was feedback-v21 / 0.2.12. `C:\Users\dhava\.codex\worktrees\othello-mobile-flutter\Othello_1\docs\mobile-rebuild\feedback-v21\IMPLEMENTED.md` was read. It records a focus trace sharing the ticket's concave path while preserving one native input; a slow “Copying…” label that initially increased button height and was corrected; explicit local success/error recovery; and scene framing revised after actual-render comparison. It keeps confirmed business state separate from decorative animation. Those are transferable engineering lessons, not permission to import game art, ticket shapes, sound or haptics. No Othello browser/device checks or images were reopened in this read-only pass; its recorded test/render results are that project's evidence, not TDC verification.

### Mockup files and what they mean

The desktop four-screen mockup is `outputs/TDC_All_Pages_Mockup.png` in the task workspace; the companion mobile board is `outputs/TDC_All_Pages_Mobile_Mockup.png`. `output/TDC_Landing_Page_Mockup.png` is the new public homepage composition study. Treat each mockup as visual direction, not a source for generated words, profile data, routes or behavior. The app follows the assessment and actual source data. Use browser captures when checking implementation.

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
| Public entry | Root routed straight to the private workspace | Editorial, image-led home in the existing rose-white/mulberry system with a direct application action and visible matchmaker sign-in | Make the public service feel like a personal relationship experience and keep work access findable |
| People | Initial-only sample identities | One generated, square portrait for each of the 220 fictional seed profiles; one shared avatar renders the same image across the client book, client story, comparison and shortlist | Add human context without misrepresenting real clients |
| Workspace entry | Mission hero and large café image above the roster | Open client book with concise introduction and useful counts | Bring the matchmaker's working content into immediate view |
| Client story | Name and context led without profile imagery | Same mapped sample portrait alongside the client and each shortlisted introduction | Keep people recognizable through the matching flow |
| Shortlist copy | Candidate role/company repeated immediately before a biography opening with the same facts | One concise biography opening | Remove repetition and preserve a calmer reading hierarchy |
| Profile comparison | Nine flat rows followed by a repeated “why” paragraph; composite values hid partial overlap | Centered, neutral relationship cues per row; mixed fields say “Some overlap”; short fit notes replace prose | Help the matchmaker scan agreement, nuance and real discussion points without treating every difference as a warning |
| Photography | One illustrative sign-in scene | A second illustrative couple image anchors the public homepage; generated demo portraits stay inside the fictional sample workspace | Give the public service warmth while preserving honest sample-data provenance |
| Stored actions | Errors swallowed or success implied without persistence | Boolean/object-or-null saves with retained inputs and recovery messages | Protect work and make success truthful |
| Saved introductions | Recorded action could disable further access | Reopen the saved draft and save changes for the same pair | Support review and revision without duplicate records |
| Historical draft context | Access depended on the candidate remaining eligible; a default tone could imply stored metadata | Keep stored text accessible outside eligibility and leave unknown saved tone unselected | Preserve work and represent the stored schema honestly |
| Draft replacement | New tone/provider output could overwrite edited text | Explicit keep/replace and unsaved-close choices | Keep the matchmaker in control of their words |
| Local draft claims | Note acknowledgment implied conversation content had been applied | Profile-based draft with an explicit reminder to review notes | Avoid claiming an unimplemented note-content feature |
| Recovery and empty states | 404 and no-results states were text-only; the Gemini-unavailable helper was easy to miss | A signpost supports 404 recovery, a small sprig marks empty results, and Gemini/provider failures use a visible warm status surface | Extend mockup coverage without hiding route context or recovery actions |
| Evidence | Reference styling or a successful build could imply UI completion | Named image/text inspections, recorded browser flows and explicit unchecked limits | Make the handoff assessable without overstating validation |

## Functional scope to preserve

Keep assigned-client browsing, search by person/city/work, gender/stage filters, complete biodata, note categories/timestamps, journey stages, opposite-gender ranking, mandatory/strict-fit behavior, counts, reasons/trade-offs, comparison, local drafting, optional Gemini drafting, saved-draft reopening and sign-out. Keep all assessment fields available: contact, education, work, income, height, family, siblings, religion/caste, mother tongue/languages, diet, smoking/drinking, children, relocation, pets and Manglik status. The current binary-gender seed and gender-specific assessment rules are prototype scope; do not silently change them during a visual pass.

Use concise labels such as Client book, Compare details, Send match, Open saved draft and Save draft. Keep the distinction between sample verification, deterministic fit, external AI and actual delivery visible. Preserve the data schema unless the task explicitly changes it.

## Verification record

Final assessment pass, 13 October 2026. The current Google Doc was retrieved through its text export. The public release is https://tdc-space.vercel.app and the source is https://github.com/dhavalkhandhadia/tdc-matchmaker-mvp. Earlier screenshots and provider observations below are historical evidence; this record describes the final pass.

- **Assessment:** all ten clients and 210 pool profiles passed field coverage, pool counts, sorting and score/weight checks. Every male rule was tested at equality and children-mismatch boundaries; female ranking, strict filtering and city/search recovery passed.
- **Portraits:** all 220 assets decode as 256×256 WebPs. The shared avatar enforces a square crop and clips its image inside the circle. Client headers use 64px on mobile and 80px on desktop, centered beside the identity block; list/comparison portraits remain 48px.
- **Browser flows:** desktop at 1440px and mobile at 375×812 covered sign-in errors and password visibility, client browsing and filters, all biodata disclosures, notes/stage persistence, shortlist filtering and pagination, comparison, draft validation, dirty-close and replacement choices, saved edits/reload and branded 404 recovery. No horizontal overflow appeared in the checked states. Mobile inputs and textareas computed to 16px; the comparison remained inside the viewport and save actions remained visible.
- **Gemini:** a real local response and a real Vercel production response both returned HTTP 200. The hosted introduction was saved and reopened after reload. Simulated provider failure retained edited text. Privacy details remain available in a disclosure beside the drafting controls. Keys remain in ignored local configuration and encrypted Vercel production configuration.
- **Build and runtime:** npm run check, npm run check:api and npm run build passed. npm audit reported zero production dependency vulnerabilities. A fresh production server returned HTTP 200 for the homepage, login, dashboard and all ten customer routes; malformed AI payloads returned 400 and unknown routes returned 404. Restarting the stale local production process resolved its old customer-route 500. The exercised local and hosted pages recorded no browser runtime errors.
- **Delivery:** the release includes the approved three-part candidate summary, corrected profile heading, exact Send match action, comparison relocation/language facts and the complete interests in the About disclosure. README.md contains the live/source links and sample credentials; ASSESSMENT.md contains the required three-paragraph write-up.
- **Prototype limits:** credentials are checked in client code; state is stored in this browser; the match action is mocked and sends no email. A changed or malformed browser session is rejected safely. Real-device, full screen-reader and intentionally forced React-error-boundary checks were not performed. The applicant will send the application email manually.

### Review screenshots

All paths below are in `C:\Users\dhava\Documents\Codex\2026-10-12\c-users-dhava-gemini-antigravity-scratch\outputs`. The two PNG boards are explorations; the JPGs are actual browser captures.

- Desktop: `TDC_All_Pages_Client_Book.jpg`, `TDC_All_Pages_Client_Story.jpg`, `TDC_All_Pages_Comparison.jpg`, `TDC_All_Pages_Introduction.jpg`.
- Mobile at 375px: `TDC_All_Pages_Mobile_Sign_In.jpg`, `TDC_All_Pages_Mobile_Client_Book.jpg`, `TDC_All_Pages_Mobile_Profile.jpg`, `TDC_All_Pages_Mobile_Comparison.jpg`, `TDC_All_Pages_Mobile_Introduction.jpg`, `TDC_All_Pages_Mobile_Not_Found.jpg`.
- Live provider: `TDC_Gemini_Live_Result.jpg` shows an actual generated draft with the opt-in disclosure and visible Save/Cancel actions.
- Public landing mockup: `output/TDC_Landing_Page_Mockup.png` in the app repository; production-render captures are `output/playwright/TDC_Landing_Desktop.png` and `output/playwright/TDC_Landing_Mobile.png`.
- Portrait and dialog captures: `output/playwright/TDC_Client_Book_Avatars.png`, `output/playwright/TDC_Compare_Desktop.png`, `output/playwright/TDC_Compare_Mobile.png`, `output/playwright/TDC_Compare_Relationship_Desktop.png`, `output/playwright/TDC_Compare_Relationship_Mobile.png` and `output/playwright/TDC_Profile_Crop_Check.png`.
- Mockup boards: `TDC_All_Pages_Mockup.png` and `TDC_All_Pages_Mobile_Mockup.png`.
- Supplemental ImageGen boards: `TDC_Recovery_Empty_States_Mockup.png` and `TDC_Recovery_States_Mockup.png` cover responsive recovery, empty results, failed sign-in, loading, app error and Gemini-unavailable views. They guide composition and art direction; source controls, copy and data stay authoritative because generated mockup lettering or incidental navigation can drift.

- Latest local browser captures: TDC_Recovery_404_Desktop.png, TDC_Recovery_404_Mobile.png, TDC_Client_Book_Empty_Desktop.png, TDC_Client_Book_Empty_Mobile.png, TDC_Shortlist_Empty_Desktop.png, TDC_Shortlist_Empty_Mobile.png, TDC_Login_Error_Desktop.png and TDC_Login_Error_Mobile.png. These are from the final local build; they are implementation evidence, not generated mockups.

## Five craft checks to finish a review

1. **Keyboard path:** comparison Escape dismissal and return to the invoking control were verified. Dirty-close and tone-replacement choices preserved text. Labels, native form submission and native dialogs were source-reviewed. This is not an exhaustive all-controls keyboard or assistive-technology pass.
2. **Focus ring:** a visible mulberry 2px outline was verified in the browser. Source gives fields, pressable controls, links and summaries a 3px offset and the global default a 4px offset. Do not infer that every focus target or contrast combination was measured.
3. **Reduced motion:** browser emulation confirmed the modal's 100ms fade. Source removes press/row/arrow transforms and transitions and disables smooth scrolling. Remaining loading/utility animations and actual-device motion are not comprehensively verified.
4. **375px overflow:** actual client-book, sign-in, comparison and saved-introduction layouts were inspected without horizontal overflow. Final roster inputs/selects were 16px/48px; sign-in fields were 16px/48px; editor input/textarea were 16px. These viewport checks do not establish real-phone keyboard-open behavior.
5. **Hover-only dependencies:** current UI and CSS inspection found no essential action that depends on hover. Critical actions remain visible; fine-pointer hover enhances row background and arrow movement only. Coarse-pointer rules are present, but no actual-phone check is claimed.
