'use client';

import { useEffect, useRef, useState } from 'react';

const CX = 134;
const CY = 134;
const R = 118;
const R_INNER = 104;
const NODE_DIST = 92;

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const HOBBY_HOUR_INDICES = new Set([0, 3, 6, 9]);

function toRad(deg: number) { return (deg * Math.PI) / 180; }

// Math.cos/sin aren't guaranteed bit-identical across JS engines (server vs.
// browser), so unrounded results can differ in the last digit and trip a
// hydration mismatch. Round to a precision no one will ever see visually.
function round(n: number) { return Math.round(n * 1000) / 1000; }

function clockXY(hourIndex: number, r: number): [number, number] {
  const deg = -90 + hourIndex * 30;
  return [round(CX + r * Math.cos(toRad(deg))), round(CY + r * Math.sin(toRad(deg)))];
}

function tickLine(tickIndex: number, innerR: number, outerR: number) {
  const rad = toRad(-90 + tickIndex * 6);
  return {
    x1: round(CX + innerR * Math.cos(rad)),
    y1: round(CY + innerR * Math.sin(rad)),
    x2: round(CX + outerR * Math.cos(rad)),
    y2: round(CY + outerR * Math.sin(rad)),
  };
}

type CollageItem = {
  top: number; right: number; w: number; h: number; rot: number; z: number;
  src?: string; objectFit?: 'cover' | 'contain'; bg?: string;
};

const STICKER_STYLE = { border: '4px solid #E8DCC8', boxShadow: '3px 4px 12px rgba(0,0,0,0.3)' } as const;

const HOBBIES: {
  symbol: string; label: string; hourIndex: number; eyebrow: string;
  title: string; titleEm: string; body: string; collage: CollageItem[];
}[] = [
  {
    symbol: '✦',
    label: 'CULTURE',
    hourIndex: 0,
    eyebrow: 'identity & roots',
    title: 'Ethiopia, ',
    titleEm: 'always',
    body: "I grew up in Addis, streets full of people (and vendors), doro wat after long fasting seasons, sitting through the full coffee ceremony, kirar sessions with my sister. The communal holidays, the life we lead as together... it's something I will forever carry with me.",
    collage: [
      { top:  65, right:  58, w: 264, h: 330, rot: -5, z: 1, src: '/Ethiopian/photo_2026-06-20_01-27-07.jpg' },
      { top:  38, right: 220, w: 215, h: 264, rot:  4, z: 2, src: '/Ethiopian/photo_2026-06-20_01-27-15.jpg' },
      { top: 220, right: 102, w: 182, h: 231, rot: -2, z: 3, src: '/Ethiopian/photo_2026-06-20_01-27-25.jpg' },
    ],
  },
  {
    symbol: '⊙',
    label: 'CAMERA',
    hourIndex: 3,
    eyebrow: 'photography',
    title: 'Everything, ',
    titleEm: 'everyone',
    body: "I take pictures of whatever is in front of me, mostly on my phone or my beat-up Canon digicam from the early 2000s. Though, I slowed down a bit after getting my phone robbed mid-sunrise-photo.",
    collage: [
      { top:  87, right:  59, w: 248, h: 297, rot:  6, z: 1, src: '/camera/photo_2026-06-20_02-31-32.jpg' },
      { top: 189, right: 211, w: 198, h: 248, rot: -4, z: 2, src: '/camera/photo_2026-06-20_02-32-00.jpg' },
      { top: 260, right:  80, w: 170, h: 220, rot:  3, z: 3, src: '/camera/photo_2026-06-20_02-32-17.jpg' },
    ],
  },
  {
    symbol: '♡',
    label: 'FAMILY',
    hourIndex: 6,
    eyebrow: 'people & home',
    title: 'Hours on ',
    titleEm: 'the phone',
    body: "My favorite hobby is a phone call that stretches for hours. Family scattered across time zones, siblings I'm mostly watching grow up through a screen, friends across different colleges with their own study-abroad stories and uni-life crises.",
    collage: [
      { top:  87, right:  60, w: 231, h: 281, rot: -7, z: 1, src: '/HoursOnPhone/photo_2026-06-20_02-02-38.jpg' },
      { top: 199, right: 201, w: 190, h: 240, rot:  5, z: 2, src: '/HoursOnPhone/photo_2026-06-20_02-03-02.jpg' },
    ],
  },
  {
    symbol: '◈',
    label: 'BOOKS',
    hourIndex: 9,
    eyebrow: 'reading',
    title: 'Lost in ',
    titleEm: 'fantasy worlds',
    body: "I love reading long fantasy books; I binge an entire series in under two weeks, get way too attached to the world, and once I'm done, forget everything and move straight to the next one. I never re-read, no matter how good the book (sorry, not sorry.)",
    collage: [
      { top:  77, right:  59, w: 240, h: 289, rot:  8, z: 1, src: '/books/photo_2026-06-20_02-16-04.jpg' },
      { top: 188, right: 206, w: 198, h: 256, rot: -3, z: 2, src: '/books/55987278.jpg' },
      { top: 130, right:  80, w: 180, h: 120, rot:  4, z: 3, src: '/books/photo_2026-06-20_02-16-18.jpg', objectFit: 'contain', bg: '#1A1A1A' },
    ],
  },
];

export default function Hobbies() {
  const [activeHobby, setActiveHobby] = useState<number | null>(null);
  const hourRef   = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h  = now.getHours() % 12;
      const m  = now.getMinutes();
      const s  = now.getSeconds();
      const ms = now.getMilliseconds();
      const hourDeg   = h * 30 + m * 0.5 + s / 120;
      const minuteDeg = m * 6 + s * 0.1;
      const secondDeg = s * 6 + ms * 0.006;
      hourRef.current?.setAttribute('transform',   `rotate(${hourDeg},   ${CX}, ${CY})`);
      minuteRef.current?.setAttribute('transform', `rotate(${minuteDeg}, ${CX}, ${CY})`);
      secondRef.current?.setAttribute('transform', `rotate(${secondDeg}, ${CX}, ${CY})`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <style>{`
        .hobbies-section {
          display: flex;
          flex-direction: column;
        }
        .hobbies-clock-col {
          width: 100%;
        }
        .hobbies-clock-svg {
          width: min(300px, 72vw);
          height: auto;
          margin-left: 0;
        }
        .hobbies-divider { display: none; }

        .hobbies-content-col {
          width: 100%;
          position: relative;
        }

        /* crossfade panels: mobile = simple show/hide in normal flow */
        .hobbies-panel {
          display: none;
          width: 100%;
          box-sizing: border-box;
        }
        .hobbies-panel.is-active { display: flex; }

        .hobbies-idle-inner  { flex-direction: column; text-align: center; padding: 32px 24px; }
        .hobbies-idle-text   { align-items: center !important; }
        .hobbies-vine        { display: none; }
        .hobbies-hobby-inner  { padding: 32px 24px; }
        .hobby-collage-wrap   {
          display: none;
          position: absolute;
          inset: 0;
          pointer-events: none;
          transform-origin: right center;
        }

        @media (min-width: 1024px) {
          .hobbies-section     { flex-direction: row; min-height: 560px; overflow: hidden; }
          .hobbies-clock-col   { width: 460px; flex-shrink: 0; }
          .hobbies-clock-svg   { width: 420px; margin-left: 62px; }
          .hobbies-divider     {
            display: block; width: 1px; flex-shrink: 0; margin-left: 40px;
            background: linear-gradient(to bottom, transparent, #1E3A58 30%, #1E3A58 70%, transparent);
          }
          .hobbies-content-col { flex: 1; overflow: visible; }

          .hobbies-panel {
            display: flex !important;
            position: absolute;
            inset: 0;
          }
          .hobbies-idle-inner  { flex-direction: row; text-align: left; padding: 48px 56px; }
          .hobbies-idle-text   { align-items: flex-start !important; }
          .hobbies-vine        { display: block; }
          .hobbies-hobby-inner { padding: 40px 32px 40px 100px; }
        }

        /* the collage needs real spare width beside the 380px-capped text (worst
           case ~435px of image intruding from the right) — below ~1280px there
           just isn't room for it beside the text at all. From there up, scale
           the whole cluster as one unit from its right-center point (not zoom
           on individual images, which shrinks toward the top and drifts away
           from the vertically-centered text) so it stays visible and centered
           on ordinary laptops, growing to full size once there's genuinely
           enough width to spare (~1600px). */
        @media (min-width: 1280px) and (max-width: 1439px) {
          .hobby-collage-wrap { display: block; transform: scale(0.485); }
        }
        @media (min-width: 1440px) and (max-width: 1599px) {
          .hobby-collage-wrap { display: block; transform: scale(0.809); }
        }
        @media (min-width: 1600px) {
          .hobby-collage-wrap { display: block; transform: scale(1.155); }
        }
      `}</style>

      <section id="hobbies" className="hobbies-section" style={{ backgroundColor: '#0F2440', overflow: 'hidden' }}>

        {/* ── LEFT: Clock ── */}
        <div className="hobbies-clock-col" style={{
          flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 16px',
        }}>

          <p style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#C8941A', marginBottom: 18, textAlign: 'center',
          }}>
            a few of my favourite things
          </p>

          <svg className="hobbies-clock-svg" viewBox="0 0 268 268" style={{ overflow: 'visible' }}>

            {/* Outer circle */}
            <circle cx={CX} cy={CY} r={R} fill="#0D1E33" stroke="#C8941A" strokeWidth="2" />

            {/* Inner ring */}
            <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#1E3A58" strokeWidth="0.6" />

            {/* 60 tick marks */}
            {Array.from({ length: 60 }, (_, i) => {
              const isMajor = i % 5 === 0;
              if (isMajor && HOBBY_HOUR_INDICES.has(i / 5)) return null;
              const t = tickLine(i, isMajor ? 108 : 112, R);
              return (
                <line key={i}
                  x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke={isMajor ? '#C8941A' : '#1E3A58'}
                  strokeWidth={isMajor ? 1.2 : 0.5}
                />
              );
            })}

            {/* Roman numerals at non-hobby hour positions */}
            {[1, 2, 4, 5, 7, 8, 10, 11].map(i => {
              const [x, y] = clockXY(i, 82);
              return (
                <text key={i} x={x} y={y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#3A5A7A" fontSize="9" fontFamily="Georgia, serif">
                  {ROMAN[i]}
                </text>
              );
            })}

            {/* Hobby nodes */}
            {HOBBIES.map((hobby, i) => {
              const [nx, ny] = clockXY(hobby.hourIndex, NODE_DIST);
              const isActive = activeHobby === i;
              return (
                <g key={i} onClick={() => setActiveHobby(p => p === i ? null : i)} style={{ cursor: 'pointer' }}>
                  <circle cx={nx} cy={ny} r={16}
                    fill={isActive ? '#C84B1A' : '#0D1E33'}
                    stroke={isActive ? '#C84B1A' : '#C8941A'}
                    strokeWidth="0.8"
                  />
                  <text x={nx} y={ny}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={isActive ? '#E8DCC8' : '#C8941A'}
                    fontSize="14" fontFamily="Georgia, serif">
                    {hobby.symbol}
                  </text>
                </g>
              );
            })}

            {/* Hour hand — shorter */}
            <g ref={hourRef}>
              <image
                href="/clockHand.svg"
                x={128} y={71}
                width={12} height={70}
              />
            </g>

            {/* Minute hand — longer */}
            <g ref={minuteRef}>
              <image
                href="/clockHand.svg"
                x={127} y={52}
                width={15} height={90}
              />
            </g>

            {/* Second hand */}
            <g ref={secondRef}>
              <line x1={CX} y1={CY+22} x2={CX} y2={CY-102}
                stroke="#C84B1A" strokeWidth="1" strokeLinecap="round" />
              <circle cx={CX} cy={CY+14} r={3} fill="#C84B1A" />
            </g>

            {/* Center caps */}
            <circle cx={CX} cy={CY} r={5} fill="#E8DCC8" />
            <circle cx={CX} cy={CY} r={2.5} fill="#C84B1A" />

          </svg>
        </div>

        {/* ── Vertical divider ── */}
        <div className="hobbies-divider" />

        {/* ── RIGHT: Content ── */}
        <div className="hobbies-content-col">

          {/* Idle state */}
          <div className={`hobbies-panel hobbies-idle-inner ${activeHobby === null ? 'is-active' : ''}`} style={{
            alignItems: 'center',
            opacity: activeHobby === null ? 1 : 0,
            transition: 'opacity 0.35s',
            pointerEvents: activeHobby === null ? 'auto' : 'none',
          }}>
            {/* Text */}
            <div className="hobbies-idle-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontStyle: 'italic', fontSize: 16,
                color: '#8AAABB', margin: '0 0 16px 0',
              }}>
                beyond all the projects and technical stuff...
              </p>

              <h2 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic', fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.1,
                color: '#E8DCC8', margin: '0 0 28px 0',
              }}>
                yes, I do have a{' '}<span style={{ color: '#D4A020' }}>personality.</span>
              </h2>

              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 17, lineHeight: 1.9,
                color: '#8AAABB', maxWidth: 460, margin: '0 0 28px 0',
              }}>
                not exactly standard for a CS portfolio, but here&apos;s what I actually do with my time when I&apos;m not building things.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 1, background: '#C8941A', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-lora), Georgia, serif',
                  fontStyle: 'italic', fontSize: 16, color: '#C8941A',
                }}>
                  tap a symbol on the clock to get a glimpse :)
                </span>
              </div>
            </div>

            {/* Vine */}
            <img
              className="hobbies-vine"
              src="/idleClockVine.svg"
              alt=""
              aria-hidden="true"
              style={{ height: 500, width: 'auto', flexShrink: 0, marginLeft: 32, opacity: 0.85, filter: 'brightness(0) saturate(100%) invert(58%) sepia(60%) saturate(800%) hue-rotate(5deg) brightness(0.9)' }}
            />
          </div>

          {/* Hobby panels */}
          {HOBBIES.map((hobby, i) => (
            <div key={i} className={`hobbies-panel hobbies-hobby-inner ${activeHobby === i ? 'is-active' : ''}`} style={{
              flexDirection: 'column', justifyContent: 'center',
              opacity: activeHobby === i ? 1 : 0,
              transition: 'opacity 0.35s',
              pointerEvents: activeHobby === i ? 'auto' : 'none',
            }}>

              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#C8941A', margin: '0 0 12px 0',
              }}>
                {hobby.eyebrow}
              </p>

              <h3 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic', fontSize: 'clamp(32px, 6vw, 54px)',
                color: '#E8DCC8', margin: '0 0 16px 0', lineHeight: 1.2,
                maxWidth: 480,
              }}>
                {hobby.title}<em style={{ color: '#D4A020' }}>{hobby.titleEm}</em>
              </h3>

              <p style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 'clamp(16px, 2.4vw, 20px)', color: '#8AAABB', lineHeight: 1.95,
                maxWidth: 480, margin: 0,
              }}>
                {hobby.body}
              </p>

              {/* Collage stickers — hidden below 1280px, scaled as a single unit
                  above that so the cluster stays centered on the text rather
                  than collapsing toward one corner as it shrinks */}
              <div className="hobby-collage-wrap">
                {hobby.collage.map((s, si) => (
                  s.src ? (
                    <img key={si} src={s.src} alt="" style={{
                      position: 'absolute', top: s.top, right: s.right,
                      width: s.w, height: s.h, zIndex: s.z,
                      objectFit: s.objectFit ?? 'cover',
                      background: s.bg ?? 'transparent',
                      transform: `rotate(${s.rot}deg)`,
                      ...STICKER_STYLE,
                    }} />
                  ) : (
                    <div key={si} style={{
                      position: 'absolute', top: s.top, right: s.right,
                      width: s.w, height: s.h, zIndex: s.z,
                      background: '#162E4A',
                      transform: `rotate(${s.rot}deg)`,
                      ...STICKER_STYLE,
                    }} />
                  )
                ))}
              </div>

            </div>
          ))}

        </div>
      </section>
    </>
  );
}
