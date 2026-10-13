'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button, Input, StageBadge } from '@/components/ui/primitives';
import { Select } from '@/components/ui/Select';
import { getCustomersWithPersistedState, getSentMatches } from '@/lib/storage';
import { ASSIGNED_CUSTOMERS, DUMMY_POOL_PROFILES } from '@/lib/seedData';
import { JourneyStage, Profile } from '@/lib/types';

const STAGES: JourneyStage[] = ['Onboarding', 'Profile Verified', 'Sourcing Matches', 'Matches Sent', 'In Dates / Feedback', 'Matched / Paused'];
export default function DashboardPage() {
  const [customers, setCustomers] = useState<Profile[]>(ASSIGNED_CUSTOMERS);
  const [draftCount, setDraftCount] = useState(0);
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState<'All' | Profile['gender']>('All');
  const [stage, setStage] = useState<'All' | JourneyStage>('All');
  useEffect(() => {
    setCustomers(getCustomersWithPersistedState());
    setDraftCount(getSentMatches().length);
  }, []);
  const rows = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.firstName} ${customer.lastName} ${customer.city} ${customer.designation}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (gender === 'All' || customer.gender === gender) && (stage === 'All' || customer.journeyStage === stage);
  }), [customers, gender, query, stage]);
  const filtered = Boolean(query || gender !== 'All' || stage !== 'All');
  const clearFilters = () => { setQuery(''); setGender('All'); setStage('All'); };
  return <div className="min-h-screen">
    <Navbar />
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 sm:px-10 sm:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-3 text-[12px] text-accent">A thoughtful introduction starts with a person.</p><h1 className="text-[36px] leading-[1.12] tracking-[-.05em] sm:text-[46px]">Your client book.</h1></div>
        <p className="pb-1 text-[12px] text-muted">{customers.length} clients <span className="px-2 text-line-strong">/</span> {draftCount} {draftCount === 1 ? 'draft' : 'drafts'} saved</p>
      </header>
      <section aria-label="Filter clients" className="mt-8 grid grid-cols-2 gap-3 border-b border-line pb-5 sm:mt-10 lg:grid-cols-[minmax(220px,1fr)_170px_220px]">
        <label className="relative col-span-2 lg:col-span-1"><span className="sr-only">Search clients by name, city or work</span><Search aria-hidden className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a person, city or work" className="h-12 pl-11" /></label>
        <Select id="client-gender" label="Filter by gender" value={gender} onValueChange={(value) => setGender(value as 'All' | Profile['gender'])} options={[{ value: 'All', label: 'Everyone' }, { value: 'Female', label: 'Women' }, { value: 'Male', label: 'Men' }]} className="h-12" />
        <Select id="journey-stage" label="Filter by journey stage" value={stage} onValueChange={(value) => setStage(value as 'All' | JourneyStage)} options={[{ value: 'All', label: 'All stages' }, ...STAGES.map((value) => ({ value, label: value }))]} className="h-12" />
      </section>
      <div className="flex min-h-14 items-center justify-between text-[11px] text-muted" role="status"><span>{filtered ? `${rows.length} of ${customers.length} clients` : 'People in your care'}</span>{filtered && <button type="button" onClick={clearFilters} className="touch-link pressable rounded-full px-3 text-accent underline underline-offset-4">Clear filters</button>}</div>
      <div>
        {rows.map((customer, index) => <Link key={customer.id} href={`/customers/${customer.id}`} className="client-entry pressable group grid grid-cols-[48px_minmax(0,1fr)_20px] items-center gap-x-4 gap-y-3 rounded-[24px] border-b border-line py-6 sm:grid-cols-[56px_minmax(0,1fr)_190px_20px] sm:gap-x-6 sm:px-4">
          <span aria-hidden className={`col-start-1 row-start-1 flex h-12 w-12 items-center justify-center rounded-full text-[16px] sm:h-14 sm:w-14 ${index % 3 === 0 ? 'bg-accent-soft text-accent' : index % 3 === 1 ? 'bg-calm-soft text-calm' : 'bg-wash text-muted'}`}>{customer.firstName[0]}{customer.lastName[0]}</span>
          <div className="col-start-2 row-start-1 grid min-w-0 gap-3 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-8"><div className="min-w-0"><h2 className="text-[21px] leading-tight tracking-[-.035em] sm:text-[24px]">{customer.firstName} {customer.lastName}</h2><p className="mt-2 text-[12px] text-muted">{customer.age} · {customer.city} · {customer.maritalStatus}</p></div><p className="line-clamp-2 text-[13px] leading-6 text-muted">{customer.bio}</p></div>
          <div className="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1"><StageBadge stage={customer.journeyStage} /></div>
          <ArrowRight aria-hidden size={18} className="entry-arrow col-start-3 row-start-1 text-accent transition-transform duration-150 sm:col-start-4" />
          <span className="sr-only">Open {customer.firstName} {customer.lastName}'s story</span>
        </Link>)}
        {rows.length === 0 && <div className="py-14 text-center"><h2 className="text-[24px] tracking-[-.035em]">No one matches these filters.</h2><Button variant="ghost" className="mt-4" onClick={clearFilters}>Clear filters</Button></div>}
      </div>
      <footer className="mt-8 flex flex-wrap justify-between gap-3 text-[11px] text-muted"><span>Demo workspace · {DUMMY_POOL_PROFILES.length} sample profiles</span><span>Notes and drafts are saved in this browser.</span></footer>
    </main>
  </div>;
}
