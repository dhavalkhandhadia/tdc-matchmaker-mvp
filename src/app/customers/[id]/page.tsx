'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Check, MapPin, Search, UsersRound, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CandidateBiodataModal } from '@/components/CandidateBiodataModal';
import { SendMatchModal } from '@/components/SendMatchModal';
import { ASSIGNED_CUSTOMERS, DUMMY_POOL_PROFILES } from '@/lib/seedData';
import { getRankedMatchesForCustomer } from '@/lib/matchingEngine';
import { addCustomerNote, getCustomerNotes, getCustomersWithPersistedState, getSentMatches, getSession, recordSentMatch, updateCustomerStage } from '@/lib/storage';
import { JourneyStage, MatchmakerNote, MatchResult, SentMatchRecord } from '@/lib/types';
import { Button, Input, ProfileAvatar, Textarea } from '@/components/ui/primitives';
import { Select } from '@/components/ui/Select';

const STAGES: JourneyStage[] = ['Onboarding', 'Profile Verified', 'Sourcing Matches', 'Matches Sent', 'In Dates / Feedback', 'Matched / Paused'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0 py-2.5"><dt className="text-[11px] text-muted">{label}</dt><dd className="mt-1 break-words text-[13px] leading-5 text-ink">{children || 'Not provided'}</dd></div>;
}

export default function CustomerPage() {
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const customer = ASSIGNED_CUSTOMERS.find((item) => item.id === customerId);
  if (!customer) notFound();

  const [stage, setStage] = useState(customer.journeyStage);
  const [notes, setNotes] = useState<MatchmakerNote[]>([]);
  const [drafts, setDrafts] = useState<SentMatchRecord[]>([]);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<MatchmakerNote['category']>('Discovery Call');
  const [search, setSearch] = useState('');
  const [strictOnly, setStrictOnly] = useState(false);
  const [city, setCity] = useState('All');
  const [diet, setDiet] = useState('All');
  const [limit, setLimit] = useState(12);
  const [inspect, setInspect] = useState<MatchResult | null>(null);
  const [send, setSend] = useState<MatchResult | null>(null);
  const [openDraft, setOpenDraft] = useState<SentMatchRecord | null>(null);
  const [toast, setToast] = useState('');
  const [stageMessage, setStageMessage] = useState('Changes save automatically');
  const [stageError, setStageError] = useState(false);
  const [noteError, setNoteError] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const saved = getCustomersWithPersistedState().find((item) => item.id === customer.id);
    setStage(saved?.journeyStage ?? customer.journeyStage);
    setNotes(getCustomerNotes(customer.id));
    setDrafts(getSentMatches(customer.id));
  }, [customer]);

  const matches = useMemo(() => getRankedMatchesForCustomer(customer, DUMMY_POOL_PROFILES, { strictOnly, searchQuery: search, cityFilter: city, dietFilter: diet }), [customer, strictOnly, search, city, diet]);
  const allMatches = useMemo(() => getRankedMatchesForCustomer(customer, DUMMY_POOL_PROFILES).results, [customer]);
  const cities = useMemo(() => Array.from(new Set(DUMMY_POOL_PROFILES.filter((p) => p.gender !== customer.gender).map((p) => p.city))).sort(), [customer.gender]);
  const setJourneyStage = (next: JourneyStage) => {
    if (!updateCustomerStage(customer.id, next)) {
      setStageMessage('Not saved. Allow site storage and try again.');
      setStageError(true);
      return;
    }
    setStage(next);
    setStageError(false);
    setStageMessage('Stage saved in this browser');
  };

  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!note.trim()) return;
    const saved = addCustomerNote({ customerId: customer.id, author: getSession()?.name ?? 'Matchmaker', category, content: note.trim() });
    if (!saved) {
      setNoteError('Your note could not be saved. Your text is still here—allow site storage, then try again.');
      return;
    }
    setNoteError('');
    setNotes((items) => [saved, ...items]);
    setNote('');
    setToast('Note saved');
  };

  const confirmSend = (record: Omit<SentMatchRecord, 'id' | 'sentAt' | 'status'>) => {
    const saved = recordSentMatch(record);
    if (!saved) return false;
    setDrafts((items) => [saved, ...items.filter((item) => item.candidateId !== saved.candidateId)]);
    setSend(null);
    setOpenDraft(null);
    setToast(`Draft recorded locally for ${record.candidateName}`);
    return true;
  };

  return <div className="min-h-screen bg-canvas text-ink">
    <Navbar />
    {toast && <div role="status" className="fixed bottom-5 left-5 right-5 z-40 flex items-center gap-3 rounded-[20px] bg-accent py-2 pl-4 pr-2 text-[13px] text-white shadow-lg sm:left-auto sm:max-w-md"><Check size={16} aria-hidden className="shrink-0" /><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')} className="pressable ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full"><X size={15} aria-hidden /></button></div>}
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1320px] px-5 pb-16 pt-6 sm:px-8">
      <Link href="/dashboard" className="touch-link inline-flex items-center gap-2 rounded-md text-[12px] text-muted hover:text-accent"><ArrowLeft size={14} /> Client book</Link>

      <header className="mt-6 border-b border-line pb-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <span aria-hidden><ProfileAvatar profileId={customer.id} firstName={customer.firstName} lastName={customer.lastName} gender={customer.gender} size="xl" /></span>
            <div className="min-w-0">
            <p className="mb-2 text-[11px] text-accent">Sample client · {customer.isVerified ? 'Verified' : 'Verification pending'}</p>
            <h1 className="font-display text-[34px] leading-tight tracking-[-.04em] text-accent sm:text-[42px]">{customer.firstName} {customer.lastName}</h1>
            <p className="mt-2 text-[13px] text-muted">{customer.age} · {customer.city}, {customer.country} · {customer.maritalStatus}</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="client-stage" className="mb-2 block text-[11px] text-muted">Journey stage</label>
            <Select id="client-stage" label="Journey stage" value={stage} onValueChange={(value) => setJourneyStage(value as JourneyStage)} options={STAGES.map((value) => ({ value, label: value }))} className="h-11 text-accent sm:w-[220px]" />
            <p role={stageError ? "alert" : "status"} className={`mt-1.5 min-h-4 text-[11px] ${stageError ? "text-warning" : "text-muted"}`}>{stageMessage}</p>
          </div>
        </div>
        <p className="mt-5 max-w-[790px] text-[16px] leading-7 text-muted">{customer.bio}</p>
      </header>

      <nav aria-label="Client sections" className="sticky top-[76px] z-20 -mx-5 flex gap-6 border-b border-line bg-canvas px-5 py-1 text-[13px] text-accent sm:-mx-8 sm:px-8 lg:hidden"><a href="#shortlist" className="touch-link underline decoration-line-strong underline-offset-4">Shortlist</a><a href="#about" className="touch-link underline decoration-line-strong underline-offset-4">About</a><a href="#notes" className="touch-link underline decoration-line-strong underline-offset-4">Call notes</a></nav>

      <div className="grid gap-9 pt-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="order-2 min-w-0 lg:order-1 lg:border-r lg:border-line lg:pr-8">
          <section id="about" className="scroll-mt-40 lg:scroll-mt-24">
            <h2 className="font-display text-[23px] tracking-[-.03em] text-accent">A little about {customer.firstName}</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-5">
              <Field label="Work">{customer.designation}</Field><Field label="Company">{customer.company}</Field>
              <Field label="Height">{customer.heightDisplay}</Field><Field label="Diet">{customer.dietaryPreference}</Field>
              <Field label="Children">{customer.wantKids}</Field><Field label="Relocation">{customer.openToRelocate}</Field>
            </dl>
            <div className="mt-3 divide-y divide-line border-y border-line">
              <details className="py-4"><summary className="text-[13px] font-medium text-ink">Personal & professional</summary><dl className="mt-3 grid grid-cols-2 gap-x-5">
                <Field label="Gender">{customer.gender}</Field><Field label="Date of birth">{customer.dob}</Field>
                <Field label="Education">{customer.degree}</Field><Field label="College">{customer.undergradCollege}</Field>
                <Field label="Income">{customer.incomeDisplay}</Field><Field label="Interests">{customer.hobbies.join(', ')}</Field>
              </dl></details>
              <details className="py-4"><summary className="text-[13px] font-medium text-ink">Family & everyday life</summary><dl className="mt-3 grid grid-cols-2 gap-x-5">
                <Field label="Religion & caste">{customer.religion} · {customer.caste}</Field><Field label="Siblings">{customer.siblings}</Field>
                <Field label="Family values">{customer.familyValues} · {customer.familyType}</Field><Field label="Mother tongue">{customer.motherTongue}</Field>
                <Field label="Languages">{customer.languages.join(', ')}</Field><Field label="Pets">{customer.openToPets}</Field>
                <Field label="Smoking">{customer.smokingHabit}</Field><Field label="Drinking">{customer.drinkingHabit}</Field><Field label="Manglik">{customer.manglikStatus}</Field>
              </dl></details>
              <details className="py-4"><summary className="text-[13px] font-medium text-ink">Contact details</summary><dl className="mt-3"><Field label="Email">{customer.email}</Field><Field label="Phone">{customer.phone}</Field></dl></details>
            </div>
          </section>

          <section id="notes" className="mt-8 scroll-mt-40 rounded-[24px] bg-wash p-5 lg:scroll-mt-24">
            <div className="mb-4 flex items-baseline justify-between"><h2 className="font-display text-[23px] tracking-[-.03em] text-accent">Call notes</h2><span className="text-[11px] text-muted">{notes.length} saved</span></div>
            <form onSubmit={saveNote} className="space-y-3">
              <Select label="Note type" value={category} onValueChange={(value) => setCategory(value as MatchmakerNote['category'])} options={['Discovery Call', 'Parent Alignment', 'Date Feedback', 'Match Preference'].map((value) => ({ value, label: value }))} className="h-11" />
              <label htmlFor="call-note" className="sr-only">Conversation note</label><Textarea id="call-note" name="note" value={note} onChange={(e) => { setNote(e.target.value); setNoteError(''); }} placeholder="What matters to them?" rows={3} className="resize-y" aria-invalid={Boolean(noteError)} aria-describedby={noteError ? 'note-error' : undefined} />
              <div className="flex items-center justify-between gap-2"><span className="text-[10px] text-muted">Private · saved in this browser</span><Button type="submit" size="sm" disabled={!note.trim()}>Save note</Button></div>
            </form>
            {noteError && <p id="note-error" role="alert" className="mt-3 text-[12px] leading-5 text-warning">{noteError}</p>}<details className="mt-4 border-t border-line-strong pt-4"><summary className="text-[12px] text-muted">Previous notes ({notes.length})</summary><div className="mt-2 divide-y divide-line-strong">{notes.map((item) => <article key={item.id} className="py-3"><p className="text-[11px] font-medium text-accent">{item.category}</p><p className="mt-2 whitespace-pre-wrap text-[13px] leading-6">{item.content}</p><p className="mt-2 text-[10px] text-muted">{item.author} · <time>{item.createdAt}</time></p></article>)}{notes.length === 0 && <p className="py-3 text-[12px] text-muted">Your first conversation can start here.</p>}</div></details>
          </section>
        </aside>

        <section id="shortlist" className="order-1 min-w-0 scroll-mt-40 lg:order-2 lg:scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h2 className="font-display text-[28px] tracking-[-.04em] text-accent sm:text-[32px]">Your shortlist</h2><p className="mt-2 text-[12px] text-muted">{matches.strictMatchCount} core fits · {matches.allOppositeCount} sample profiles to explore</p></div>
            {customer.gender === 'Female' ? <label className="flex min-h-11 items-center gap-2 text-[12px] text-muted"><input type="checkbox" checked={strictOnly} onChange={(e) => { setStrictOnly(e.target.checked); setLimit(12); }} className="h-4 w-4 accent-accent" />Core fits only</label> : <span className="text-[11px] text-muted">Mandatory rules applied</span>}
          </div>
          {drafts.length > 0 && <details className="mt-5 rounded-[20px] bg-wash px-4 py-1"><summary className="text-[12px] text-accent">Saved introductions ({drafts.length})</summary><div className="divide-y divide-line">{drafts.map((draft) => <div key={draft.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="text-[13px]">{draft.candidateName}</p><p className="mt-1 text-[11px] text-muted">{draft.sentAt}</p></div><Button size="sm" variant="outline" onClick={() => { setSend(allMatches.find((match) => match.candidate.id === draft.candidateId) ?? null); setOpenDraft(draft); }}>Open saved draft<span className="sr-only"> for {draft.candidateName}</span></Button></div>)}</div></details>}
          <div className="grid gap-2.5 border-b border-line pb-4 pt-5 sm:grid-cols-2 xl:grid-cols-[minmax(150px,1fr)_130px_150px]">
            <label className="relative sm:col-span-2 xl:col-span-1"><span className="sr-only">Search potential introductions</span><Search size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><Input value={search} onChange={(e) => { setSearch(e.target.value); setLimit(12); }} placeholder="Find someone" className="h-11 bg-surface pl-10" /></label>
            <Select label="Filter by city" value={city} onValueChange={(value) => { setCity(value); setLimit(12); }} options={[{ value: 'All', label: 'Any city' }, ...cities.map((value) => ({ value, label: value }))]} className="h-11" />
            <Select label="Filter by diet" value={diet} onValueChange={(value) => { setDiet(value); setLimit(12); }} options={[{ value: 'All', label: 'Any diet' }, ...['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain', 'Vegan'].map((value) => ({ value, label: value }))]} className="h-11" />
          </div>
          <p role="status" className="py-3 text-[11px] text-muted">{matches.results.length} profiles · Fit guide out of 100, not a prediction</p>
          <div className="divide-y divide-line">
            {matches.results.slice(0, limit).map((match) => {
              const person = match.candidate;
              const sent = drafts.some((draft) => draft.candidateId === person.id);
              const childrenSummary = customer.wantKids === person.wantKids
                ? person.wantKids === 'Yes'
                  ? 'Both want children'
                  : person.wantKids === 'No'
                    ? 'Neither wants children'
                    : 'Both are unsure about children'
                : `${customer.firstName}: ${customer.wantKids.toLowerCase()} · ${person.firstName}: ${person.wantKids.toLowerCase()}`;
              const relocationSummary = customer.city === person.city
                ? `Both in ${person.city}`
                : person.openToRelocate === 'Yes'
                  ? `${person.firstName} is open to relocating`
                  : customer.openToRelocate === 'Yes'
                    ? `${customer.firstName} is open to relocating`
                    : person.openToRelocate === 'Maybe' || customer.openToRelocate === 'Maybe'
                      ? `Worth discussing · ${customer.city} ↔ ${person.city}`
                      : `Neither is open to relocating · ${customer.city} ↔ ${person.city}`;
              return <article key={person.id} className="py-6 first:pt-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3"><span aria-hidden><ProfileAvatar profileId={person.id} firstName={person.firstName} lastName={person.lastName} gender={person.gender} size="lg" /></span><div className="min-w-0"><h3 className="font-display text-[24px] leading-tight tracking-[-.03em] text-ink">{person.firstName} {person.lastName}</h3><p className="mt-2 text-[12px] text-muted">{person.age} · {person.city} · {person.heightDisplay}</p></div></div>
                <div className="shrink-0 text-right"><span className="font-display text-[25px] leading-none text-accent">{match.totalScore}<span className="text-[12px] text-muted"> / 100</span></span><p className="mt-1.5 text-[10px] text-muted">Fit guide</p></div>
              </div>
              <div className="mt-5 grid gap-4 border-y border-line py-4 xl:grid-cols-[1.15fr_.9fr_1.25fr]">
                <section className="min-w-0" aria-label={`${person.firstName}'s work and education`}>
                  <h4 className="text-[10px] font-medium uppercase tracking-[.15em] text-accent">Work & study</h4>
                  <p className="mt-3 text-[13px] leading-5 text-ink"><span className="font-medium">{person.designation}</span><span className="text-muted"> · {person.company}</span></p>
                  <p className="mt-1 text-[12px] leading-5 text-muted">{person.degree} · {person.undergradCollege}</p>
                </section>
                <section className="min-w-0 border-t border-line pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0" aria-label={`${person.firstName}'s interests`}>
                  <h4 className="text-[10px] font-medium uppercase tracking-[.15em] text-accent">After hours</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {person.hobbies.length > 0 ? person.hobbies.slice(0, 2).map((hobby) => <li key={hobby} className="inline-flex min-h-9 items-center rounded-full bg-accent-soft/55 px-3.5 text-[12px] text-ink">{hobby}</li>) : <li className="text-[12px] text-muted">Not shared yet</li>}
                  </ul>
                </section>
                <section className="min-w-0 border-t border-line pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0" aria-label="Shared preferences">
                  <h4 className="text-[10px] font-medium uppercase tracking-[.15em] text-accent">Where your lives align</h4>
                  <ul className="mt-3 space-y-2.5">
                    <li className="flex items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft/55 text-accent"><UsersRound size={14} aria-hidden="true" /></span><p className="min-w-0 text-[12px] leading-5"><span className="font-medium text-ink">Children</span><span className="text-muted"> · {childrenSummary}</span></p></li>
                    <li className="flex items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft/55 text-accent"><MapPin size={14} aria-hidden="true" /></span><p className="min-w-0 text-[12px] leading-5"><span className="font-medium text-ink">Relocation</span><span className="text-muted"> · {relocationSummary}</span></p></li>
                  </ul>
                </section>
              </div>
              {match.frictionFlags[0] && <p className="mt-3 text-[12px] leading-5 text-accent">Worth discussing: {match.frictionFlags[0]}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2.5"><Button size="md" variant="outline" onClick={() => setInspect(match)}>Compare details</Button><Button size="md" onClick={() => { setOpenDraft(null); setSend(match); }}>{sent ? 'Open saved draft' : 'Send match'}</Button>{match.passesAllStrictRules && <span className="ml-auto text-[10px] text-calm">Core rules align</span>}</div>
              </article>;
            })}
            {matches.results.length === 0 && <div className="py-12 text-center"><Image src="/images/tdc-empty-bougainvillea-v1.webp" alt="" aria-hidden width={120} height={80} className="mx-auto mb-2 h-16 w-24 object-contain" /><h3 className="font-display text-[23px] text-accent">A little more room to explore.</h3><p className="mt-2 text-[13px] text-muted">No profiles match these filters.</p><Button variant="ghost" className="mt-4" onClick={() => { setSearch(''); setCity('All'); setDiet('All'); setStrictOnly(false); setLimit(12); }}>Clear filters</Button></div>}
          </div>
          {matches.results.length > limit && <div className="flex justify-center border-t border-line py-6"><Button variant="outline" onClick={() => setLimit((n) => n + 12)}>Show 12 more</Button></div>}
        </section>
      </div>
    </main>
    <CandidateBiodataModal customer={customer} match={inspect} onClose={() => setInspect(null)} onSendMatch={(match) => { setInspect(null); setOpenDraft(null); setSend(match); }} alreadySent={inspect ? drafts.some((draft) => draft.candidateId === inspect.candidate.id) : false} />
    <SendMatchModal customer={customer} match={send} notes={notes} existingDraft={openDraft ?? (send ? drafts.find((draft) => draft.candidateId === send.candidate.id) : undefined)} onClose={() => { setSend(null); setOpenDraft(null); }} onSaveDraft={confirmSend} />
  </div>;
}
