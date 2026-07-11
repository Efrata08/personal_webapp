'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'contact', label: 'Contact' },
];

// each section's own background — the nav switches its palette to match
// whichever one currently sits behind it, rather than one look for both.
const NAVY_SECTIONS = new Set(['home', 'stack', 'hobbies', 'contact']);

export default function Nav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = LINKS
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    // otherwise the clicked link keeps keyboard focus, which keeps
    // :focus-within true and the nav stuck open even after the mouse leaves
    e.currentTarget.blur();
  };

  const isHome = active === 'home';
  const theme = NAVY_SECTIONS.has(active) ? 'site-nav--dark' : 'site-nav--light';

  return (
    <>
      <style>{`
        .site-nav-wrap {
          position: fixed;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        /* ── the seal: collapsed default state once past the Hero ── */
        .site-nav-seal {
          position: absolute;
          top: 50%;
          right: 0;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          transform: translateY(-50%) scale(1);
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 32% 28%, #E0AC3A, #C8941A 55%, #A87710 100%);
          box-shadow:
            0 3px 10px rgba(0,0,0,0.4),
            inset 0 2px 3px rgba(255,255,255,0.3),
            inset 0 -3px 5px rgba(0,0,0,0.25);
          border: 1px solid rgba(15,36,64,0.35);
          padding: 0;
          opacity: 1;
          cursor: pointer;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .site-nav-seal:focus-visible {
          outline: 2px solid #E8DCC8;
          outline-offset: 2px;
        }
        .site-nav-wrap.is-home .site-nav-seal { pointer-events: none; }
        .site-nav-seal-letter {
          font-family: var(--font-playfair), Georgia, serif;
          font-style: italic;
          font-size: 21px;
          color: #0F2440;
          line-height: 1;
        }
        .site-nav-wrap.is-home .site-nav-seal {
          opacity: 0;
          transform: translateY(-50%) scale(0.6);
        }
        .site-nav-wrap:hover .site-nav-seal,
        .site-nav-wrap:focus-within .site-nav-seal {
          opacity: 0;
          transform: translateY(-50%) scale(0.7);
        }

        /* ── the link list: hidden by default once past the Hero, blooms
           open on hover/focus (or stays open the whole time on the Hero) ── */
        .site-nav {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
          padding-right: 18px;
          border-right: 1px solid rgba(200, 148, 26, 0.6);
          opacity: 0;
          visibility: hidden;
          transform: translateX(10px) scale(0.97);
          transition: opacity 0.35s ease, transform 0.35s ease, visibility 0s 0.35s;
        }
        .site-nav-wrap.is-home .site-nav,
        .site-nav-wrap:hover .site-nav,
        .site-nav-wrap:focus-within .site-nav {
          opacity: 1;
          visibility: visible;
          transform: translateX(0) scale(1);
          transition: opacity 0.35s ease, transform 0.35s ease, visibility 0s 0s;
        }

        /* soft edgeless vignettes, not a panel — keeps labels legible over
           illustrations (Hobbies' vine) or solid blocks (Projects' photo
           placeholder) without looking like a modern UI chip. Extends past
           the nav's own bounds via negative inset so it feathers out rather
           than reading as a hard-edged box.

           Both dark and light tints stay permanently in the DOM (::before /
           ::after) and we cross-fade their opacity, rather than swapping one
           shared background — animating a background/gradient value reads as
           a hard cut in most browsers even with a transition on it; opacity
           always animates smoothly. */
        .site-nav::before, .site-nav::after {
          content: '';
          position: absolute;
          inset: -24px -40px -24px -60px;
          z-index: -1;
          filter: blur(6px);
          pointer-events: none;
          transition: opacity 0.9s ease;
        }
        .site-nav::before {
          background: radial-gradient(ellipse 140% 100% at 75% 50%,
            rgba(10, 20, 36, 0.42) 0%,
            rgba(10, 20, 36, 0.22) 45%,
            transparent 75%);
          opacity: 1;
        }
        .site-nav::after {
          background: radial-gradient(ellipse 140% 100% at 75% 50%,
            rgba(232, 220, 200, 0.55) 0%,
            rgba(232, 220, 200, 0.3) 45%,
            transparent 75%);
          opacity: 0;
        }
        .site-nav--light::before { opacity: 0; }
        .site-nav--light::after { opacity: 1; }

        .site-nav-link {
          font-family: var(--font-lora), Georgia, serif;
          font-style: italic;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.9s ease, text-shadow 0.9s ease;
          position: relative;
        }
        .site-nav-link.is-active { color: #D4A020; }

        /* dark theme text: on navy sections (Home / Stack / Hobbies / Contact) */
        .site-nav--dark .site-nav-link { color: #B0A080; text-shadow: 0 1px 5px rgba(0,0,0,0.5); }
        .site-nav--dark .site-nav-link:hover { color: #E8DCC8; }

        /* light theme text: on parchment sections (About / Projects / Recognition) */
        .site-nav--light .site-nav-link { color: #8A7A64; text-shadow: 0 1px 3px rgba(232,220,200,0.6); }
        .site-nav--light .site-nav-link:hover { color: #5A4A38; }

        .site-nav-link.is-active::after {
          content: '';
          position: absolute;
          right: -20px;
          top: 50%;
          width: 6px;
          height: 6px;
          transform: translateY(-50%) rotate(45deg);
          background: #D4A020;
          box-shadow: 0 0 4px rgba(212,160,32,0.7);
        }

        @media (max-width: 1024px) {
          .site-nav-wrap { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
      `}</style>

      <div className={`site-nav-wrap ${isHome ? 'is-home' : ''}`}>
        <button
          type="button"
          className="site-nav-seal"
          aria-label="Open section navigation"
          aria-hidden={isHome}
          tabIndex={isHome ? -1 : 0}
        >
          <span className="site-nav-seal-letter">E</span>
        </button>

        <nav className={`site-nav ${theme}`} aria-label="Section navigation">
          {LINKS.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`site-nav-link${active === link.id ? ' is-active' : ''}`}
              onClick={(e) => handleClick(e, link.id)}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
