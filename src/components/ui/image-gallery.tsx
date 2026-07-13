"use client";

import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    gsap: any;
    MotionPathPlugin: any;
  }
}

const images = [
  { title: "Capturing Timeless Beauty", url: "/images/hero-bg1.jpg" },
  { title: "Capturing Timeless Beauty", url: "/images/hero-bg2.jpg" },
  { title: "Capturing Timeless Beauty", url: "/images/hero-bg3.jpg" },
  { title: "Capturing Timeless Beauty", url: "/images/hero-bg4.jpg" },
];

const W = 1920;
const H = 1080;

export function ImageGallery() {
  const [opened, setOpened] = useState(0);
  const [inPlace, setInPlace] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);
  const [refsReady, setRefsReady] = useState(false);
  const timer = useRef<number | null>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const initialized = useRef(false);

  // Load GSAP
  useEffect(() => {
    if (window.gsap && window.MotionPathPlugin) {
      window.gsap.registerPlugin(window.MotionPathPlugin);
      setGsapReady(true);
      return;
    }
    if (document.getElementById('gsap-script')) {
      const checkReady = setInterval(() => {
        if (window.gsap && window.MotionPathPlugin) {
          clearInterval(checkReady);
          window.gsap.registerPlugin(window.MotionPathPlugin);
          setGsapReady(true);
        }
      }, 100);
      return () => clearInterval(checkReady);
    }
    const s1 = document.createElement("script");
    s1.id = 'gsap-script';
    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    s1.onload = () => {
      const s2 = document.createElement("script");
      s2.id = 'gsap-motionpath-script';
      s2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js";
      s2.onload = () => {
        if (window.gsap && window.MotionPathPlugin) {
          window.gsap.registerPlugin(window.MotionPathPlugin);
          setGsapReady(true);
        }
      };
      document.body.appendChild(s2);
    };
    document.body.appendChild(s1);
  }, []);

  const onClick = (i: number) => { if (!disabled) setOpened(i); };
  const onInPlace = (i: number) => setInPlace(i);
  const next = useCallback(() => setOpened((p) => (p + 1 >= images.length ? 0 : p + 1)), []);
  const prev = useCallback(() => setOpened((p) => (p - 1 < 0 ? images.length - 1 : p - 1)), []);

  useEffect(() => setDisabled(true), [opened]);
  useEffect(() => setDisabled(false), [inPlace]);

  // Auto-rotate
  useEffect(() => {
    if (!gsapReady || !refsReady) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = window.setInterval(next, 4500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [opened, gsapReady, refsReady, next]);

  // Set refs ready after mount (ensures circle refs are populated)
  useEffect(() => {
    setRefsReady(true);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Fallback: always show first image as static background so hero is never blank */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url('${images[0].url}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: gsapReady && refsReady && initialized.current ? 0 : 1,
        transition: "opacity 0.5s ease",
        zIndex: 0,
      }} />

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "relative", zIndex: 1 }}>
        <defs>
          {images.map((_, i) => (
            <g key={i}>
              <clipPath id={`cc_${i}`}>
                <circle
                  ref={(el) => { circleRefs.current[i] = el; }}
                  cx={W / 2} cy={H / 2} r={0}
                />
              </clipPath>
              <clipPath id={`rc_${i}`}>
                <rect x={0} y={0} width={W} height={H} />
              </clipPath>
            </g>
          ))}
        </defs>

        {gsapReady && refsReady && images.map((img, i) => (
          <GalleryLayer
            key={img.url}
            id={i}
            circleEl={circleRefs.current[i]}
            url={img.url}
            title={img.title}
            open={opened === i}
            inPlace={inPlace === i}
            onInPlace={onInPlace}
            total={images.length}
            isInitOpen={i === 0}
            onInitialized={() => { initialized.current = true; }}
          />
        ))}

        {gsapReady && refsReady && <TabDots count={images.length} images={images} onSelect={onClick} active={opened} />}
      </svg>

      {/* Nav buttons */}
      <button onClick={prev} disabled={disabled} aria-label="Previous" style={{
        position: "absolute", left: 24, top: "50%", zIndex: 10,
        transform: "translateY(-50%)", width: 52, height: 52,
        borderRadius: "50%", border: "none",
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
        color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 0.9, display: "flex",
        alignItems: "center", justifyContent: "center", transition: "all 0.3s",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button onClick={next} disabled={disabled} aria-label="Next" style={{
        position: "absolute", right: 24, top: "50%", zIndex: 10,
        transform: "translateY(-50%)", width: 52, height: 52,
        borderRadius: "50%", border: "none",
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
        color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 0.9, display: "flex",
        alignItems: "center", justifyContent: "center", transition: "all 0.3s",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

/* ===== Gallery Layer ===== */
function GalleryLayer({ id, circleEl, url, title, open, inPlace, onInPlace, total, isInitOpen, onInitialized }: {
  id: number; circleEl: SVGCircleElement | null; url: string; title: string;
  open: boolean; inPlace: boolean; onInPlace: (i: number) => void; total: number;
  isInitOpen: boolean; onInitialized: () => void;
}) {
  const hasAnimated = useRef(false);

  const R = 20;
  const GAP = 30;
  const TAB_Y = H - 60;
  const DUR = 0.5;
  const BIG = 3000;

  const small = () => ({
    cx: W / 2 - (total * (R * 2 + GAP) - GAP) / 2 + id * (R * 2 + GAP),
    cy: TAB_Y, r: R,
  });
  const mid = () => ({ cx: W / 2, cy: H / 2, r: 100 });
  const bigL = () => ({ cx: W / 2 - BIG, cy: H / 2, r: BIG });
  const bigR = () => ({ cx: W / 2 + BIG, cy: H / 2, r: BIG });
  const above = () => ({
    cx: W / 2 - (total * (R * 2 + GAP) - GAP) / 2 + id * (R * 2 + GAP),
    cy: H / 2, r: R * 2,
  });

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !circleEl) return;

    // First time: instantly show first image fullscreen, collapse others to tabs
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      if (isInitOpen) {
        // Instantly expand first image to fill screen
        gsap.set(circleEl, { attr: bigL() });
        onInPlace(id);
        onInitialized();
      } else {
        // Place other images at their tab dot positions
        gsap.set(circleEl, { attr: small() });
        onInitialized();
      }
      return;
    }

    // Normal animations after initialization
    if (open) {
      gsap.timeline()
        .set(circleEl, { attr: small() })
        .to(circleEl, { attr: mid(), duration: 0.25, ease: "power3.inOut" })
        .to(circleEl, { attr: bigL(), duration: DUR, ease: "power4.in", onComplete: () => onInPlace(id) });
    } else {
      const delay = DUR + 0.25;
      gsap.timeline({ overwrite: true })
        .set(circleEl, { attr: bigR() })
        .to(circleEl, { attr: mid(), delay, duration: DUR, ease: "power4.out" })
        .to(circleEl, { attr: above(), duration: 0.4, ease: "power2.out" })
        .to(circleEl, { attr: small(), duration: 0.6, ease: "bounce.out" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, circleEl]);

  const clipId = inPlace ? `rc_${id}` : `cc_${id}`;

  return (
    <g style={{ zIndex: inPlace ? id : total + 1 }}>
      <g clipPath={`url(#${clipId})`}>
        <image width={W} height={H} href={url} preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: "none" }} />
      </g>
    </g>
  );
}

/* ===== Tab Dots ===== */
function TabDots({ count, images, onSelect, active }: { count: number; images: { title: string; url: string }[]; onSelect: (i: number) => void; active: number }) {
  const R = 20;
  const GAP = 30;
  const Y = H - 60;

  return (
    <g style={{ pointerEvents: "auto" }}>
      {images.map((img, i) => {
        const cx = W / 2 - (count * (R * 2 + GAP) - GAP) / 2 + i * (R * 2 + GAP);
        return (
          <g key={img.url}>
            <defs>
              <clipPath id={`tc_${i}`}>
                <circle cx={cx} cy={Y} r={R} />
              </clipPath>
            </defs>
            <image x={cx - R} y={Y - R} width={R * 2} height={R * 2} href={img.url} clipPath={`url(#tc_${i})`} preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: "none" }} />
            <circle cx={cx} cy={Y} r={R + 3} fill="none" stroke={active === i ? "rgba(212,160,23,0.9)" : "rgba(255,255,255,0.5)"} strokeWidth={active === i ? 3 : 2} style={{ cursor: "pointer", transition: "all 0.3s" }} onClick={() => onSelect(i)} />
          </g>
        );
      })}
    </g>
  );
}
