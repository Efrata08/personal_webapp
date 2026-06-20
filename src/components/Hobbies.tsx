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

function clockXY(hourIndex: number, r: number): [number, number] {
  const deg = -90 + hourIndex * 30;
  return [CX + r * Math.cos(toRad(deg)), CY + r * Math.sin(toRad(deg))];
}

function tickLine(tickIndex: number, innerR: number, outerR: number) {
  const rad = toRad(-90 + tickIndex * 6);
  return {
    x1: CX + innerR * Math.cos(rad),
    y1: CY + innerR * Math.sin(rad),
    x2: CX + outerR * Math.cos(rad),
    y2: CY + outerR * Math.sin(rad),
  };
}

const STICKER_STYLE = { border: '4px solid #E8DCC8', boxShadow: '3px 4px 12px rgba(0,0,0,0.3)' } as const;

const HOBBIES = [
  {
    symbol: '✦',
    label: 'CULTURE',
    hourIndex: 0,
    eyebrow: 'identity & roots',
    title: 'Ethiopia, ',
    titleEm: 'always',
    body: "I grew up carrying Addis Abeba with me everywhere. The coffee ceremonies, the paintings of women in habesha kemis, the jazz that sounds like it was made for slow mornings.",
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
    title: 'The digicam ',
    titleEm: 'slows me down',
    body: "I bought a digital camera and it changed how I see things. I shoot candid moments, textures, quiet streets — things I'd walk past otherwise.",
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
    body: "My favourite hobby is a phone call that stretches for hours. Talking to my family and friends — really talking, unhurried — is something I'd choose over almost anything else.",
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
    body: "I disappear into long fantasy series — the world-building, the lore, the way a great author makes you genuinely grieve a fictional character.",
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
    <section style={{ backgroundColor: '#0F2440', display: 'flex', minHeight: 560, overflow: 'hidden' }}>

      {/* ── LEFT: Clock ── */}
      <div style={{
        width: 460, flexShrink: 0,
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

        <svg width="420" height="420" viewBox="0 0 268 268" style={{ overflow: 'visible', marginLeft: 62 }}>

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
            const [lx, ly] = clockXY(hobby.hourIndex, NODE_DIST + 30);
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
              x={128} y={60}
              width={12} height={81}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </g>

          {/* Minute hand — longer */}
          <g ref={minuteRef}>
            <image
              href="/clockHand.svg"
              x={127} y={37}
              width={15} height={105}
              style={{ filter: 'brightness(0) invert(1)' }}
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
      <div style={{
        width: 1, flexShrink: 0, marginLeft: 40,
        background: 'linear-gradient(to bottom, transparent, #1E3A58 30%, #1E3A58 70%, transparent)',
      }} />

      {/* ── RIGHT: Content ── */}
      <div style={{
        flex: 1, padding: '40px 32px 40px 156px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'visible',
      }}>

        {/* Idle state */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          padding: '48px 56px',
          opacity: activeHobby === null ? 1 : 0,
          transition: 'opacity 0.35s',
          pointerEvents: activeHobby === null ? 'auto' : 'none',
        }}>
          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontStyle: 'italic', fontSize: 16,
              color: '#8AAABB', margin: '0 0 16px 0',
            }}>
              beyond all the projects and technical stuff...
            </p>

            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontStyle: 'italic', fontSize: 52, lineHeight: 1.1,
              color: '#E8DCC8', margin: '0 0 28px 0',
            }}>
              yes, I do have a{' '}<span style={{ color: '#D4A020' }}>personality.</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontSize: 17, lineHeight: 1.9,
              color: '#8AAABB', maxWidth: 460, margin: '0 0 28px 0',
            }}>
              although it is not exactly standard for a CS portfolio, I choose to share what I actually do with my time — because time is the most precious gift we have, and what you spend it on says everything about you.
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
            src="/idleClockVine.svg"
            alt=""
            aria-hidden="true"
            style={{ height: 500, width: 'auto', flexShrink: 0, marginLeft: 32, opacity: 0.85, filter: 'brightness(0) saturate(100%) invert(58%) sepia(60%) saturate(800%) hue-rotate(5deg) brightness(0.9)' }}
          />
        </div>

        {/* Hobby panels */}
        {HOBBIES.map((hobby, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            padding: '40px 32px 40px 156px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
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
              fontStyle: 'italic', fontSize: 54,
              color: '#E8DCC8', margin: '0 0 16px 0', lineHeight: 1.2,
            }}>
              {hobby.title}<em style={{ color: '#D4A020' }}>{hobby.titleEm}</em>
            </h3>

            <p style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontSize: 20, color: '#8AAABB', lineHeight: 1.95,
              maxWidth: 380, margin: 0,
            }}>
              {hobby.body}
            </p>

            {/* Collage stickers */}
            {hobby.collage.map((s, si) => (
              s.src ? (
                <img key={si} src={s.src} alt="" style={{
                  position: 'absolute', top: s.top, right: s.right,
                  width: s.w, height: s.h, zIndex: s.z,
                  objectFit: (s as any).objectFit ?? 'cover',
                  background: (s as any).bg ?? 'transparent',
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
        ))}

      </div>
    </section>
  );
}
