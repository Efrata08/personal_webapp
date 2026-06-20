'use client';

import { useEffect, useRef } from 'react';

const LETTERS = [
  {
    stat: 'Top 5',
    sub: 'of 4,700+ participants',
    title: 'Wells Fargo × Global Career Accelerator',
    body: 'Placed top 5 of 4,700+. The only woman in the top 10.',
    tag: 'fintech · 2026',
  },
  {
    stat: 'Cohort',
    sub: 'selected member',
    title: 'AI4ALL Ignite Program',
    body: 'Building ML model for health vulnerability by US county.',
    tag: 'machine learning · 2026',
  },
  {
    stat: 'Grant',
    sub: 'incubator award',
    title: 'Haverford College Incubator',
    body: 'Funded Fa-ray ፍሬ — offline pharmacy software for Ethiopia.',
    tag: 'entrepreneurship · 2025',
  },
  {
    stat: 'Global',
    sub: 'exchange program',
    title: 'Bates College Exchange',
    body: 'Selected for competitive academic exchange program.',
    tag: 'academic · 2025',
  },
];

export default function Recognition() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('spread');
        } else {
          el.classList.remove('spread');
        }
      },
      { threshold: 0.65 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .letter-card {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: #F5EDE0;
          border: 1px solid #C4B090;
          border-radius: 2px;
          padding: 47px 36px;
          width: 312px;
          box-sizing: border-box;
          box-shadow: 3px 5px 16px rgba(0,0,0,0.12);
          overflow: hidden;
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 22px,
            rgba(180,160,120,0.06) 23px
          );
        }
        .letter-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.35;
          pointer-events: none;
          border-radius: 2px;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .letter-card:nth-child(1) { z-index: 0; transition-delay: 0s;    }
        .letter-card:nth-child(2) { z-index: 0; transition-delay: 0.15s; }
        .letter-card:nth-child(3) { z-index: 0; transition-delay: 0.3s;  }
        .letter-card:nth-child(4) { z-index: 0; transition-delay: 0.45s; }

        .spread .letter-card:nth-child(1) { transform: translate(-735px, -50%) rotate(-14deg); opacity: 1; }
        .spread .letter-card:nth-child(2) { transform: translate(-470px, -55%) rotate(-6deg);  opacity: 1; }
        .spread .letter-card:nth-child(3) { transform: translate(205px,  -55%) rotate(6deg);   opacity: 1; }
        .spread .letter-card:nth-child(4) { transform: translate(505px,  -50%) rotate(14deg);  opacity: 1; }
      `}</style>

      <section style={{
        backgroundColor: '#E8DCC8',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '24px',
        boxSizing: 'border-box',
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--font-lora), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 12,
          letterSpacing: '0.14em',
          color: '#8A7A64',
          margin: '0 0 24px 0',
          textAlign: 'center',
        }}>
          recognition & achievements
        </p>

        {/* Layout wrapper — letters fan out from here */}
        <div
          ref={wrapperRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1200,
            height: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          {/* Letter cards */}
          {LETTERS.map((letter, i) => (
            <div key={i} className="letter-card">
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 56,
                lineHeight: 1,
                color: '#D4A020',
                margin: '0 0 2px 0',
              }}>
                {letter.stat}
              </p>

              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#B0A080',
                margin: '0 0 10px 0',
              }}>
                {letter.sub}
              </p>

              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 20,
                color: '#0F2440',
                margin: '0 0 8px 0',
                lineHeight: 1.4,
              }}>
                {letter.title}
              </p>

              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 17,
                color: '#5A4A38',
                lineHeight: 1.6,
                margin: '0 0 10px 0',
              }}>
                {letter.body}
              </p>

              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 16,
                color: '#C8941A',
                margin: 0,
                paddingBottom: 3,
                borderBottom: '1px solid #C8941A',
                display: 'inline-block',
              }}>
                {letter.tag}
              </p>
            </div>
          ))}

          {/* Envelope SVG */}
          <svg
            width="380"
            height="260"
            viewBox="0 0 280 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ position: 'relative', zIndex: 3, flexShrink: 0 }}
          >
            {/* Body */}
            <rect x="0" y="0" width="280" height="190" rx="4" fill="#0F2440" />

            {/* Flap — triangle pointing down into the envelope body */}
            <polygon points="0,0 280,0 140,108" fill="#1A3A5C" />

            {/* Diagonal fold lines — classic diamond/X pattern, all corners to center */}
            <line x1="0"   y1="0"   x2="140" y2="95" stroke="#C8941A" strokeWidth="1" opacity="0.6" />
            <line x1="280" y1="0"   x2="140" y2="95" stroke="#C8941A" strokeWidth="1" opacity="0.6" />
            <line x1="0"   y1="190" x2="140" y2="95" stroke="#C8941A" strokeWidth="1" opacity="0.6" />
            <line x1="280" y1="190" x2="140" y2="95" stroke="#C8941A" strokeWidth="1" opacity="0.6" />


            {/* Wax seal */}
            <circle cx="140" cy="108" r="26" fill="#C8941A" />
            <circle cx="140" cy="108" r="21" stroke="#0F2440" strokeWidth="1" fill="none" opacity="0.3" />
            <text
              x="140"
              y="108"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-playfair), Georgia, serif"
              fontStyle="italic"
              fontSize="20"
              fill="#0F2440"
            >
              E
            </text>
          </svg>
        </div>
      </section>
    </>
  );
}
