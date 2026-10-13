import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return <main id="main-content" className="flex min-h-screen items-center justify-center px-6">
    <div role="status" aria-live="polite" aria-busy="true" className="flex flex-col items-center gap-5 text-center">
      <p className="text-[28px] font-medium tracking-[-.055em]">the date crew</p>
      <LoaderCircle size={24} strokeWidth={1.5} aria-hidden className="workspace-spinner text-accent" />
      <p className="text-[13px] text-muted">Opening your workspace…</p>
    </div>
  </main>;
}
