'use client';

import { useRef } from 'react';

const LOGOS = [
  { name: 'React Native', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'TypeScript',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg' },
  { name: 'JavaScript',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg' },
  { name: 'Python',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java',         src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Git',          src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Swift',        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-plain.svg' },
  { name: 'PostgreSQL',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Supabase',     src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Google',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
];

// forces any source image to solid black first (brightness(0), so it works
// regardless of the icon's original brand colors), then recolors that black
// toward #0F2440 (HSL ~214°, 62%, 15%) via invert→sepia→hue-rotate — the
// standard technique for tinting a black source to an arbitrary color with
// CSS filters alone. Approximate by nature (filters don't hit hex values
// exactly) — nudge hue-rotate/saturate if it reads off once you see it.
const NAVY_FILTER =
  'brightness(0) saturate(100%) invert(15%) sepia(50%) saturate(1500%) hue-rotate(178deg) brightness(0.95) contrast(1.05)';

export default function TechStack() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
  };
  const handleMouseLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
  };

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: ticker-scroll 35s linear infinite;
        }
        .ticker-track:hover img {
          opacity: 1 !important;
        }
      `}</style>

      <section id="stack" style={{ backgroundColor: '#E8DCC8', padding: 'clamp(16px, 2.5vw, 28px) 24px', overflow: 'hidden' }}>

        {/* contained to the same width as Projects/Recognition, not full-bleed */}
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 11,
            letterSpacing: '0.16em',
            color: '#8A7A64',
            textAlign: 'center',
            margin: '0 0 10px 0',
          }}>
            built with
          </p>

          {/* Ticker: no fill, no border — just the icons and fade edges.
              overflow:hidden is what actually contains the loop to this
              max-width box instead of the full viewport (it was missing
              before — the icons were only ever clipped by the outer
              section, not this inner box). */}
          <div
            style={{
              position: 'relative',
              padding: '4px 0',
              overflow: 'hidden',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Left fade */}
            <div style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: 80,
              background: 'linear-gradient(to right, #E8DCC8, transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }} />

            {/* Right fade */}
            <div style={{
              position: 'absolute',
              right: 0, top: 0, bottom: 0,
              width: 80,
              background: 'linear-gradient(to left, #E8DCC8, transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }} />

            {/* Track — three copies for seamless loop */}
            <div ref={trackRef} className="ticker-track">
              {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.name}
                  width={36}
                  height={36}
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: 'contain',
                    flexShrink: 0,
                    margin: '0 28px',
                    opacity: 0.8,
                    filter: NAVY_FILTER,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
