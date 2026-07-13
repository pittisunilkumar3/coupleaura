"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const galleryImages = [
  { src: "/images/portrait1.jpg", alt: "Golden Hour Portrait" },
  { src: "/images/landscape2.jpg", alt: "Mountain Serenity" },
  { src: "/images/wedding1.jpg", alt: "Eternal Love" },
  { src: "/images/street1.jpg", alt: "Urban Nights" },
  { src: "/images/portrait2.jpg", alt: "Natural Beauty" },
  { src: "/images/arch1.jpg", alt: "Modern Lines" },
  { src: "/images/landscape1.jpg", alt: "Alpine Dawn" },
  { src: "/images/wedding2.jpg", alt: "First Dance" },
  { src: "/images/street2.jpg", alt: "City Lights" },
  { src: "/images/hero1.jpg", alt: "Studio Portrait" },
  { src: "/images/team1.jpg", alt: "Alexandre" },
  { src: "/images/team2.jpg", alt: "Isabella" },
  { src: "/images/team3.jpg", alt: "Sophia" },
  { src: "/images/team4.jpg", alt: "Mia" },
  { src: "/images/avatar1.jpg", alt: "Sarah & James" },
  { src: "/images/avatar2.jpg", alt: "Michael Chen" },
  { src: "/images/avatar3.jpg", alt: "Emma Rodriguez" },
  { src: "/images/divider.jpg", alt: "Cinematic Moment" },
  { src: "/images/portrait1.jpg", alt: "Bridal Glow" },
  { src: "/images/landscape2.jpg", alt: "Misty Peaks" },
  { src: "/images/wedding1.jpg", alt: "Sacred Vows" },
  { src: "/images/street1.jpg", alt: "Neon Reflections" },
  { src: "/images/portrait2.jpg", alt: "Ethereal Light" },
  { src: "/images/arch1.jpg", alt: "Glass & Steel" },
  { src: "/images/landscape1.jpg", alt: "Valley of Dreams" },
  { src: "/images/wedding2.jpg", alt: "Love & Laughter" },
  { src: "/images/street2.jpg", alt: "Rainy Evening" },
  { src: "/images/hero1.jpg", alt: "Dramatic Flair" },
  { src: "/images/team1.jpg", alt: "Behind the Lens" },
  { src: "/images/avatar1.jpg", alt: "Joyful Tears" },
];

/* ─── justified row calculator ─── */
function computeRows(
  images: { src: string; alt: string; ratio: number }[],
  containerWidth: number,
  targetHeight: number,
  gap: number
) {
  const rows: { src: string; alt: string; w: number; h: number; globalIdx: number }[][] = [];
  let row: { src: string; alt: string; ratio: number; globalIdx: number }[] = [];
  let rowWidth = 0;
  let rowGlobalIndices: number[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const imgW = targetHeight * img.ratio;
    row.push({ src: img.src, alt: img.alt, ratio: img.ratio, globalIdx: i });
    rowGlobalIndices.push(i);
    rowWidth += imgW + gap;

    if (rowWidth - gap >= containerWidth && row.length >= 2) {
      const totalRatio = row.reduce((s, r) => s + r.ratio, 0);
      const totalGap = (row.length - 1) * gap;
      const finalH = (containerWidth - totalGap) / totalRatio;

      rows.push(
        row.map((r, ci) => ({
          src: r.src,
          alt: r.alt,
          w: Math.round(finalH * r.ratio),
          h: Math.round(finalH),
          globalIdx: rowGlobalIndices[ci],
        }))
      );
      row = [];
      rowGlobalIndices = [];
      rowWidth = 0;
    }
  }

  // last row
  if (row.length > 0) {
    rows.push(
      row.map((r, ci) => ({
        src: r.src,
        alt: r.alt,
        w: Math.round(targetHeight * r.ratio),
        h: Math.round(targetHeight),
        globalIdx: rowGlobalIndices[ci],
      }))
    );
  }
  return rows;
}

/* ─── Gallery Item ─── */
function GalleryItem({
  img,
  onOpen,
}: {
  img: { src: string; alt: string; w: number; h: number; globalIdx: number };
  onOpen: (idx: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onOpen(img.globalIdx)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: img.w,
        height: img.h,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.4s",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          filter: hovered ? "saturate(1.1) brightness(1.05)" : "saturate(0.85)",
        }}
      />
      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          display: "flex",
          alignItems: "flex-end",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#d4a017" }}>
          {img.alt}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function OurClicks() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [ratios, setRatios] = useState<number[]>([]);
  const [containerW, setContainerW] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  // measure natural aspect ratios
  useEffect(() => {
    let loaded = 0;
    const arr = new Array(galleryImages.length).fill(1.5);
    galleryImages.forEach((img, i) => {
      const el = new window.Image();
      el.src = img.src;
      el.onload = () => {
        arr[i] = el.naturalWidth / el.naturalHeight;
        loaded++;
        if (loaded === galleryImages.length) setRatios(arr);
      };
      el.onerror = () => {
        loaded++;
        if (loaded === galleryImages.length) setRatios(arr);
      };
    });
  }, []);

  // observe container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const imagesWithRatio = galleryImages.map((img, i) => ({
    ...img,
    ratio: ratios[i] || 1.5,
  }));

  const gap = 16;
  const targetH = containerW < 768 ? 180 : containerW < 1024 ? 260 : 380;
  const rows = computeRows(imagesWithRatio, containerW, targetH, gap);

  const openNext = useCallback(
    (dir: 1 | -1) => {
      if (lightbox === null) return;
      const next = lightbox + dir;
      if (next >= 0 && next < galleryImages.length) setLightbox(next);
    },
    [lightbox]
  );

  // keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") openNext(1);
      if (e.key === "ArrowLeft") openNext(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, openNext]);

  // lock body scroll when lightbox open
  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [lightbox]);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", paddingTop: 56 }}>
      {/* ─── HERO BANNER (CENTERED) ─── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: containerW < 768 ? 340 : 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #111 100%)",
        }}
      >
        {/* Decorative tilted images */}
        <div
          style={{
            position: "absolute",
            left: containerW < 768 ? -60 : -20,
            top: "50%",
            transform: "translateY(-50%) rotate(8deg)",
            width: containerW < 768 ? 160 : 300,
            height: containerW < 768 ? 100 : 190,
            borderRadius: 16,
            overflow: "hidden",
            opacity: 0.2,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src="/images/landscape1.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: containerW < 768 ? -60 : -20,
            top: "50%",
            transform: "translateY(-50%) rotate(-12deg)",
            width: containerW < 768 ? 160 : 300,
            height: containerW < 768 ? 100 : 190,
            borderRadius: 16,
            overflow: "hidden",
            opacity: 0.2,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src="/images/wedding1.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Decorative dots */}
        <div style={{ position: "absolute", left: "10%", top: "15%", width: 8, height: 8, borderRadius: "50%", background: "#d4a017", opacity: 0.4 }} />
        <div style={{ position: "absolute", left: "12%", top: "22%", width: 5, height: 5, borderRadius: "50%", background: "#d4a017", opacity: 0.25 }} />
        <div style={{ position: "absolute", right: "10%", top: "18%", width: 6, height: 6, borderRadius: "50%", background: "#d4a017", opacity: 0.35 }} />
        <div style={{ position: "absolute", right: "8%", bottom: "20%", width: 4, height: 4, borderRadius: "50%", background: "#d4a017", opacity: 0.3 }} />

        {/* Centered content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 720,
            width: "100%",
            padding: containerW < 768 ? "60px 24px" : "100px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase" as const,
              letterSpacing: 4,
              color: "#d4a017",
              marginBottom: 16,
            }}
          >
            ✦ Portfolio
          </span>
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: containerW < 768 ? 36 : 60,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: -1,
            }}
          >
            Our Clicks
          </h1>
          <div style={{ width: 60, height: 2, background: "#d4a017", marginBottom: 24, borderRadius: 1 }} />
          <p
            style={{
              fontSize: containerW < 768 ? 14 : 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 540,
              margin: 0,
            }}
          >
            Going through our clicks isn&apos;t just a visual journey;
            it&apos;s an exploration of how we capture the essence of every
            moment. Each photograph tells a story, and collectively, they unfold
            the artistry and passion we bring to our craft.
          </p>
        </div>
      </section>

      {/* ─── JUSTIFIED GALLERY ─── */}
      <section
        ref={containerRef}
        style={{
          padding: containerW < 768 ? "40px 16px 80px" : "60px 40px 100px",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {rows.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "flex",
                gap,
                marginBottom: gap,
                justifyContent:
                  ri === rows.length - 1 ? "flex-start" : "center",
              }}
            >
              {row.map((img, ci) => (
                <GalleryItem
                  key={ci}
                  img={img}
                  onOpen={(idx) => setLightbox(idx)}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIGHTBOX ─── */}
      {lightbox !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.96)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              width: 48,
              height: 48,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            ✕
          </button>

          {/* Prev */}
          {lightbox > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openNext(-1);
              }}
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 52,
                height: 52,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s",
              }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={galleryImages[lightbox].src}
            alt={galleryImages[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          />

          {/* Next */}
          {lightbox < galleryImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openNext(1);
              }}
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 52,
                height: 52,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s",
              }}
            >
              ›
            </button>
          )}

          {/* Caption */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "24px 32px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: 18,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {galleryImages[lightbox].alt}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {lightbox + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
