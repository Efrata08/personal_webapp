'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type HawkMode  = 'flying' | 'perched' | 'hidden';
type HawkPhase = 'hidden' | 'flying-in' | 'perched' | 'flying-out';
type FormState = 'idle' | 'sending' | 'sent' | 'error';

const HAWK_FRAMES_LEFT = [
  '/Hawk/1-right.png',
  '/Hawk/2-right.png',
  '/Hawk/3-right.png',
  '/Hawk/4-right.png',
];

const HAWK_FRAMES_RIGHT = [
  '/Hawk/1-right.png',
  '/Hawk/2-right.png',
  '/Hawk/3-right.png',
  '/Hawk/4-right.png',
];

/* ── HawkSprite ──────────────────────────────────────────── */
function HawkSprite({ mode, direction }: { mode: HawkMode; direction: 'left' | 'right' }) {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (mode !== 'flying') return;
    const id = setInterval(() => {
      setFrameIdx(i => (i + 1) % 4);
    }, 110);
    return () => clearInterval(id);
  }, [mode]);

  const frames = direction === 'right' ? HAWK_FRAMES_RIGHT : HAWK_FRAMES_LEFT;
  const src = mode === 'perched' ? '/Hawk/hawk-perched.png' : frames[frameIdx];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="hawk-img"
      style={{
        display: 'block',
        opacity: mode === 'hidden' ? 0 : 1,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── ContactSection ──────────────────────────────────────── */
export default function ContactSection() {
  const sectionRef      = useRef<HTMLElement>(null);
  const hawkWrapRef     = useRef<HTMLDivElement>(null);
  const hasEntered      = useRef(false);
  const prefersReduced  = useRef(false);

  const [hawkMode,         setHawkMode]         = useState<HawkMode>('hidden');
  const [hawkPhase,        setHawkPhase]        = useState<HawkPhase>('hidden');
  const [hawkDirection,    setHawkDirection]    = useState<'left' | 'right'>('left');
  const [isFloating,       setIsFloating]       = useState(false);
  const [showGlow,         setShowGlow]         = useState(false);

  const [name,             setName]             = useState('');
  const [email,            setEmail]            = useState('');
  const [subject,          setSubject]          = useState('');
  const [message,          setMessage]          = useState('');
  const [formState,        setFormState]        = useState<FormState>('idle');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({});

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_MESSAGE_LENGTH = 10;

  const emailError   = email.trim() && !EMAIL_RE.test(email.trim())
    ? 'Please enter a valid email address.'
    : '';
  const messageError = message.trim() && message.trim().length < MIN_MESSAGE_LENGTH
    ? `Message should be at least ${MIN_MESSAGE_LENGTH} characters.`
    : '';

  const isFormFilled = Boolean(name.trim() && email.trim() && message.trim());
  // format errors are checked on submit (not baked into `disabled`) — a
  // disabled button can't fire a click/submit event, so gating disabled on
  // format would leave an invalid email silently un-clickable with no way
  // to surface why.
  const isDisabled   = !isFormFilled || formState === 'sending' || formState === 'sent';

  /* ── land hawk: settle bounce then float ── */
  const landHawk = useCallback(() => {
    setHawkPhase('perched');
    setHawkMode('perched');
    const el = hawkWrapRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.175s ease-out';
    el.style.transform  = 'translateX(0) translateY(8px)';
    setTimeout(() => {
      el.style.transition = 'transform 0.175s ease-in';
      el.style.transform  = 'translateX(0) translateY(0)';
      setTimeout(() => {
        el.style.transition = 'none';
        el.style.transform  = ''; // clear so CSS animation takes over
        el.style.animation  = ''; // release the inline 'none' set in handleSubmit —
                                   // otherwise it permanently blocks cs-hawk-float on every future landing
        void el.offsetHeight;
        setIsFloating(true);
        setShowGlow(true);
      }, 175);
    }, 175);
  }, []);

  /* ── fly hawk in from left ── */
  const flyIn = useCallback(() => {
    setHawkDirection('left');
    setHawkMode('flying');
    setIsFloating(false);
    setShowGlow(false);
    const el = hawkWrapRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.transform  = 'translateX(-115vw) rotate(-8deg)';
    el.style.opacity    = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'transform 1.3s cubic-bezier(0.16,1,0.3,1), opacity 1.3s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform  = 'translateX(0) rotate(0deg)';
        el.style.opacity    = '1';
        setHawkPhase('flying-in');
      });
    });
    setTimeout(landHawk, 1300);
  }, [landHawk]);

  /* ── IntersectionObserver: trigger entry once ── */
  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced.current) {
      hasEntered.current = true;
      setHawkPhase('perched');
      setHawkMode('perched');
      setIsFloating(false);
      setShowGlow(true);
      const el = hawkWrapRef.current;
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
      return;
    }

    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasEntered.current) {
        hasEntered.current = true;
        flyIn();
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    // Delay observe by 100ms so the initial render position doesn't
    // trigger an immediate "already intersecting" fire
    const timer = setTimeout(() => obs.observe(section), 100);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [flyIn]);

  /* ── form submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    if (emailError || messageError) {
      setTouched({ email: true, message: true });
      return;
    }

    setFormState('sending');
    setIsFloating(false);
    setShowGlow(false);
    setHawkDirection('right');
    setHawkMode('flying');
    setHawkPhase('flying-out');

    const el = hawkWrapRef.current;
    if (el) {
      el.style.animation  = 'none';           // stop float — CSS animations override inline transforms
      void el.offsetHeight;                   // force reflow so browser registers the stop
      el.style.transition = 'transform 1.0s cubic-bezier(0.55,0,1,0.45), opacity 1.0s cubic-bezier(0.55,0,1,0.45)';
      el.style.transform  = 'translateX(130vw) rotate(-10deg)';
      el.style.opacity    = '0';
    }

    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
      if (!endpoint) throw new Error('Formspree endpoint not configured');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error('Formspree request failed');

      setFormState('sent');
      setTimeout(() => setShowConfirmation(true), 400);
    } catch {
      setFormState('error');
      setHawkPhase('perched');
      setHawkMode('perched');
      const errEl = hawkWrapRef.current;
      if (errEl) {
        errEl.style.transition = 'opacity 0.5s ease';
        errEl.style.transform  = '';
        errEl.style.opacity    = '1';
        setTimeout(() => {
          errEl.style.transition = 'none';
          errEl.style.animation  = ''; // release the inline 'none' set in handleSubmit
          setIsFloating(true);
          setShowGlow(true);
        }, 500);
      }
    }
  };

  /* ── send another: reset + re-enter ── */
  const handleSendAnother = () => {
    setShowConfirmation(false);
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setTouched({});
    setFormState('idle');
    setTimeout(flyIn, 50);
  };

  /* ── render ── */
  return (
    <>
      <style>{`
        .contact-section {
          position: relative;
          background: var(--color-navy);
          min-height: 100vh;
          padding: 100px 60px;
        }
        .contact-section::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(200,148,26,0.015) 3px,
            rgba(200,148,26,0.015) 4px
          );
        }

        .cs-corner {
          position: absolute;
          width: 52px;
          height: 52px;
          opacity: 0.22;
          pointer-events: none;
          border-color: var(--color-brass);
          border-style: solid;
        }
        .cs-corner-tl { top: 24px;    left: 24px;  border-width: 1px 0 0 1px; }
        .cs-corner-tr { top: 24px;    right: 24px; border-width: 1px 1px 0 0; }
        .cs-corner-bl { bottom: 24px; left: 24px;  border-width: 0 0 1px 1px; }
        .cs-corner-br { bottom: 24px; right: 24px; border-width: 0 1px 1px 0; }

        .cs-inner {
          position: relative;
          z-index: 1;
        }

        /* ── header ── */
        .cs-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .cs-eyebrow {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.32em;
          color: var(--color-brass);
          margin: 0 0 14px;
        }
        .cs-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-style: italic;
          font-size: clamp(32px, 6vw, 48px);
          color: var(--color-parchment);
          margin: 0 0 16px;
        }
        .cs-divider {
          width: 100px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--color-brass), transparent);
          margin: 0 auto 16px;
        }
        .cs-subtitle {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 14px;
          font-style: italic;
          color: var(--color-parchment);
          opacity: 0.55;
          margin: 0;
        }

        /* ── two-column layout ── */
        .cs-columns {
          display: flex;
          flex-direction: row;
          gap: 150px;
          max-width: 1150px;
          margin: 0 auto;
        }
        .cs-left {
          flex: 0 0 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .cs-right {
          flex: 1;
        }

        /* ── lanterns ── */
        .cs-lanterns {
          display: none;
        }

        @keyframes flicker1 {
          0%, 100% { opacity: 1;    filter: drop-shadow(0 12px 32px rgba(212,160,32,0.5))  brightness(1);    }
          20%      { opacity: 0.92; filter: drop-shadow(0 12px 32px rgba(212,160,32,0.4))  brightness(0.94); }
          40%      { opacity: 1;    filter: drop-shadow(0 12px 32px rgba(212,160,32,0.6))  brightness(1.06); }
          65%      { opacity: 0.95; filter: drop-shadow(0 12px 32px rgba(212,160,32,0.45)) brightness(0.97); }
          80%      { opacity: 1;    filter: drop-shadow(0 12px 32px rgba(212,160,32,0.55)) brightness(1.03); }
        }
        @keyframes flicker2 {
          0%, 100% { opacity: 0.85; filter: drop-shadow(0 8px 20px rgba(212,160,32,0.35)) brightness(0.95); }
          30%      { opacity: 1;    filter: drop-shadow(0 8px 20px rgba(212,160,32,0.5))  brightness(1.05); }
          55%      { opacity: 0.88; filter: drop-shadow(0 8px 20px rgba(212,160,32,0.3))  brightness(0.92); }
          75%      { opacity: 0.96; filter: drop-shadow(0 8px 20px rgba(212,160,32,0.45)) brightness(1);    }
        }
        @keyframes glowPulse1 {
          0%, 100% { opacity: 0.6; transform: scale(1);    }
          50%      { opacity: 1;   transform: scale(1.1);  }
        }
        @keyframes glowPulse2 {
          0%, 100% { opacity: 0.4; transform: scale(1);    }
          50%      { opacity: 0.8; transform: scale(1.08); }
        }

        /* ── hawk ── */
        .cs-hawk-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transform: translateX(-115vw) rotate(-8deg);
        }
        .hawk-img {
          width: 100%;
          max-width: 380px;
          height: auto;
        }
        .cs-hawk-float {
          animation: hawkFloat 3.5s ease-in-out infinite;
        }
        @keyframes hawkFloat {
          0%, 100% { transform: translateY(0);     }
          50%       { transform: translateY(-12px); }
        }

        .cs-glow {
          width: 160px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(200,148,26,0.22) 0%, transparent 70%);
          animation: glowPulse 3.5s ease-in-out infinite;
          margin-top: -4px;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }

        .cs-caption {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--color-brass);
          opacity: 0.65;
          text-align: center;
          margin-top: 16px;
        }

        /* ── scroll form ── */
        .scroll-wrapper {
          position: relative;
        }
.scroll-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .scroll-form-content {
          position: absolute;
          top: calc(18% - 30px);
          bottom: 10%;
          left: 18%;
          right: 18%;
          overflow: hidden;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 0;
        }

        .social-label {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 11.7px;
          font-style: italic;
          color: #5A3000;
          text-align: center;
          margin-bottom: 8px;
        }
        .social-pills {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 0;
        }
        .social-pill {
          padding: 6px 14px;
          border: 1px solid rgba(26,8,0,0.75);
          border-radius: 20px;
          color: #1A0800;
          font-family: var(--font-lora), Georgia, serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          cursor: pointer;
          transition: all 0.2s;
        }
        .social-pill:hover {
          background: #0F2440;
          color: #E8DCC8;
          border-color: #0F2440;
        }
        .social-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(200,148,26,0.35), transparent);
          margin: 10px 0;
        }

        .form-deco-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 7px;
          font-family: var(--font-lora), Georgia, serif;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.26em;
          color: #3D2000;
          white-space: nowrap;
        }
        .form-deco-line {
          flex: 1;
          height: 1px;
          background: var(--color-brass);
          opacity: 0.35;
          display: block;
        }

        .form-field { margin-bottom: 7px; }
        .form-label {
          display: block;
          font-family: var(--font-lora), Georgia, serif;
          font-size: 10.4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #3D2000;
          margin-bottom: 3px;
        }
        .form-input,
        .form-textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(80,40,0,0.5);
          padding: 3px 2px;
          font-size: 16.9px;
          color: #2C1200;
          font-family: var(--font-lora), Georgia, serif;
          outline: none;
          resize: none;
          box-sizing: border-box;
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #8B6020;
          font-style: italic;
        }
        .form-input:focus,
        .form-textarea:focus {
          border-bottom-color: var(--color-navy);
        }
        .form-input:disabled,
        .form-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .field-textarea {
          overflow-y: auto;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: #C8941A rgba(139,90,0,0.1);
        }
        .field-textarea::-webkit-scrollbar       { width: 4px; }
        .field-textarea::-webkit-scrollbar-track { background: rgba(139,90,0,0.1); }
        .field-textarea::-webkit-scrollbar-thumb { background: #C8941A; border-radius: 2px; }
        .field-textarea::-webkit-scrollbar-thumb:hover { background: #8B6010; }

        .form-submit {
          margin-top: 7px;
          width: 100%;
          background: #1a0a00;
          background-image: repeating-linear-gradient(
            45deg, transparent, transparent 2px,
            rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px
          );
          color: #E8C87A;
          border: none;
          padding: 14px 20px;
          font-family: var(--font-lora), Georgia, serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .form-submit:not(:disabled):hover { background: #2C1200; color: #D4A020; }
        .form-submit:focus-visible        { outline: 2px solid var(--color-brass); }
        .form-submit:disabled             { opacity: 0.38; cursor: not-allowed; }

        .field-error {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 10.5px;
          font-style: italic;
          color: #8B1A1A;
          margin: 3px 0 0;
        }
        .form-input.has-error,
        .form-textarea.has-error {
          border-bottom-color: #8B1A1A;
        }

        .sending-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-brass);
          animation: dotPulse 0.9s ease-in-out infinite;
        }
        .sending-dot:nth-child(2) { animation-delay: 0.2s; }
        .sending-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }

        .form-error {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 12px;
          font-style: italic;
          color: #8B1A1A;
          text-align: center;
          margin-top: 10px;
        }

        /* ── confirmation overlay ── */
        .cs-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,36,64,0.85);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlayFadeIn 0.35s ease forwards;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .cs-card {
          position: relative;
          background: var(--color-parchment);
          max-width: 400px;
          width: 90%;
          padding: 52px 56px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          text-align: center;
          animation: cardSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes cardSlideIn {
          from { transform: translateY(20px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        .cs-card::before {
          content: '';
          position: absolute;
          top: 12px; left: 12px;
          width: 28px; height: 28px;
          border-color: var(--color-brass);
          border-style: solid;
          border-width: 1px 0 0 1px;
          opacity: 0.4;
        }
        .cs-card::after {
          content: '';
          position: absolute;
          bottom: 12px; right: 12px;
          width: 28px; height: 28px;
          border-color: var(--color-brass);
          border-style: solid;
          border-width: 0 1px 1px 0;
          opacity: 0.4;
        }

        .cs-card-ornament {
          display: block;
          font-size: 26px;
          color: var(--color-brass);
          margin-bottom: 14px;
          animation: ornamentSpin 0.55s ease 0.1s both;
        }
        @keyframes ornamentSpin {
          from { transform: rotate(-180deg) scale(0); }
          to   { transform: rotate(0deg)   scale(1); }
        }

        .cs-card-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-style: italic;
          font-size: 26px;
          color: #0F2440;
          margin: 0 0 10px;
        }
        .cs-card-body {
          font-family: var(--font-lora), Georgia, serif;
          font-size: 13px;
          color: #4A3010;
          line-height: 1.7;
          margin: 0 0 24px;
        }
        .cs-card-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--color-brass), transparent);
          margin: 0 auto 24px;
        }
        .cs-card-btn {
          background: transparent;
          border: 1px solid var(--color-brass);
          color: #0F2440;
          padding: 9px 24px;
          font-family: var(--font-lora), Georgia, serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .cs-card-btn:hover {
          background: #0F2440;
          color: var(--color-parchment);
        }

        /* ── mobile ── */
        @media (max-width: 820px) {
          .contact-section { padding: 80px 24px; }
          .cs-columns      { flex-direction: column; align-items: center; gap: 40px; }
          .cs-left         { width: 220px; flex: none; }
          .hawk-img        { width: 220px !important; }
          .cs-right        { width: 100%; }
        }

        @media (max-width: 420px) {
          .cs-card { padding: 36px 28px; }
        }

        /* ── medium: two columns still fit, but the fixed 400px+150px gap
           leaves the form too little room — tighten both ── */
        @media (min-width: 821px) and (max-width: 1100px) {
          .cs-columns { gap: 48px; }
          .cs-left    { flex: 0 0 240px; }
          .hawk-img   { max-width: 240px; }
        }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .cs-hawk-float     { animation: none !important; }
          .cs-glow           { animation: none !important; }
          .cs-overlay        { animation: none !important; }
          .cs-card           { animation: none !important; }
          .cs-card-ornament  { animation: none !important; }
          .sending-dot       { animation: none !important; }
        }
      `}</style>

      <section id="contact" ref={sectionRef} className="contact-section">
{/* botanical vines */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vine3.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -85,
            top: 145,
            width: 380,
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.85,
          }}
        />

        {/* corner brackets */}
        <div className="cs-corner cs-corner-tl" />
        <div className="cs-corner cs-corner-tr" />
        <div className="cs-corner cs-corner-bl" />
        <div className="cs-corner cs-corner-br" />

        <div className="cs-inner">
          {/* top ornament divider */}
          <div style={{ paddingTop: 20, height: 40, marginBottom: 0 }}>
            <svg width="100%" height="40" viewBox="0 0 800 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <line x1="0"   y1="20" x2="360" y2="20" stroke="var(--color-brass)" strokeWidth="0.8" opacity="0.4"/>
              <circle cx="370" cy="20" r="2" fill="var(--color-brass)" opacity="0.4"/>
              <rect x="388" y="12" width="16" height="16" fill="var(--color-brass)" transform="rotate(45 396 20)" opacity="0.4"/>
              <circle cx="422" cy="20" r="2" fill="var(--color-brass)" opacity="0.4"/>
              <line x1="432" y1="20" x2="800" y2="20" stroke="var(--color-brass)" strokeWidth="0.8" opacity="0.4"/>
            </svg>
          </div>

          {/* section header */}
          <header className="cs-header">
            <h2 className="cs-title">Get in Touch</h2>
            <div className="cs-divider" />
            <p className="cs-subtitle">The hawk awaits your correspondence</p>
          </header>

          {/* two columns */}
          <div className="cs-columns">

            {/* col 1 — lanterns */}
            <div className="cs-lanterns" aria-hidden="true">
              {/* glow 1 */}
              <div style={{ position: 'absolute', top: 80, left: -20, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(212,160,32,0.15) 0%, transparent 70%)', animation: 'glowPulse1 3s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />
              {/* glow 2 */}
              <div style={{ position: 'absolute', top: 280, left: 50, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(212,160,32,0.1) 0%, transparent 70%)', animation: 'glowPulse2 4s ease-in-out infinite 0.8s', pointerEvents: 'none', zIndex: 1 }} />
              {/* lantern 1 — in-flow, offset via margin */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lantern-final.png" alt="" style={{ position: 'relative', marginTop: 0, marginLeft: 16, width: 130, height: 'auto', filter: 'drop-shadow(0 12px 32px rgba(212,160,32,0.5))', animation: 'flicker1 3s ease-in-out infinite', zIndex: 2, flexShrink: 0 }} />
              {/* lantern 2 — in-flow, offset below lantern 1 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lantern-final.png" alt="" style={{ position: 'relative', marginTop: 24, marginLeft: 90, width: 88, height: 'auto', filter: 'drop-shadow(0 8px 20px rgba(212,160,32,0.4))', animation: 'flicker2 4s ease-in-out infinite 0.8s', zIndex: 2, flexShrink: 0 }} />
            </div>

            {/* left — hawk */}
            <div className="cs-left" aria-hidden="true">
              <div
                ref={hawkWrapRef}
                className={`cs-hawk-wrap${isFloating ? ' cs-hawk-float' : ''}`}
              >
                <HawkSprite mode={hawkMode} direction={hawkDirection} />
              </div>

              {showGlow && <div className="cs-glow" />}

              {hawkPhase === 'perched' && (
                <p className="cs-caption">✦ Messenger of the digital age ✦</p>
              )}
            </div>

            {/* right — scroll form */}
            <div className="cs-right">
              <div className="scroll-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Hawk/scroll.png"
                  alt="Parchment scroll"
                  className="scroll-img"
                />

<div className="scroll-form-content">
                  <div className="form-deco-header">
                    <span className="form-deco-line" />
                    Your message
                    <span className="form-deco-line" />
                  </div>

                  <p className="social-label">or reach me directly</p>
                  <div className="social-pills">
                    <a href="https://www.linkedin.com/in/efrata-gbogale/" target="_blank" rel="noopener noreferrer" className="social-pill">LinkedIn</a>
                    <a href="mailto:ebogale@brynmawr.edu" className="social-pill">Email</a>
                    <a href="https://github.com/Efrata08" target="_blank" rel="noopener noreferrer" className="social-pill">GitHub</a>
                  </div>
                  <div className="social-divider" />

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-field">
                      <label htmlFor="cs-name" className="form-label">Name</label>
                      <input
                        id="cs-name"
                        type="text"
                        className="form-input"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={formState === 'sending' || formState === 'sent'}
                        autoComplete="name"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="cs-email" className="form-label">Email</label>
                      <input
                        id="cs-email"
                        type="email"
                        className={`form-input${touched.email && emailError ? ' has-error' : ''}`}
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        disabled={formState === 'sending' || formState === 'sent'}
                        autoComplete="email"
                        aria-invalid={touched.email && Boolean(emailError)}
                        aria-describedby={touched.email && emailError ? 'cs-email-error' : undefined}
                      />
                      {touched.email && emailError && (
                        <p id="cs-email-error" className="field-error" role="alert">{emailError}</p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="cs-subject" className="form-label">Subject</label>
                      <input
                        id="cs-subject"
                        type="text"
                        className="form-input"
                        placeholder="What's this about?"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        disabled={formState === 'sending' || formState === 'sent'}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="cs-message" className="form-label">Message</label>
                      <textarea
                        id="cs-message"
                        rows={3}
                        className={`form-textarea field-textarea${touched.message && messageError ? ' has-error' : ''}`}
                        placeholder="Write your message here..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, message: true }))}
                        disabled={formState === 'sending' || formState === 'sent'}
                        aria-invalid={touched.message && Boolean(messageError)}
                        aria-describedby={touched.message && messageError ? 'cs-message-error' : undefined}
                      />
                      {touched.message && messageError && (
                        <p id="cs-message-error" className="field-error" role="alert">{messageError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="form-submit"
                      disabled={isDisabled}
                    >
                      {formState === 'sending' ? '🪶 Dispatching… 🪶' : '🪶 Dispatch the Hawk 🪶'}
                    </button>

                    {formState === 'error' && (
                      <p className="form-error" role="alert">
                        The hawk lost its way. Please try again.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* confirmation popup */}
      {showConfirmation && (
        <div
          className="cs-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Message sent confirmation"
        >
          <div className="cs-card">
            <span className="cs-card-ornament">✦</span>
            <h3 className="cs-card-title">Message Dispatched</h3>
            <p className="cs-card-body">
              Your scroll has been delivered. I&apos;ll write back soon.
            </p>
            <div className="cs-card-divider" />
            <button className="cs-card-btn" onClick={handleSendAnother}>
              Send another
            </button>
          </div>
        </div>
      )}
    </>
  );
}
