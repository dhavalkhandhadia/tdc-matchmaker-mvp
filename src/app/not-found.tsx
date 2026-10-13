import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return <main id="main-content" className="mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 sm:px-10">
    <header className="flex h-24 items-center"><Link href="/" className="touch-link text-[26px] font-medium tracking-[-.055em]">the date crew</Link></header>
    <section className="flex flex-1 flex-col items-start justify-center pb-24">
      <p className="mb-4 text-[12px] text-accent">Page not found</p>
      <h1 className="max-w-xl text-[38px] leading-[1.1] tracking-[-.045em] sm:text-[54px]">Let’s find your way back.</h1>
      <p className="mt-5 max-w-md text-[15px] leading-7 text-muted">This page may have moved, or the link may be incomplete. Your client book is a good place to start.</p>
      <Link href="/dashboard" className="pressable mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-6 text-[14px] font-medium text-white"><ArrowLeft size={16} aria-hidden />Open client book</Link>
    </section>
    <footer className="border-t border-line py-5 text-[11px] text-muted">The matchmaker space</footer>
  </main>;
}
