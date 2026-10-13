'use client';

import { MatchResult, Profile } from '@/lib/types';
import { X } from 'lucide-react';
import { Button, CompatibilityRing, ProfileAvatar } from '@/components/ui/primitives';
import { Dialog } from '@/components/ui/Dialog';

export function CandidateBiodataModal({ customer, match, onClose, onSendMatch, alreadySent }: {
  customer: Profile; match: MatchResult | null; onClose: () => void;
  onSendMatch: (match: MatchResult) => void; alreadySent: boolean;
}) {
  if (!match) return null;
  const candidate = match.candidate;
  const fields: Array<[string, string, string]> = [
    ['Age', `${customer.age}`, `${candidate.age}`],
    ['Height', customer.heightDisplay, candidate.heightDisplay],
    ['Income', customer.incomeDisplay, candidate.incomeDisplay],
    ['Work', `${customer.designation} · ${customer.company}`, `${candidate.designation} · ${candidate.company}`],
    ['Education', `${customer.degree} · ${customer.undergradCollege}`, `${candidate.degree} · ${candidate.undergradCollege}`],
    ['Location', `${customer.city}, ${customer.country}`, `${candidate.city}, ${candidate.country}`],
    ['Family', `${customer.religion} · ${customer.caste} · ${customer.familyValues}`, `${candidate.religion} · ${candidate.caste} · ${candidate.familyValues}`],
    ['Marriage & children', `${customer.maritalStatus} · ${customer.wantKids}`, `${candidate.maritalStatus} · ${candidate.wantKids}`],
    ['Everyday life', `${customer.dietaryPreference} · ${customer.openToPets} pets`, `${candidate.dietaryPreference} · ${candidate.openToPets} pets`],
  ];

  return <Dialog open onClose={onClose} labelledBy="compare-title" className="max-w-[860px]">
      <header className="dialog-heading flex items-center gap-3 border-b border-line p-5 sm:px-6"><CompatibilityRing score={match.totalScore} size={42} /><div className="min-w-0 flex-1"><h2 id="compare-title" className="font-display text-[25px] tracking-[-.03em] text-accent">A closer look</h2><p className="mt-1 text-[12px] text-muted">{customer.firstName} · {candidate.firstName} · {match.tier}</p></div><Button variant="ghost" size="sm" className="h-11 w-11 shrink-0 px-0" onClick={onClose} aria-label="Close comparison"><X size={17} aria-hidden /></Button></header>
      <div className="grid grid-cols-2 gap-4 border-b border-line bg-wash px-5 py-5 text-[12px] text-muted sm:grid-cols-[130px_1fr_1fr] sm:px-6"><span className="hidden self-center sm:block">Comparing</span>{[customer, candidate].map((person) => <div key={person.id} className="flex min-w-0 flex-wrap items-center gap-3"><span aria-hidden><ProfileAvatar firstName={person.firstName} lastName={person.lastName} gender={person.gender} size="lg" /></span><div className="min-w-0"><p className="text-[16px] leading-6 tracking-[-.02em] text-accent">{person.firstName} {person.lastName}</p><p className="mt-1 text-[11px]">{person.age} · {person.city}</p></div></div>)}</div>
      <div className="divide-y divide-line px-5 sm:px-6">{fields.map(([label, client, person]) => <div key={label} className="grid grid-cols-2 gap-x-4 gap-y-1 py-3 text-[12px] leading-6 sm:grid-cols-[130px_1fr_1fr] sm:text-[13px]"><span className="col-span-2 text-[11px] text-faint sm:col-span-1">{label}</span><span className="min-w-0 break-words">{client}</span><span className="min-w-0 break-words">{person}</span></div>)}</div>
      <div className="border-t border-line p-5 sm:px-6"><p className="mb-2 font-display text-[20px] text-accent">Why this could work</p><p className="text-[13px] leading-6 text-accent">{match.aiSummary}</p>{match.frictionFlags.length > 1 && <p className="mt-3 text-[12px] leading-6 text-accent">Also discuss: {match.frictionFlags.slice(1).join(' · ')}</p>}<details className="mt-4 border-t border-line py-2"><summary className="text-[12px] text-muted">About {candidate.firstName}</summary><p className="py-2 text-[14px] leading-7 text-muted">{candidate.bio}</p></details><details className="border-y border-line py-2"><summary className="text-[12px] text-muted">How the fit guide is calculated</summary><dl className="divide-y divide-line">{match.dimensions.map((dimension) => <div key={dimension.key} className="py-3"><div className="flex justify-between gap-4 text-[12px]"><dt>{dimension.label}</dt><dd className="tabular-nums">{dimension.score}/100</dd></div><p className="mt-1 text-[11px] leading-5 text-muted">{dimension.summary} · {dimension.weight}% weight</p></div>)}</dl></details></div>
      <footer className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 border-t border-line bg-surface px-5 py-4 sm:px-6"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => onSendMatch(match)}>{alreadySent ? 'Open saved draft' : 'Draft introduction'}</Button></footer>
  </Dialog>;
}
