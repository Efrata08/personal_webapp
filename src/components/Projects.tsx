'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const PROJECTS = [
  {
    number: '01 / 04',
    title: 'Fa-ray',
    titleSuffix: ' ፍሬ',
    description:
      "An offline-first inventory management platform for small independent pharmacies in Ethiopia, built through Haverford College's Innovation Incubator. It works entirely without internet, operates in Amharic, and is designed for low-end Android devices — owners can track stock, log sales, get low-stock alerts, and generate customer records in a single tap flow built for busy counters. Currently in the process of deploying and piloting it with real pharmacies in Ethiopia.",
    tags: ['React Native', 'Expo', 'TypeScript'],
    linkLabel: 'GitHub',
    image: '/fa-ray/screenshot.png',
  },
  {
    number: '02 / 04',
    title: 'Phix',
    titleSuffix: 'Philly',
    description:
      "A civic reporting platform built at Drexel's Philly Codefest, with both a resident-facing app and a government dashboard so the reporting loop works end to end. Residents snap a photo of an issue and Gemini Vision AI classifies the type and severity, while a custom Haversine-distance algorithm checks it against 500K+ existing Philadelphia 311 cases to catch duplicates instead of clogging the queue. It also surfaces an equity heatmap showing which neighborhoods consistently wait longer for resolution, holding city officials accountable.",
    tags: ['React Native', 'Supabase', 'Gemini AI'],
    linkLabel: 'GitHub',
    image: '/phixphilly/screenshot.png',
  },
  {
    number: '03 / 04',
    title: 'Room',
    titleSuffix: '8',
    description:
      "An all-in-one roommate coordination app built at the Trico Protothon. Instead of juggling a separate calendar app, a Splitwise, a group chat, and sticky notes on the fridge, Room8 brings it all into one place. It features shared calendars for chores and events (including guest scheduling), expense splitting for shared costs, and a digital shared fridge with sticky notes.",
    tags: ['Swift', 'SwiftUI'],
    linkLabel: 'Demo',
    image: '/room8/dashboard-calendar.png',
  },
  {
    number: '04 / 04',
    title: 'Alumni ',
    titleSuffix: 'Feedback Sorter',
    description:
      "Built a background script that automates the working pipeline of Haverford College's alumni office, which was manually checking hundreds of emails a week against Raiser's Edge and logging sentiment by hand. The script pulls emails through the Gmail API, filters out routine noise, then classifies sentiment and giving status (paused, resumed, bequest changes) using DistilBERT and BART for zero-shot classification. Results upload to Google Sheets automatically, along with a weekly trend summary.",
    tags: ['Python', 'PyTorch'],
    linkLabel: 'GitHub',
    image: '/alumni/dashboard.png',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('projects-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(PROJECTS.length - 1, c + 1));

  return (
    <>
      <style>{`
        .projects-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .projects-section.projects-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .nav-arrow {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #C4B090;
          background: transparent;
          color: #0F2440;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          line-height: 1;
          transition: background 0.2s ease, color 0.2s ease;
          padding: 0;
        }
        .nav-arrow:hover:not(:disabled) {
          background: #0F2440;
          color: #E8DCC8;
        }
        .nav-arrow:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .projects-slide {
          display: grid;
          grid-template-columns: 1fr;
        }
        .project-left {
          padding: 32px 24px;
        }
        .project-right {
          min-height: 200px;
        }
        @media (min-width: 768px) {
          .projects-slide  { grid-template-columns: 1fr 1fr; }
          .project-left    { padding: 48px 56px; }
          .project-right   { min-height: 0; }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        className="projects-section"
        style={{ backgroundColor: '#E8DCC8', padding: 'clamp(24px, 6vw, 56px) clamp(24px, 6vw, 56px) clamp(12px, 3vw, 24px)' }}
      >
        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--font-lora), Georgia, serif',
          fontStyle: 'italic',
          fontSize: 13,
          letterSpacing: '0.14em',
          color: '#8A7A64',
          margin: '0 0 32px 0',
        }}>
          selected work
        </p>

        {/* Centered card wrapper */}
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Card + ribbons wrapper */}
          <div style={{ position: 'relative' }}>

            {/* Corner ornaments — gold-recolored frame1.svg, all 4 corners.
                Rotation is offset 180deg from Hero's corner-ornament.svg
                convention (0/90/180/270 for TL/TR/BR/BL) — this asset's
                default orientation faces the opposite way, confirmed by the
                top-right/bottom-left swap. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frame1-gold.svg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: -10, left: -10,
                width: 220, height: 220,
                transform: 'rotate(180deg)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frame1-gold.svg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: -10, right: -10,
                width: 220, height: 220,
                transform: 'rotate(270deg)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frame1-gold.svg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: -10, right: -10,
                width: 220, height: 220,
                transform: 'rotate(0deg)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frame1-gold.svg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: -10, left: -10,
                width: 220, height: 220,
                transform: 'rotate(90deg)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

{/* Slider — overflow hidden, border on this element */}
          <div style={{
            overflow: 'hidden',
            border: '1px solid #C4B090',
            borderRadius: 2,
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Track */}
            <div style={{
              display: 'flex',
              transform: `translateX(-${current * 100}%)`,
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {PROJECTS.map((project, i) => (
                <div
                  key={i}
                  className="projects-slide"
                  style={{
                    flex: '0 0 100%',
                    width: '100%',
                  }}
                >
                  {/* Left: text */}
                  <div className="project-left" style={{
                    backgroundColor: '#E8DCC8',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    minWidth: 0,
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-lora), Georgia, serif',
                      fontSize: 13,
                      letterSpacing: '0.16em',
                      color: '#B0A080',
                      margin: '0 0 8px 0',
                    }}>
                      {project.number}
                    </p>

                    <h3 style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px, 3.5vw, 30px)',
                      lineHeight: 1.1,
                      color: '#0F2440',
                      margin: '0 0 14px 0',
                    }}>
                      {project.title}
                      {project.titleSuffix && (
                        <span style={{ color: '#D4A020' }}>{project.titleSuffix}</span>
                      )}
                    </h3>

                    <p style={{
                      fontFamily: 'var(--font-lora), Georgia, serif',
                      fontSize: 'clamp(14.5px, 1.3vw, 16.5px)',
                      lineHeight: 1.6,
                      color: '#5A4A38',
                      flex: 1,
                      margin: '0 0 16px 0',
                    }}>
                      {project.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{
                          fontFamily: 'var(--font-lora), Georgia, serif',
                          fontSize: 12,
                          border: '1px solid #C4B090',
                          padding: '4px 12px',
                          borderRadius: 20,
                          color: '#0F2440',
                        }}>
                          {tag}
                        </span>
                      ))}
                      <span style={{
                        fontFamily: 'var(--font-lora), Georgia, serif',
                        fontSize: 12,
                        border: '1px solid #D4A020',
                        padding: '4px 12px',
                        borderRadius: 20,
                        color: '#D4A020',
                      }}>
                        {project.linkLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right: screenshot, or navy placeholder if none yet */}
                  <div className="project-right" style={{
                    backgroundColor: '#0F2440',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.title}${project.titleSuffix} screenshot`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'contain', padding: 24 }}
                      />
                    ) : (
                    <p style={{
                      fontFamily: 'var(--font-lora), Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: 12,
                      color: '#3A5470',
                      margin: 0,
                    }}>
                      screenshot coming soon
                    </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


</div>{/* end card + ribbons wrapper */}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 24,
          }}>
            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to project ${i + 1}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: 'none',
                    background: i === current ? '#0F2440' : '#C4B090',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background 0.2s ease',
                  }}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="nav-arrow"
                onClick={prev}
                disabled={current === 0}
                aria-label="Previous project"
              >
                ←
              </button>
              <button
                className="nav-arrow"
                onClick={next}
                disabled={current === PROJECTS.length - 1}
                aria-label="Next project"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
