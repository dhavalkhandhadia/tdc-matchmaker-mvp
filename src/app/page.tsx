import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const applyUrl = 'https://thedatecrew.club/apply/welcome';

export default function HomePage() {
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 pb-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
      <Link href="/" className="shrink-0 text-[20px] font-medium tracking-[-.06em] text-ink sm:text-[22px]">the date crew</Link>
      <nav aria-label="Main navigation" className="flex items-center gap-3 text-[12px] text-muted sm:gap-8 sm:text-[13px]">
        <a href="#approach" className="hidden transition-colors hover:text-ink sm:inline">Our approach</a>
        <Link href="/login" className="min-h-11 inline-flex items-center transition-colors hover:text-accent">Matchmaker sign in</Link>
      </nav>
    </header>

    <main id="main">
      <section className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-12">
        <div className="max-w-[560px]">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[.16em] text-accent sm:text-[12px]">Personal matchmaking, across India</p>
          <h1 className="max-w-[600px] text-[clamp(2.8rem,6vw,5rem)] leading-[1.04] tracking-[-.065em] text-ink">Love deserves a little more thought.</h1>
          <p className="mt-6 max-w-[440px] text-[16px] leading-7 text-muted sm:text-[17px] sm:leading-8">We’re fixing how India finds love, one thoughtful introduction at a time. Real matchmakers help serious singles meet someone who feels right.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <a href={applyUrl} className="pressable inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-[13px] font-medium text-white transition-colors hover:bg-accent-strong">Start with a conversation<ArrowUpRight size={15} aria-hidden /></a>
            <a href="#how-it-works" className="touch-link inline-flex items-center gap-2 text-[13px] font-medium text-accent underline decoration-line-strong underline-offset-4 hover:text-accent-strong">How it works<ArrowDown size={14} aria-hidden /></a>
          </div>
        </div>
        <figure className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px_32px_84px_32px] bg-wash sm:rounded-[40px_40px_112px_40px]">
            <Image src="/images/tdc-landing-couple.webp" alt="Illustrative portrait of a couple sharing a conversation over coffee" fill priority sizes="(max-width: 1023px) 100vw, 56vw" className="object-cover object-[center_54%]" />
          </div>
          <figcaption className="mt-4 flex items-center gap-3 pl-1 text-[12px] text-muted"><span className="h-px w-8 bg-line-strong" />Thoughtful introductions, made personal</figcaption>
        </figure>
      </section>

      <section id="approach" className="scroll-mt-8 border-y border-line bg-surface">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-[76px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-tight tracking-[-.055em] text-ink">People first. Always.</h2>
            <p className="max-w-[360px] text-[14px] leading-6 text-muted">Not another app to swipe through. A real person, getting to know what matters to you.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-0">
            {[
              ['A matchmaker who listens', 'We take the time to understand the life you want to build.'],
              ['Introductions with intention', 'Each introduction begins with care, context and a real conversation.'],
              ['Support beyond hello', 'Your matchmaker is there for the questions and the next steps, too.'],
            ].map(([title, copy], index) => <article key={title} className={`max-w-[340px] ${index ? 'md:border-l md:border-line md:pl-8 lg:pl-12' : ''} ${index < 2 ? 'md:pr-8 lg:pr-12' : ''}`}>
              <p className="mb-4 text-[11px] tabular-nums text-faint">0{index + 1}</p>
              <h3 className="text-[18px] font-medium tracking-[-.025em] text-ink">{title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-muted">{copy}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 mx-auto grid max-w-[1280px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:px-12 lg:py-24">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[.16em] text-accent">A good beginning</p>
          <h2 className="max-w-[440px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-[-.055em] text-ink">One conversation can change the way you meet.</h2>
          <a href={applyUrl} className="touch-link mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-accent underline decoration-line-strong underline-offset-4">Talk to a matchmaker<ArrowUpRight size={14} aria-hidden /></a>
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {[
            ['01', 'Tell us what matters', 'Share the values, hopes and everyday details that make a relationship yours.'],
            ['02', 'Meet your matchmaker', 'A real person listens, asks thoughtful questions and gets to know your story.'],
            ['03', 'Take it one introduction at a time', 'When there’s a meaningful fit, your matchmaker brings you together and stays close.'],
          ].map(([number, title, copy]) => <li key={number} className="grid grid-cols-[36px_minmax(0,1fr)] gap-4 py-5 sm:py-6">
            <span className="pt-1 text-[11px] tabular-nums text-faint">{number}</span>
            <div><h3 className="text-[16px] font-medium tracking-[-.02em] text-ink">{title}</h3><p className="mt-1.5 max-w-[480px] text-[13px] leading-6 text-muted">{copy}</p></div>
          </li>)}
        </ol>
      </section>
    </main>

    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-6 text-[12px] text-muted sm:px-8 lg:px-12">
        <Link href="/" className="font-medium tracking-[-.04em] text-ink">the date crew</Link>
        <p>Thoughtful matchmaking for real life.</p>
        <Link href="/login" className="touch-link text-accent hover:text-accent-strong">Matchmaker sign in</Link>
      </div>
    </footer>
  </>;
}
