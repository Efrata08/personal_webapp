'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const PHRASES = [
  'A Builder.',
  'A founder.',
  'A laughter lover.',
  'An Overthinker.',
  'A perpetual beta.',
];

const BRASS_FILTER =
  'invert(58%) sepia(60%) saturate(500%) hue-rotate(5deg) brightness(95%)';

// deterministic PRNG (not Math.random()) so server and client render the same
// particle layout — avoids a hydration mismatch on first paint.
function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// embers cluster near the lanterns (left) and thin out toward the name/photo (right)
const rand = seededRandom(1337);
const EMBERS = Array.from({ length: 22 }, () => {
  const left = Math.pow(rand(), 2.4) * 58; // skewed toward 0%, capped ~58%
  return {
    left,
    top: 8 + rand() * 84,
    size: 2 + rand() * 3.2,
    duration: 8 + rand() * 9,
    delay: -rand() * 16,
    rise: 90 + rand() * 110,
    drift: (rand() - 0.5) * 40,
    peakOpacity: 0.35 + rand() * 0.45,
  };
});

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

        /* nudge the whole composition (text + photo, together — a single
           transform on the shared parent so their relative spacing is untouched) */
        .hero-grid { transform: translateX(28px); }

        /* lanterns float in the margin left of hero-left. That margin only
           reaches the ~230px the original design needs once the viewport is
           wide enough for the centered maxWidth:945 grid to have that much
           space to spare (~1461px) — full original size/position kicks in
           right after that, no transform needed. Below it, keep them close to
           full size rather than shrinking to nothing; the tightest widths
           (768–1017px, where margin is a flat ~24px) will clip modestly. */
        .hero-lantern-1 { top: -26px;  left: -80px; width: 145px; }
        .hero-lantern-2 { top: 190px;  left: -35px; width: 100px; }

        @media (min-width: 1500px) {
          .hero-lantern-1 { top: -44px; left: -230px; width: 184px; }
          .hero-lantern-2 { top: 178px; left: -106px; width: 126px; }
        }

        @media (max-width: 768px) {
          .hero-section    { padding: 0 20px !important; }
          .hero-grid       { grid-template-columns: 1fr !important; transform: none !important; }
          .hero-left       { align-items: center !important; text-align: center; padding: 0 !important; }
          .hero-right      { justify-content: center !important; margin-top: 48px; }
          .hero-lantern-1  { top: -18px; left: 4px;  width: 42px; }
          .hero-lantern-2  { top: 258px; left: 24px; width: 32px; }
        }

        /* fixed-pixel photo frame — scale down (not just visually, via zoom so
           layout width shrinks too) once it no longer fits beside the stacked text */
        @media (max-width: 480px) { .hero-photo-box { zoom: 0.85; } }
        @media (max-width: 420px) { .hero-photo-box { zoom: 0.72; } }
        @media (max-width: 375px) { .hero-photo-box { zoom: 0.65; } }
        @media (max-width: 340px) { .hero-photo-box { zoom: 0.58; } }

        @media (min-width: 1400px) {
          .hero-section { padding-right: 80px !important; }
        }

        /* fill the spare margin at ordinary desktop widths — scaling the whole
           grid as one unit means text, photo, and lanterns all grow together
           without any of their relative positions shifting. Scoped to
           1300–1499px specifically: the lanterns switch to bigger "wide"
           values at 1500px (below), which were tuned assuming NO extra scale
           until 1700px (where translateX also jumps to 228px to compensate) —
           letting this scale bleed into 1500–1699px pushed those already-
           tight wide-tier values past the safe margin and off-screen. */
        @media (min-width: 1300px) and (max-width: 1499px) {
          .hero-grid { transform: translateX(28px) scale(1.12); }
        }

        /* the translateX+scale flourish only has room to breathe on very wide screens
           (200px original nudge + the 28px whole-composition shift above).
           Reverted back to 1.3 — bumping it to 1.45 cut the lantern's safety
           margin at this breakpoint down to a few px, which was part of the
           same regression as the 1500–1699px gap above. */
        @media (min-width: 1700px) {
          .hero-grid { transform: translateX(228px) scale(1.3); }
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

        /* ── ambient lamplight: soft downward rays + drifting embers ── */
        .hero-ambient {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }
        .hero-rays {
          position: absolute;
          top: -15%;
          left: -10%;
          width: 60%;
          height: 150%;
          background: linear-gradient(160deg,
            rgba(212,160,32,0.16) 0%,
            rgba(212,160,32,0.07) 30%,
            transparent 65%);
          filter: blur(24px);
          transform: rotate(-8deg);
        }

        .hero-ember {
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,190,90,0.95), rgba(200,148,26,0.25) 70%, transparent 100%);
          box-shadow: 0 0 6px 1px rgba(212,160,32,0.5);
          animation-name: heroEmberRise;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes heroEmberRise {
          0%   { transform: translate(0, 0) scale(0.85);              opacity: 0; }
          15%  { opacity: var(--peak-opacity, 0.6); }
          50%  { transform: translate(calc(var(--drift, 0) * 1px), calc(var(--rise, 100) * -0.5px)) scale(1); }
          85%  { opacity: var(--peak-opacity, 0.6); }
          100% { transform: translate(calc(var(--drift, 0) * 1px), calc(var(--rise, 100) * -1px)) scale(0.8); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ember { animation: none; opacity: 0; }
        }
      `}</style>

      <section
        id="home"
        className="hero-section"
        style={{
          backgroundColor: '#0F2440',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px 0 24px',
          position: 'relative',
          isolation: 'isolate',
        }}
      >
        {/* ambient lamplight — soft rays + drifting embers, behind the text/photo */}
        <div className="hero-ambient" aria-hidden="true">
          <div className="hero-rays" />
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="hero-ember"
              style={{
                left: `${e.left}%`,
                top: `${e.top}%`,
                width: e.size,
                height: e.size,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
                ['--rise' as string]: e.rise,
                ['--drift' as string]: e.drift,
                ['--peak-opacity' as string]: e.peakOpacity,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div
          className="hero-grid"
          style={{
            maxWidth: 945,
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
            style={{ display: 'flex', flexDirection: 'column', paddingLeft: 56, paddingRight: 24, position: 'relative' }}
          >
            {/* Welcome line */}
            <p
              className="hero-fade-1"
              style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 19.5,
                color: '#8A7A64',
                marginBottom: 19.5,
              }}
            >
              welcome to my humble space —
            </p>

            {/* lanterns near welcome line */}
            <img className="hero-lantern-1" src="/lantern-final.png" alt="" aria-hidden="true" style={{ position: 'absolute', height: 'auto', pointerEvents: 'none', animation: 'flicker1 3s ease-in-out infinite', zIndex: 1, transition: 'top 0.2s, left 0.2s, width 0.2s' }} />
            <img className="hero-lantern-2" src="/lantern-final.png" alt="" aria-hidden="true" style={{ position: 'absolute', height: 'auto', pointerEvents: 'none', animation: 'flicker2 4s ease-in-out infinite 0.8s', zIndex: 1, transition: 'top 0.2s, left 0.2s, width 0.2s' }} />

            {/* "hi, the name is" */}
            <p
              className="hero-fade-2"
              style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 16.5,
                color: '#6A5A48',
                marginBottom: 7.5,
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
                fontSize: 'clamp(85px, 9.75vw, 133px)',
                color: '#D4A020',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                margin: '0 0 27px 0',
              }}
            >
              Efrata
            </h1>

            {/* Cycling phrase */}
            <div style={{ height: 35 }}>
              <span
                style={{
                  display: 'inline-block',
                  opacity: phraseVisible ? 1 : 0,
                  transition: 'opacity 0.55s ease',
                  fontFamily: isEthiopian
                    ? 'var(--font-playfair), Georgia, serif'
                    : 'var(--font-lora), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: isEthiopian ? 21.75 : 19.5,
                  color: isEthiopian ? '#D4A020' : '#8A7A64',
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
                fontSize: 15.75,
                color: '#8A7A64',
                letterSpacing: '0.04em',
                userSelect: 'none',
                marginTop: 27,
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
            <div className="hero-photo-box" style={{ position: 'relative', width: 439, height: 497 }}>

              {/* ── SVG frame ── */}
              <svg
                width="351"
                height="410"
                viewBox="0 0 252 332"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 43.9, left: 43.9, overflow: 'visible' }}
                aria-hidden="true"
              >
                {/* Outer filled rectangle */}
                <rect
                  x="0" y="0" width="252" height="332"
                  fill="#0F2440" stroke="#D4A020" strokeWidth="2.6"
                />

                {/* Inner border (inset 8px) */}
                <rect
                  x="8" y="8" width="236" height="316"
                  fill="none" stroke="#D4A020" strokeWidth="1"
                />

                {/* Registration cross lines – intentionally asymmetric lengths */}
                {/* Top-left */}
                <line x1="-11" y1="0"   x2="14"  y2="0"   stroke="#D4A020" strokeWidth="2.2" />
                <line x1="0"   y1="-13" x2="0"   y2="12"  stroke="#D4A020" strokeWidth="2.2" />
                {/* Top-right */}
                <line x1="238" y1="0"   x2="264" y2="0"   stroke="#D4A020" strokeWidth="2.2" />
                <line x1="252" y1="-11" x2="252" y2="14"  stroke="#D4A020" strokeWidth="2.2" />
                {/* Bottom-right */}
                <line x1="239" y1="332" x2="263" y2="332" stroke="#D4A020" strokeWidth="2.2" />
                <line x1="252" y1="319" x2="252" y2="345" stroke="#D4A020" strokeWidth="2.2" />
                {/* Bottom-left */}
                <line x1="-12" y1="332" x2="13"  y2="332" stroke="#D4A020" strokeWidth="2.2" />
                <line x1="0"   y1="320" x2="0"   y2="344" stroke="#D4A020" strokeWidth="2.2" />

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

              {/* ── Photo — inset inside the inner border rect ── */}
              <div style={{
                position: 'absolute',
                top: 55.6,
                left: 55.6,
                width: 327.6,
                height: 386.1,
                overflow: 'hidden',
              }}>
                <Image
                  src="/newImage.jpg"
                  alt="Efrata"
                  fill
                  sizes="(max-width: 480px) 200px, 328px"
                  style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                  priority
                />
              </div>

              {/* ── Vine overlay — same coords as main SVG, sits above photo ── */}
              <svg
                width="351"
                height="410"
                viewBox="0 0 252 332"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 43.9, left: 43.9, overflow: 'visible', pointerEvents: 'none' }}
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
                  width: 88, height: 88,
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
                  width: 88, height: 88,
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
                  width: 88, height: 88,
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
                  width: 88, height: 88,
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
