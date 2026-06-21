'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const PHRASES = [
  'A builder.',
  'A founder.',
  'A non-stop yapper.',
  'A cheesy joker.',
  'An Ethiopian.',
];

const BRASS_FILTER =
  'invert(58%) sepia(60%) saturate(500%) hue-rotate(5deg) brightness(95%)';

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(false);

  useEffect(() => {
    let cycleInterval: ReturnType<typeof setInterval> | undefined;
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;

    const startTimeout = setTimeout(() => {
      setPhraseVisible(true);
      let idx = 0;

      cycleInterval = setInterval(() => {
        setPhraseVisible(false);
        fadeTimeout = setTimeout(() => {
          idx = (idx + 1) % PHRASES.length;
          setPhraseIndex(idx);
          setPhraseVisible(true);
        }, 550);
      }, 2550); // 2000ms display + 550ms fade-out
    }, 2400);

    return () => {
      clearTimeout(startTimeout);
      if (cycleInterval) clearInterval(cycleInterval);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []);

  const phrase = PHRASES[phraseIndex];
  const isEthiopian = phrase === 'An Ethiopian.';

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-1        { animation: fadeUp 0.8s ease 0.2s both; }
        .hero-fade-2        { animation: fadeUp 0.8s ease 0.6s both; }
        .hero-fade-3        { animation: fadeUp 1s   ease 1s   both; }
        .hero-fade-r        { animation: fadeUp 0.8s ease 1s   both; }
        .hero-scroll-text   { animation: fadeUp 0.8s ease 2s both; }

        @media (max-width: 768px) {
          .hero-grid       { grid-template-columns: 1fr !important; }
          .hero-left       { align-items: center !important; text-align: center; padding-left: 0 !important; }
          .hero-right      { justify-content: center; margin-top: 48px; }
        }

        @media (min-width: 1400px) {
          .hero-section { padding-right: 80px !important; }
        }
      `}</style>

      <section
        className="hero-section"
        style={{
          backgroundColor: '#E8DCC8',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px 0 24px',
        }}
      >
        <div
          className="hero-grid"
          style={{
            maxWidth: 1260,
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
          }}
        >
          {/* ─── MIDDLE: TEXT ─── */}
          <div
            className="hero-left"
            style={{ display: 'flex', flexDirection: 'column', paddingLeft: 56, paddingRight: 24 }}
          >
            {/* Welcome line */}
            <p
              className="hero-fade-1"
              style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 26,
                color: '#8A7A64',
                marginBottom: 26,
              }}
            >
              welcome to my humble space —
            </p>

            {/* "hi, the name is" */}
            <p
              className="hero-fade-2"
              style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 22,
                color: '#6A5A48',
                marginBottom: 10,
              }}
            >
              hi, the name is
            </p>

            {/* Name */}
            <h1
              className="hero-fade-3"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(114px, 13vw, 177px)',
                color: '#0F2440',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                margin: '0 0 36px 0',
              }}
            >
              Efrata
            </h1>

            {/* Cycling phrase */}
            <div style={{ height: 47 }}>
              <span
                style={{
                  display: 'inline-block',
                  opacity: phraseVisible ? 1 : 0,
                  transition: 'opacity 0.55s ease',
                  fontFamily: isEthiopian
                    ? 'var(--font-playfair), Georgia, serif'
                    : 'var(--font-lora), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: isEthiopian ? 29 : 26,
                  color: isEthiopian ? '#D4A020' : '#0F2440',
                }}
              >
                {phrase}
              </span>
            </div>

            {/* Scroll hint */}
            <span
              className="hero-scroll-text"
              style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 21,
                color: '#8A7A64',
                letterSpacing: '0.04em',
                userSelect: 'none',
                marginTop: 36,
              }}
            >
              keep scrolling, please :)
            </span>
          </div>

          {/* ─── RIGHT: PHOTO FRAME ─── */}
          <div
            className="hero-fade-r hero-right"
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            {/*
              Wrapper is 450×510 = frame (360×420) + 45px ornament bleed on each side.
              SVG is offset (45, 45) so frame corners align with ornament centers.
            */}
            <div style={{ position: 'relative', width: 585, height: 663 }}>

              {/* ── SVG frame ── */}
              <svg
                width="468"
                height="546"
                viewBox="0 0 252 332"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 58.5, left: 58.5, overflow: 'visible' }}
                aria-hidden="true"
              >
                {/* Outer filled rectangle */}
                <rect
                  x="0" y="0" width="252" height="332"
                  fill="#C8B898" stroke="#0F2440" strokeWidth="2.6"
                />

                {/* Inner border (inset 8px) */}
                <rect
                  x="8" y="8" width="236" height="316"
                  fill="none" stroke="#0F2440" strokeWidth="1"
                />

                {/* Registration cross lines – intentionally asymmetric lengths */}
                {/* Top-left */}
                <line x1="-11" y1="0"   x2="14"  y2="0"   stroke="#0F2440" strokeWidth="2.2" />
                <line x1="0"   y1="-13" x2="0"   y2="12"  stroke="#0F2440" strokeWidth="2.2" />
                {/* Top-right */}
                <line x1="238" y1="0"   x2="264" y2="0"   stroke="#0F2440" strokeWidth="2.2" />
                <line x1="252" y1="-11" x2="252" y2="14"  stroke="#0F2440" strokeWidth="2.2" />
                {/* Bottom-right */}
                <line x1="239" y1="332" x2="263" y2="332" stroke="#0F2440" strokeWidth="2.2" />
                <line x1="252" y1="319" x2="252" y2="345" stroke="#0F2440" strokeWidth="2.2" />
                {/* Bottom-left */}
                <line x1="-12" y1="332" x2="13"  y2="332" stroke="#0F2440" strokeWidth="2.2" />
                <line x1="0"   y1="320" x2="0"   y2="344" stroke="#0F2440" strokeWidth="2.2" />

                {/* Left vine – gently wavy */}
                <path
                  d="M20 28 C16 65,24 105,18 148 C12 190,22 230,16 268 C10 305,20 318,19 326"
                  fill="none" stroke="#C8941A" strokeWidth="1" opacity="0.4"
                />
                {/* Right vine – gently wavy */}
                <path
                  d="M232 28 C236 68,228 108,234 152 C240 194,230 234,236 270 C242 306,232 319,233 326"
                  fill="none" stroke="#C8941A" strokeWidth="1" opacity="0.4"
                />
              </svg>

              {/* ── Photo — inset inside the inner border rect (8px in viewBox → ~12px screen) ── */}
              <div style={{
                position: 'absolute',
                top: 58.5 + 15.6,
                left: 58.5 + 15.6,
                width: 468 - 31.2,
                height: 546 - 31.2,
                overflow: 'hidden',
              }}>
                <Image
                  src="/newImage.jpg"
                  alt="Efrata"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                  priority
                />
              </div>

              {/* ── Vine overlay — same coords as main SVG, sits above photo ── */}
              <svg
                width="468"
                height="546"
                viewBox="0 0 252 332"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 58.5, left: 58.5, overflow: 'visible', pointerEvents: 'none' }}
                aria-hidden="true"
              >
                <path
                  d="M20 28 C16 65,24 105,18 148 C12 190,22 230,16 268 C10 305,20 318,19 326"
                  fill="none" stroke="#C8941A" strokeWidth="1.5" opacity="0.7"
                />
                <path
                  d="M232 28 C236 68,228 108,234 152 C240 194,230 234,236 270 C242 306,232 319,233 326"
                  fill="none" stroke="#C8941A" strokeWidth="1.5" opacity="0.7"
                />
              </svg>

              {/* ── Corner ornaments ── */}
              {/* Top-left  — 0deg */}
              <img
                src="/corner-ornament.svg"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 117, height: 117,
                  top: 0, left: 0,
                  transform: 'rotate(0deg)',
                  filter: BRASS_FILTER,
                }}
              />
              {/* Top-right — 90deg */}
              <img
                src="/corner-ornament.svg"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 117, height: 117,
                  top: 0, right: 0,
                  transform: 'rotate(90deg)',
                  filter: BRASS_FILTER,
                }}
              />
              {/* Bottom-right — 180deg */}
              <img
                src="/corner-ornament.svg"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 117, height: 117,
                  bottom: 0, right: 0,
                  transform: 'rotate(180deg)',
                  filter: BRASS_FILTER,
                }}
              />
              {/* Bottom-left — 270deg */}
              <img
                src="/corner-ornament.svg"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 117, height: 117,
                  bottom: 0, left: 0,
                  transform: 'rotate(270deg)',
                  filter: BRASS_FILTER,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
