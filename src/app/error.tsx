'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/primitives';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 sm:px-10">
    <header className="flex h-24 items-center"><Link href="/" className="touch-link text-[26px] font-medium tracking-[-.055em]">the date crew</Link></header>
    <section className="flex flex-1 flex-col items-start justify-center pb-24">
      <p className="mb-4 text-[12px] text-warning">Something went wrong</p>
      <h1 className="max-w-xl text-[38px] leading-[1.1] tracking-[-.045em] sm:text-[54px]">A moment to try again.</h1>
      <p role="alert" className="mt-5 max-w-md text-[15px] leading-7 text-muted">This page could not open. Try again, or return to your client book.</p>
      <div className="mt-8 flex flex-wrap items-center gap-5"><Button size="lg" onClick={reset}>Try again</Button><Link href="/dashboard" className="touch-link text-[13px] text-accent underline underline-offset-4">Open client book</Link></div>
    </section>
  </main>;
}
