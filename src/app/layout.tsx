import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });
export const metadata: Metadata = {
  title: 'The Date Crew — Thoughtful matchmaking in India',
  description: 'Personal matchmakers for serious singles in India. Thoughtful introductions, made personal.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={dmSans.variable}><body className="min-h-screen antialiased selection:bg-accent-soft selection:text-ink">{children}</body></html>;
}
