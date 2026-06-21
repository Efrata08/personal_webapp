'use client';

import { useEffect, useRef, useState } from 'react';

const TYPED_TEXT = "I'm Ethiopian first . But I'm also African, a woman, a Christian, and an international student. Each part of my identity shapes how I see the world, the problems I care about, and the people I hope to build for.";

// Approximate chars per line for Lora italic 15.5px in 244px container
const CHARS_PER_LINE = 32;

export default function About() {
  const sectionRef      = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const [svgContent,  setSvgContent]  = useState('');
  const [typedText,   setTypedText]   = useState('');
  const [paperHeight, setPaperHeight] = useState(160);

  const typingStarted = useRef(false);
  const visibleRef    = useRef(false);
  const svgReadyRef   = useRef(false);

  /* ── key press ── */
  const pressRandomKey = () => {
    const container = svgContainerRef.current;
    if (!container) return;
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    // viewBox height = 511.6; bottom 60% starts at y > 204
    const threshold = 511.6 * 0.4;
    const allPaths  = Array.from(container.querySelectorAll<SVGPathElement>('path'));
    const keyPaths  = allPaths.filter(p => {
      try { return p.getBBox().y > threshold; } catch { return false; }
    });
    if (!keyPaths.length) return;

    const key = keyPaths[Math.floor(Math.random() * keyPaths.length)];
    key.style.transition = 'transform 40ms ease-in';
    key.style.transform  = 'translateY(3px)';
    setTimeout(() => {
      key.style.transition = 'transform 40ms ease-out';
      key.style.transform  = 'translateY(0)';
    }, 40);
  };

  /* ── typing loop ── */
  const startTyping = () => {
    if (typingStarted.current) return;
    typingStarted.current = true;
    let idx = 0;
    const tick = () => {
      if (idx >= TYPED_TEXT.length) return;
      idx++;
      setTypedText(TYPED_TEXT.slice(0, idx));
      pressRandomKey();

      // Grow paper upward by 18px each time a new line is added
      const lines = Math.ceil(idx / CHARS_PER_LINE);
      setPaperHeight(Math.min(160 + (lines - 1) * 22, 400));

      setTimeout(tick, 80);
    };
    tick();
  };

  /* ── start when both SVG + viewport ready ── */
  const tryStart = () => {
    if (visibleRef.current && svgReadyRef.current && !typingStarted.current) {
      startTyping();
    }
  };

  /* ── fetch SVG inline ── */
  useEffect(() => {
    fetch('/typewriter.svg')
      .then(r => r.text())
      .then(text => {
        const clean = text
          .replace(/<\?xml[^?]*\?>/g, '')
          .replace('<svg', '<svg style="width:380px;height:auto;display:block;"');
        setSvgContent(clean);
        svgReadyRef.current = true;
        setTimeout(tryStart, 80);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── IntersectionObserver ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('about-visible');
          visibleRef.current = true;
          tryStart();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`

        .about-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .about-section.about-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .tw-cursor {
          display: inline-block;
          font-style: normal;
          animation: twBlink 0.53s step-end infinite;
        }
        @keyframes twBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        @media (max-width: 768px) {
          .about-inner { padding: 60px 24px !important; }
          .about-grid  { grid-template-columns: 1fr !important; }
          .about-right { display: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="about-section"
        style={{ backgroundColor: '#E8DCC8' }}
      >
        <div
          className="about-inner"
          style={{ padding: '96px 56px', width: '100%' }}
        >
          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 13,
            letterSpacing: '0.14em',
            color: '#8A7A64',
            marginBottom: 48,
          }}>
            about
          </p>

          <div
            className="about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '3fr 2fr',
              gap: '0 72px',
              alignItems: 'start',
            }}
          >
            {/* ── LEFT: text ── */}
            <div>
              <h2 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(48px, 5vw, 72px)',
                lineHeight: 1.1,
                color: '#0F2440',
                marginBottom: 32,
                whiteSpace: 'pre-line',
              }}>
                {"I've always been\nthe "}
                <span style={{ color: '#D4A020' }}>curious</span>
                {' kid.'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <p style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontSize: 19, lineHeight: 1.95, color: '#5A4A38', margin: 0 }}>
                  The one who pierced a ball filled with liquid just to find out what was inside. (Turns out it was water. Classic.) That curiosity naturally drew me toward STEM, where I found joy in asking questions, solving problems, and building things from scratch.
                </p>

                <p style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontSize: 19, lineHeight: 1.95, color: '#5A4A38', margin: 0 }}>
                  When I started high school, I was introduced to programming, and it didn&apos;t come naturally to me at first. But I stuck with it, put in the extra work to catch up, and spent enough late nights wrestling with bugs to eventually feel at home in tech.
                </p>

                <p style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontSize: 19, lineHeight: 1.95, color: '#5A4A38', margin: 0 }}>
                  Today, I&apos;m a{' '}
                  <strong style={{ fontWeight: 400, color: '#0F2440' }}>
                    Computer Science and Mathematics
                  </strong>
                  {' '}student at Bryn Mawr College. But long before I wrote my first line of code, I knew one thing: whatever I ended up doing, I wanted it to matter to the people who often get overlooked. That hasn&apos;t changed.
                </p>

              </div>
            </div>

            {/* ── RIGHT: typewriter ── */}
            <div
              className="about-right"
              style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center' }}
            >
              {/*
                280px wide inline SVG — centered in the right column.
                Paper overlay grows upward (bottom-anchored) as text accumulates.
                ViewBox 511.6×511.6 rendered 280px → scale 0.547.
                Carriage line ≈ y=181 in viewBox → ~99px from top rendered.
              */}
              <div style={{ width: 380, position: 'relative' }}>

                {/* Typewriter SVG with mahogany filter */}
                <div
                  ref={svgContainerRef}
                  style={{ lineHeight: 0 }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />

                {/*
                  Paper text overlay — bottom-anchored near the carriage (~99px from top),
                  grows upward as paperHeight increases.
                  No overflow clipping — text is always fully visible.
                */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 245,          /* 380px wide → carriage at 209px from top → 245px from bottom */
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 244,
                    height: paperHeight,
                    transition: 'height 0.3s ease',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end', /* text anchored to bottom, grows upward */
                    paddingTop: 15,             /* gap between text and paper fold */
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-lora), Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 14.9,
                    color: '#0F2440',
                    lineHeight: 1.6,
                    margin: 0,
                    wordBreak: 'break-word',
                    textAlign: 'center',
                  }}>
                    {typedText}
                    <span className="tw-cursor">|</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
