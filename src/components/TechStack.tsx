'use client';

import { useRef } from 'react';

const LOGOS = [
  { name: 'React Native', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'TypeScript',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Python',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java',         src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Git',          src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Swift',        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
  { name: 'PostgreSQL',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Supabase',     src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Google',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
];

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

      <section id="stack" style={{ backgroundColor: '#0F2440', padding: '24px 0', overflow: 'hidden' }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--font-lora), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 11,
          letterSpacing: '0.16em',
          color: '#3A5A7A',
          textAlign: 'center',
          margin: '0 0 24px 0',
        }}>
          built with
        </p>

        {/* Ticker wrapper */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left fade */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 80,
            background: 'linear-gradient(to right, #0F2440, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }} />

          {/* Right fade */}
          <div style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            width: 80,
            background: 'linear-gradient(to left, #0F2440, transparent)',
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
                width={48}
                height={48}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                  flexShrink: 0,
                  margin: '0 28px',
                  opacity: 0.75,
                  transition: 'opacity 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
