'use client';

import { MatchResult, Profile } from '@/lib/types';
import { ComparisonRow, getComparisonRows } from '@/lib/profileComparison';
import { ArrowDown, ArrowUp, BriefcaseBusiness, Check, Equal, Info, MapPin, MessageCircle, UsersRound, X } from 'lucide-react';
import { Button, CompatibilityRing, ProfileAvatar } from '@/components/ui/primitives';
import { Dialog } from '@/components/ui/Dialog';

const insightIcons = { up: ArrowUp, down: ArrowDown, equal: Equal, children: UsersRound, location: MapPin, work: BriefcaseBusiness, values: UsersRound, shared: MessageCircle };
const focusLabels: Record<string, { title: string; fit: string }> = {
  career: { title: 'Career', fit: 'Career fit' }, values: { title: 'Values', fit: 'Values align' }, relocation: { title: 'Location', fit: 'Location works' },
};

function ComparisonValue({ values, scale, candidate }: { values: string[]; scale?: ComparisonRow['scale']; candidate?: boolean }) {
  const width = scale ? ((candidate ? scale.person : scale.client) / Math.max(scale.client, scale.person, 1)) * 100 : 0;
  return <>
    {values.map((value, index) => <p key={`${index}-${value}`} className={index ? 'mt-0.5 text-[11px] leading-5 text-muted' : ''}>{value}</p>)}
    {scale && <div className="mt-2 h-1 w-full max-w-[168px] overflow-hidden rounded-full bg-wash" aria-hidden>
      <div className={`h-full rounded-full ${candidate ? 'bg-accent' : 'bg-line-strong'}`} style={{ width: `${width}%` }} />
    </div>}
  </>;
}

export function CandidateBiodataModal({ customer, match, onClose, onSendMatch, alreadySent }: {
  customer: Profile; match: MatchResult | null; onClose: () => void;
  onSendMatch: (match: MatchResult) => void; alreadySent: boolean;
}) {
  if (!match) return null;
  const candidate = match.candidate;
  const fields = getComparisonRows(customer, match);
  const maleClient = customer.gender === 'Male';
  const rulesMet = match.dimensions.filter((dimension) => ['age', 'height', 'income', 'kids'].includes(dimension.key) && dimension.passedStrict).length;

  return <Dialog open onClose={onClose} labelledBy="compare-title" className="max-w-[860px]">
    <header className="dialog-heading flex items-center gap-3 border-b border-line p-5 sm:px-6">
      <CompatibilityRing score={match.totalScore} size={38} />
      <div className="min-w-0 flex-1">
        <h2 id="compare-title" className="font-display text-[25px] tracking-[-.03em] text-accent">A closer look</h2>
        <p className="mt-1 text-[12px] text-muted">{customer.firstName} · {candidate.firstName} · {match.tier}</p>
      </div>
      <Button variant="ghost" size="sm" className="h-11 w-11 shrink-0 px-0" onClick={onClose} aria-label="Close comparison"><X size={17} aria-hidden /></Button>
    </header>

    <div className="grid grid-cols-2 gap-4 border-b border-line bg-wash px-5 py-5 text-[12px] text-muted sm:grid-cols-[84px_minmax(0,1fr)_168px_minmax(0,1fr)] sm:gap-3 sm:px-6">
      <span className="hidden self-center sm:block">Comparing</span>
      {[customer, candidate].map((person, index) => <div key={person.id} className={`flex min-w-0 items-center gap-2 sm:gap-3 ${index === 0 ? 'sm:col-start-2' : 'sm:col-start-4'}`}>
        <span aria-hidden><ProfileAvatar profileId={person.id} firstName={person.firstName} lastName={person.lastName} gender={person.gender} size="lg" /></span>
        <div className="min-w-0">
          <p className="text-[13px] leading-5 tracking-[-.02em] text-accent sm:text-[15px] sm:leading-6">{person.firstName} {person.lastName}</p>
          <p className="mt-1 text-[11px]">{person.age} · {person.city}</p>
        </div>
      </div>)}
    </div>

    <section className="border-b border-line px-5 py-4 sm:px-6" aria-label={maleClient ? 'Required matching rules' : 'Matching priorities'}>
      {maleClient ? <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-2xl bg-wash px-4 py-3">
        <h3 className="text-[12px] font-medium">{customer.firstName}’s required rules</h3>
        <span className={`inline-flex shrink-0 items-center gap-1.5 text-[10px] ${rulesMet === 4 ? 'text-accent' : 'text-warning'}`}>
          {rulesMet === 4 ? <Check size={13} aria-hidden /> : <MessageCircle size={13} aria-hidden />}{rulesMet} of 4 met
        </span>
        <p className="col-span-2 text-[11px] leading-5 text-muted">Younger · lower income · shorter · same children preference</p>
      </div> : <>
        <h3 className="text-[12px] text-muted">Career, values & relocation lead this fit guide.</h3>
        <div className="mt-3 grid grid-cols-3 divide-x divide-line">
          {match.dimensions.filter((dimension) => focusLabels[dimension.key]).map((dimension, index) => <div key={dimension.key} className={`${index ? 'pl-3 sm:pl-5' : ''} ${index < 2 ? 'pr-3 sm:pr-5' : ''}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-[11px]"><span>{focusLabels[dimension.key].title} <span className="text-[10px] text-faint">{dimension.weight}%</span></span><span className="basis-full tabular-nums text-accent sm:basis-auto">{dimension.score}<span className="sr-only"> out of 100</span></span></div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-wash" aria-hidden><div className="h-full rounded-full bg-accent" style={{ width: `${dimension.score}%` }} /></div>
            <p className={`mt-2 flex items-start gap-1 text-[10px] leading-4 ${dimension.passedStrict ? 'text-accent' : 'text-warning'}`}>{dimension.passedStrict ? <Check size={11} className="mt-0.5 shrink-0" aria-hidden /> : <MessageCircle size={11} className="mt-0.5 shrink-0" aria-hidden />}{dimension.passedStrict ? focusLabels[dimension.key].fit : 'Worth discussing'}</p>
          </div>)}
        </div>
        <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-5 text-muted"><Info size={12} className="mt-1 shrink-0" aria-hidden />Age and height are weighted preferences, not mandatory rules.</p>
      </>}
      <p className="mt-3 text-[10px] leading-5 text-muted">{candidate.firstName} compared with {customer.firstName} · Bars show values to scale.</p>
    </section>

    <div className="px-5 sm:px-6" role="table" aria-label={`${customer.firstName} and ${candidate.firstName} profile comparison`}>
      <div role="row" className="sr-only text-[10px] text-faint sm:not-sr-only sm:grid sm:grid-cols-[84px_minmax(0,1fr)_168px_minmax(0,1fr)] sm:gap-3 sm:border-b sm:border-line sm:py-2">
        <span role="columnheader">Field</span><span role="columnheader">{customer.firstName}</span><span role="columnheader" className="text-center">Insight</span><span role="columnheader">{candidate.firstName}</span>
      </div>
      {fields.map((field) => {
        const InsightIcon = insightIcons[field.icon];

        return <div key={field.key} role="row" className="grid grid-cols-2 items-center gap-x-5 gap-y-1 border-b border-line py-3 text-[12px] leading-6 sm:grid-cols-[84px_minmax(0,1fr)_168px_minmax(0,1fr)] sm:gap-x-3 sm:py-4 sm:text-[13px]">
          <span role="rowheader" className="col-span-2 text-[11px] text-faint sm:col-span-1">{field.label}</span>
          <div role="cell" className="min-w-0 break-words"><ComparisonValue values={field.client} scale={field.scale} /></div>
          <div role="cell" className={`col-span-2 row-start-3 flex items-center justify-center gap-2 text-center sm:col-span-1 sm:row-auto ${field.tone === 'discuss' ? 'text-warning' : field.tone === 'aligned' ? 'text-accent' : 'text-muted'}`}>
            <InsightIcon size={15} className="shrink-0" aria-hidden />
            <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 sm:block">
              <p className="text-[11px] leading-5">{field.insight}</p>
              <p className="flex items-center justify-center gap-1 text-[10px] leading-5">{field.tone === 'aligned' && <Check size={11} aria-hidden />}{field.status}</p>
            </div>
          </div>
          <div role="cell" className="col-start-2 row-start-2 min-w-0 break-words sm:col-start-auto sm:row-auto"><ComparisonValue values={field.person} scale={field.scale} candidate /></div>
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
