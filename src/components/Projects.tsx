'use client';

import { useEffect, useRef, useState } from 'react';

const PROJECTS = [
  {
    number: '01 / 04',
    title: 'Fa-ray',
    titleSuffix: ' ፍሬ',
    description:
      'An offline-first inventory management platform for small independent pharmacies in Ethiopia. It works entirely without internet, operates in Amharic, and is designed for low-end Android devices. Owners can track stock levels, record sales, receive low-stock alerts, and generate customer sale records — all in a single tap flow optimized for busy counter environments. Built through Haverford College\'s incubator program.',
    tags: ['React Native', 'Expo', 'TypeScript'],
    linkLabel: 'GitHub',
  },
  {
    number: '02 / 04',
    title: 'PhixPhilly',
    titleSuffix: '',
    description:
      'Mapped 500K+ Philadelphia 311 infrastructure cases using Gemini Vision AI and a Haversine routing algorithm. Built at Philly Codefest 2026 — civic tech that makes city issues visible.',
    tags: ['React Native', 'Supabase', 'Gemini AI'],
    linkLabel: 'GitHub',
  },
  {
    number: '03 / 04',
    title: 'Room8',
    titleSuffix: '',
    description:
      'Roommate management app handling cost splitting, shared calendars, chores, and guest notifications. Splitwise + Google Calendar + group chat — built for the chaos of living with people.',
    tags: ['React Native', 'TypeScript'],
    linkLabel: 'Demo',
  },
  {
    number: '04 / 04',
    title: 'Alumni Sorter',
    titleSuffix: '',
    description:
      'Email sorting and routing tool for alumni outreach management. Automates categorization so the right messages reach the right people faster.',
    tags: ['Python'],
    linkLabel: 'GitHub',
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
      `}</style>

      <section
        ref={sectionRef}
        className="projects-section"
        style={{ backgroundColor: '#E8DCC8', padding: '56px' }}
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

          {/* Slider — overflow hidden, border on this element */}
          <div style={{
            overflow: 'hidden',
            border: '1px solid #C4B090',
            borderRadius: 2,
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
                  style={{
                    flex: '0 0 100%',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                  }}
                >
                  {/* Left: text */}
                  <div style={{
                    backgroundColor: '#E8DCC8',
                    padding: '48px 56px',
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
                      fontSize: 36,
                      lineHeight: 1.1,
                      color: '#0F2440',
                      margin: '0 0 20px 0',
                    }}>
                      {project.title}
                      {project.titleSuffix && (
                        <span style={{ color: '#D4A020' }}>{project.titleSuffix}</span>
                      )}
                    </h3>

                    <p style={{
                      fontFamily: 'var(--font-lora), Georgia, serif',
                      fontSize: 19,
                      lineHeight: 1.85,
                      color: '#5A4A38',
                      flex: 1,
                      margin: '0 0 24px 0',
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

                  {/* Right: navy placeholder */}
                  <div style={{
                    backgroundColor: '#0F2440',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-lora), Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: 12,
                      color: '#3A5470',
                      margin: 0,
                    }}>
                      screenshot coming soon
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
