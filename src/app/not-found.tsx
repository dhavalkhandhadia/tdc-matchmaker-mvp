import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return <main id="main-content" className="mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 sm:px-10">
    <header className="flex h-24 items-center"><Link href="/" className="touch-link text-[26px] font-medium tracking-[-.055em]">the date crew</Link></header>
    <section className="grid flex-1 content-center items-center gap-3 py-8 sm:grid-cols-[minmax(0,1fr)_minmax(260px,.8fr)] sm:gap-10 sm:pb-20">
      <div>
        <p className="mb-4 text-[12px] text-accent">Page not found</p>
        <h1 className="max-w-xl text-[38px] leading-[1.1] tracking-[-.045em] sm:text-[54px]">Let’s find your way back.</h1>
        <p className="mt-5 max-w-md text-[15px] leading-7 text-muted">This page may have moved, or the link may be incomplete. Your client book is a good place to start.</p>
        <Link href="/dashboard" className="pressable mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-6 text-[14px] font-medium text-white"><ArrowLeft size={16} aria-hidden />Open client book</Link>
      </div>
      <div className="relative mx-auto h-[230px] w-[176px] sm:h-[360px] sm:w-[240px] lg:h-[420px] lg:w-[280px]">
        <Image src="/images/tdc-wayfinding-v1.webp" alt="" fill sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 280px" className="object-contain" />
      </div>
    </section>
    <footer className="border-t border-line py-5 text-[11px] text-muted">The matchmaker space</footer>
  </main>;
}
