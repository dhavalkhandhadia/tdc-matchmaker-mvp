'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { setSession } from '@/lib/storage';
import { Button, Input } from '@/components/ui/primitives';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ananya@thedatecrew.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || emailRef.current?.validity.typeMismatch) {
      setError(email.trim() ? 'Enter a valid work email.' : 'Enter your work email.');
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setError('Enter your password.');
      passwordRef.current?.focus();
      return;
    }
    if (email.trim().toLowerCase() !== 'ananya@thedatecrew.com' || password !== 'tdc2026') {
      setError('That email and password do not match the demo account.');
      return;
    }
    if (!setSession({ username: email.trim().toLowerCase(), name: 'Ananya Sharma', role: 'Senior Matchmaker', loggedInAt: new Date().toISOString() })) {
      setError('Your browser could not save this session. Allow site storage, then try again.');
      return;
    }
    router.push('/dashboard');
  };
  return <main id="main-content" className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 sm:px-10 lg:px-14">
    <header className="flex min-h-24 items-center justify-between gap-4">
      <span className="text-[24px] font-medium tracking-[-.055em] sm:text-[28px]">the date crew</span>
      <span className="text-[12px] text-muted">The matchmaker space</span>
    </header>
    <div className="grid flex-1 items-center gap-10 pb-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-8 lg:pb-8">
      <section className="py-5 lg:py-8">
        <h1 className="max-w-[560px] text-[42px] leading-[1.08] tracking-[-.055em] sm:text-[56px] xl:text-[64px]">A little help.<br />A real connection.</h1>
        <div className="mt-8 max-w-[370px] lg:mt-10">
          <h2 className="mb-5 text-[16px] font-medium">Matchmaker sign in</h2>
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            <div><label htmlFor="email" className="mb-2 block text-[12px] text-muted">Work email</label><Input ref={emailRef} id="email" name="email" type="email" spellCheck={false} autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} required aria-invalid={Boolean(error)} aria-describedby={error ? 'sign-in-error' : undefined} className="h-12" /></div>
            <div><label htmlFor="password" className="mb-2 block text-[12px] text-muted">Password</label><div className="relative"><Input ref={passwordRef} id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} required aria-invalid={Boolean(error)} aria-describedby={error ? 'sign-in-error' : undefined} className="h-12 pr-12" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)} className="pressable absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center rounded-full text-muted">{showPassword ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}</button></div></div>
            <p id="sign-in-error" role="alert" className="min-h-5 text-[12px] leading-5 text-warning">{error}</p>
            <Button type="submit" size="lg" className="w-full">Open your client book <ArrowRight size={16} aria-hidden /></Button>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted"><span>Demo account</span><button type="button" className="touch-link pressable rounded-full px-3 text-accent underline decoration-line-strong underline-offset-4" onClick={() => { setEmail('ananya@thedatecrew.com'); setPassword('tdc2026'); setError(''); }}>Fill demo details</button></div>
          <p className="mt-2 text-[11px] leading-5 text-muted">Sample profiles. Notes and drafts stay in this browser.</p>
        </div>
      </section>
      <figure className="relative h-[340px] sm:h-[480px] lg:h-[660px] lg:max-h-[calc(100dvh-160px)] lg:min-h-[520px]">
        <div className="sign-in-photo relative h-full overflow-hidden"><Image src="/images/tdc-bougainvillea-v1.png" alt="An illustrative Indian couple sharing a quiet laugh on a tree-lined street" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-[64%_center]" /></div>
        <figcaption className="absolute bottom-4 right-4 rounded-full bg-surface px-3 py-1.5 text-[10px] text-muted">Illustrative photography</figcaption>
      </figure>
    </div>
    <footer className="border-t border-line py-5 text-[11px] text-muted">Fixing how India finds love, one intelligent match at a time.</footer>
  </main>;
}
