'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Profile, MatchResult, MatchmakerNote, SentMatchRecord } from '@/lib/types';
import { buildPersonalizedMatchIntro } from '@/lib/matchingEngine';
import { Button, Input, Textarea, CompatibilityRing, SegmentedTabs } from '@/components/ui/primitives';
import { Dialog } from '@/components/ui/Dialog';
import { Disclosure } from '@/components/ui/Disclosure';

interface SendMatchModalProps {
  customer: Profile;
  match: MatchResult | null;
  notes: MatchmakerNote[];
  existingDraft?: SentMatchRecord;
  onClose: () => void;
  onSaveDraft: (record: Omit<SentMatchRecord, 'id' | 'sentAt' | 'status'>) => boolean;
}

type ToneType = 'warm' | 'executive' | 'family';

export function SendMatchModal({ customer, match, notes, existingDraft, onClose, onSaveDraft }: SendMatchModalProps) {
  const [tone, setTone] = useState<ToneType | null>('warm');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiAvailable, setGeminiAvailable] = useState<boolean | null>(null);
  const [providerMessage, setProviderMessage] = useState('');
  const [edited, setEdited] = useState(false);
  const [pendingTone, setPendingTone] = useState<ToneType | null>(null);
  const [discarding, setDiscarding] = useState(false);
  const [pendingGemini, setPendingGemini] = useState(false);
  const [saveError, setSaveError] = useState('');
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const keepEditingRef = useRef<HTMLButtonElement>(null);
  const generationRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!match && !existingDraft) return;
    const generated = match ? buildPersonalizedMatchIntro(customer, match, notes, 'warm') : { subject: '', emailBody: '', aiBullets: [] };
    setTone(existingDraft ? null : 'warm');
    setEdited(false);
    setPendingTone(null);
    setDiscarding(false);
    setPendingGemini(false);
    setSaveError('');
    setIsGenerating(false);
    setSubject(existingDraft?.emailSubject ?? generated.subject);
    setMessageBody(existingDraft?.emailBody ?? generated.emailBody);
    setHighlights(generated.aiBullets);
    setProviderMessage(existingDraft ? `Saved in this browser · ${existingDraft.sentAt}` : 'Local draft ready.');
    setGeminiAvailable(null);
    fetch('/api/ai/intro').then((response) => response.json()).then((data) => setGeminiAvailable(data.geminiAvailable === true)).catch(() => setGeminiAvailable(false));
    return () => generationRef.current?.abort();
  }, [customer, match, notes, existingDraft]);

  useEffect(() => { if (discarding) keepEditingRef.current?.focus(); }, [discarding]);

  if (!match && !existingDraft) return null;
  const candidateFullName = match ? `${match.candidate.firstName} ${match.candidate.lastName}` : existingDraft!.candidateName;
  const customerFullName = `${customer.firstName} ${customer.lastName}`;
  const providerFailed = providerMessage.startsWith('Gemini could not respond.');

  const applyTone = (nextTone: ToneType) => {
    if (!match) return;
    const generated = buildPersonalizedMatchIntro(customer, match, notes, nextTone);
    setTone(nextTone);
    setSubject(generated.subject);
    setMessageBody(generated.emailBody);
    setHighlights(generated.aiBullets);
    setEdited(true);
    setPendingTone(null);
    setProviderMessage('Local draft ready.');
  };
  const changeTone = (nextTone: ToneType) => {
    if (nextTone === tone && !existingDraft) return;
    if (edited || existingDraft) setPendingTone(nextTone);
    else applyTone(nextTone);
  };

  const requestClose = () => {
    if (edited) setDiscarding(true);
    else onClose();
  };

  const generateWithGemini = async () => {
    if (!geminiAvailable || !match) return;
    generationRef.current?.abort();
    const controller = new AbortController();
    generationRef.current = controller;
    setPendingGemini(false);
    setIsGenerating(true);
    setProviderMessage('Drafting with Gemini…');
    try {
      const response = await fetch('/api/ai/intro', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, match, notes: notes.slice(0, 5), tone: tone ?? 'warm', useGemini: true }),
      });
      const data = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok) throw new Error(data.error || 'Draft service unavailable');
      if (data.subject) setSubject(data.subject);
      if (data.emailBody) setMessageBody(data.emailBody);
      if (Array.isArray(data.aiBullets)) setHighlights(data.aiBullets);
      setEdited(true);
      setProviderMessage(data.providerMessage || 'Gemini draft ready. Review and edit it before saving.');
    } catch {
      if (controller.signal.aborted) return;
      setProviderMessage('Gemini could not respond. Your current draft is unchanged.');
    } finally {
      if (!controller.signal.aborted) setIsGenerating(false);
    }
  };

  const handleSaveDraft = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !messageBody.trim()) {
      setSaveError(!subject.trim() ? 'Add a subject before saving.' : 'Add an introduction note before saving.');
      (!subject.trim() ? subjectRef : bodyRef).current?.focus();
      return;
    }
    const saved = onSaveDraft({
      customerId: customer.id,
      candidateId: match?.candidate.id ?? existingDraft!.candidateId,
      candidateName: candidateFullName,
      score: match?.totalScore ?? existingDraft!.score,
      emailSubject: subject,
      emailBody: messageBody,
    });
    if (!saved) setSaveError('Could not save this draft. Your text is still here—allow site storage and try again.');
  };

  return <Dialog open onClose={requestClose} labelledBy="intro-title" className="max-w-[660px]">
      <header className="dialog-heading flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
        <CompatibilityRing score={match?.totalScore ?? existingDraft!.score} size={42} />
        <div className="min-w-0 flex-1"><h2 id="intro-title" className="font-display text-[25px] tracking-[-.03em] text-accent">An introduction.</h2><p className="mt-1 text-[12px] text-muted">{customerFullName} <span className="px-1">·</span> {candidateFullName}</p></div>
        <Button variant="ghost" size="sm" className="h-11 w-11 shrink-0 px-0" onClick={requestClose} aria-label="Close introduction"><X size={17} aria-hidden /></Button>
      </header>

       {discarding && <div role="alert" className="border-b border-line bg-warning-soft px-5 py-4 sm:px-6"><p className="text-[13px] text-ink">You have unsaved edits.</p><div className="mt-3 flex gap-2"><Button ref={keepEditingRef} variant="outline" size="sm" onClick={() => { setDiscarding(false); subjectRef.current?.focus(); }}>Keep editing</Button><Button variant="ghost" size="sm" onClick={onClose}>Discard edits</Button></div></div>}
      <form onSubmit={handleSaveDraft} noValidate className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="mb-1.5 text-[12px] text-muted">Tone</p><SegmentedTabs disabled={isGenerating || !match} value={tone} onChange={changeTone} options={[{ value: 'warm', label: 'Warm' }, { value: 'executive', label: 'Crisp' }, { value: 'family', label: 'Family' }]} /></div>
          <Button type="button" variant="outline" onClick={() => { if (edited || existingDraft) setPendingGemini(true); else generateWithGemini(); }} disabled={geminiAvailable !== true || isGenerating || !match}>{isGenerating ? 'Drafting…' : geminiAvailable === null ? 'Checking Gemini…' : geminiAvailable ? 'Draft with Gemini' : 'Gemini unavailable'}</Button>
        </div>
        {pendingTone && <div role="alert" className="rounded-[14px] bg-warning-soft p-3 text-[12px] text-muted"><p>Changing tone replaces your edits.</p><div className="mt-2 flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => { setPendingTone(null); subjectRef.current?.focus(); }}>Keep edits</Button><Button type="button" size="sm" onClick={() => { applyTone(pendingTone); subjectRef.current?.focus(); }}>Replace draft</Button></div></div>}
        {pendingGemini && <div role="alert" className="rounded-[16px] bg-warning-soft p-4 text-[12px]"><p>Gemini will replace this draft using the profile and recent notes.</p><div className="mt-3 flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => setPendingGemini(false)}>Keep draft</Button><Button type="button" size="sm" onClick={generateWithGemini}>Replace with Gemini</Button></div></div>}
        <p role={providerFailed ? 'alert' : 'status'} aria-live="polite" className={`min-h-4 text-[11px] leading-4 ${providerFailed ? 'rounded-[14px] bg-warning-soft px-3.5 py-3 text-warning' : 'text-faint'}`}>{providerMessage}</p>
        {geminiAvailable && <Disclosure title="What Gemini receives when you draft" className="border-y border-line" triggerClassName="text-[11px] text-muted"><p className="text-[11px] leading-5 text-muted">Google receives names, age, city, work, education, values, lifestyle preferences, match reasons and up to five recent notes. Contact details and dates of birth are excluded. Review the result; no email is sent.</p></Disclosure>}
        {geminiAvailable === false && <p role="status" className="rounded-[14px] bg-warning-soft px-3.5 py-3 text-[11px] leading-4 text-muted"><span className="font-medium text-warning">Gemini unavailable. </span>Local draft uses profile details. Review call notes before saving.</p>}

        {!match && <p className="rounded-[16px] bg-warning-soft p-4 text-[12px] leading-5">This saved introduction is outside the current shortlist. You can review and edit it; automatic redrafting is unavailable.</p>}
        {highlights.length > 0 && <Disclosure title="Shortlist context" className="bg-wash" triggerClassName="text-[12px] text-muted"><ul className="space-y-2 text-[12px] leading-6 text-muted">{highlights.map((item, index) => <li key={index}>{item}</li>)}</ul></Disclosure>}

        <div><label htmlFor="intro-subject" className="mb-1.5 block text-[12px] text-muted">Subject</label><Input ref={subjectRef} id="intro-subject" name="subject" disabled={isGenerating} value={subject} onChange={(event) => { setSubject(event.target.value); setEdited(true); setSaveError(''); }} aria-invalid={Boolean(saveError && !subject.trim())} aria-describedby={saveError ? 'intro-error' : undefined} required className="h-12" /></div>
        <div><label htmlFor="intro-body" className="mb-1.5 block text-[12px] text-muted">Introduction note</label><Textarea ref={bodyRef} id="intro-body" name="introduction" disabled={isGenerating} rows={8} value={messageBody} onChange={(event) => { setMessageBody(event.target.value); setEdited(true); setSaveError(''); }} aria-invalid={Boolean(saveError && !messageBody.trim())} aria-describedby={saveError ? 'intro-error' : undefined} className="resize-y" required /></div>

        {saveError && <p id="intro-error" role="alert" className="text-[12px] leading-5 text-warning">{saveError}</p>}<footer className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-5 py-3 sm:-mx-6 sm:px-6">
          <span className="text-[11px] text-faint">{edited ? 'Unsaved changes' : existingDraft ? 'Saved in this browser' : 'Local draft · not saved'} · no email is sent</span>
          <div className="flex items-center gap-2"><Button type="button" variant="ghost" onClick={requestClose}>Cancel</Button><Button type="submit" disabled={isGenerating}>{existingDraft ? "Save changes" : "Save draft"}</Button></div>
        </footer>
      </form>
  </Dialog>;
}
