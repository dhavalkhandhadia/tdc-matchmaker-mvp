'use client';

import { MatchResult, Profile } from '@/lib/types';
import { ArrowLeftRight, Check, CircleDot, X } from 'lucide-react';
import { Button, CompatibilityRing, ProfileAvatar } from '@/components/ui/primitives';
import { Dialog } from '@/components/ui/Dialog';

export function CandidateBiodataModal({ customer, match, onClose, onSendMatch, alreadySent }: {
  customer: Profile; match: MatchResult | null; onClose: () => void;
  onSendMatch: (match: MatchResult) => void; alreadySent: boolean;
}) {
  if (!match) return null;
  const candidate = match.candidate;
  const fields: Array<{ label: string; client: string[]; person: string[]; separator?: string }> = [
    { label: 'Age', client: [String(customer.age)], person: [String(candidate.age)] },
    { label: 'Height', client: [customer.heightDisplay], person: [candidate.heightDisplay] },
    { label: 'Income', client: [customer.incomeDisplay], person: [candidate.incomeDisplay] },
    { label: 'Work', client: [customer.designation, customer.company], person: [candidate.designation, candidate.company] },
    { label: 'Education', client: [customer.degree, customer.undergradCollege], person: [candidate.degree, candidate.undergradCollege] },
    { label: 'Location', client: [customer.city, customer.country], person: [candidate.city, candidate.country], separator: ', ' },
    { label: 'Open to relocate', client: [customer.openToRelocate], person: [candidate.openToRelocate] },
    { label: 'Languages', client: customer.languages, person: candidate.languages },
    { label: 'Family', client: [customer.religion, customer.caste, customer.familyValues], person: [candidate.religion, candidate.caste, candidate.familyValues] },
    { label: 'Marriage & children', client: [customer.maritalStatus, customer.wantKids], person: [candidate.maritalStatus, candidate.wantKids] },
    { label: 'Everyday life', client: [customer.dietaryPreference, `${customer.openToPets} pets`], person: [candidate.dietaryPreference, `${candidate.openToPets} pets`] },
  ];

  return <Dialog open onClose={onClose} labelledBy="compare-title" className="max-w-[860px]">
    <header className="dialog-heading flex items-center gap-3 border-b border-line p-5 sm:px-6">
      <CompatibilityRing score={match.totalScore} size={38} />
      <div className="min-w-0 flex-1">
        <h2 id="compare-title" className="font-display text-[25px] tracking-[-.03em] text-accent">A closer look</h2>
        <p className="mt-1 text-[12px] text-muted">{customer.firstName} · {candidate.firstName} · {match.tier}</p>
      </div>
      <Button variant="ghost" size="sm" className="h-11 w-11 shrink-0 px-0" onClick={onClose} aria-label="Close comparison"><X size={17} aria-hidden /></Button>
    </header>

    <div className="grid grid-cols-1 gap-y-3 border-b border-line bg-wash px-5 py-5 text-[12px] text-muted sm:grid-cols-[120px_minmax(0,1fr)_94px_minmax(0,1fr)] sm:gap-3 sm:px-6">
      <span className="hidden self-center sm:block">Comparing</span>
      {[customer, candidate].map((person, index) => <div key={person.id} className={`flex min-w-0 items-center gap-3 ${index === 0 ? 'sm:col-start-2' : 'sm:col-start-4'}`}>
        <span aria-hidden><ProfileAvatar profileId={person.id} firstName={person.firstName} lastName={person.lastName} gender={person.gender} size="lg" /></span>
        <div className="min-w-0">
          <p className="text-[15px] leading-6 tracking-[-.02em] text-accent">{person.firstName} {person.lastName}</p>
          <p className="mt-1 text-[11px]">{person.age} · {person.city}</p>
        </div>
      </div>)}
    </div>

    <div className="flex flex-wrap justify-end gap-x-4 gap-y-2 border-b border-line px-5 py-3 text-[10px] text-muted sm:px-6" aria-label="Comparison key">
      <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-accent" aria-hidden /> In common</span>
      <span className="inline-flex items-center gap-1.5"><CircleDot size={12} aria-hidden /> Some overlap</span>
      <span className="inline-flex items-center gap-1.5"><ArrowLeftRight size={12} aria-hidden /> Different</span>
    </div>

    <div className="divide-y divide-line px-5 sm:px-6">
      {fields.map((field) => {
        const same = field.client.length === field.person.length && field.client.every((value, index) => value === field.person[index]);
        const overlaps = field.client.some((value) => field.person.includes(value));
        const state = same ? 'In common' : overlaps ? 'Some overlap' : 'Different';
        const StateIcon = same ? Check : overlaps ? CircleDot : ArrowLeftRight;

        return <div key={field.label} className="grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] gap-x-2 gap-y-1 py-3 text-[12px] leading-6 sm:grid-cols-[120px_minmax(0,1fr)_94px_minmax(0,1fr)] sm:gap-x-3 sm:text-[13px]">
          <span className="col-span-3 text-[11px] text-faint sm:col-span-1 sm:self-center">{field.label}</span>
          <span className="min-w-0 break-words">{field.client.join(field.separator ?? ' · ')}</span>
          <span className={`mx-auto inline-flex h-7 items-center justify-center gap-1 rounded-full px-1.5 text-[10px] ${same || overlaps ? 'bg-wash text-accent' : 'text-muted'}`} aria-label={state} title={state}>
            <StateIcon size={13} aria-hidden />
            <span className="hidden sm:inline">{state}</span>
          </span>
          <span className="min-w-0 break-words">{field.person.join(field.separator ?? ' · ')}</span>
        </div>;
      })}
    </div>

    <section className={`grid divide-y divide-line border-t border-line px-5 sm:px-6 ${match.frictionFlags.length ? 'sm:grid-cols-2 sm:divide-x sm:divide-y-0' : ''}`} aria-label="Match notes">
      <div className="py-4 sm:pr-6">
        <h3 className="font-display text-[18px] text-accent">What fits</h3>
        <ul className={`mt-2 text-[12px] leading-5 text-muted ${match.frictionFlags.length ? 'space-y-1.5' : 'grid gap-x-6 gap-y-1.5 sm:grid-cols-2'}`}>
          {match.greenFlags.map((flag) => <li key={flag} className="flex gap-2"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent/60" aria-hidden /><span>{flag}</span></li>)}
        </ul>
      </div>
      {match.frictionFlags.length > 0 && <div className="py-4 sm:pl-6">
        <h3 className="font-display text-[18px] text-accent">Worth discussing</h3>
        <ul className="mt-2 space-y-1.5 text-[12px] leading-5 text-muted">
          {match.frictionFlags.map((flag) => <li key={flag} className="flex gap-2"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent/35" aria-hidden /><span>{flag}</span></li>)}
        </ul>
      </div>}
    </section>

    <div className="px-5 sm:px-6">
      <details className="border-t border-line py-2">
        <summary className="text-[12px] text-muted">About {candidate.firstName}</summary>
        <p className="py-2 text-[14px] leading-7 text-muted">{candidate.bio}</p>
        <p className="pb-2 text-[12px] leading-6 text-accent">{candidate.hobbies.join(' · ')}</p>
      </details>
      <details className="border-y border-line py-2">
        <summary className="text-[12px] text-muted">How the fit guide is calculated</summary>
        <dl className="divide-y divide-line">
          {match.dimensions.map((dimension) => <div key={dimension.key} className="py-3">
            <div className="flex justify-between gap-4 text-[12px]"><dt>{dimension.label}</dt><dd className="tabular-nums">{dimension.score}/100</dd></div>
            <p className="mt-1 text-[11px] leading-5 text-muted">{dimension.summary} · {dimension.weight}% weight</p>
          </div>)}
        </dl>
      </details>
    </div>

    <footer className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 border-t border-line bg-surface px-5 py-4 sm:px-6">
      <Button variant="outline" onClick={onClose}>Close</Button>
      <Button onClick={() => onSendMatch(match)}>{alreadySent ? 'Open saved draft' : 'Send match'}</Button>
    </footer>
  </Dialog>;
}
