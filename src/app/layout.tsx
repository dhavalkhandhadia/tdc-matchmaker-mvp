import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });
export const metadata: Metadata = {
  title: 'The Date Crew — Matchmaker Space',
  description: 'A thoughtful workspace for matchmakers guiding meaningful introductions.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={dmSans.variable}><body className="min-h-screen antialiased selection:bg-accent-soft selection:text-ink">{children}</body></html>;
}
