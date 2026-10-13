'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getSession } from '@/lib/storage';
import { Button } from '@/components/ui/primitives';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) router.replace('/login');
    else setName(session.name);
  }, [router]);

  return <header className="sticky top-0 z-30 border-b border-line bg-canvas backdrop-blur">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-10">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/dashboard" className="touch-link text-[23px] font-medium tracking-[-.055em] text-ink sm:text-[26px]">
          the date crew
        </Link>
        {pathname !== '/login' && <Link href="/dashboard" className="touch-link hidden border-l border-line-strong pl-4 text-[12px] text-muted sm:block">Client book</Link>}
      </div>
      {pathname !== '/login' && <div className="flex items-center gap-3">
        <span className="hidden text-[12px] text-muted sm:block">{name.split(' ')[0]}</span>
        <Button variant="ghost" size="sm" className="text-accent hover:bg-wash" onClick={() => { if (clearSession()) router.replace('/login'); else setError('Could not sign out. Allow site storage and try again.'); }}>Sign out</Button>
      </div>}
    </div>
    {error && <p role="alert" className="px-5 pb-3 text-right text-[12px] text-warning">{error}</p>}
  </header>;
}
