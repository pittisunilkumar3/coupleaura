"use client";

import * as React from "react";
import { motion, type Variants, type Easing } from "framer-motion";

interface Testimonial {
  imgSrc: string;
  alt: string;
}

const imagePositions = [
  // Row 1 — top
  { top: "2%", left: "8%", w: 110, h: 110 },
  { top: "0%", left: "28%", w: 90, h: 90 },
  { top: "3%", left: "48%", w: 70, h: 70 },
  { top: "1%", right: "22%", w: 100, h: 100 },
  { top: "4%", right: "4%", w: 85, h: 85 },
  // Row 2 — mid-top
  { top: "22%", left: "2%", w: 100, h: 100 },
  { top: "25%", right: "8%", w: 95, h: 95 },
  // Row 3 — middle
  { top: "42%", left: "5%", w: 85, h: 85 },
  { top: "45%", right: "3%", w: 110, h: 110 },
  // Row 4 — mid-bottom
  { top: "62%", left: "10%", w: 90, h: 90 },
  { top: "60%", right: "12%", w: 75, h: 75 },
  // Row 5 — bottom
  { bottom: "8%", left: "5%", w: 95, h: 95 },
  { bottom: "5%", left: "25%", w: 70, h: 70 },
  { bottom: "3%", left: "50%", w: 80, h: 80 },
  { bottom: "6%", right: "20%", w: 100, h: 100 },
  { bottom: "2%", right: "3%", w: 85, h: 85 },
  // Extras
  { top: "15%", left: "15%", w: 65, h: 65 },
  { top: "35%", left: "20%", w: 60, h: 60 },
  { bottom: "18%", left: "15%", w: 70, h: 70 },
  { bottom: "20%", right: "8%", w: 65, h: 65 },
];

const imageVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: i * 0.08,
    },
  }),
};

function floatingAnimation(seed: number): {
  y: number[];
  x: number[];
  transition: { duration: number; repeat: number; repeatType: "reverse"; ease: Easing };
} {
  return {
    y: [0, (Math.sin(seed) * 12) + -8, 0],
    x: [0, Math.cos(seed) * 5, 0],
    transition: {
      duration: 4 + (seed % 3),
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut" as Easing,
    },
  };
}

export function AnimatedTestimonialGrid({
  testimonials,
  badgeText,
  title,
  description,
  ctaText,
  ctaHref,
}: {
  testimonials: Testimonial[];
  badgeText?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  ctaText: string;
  ctaHref: string;
}) {
  const [windowWidth, setWindowWidth] = React.useState(0);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth > 0 && windowWidth < 768;

  // On mobile show fewer images, on desktop show all
  const visibleCount = isMobile ? 8 : imagePositions.length;
  const scale = isMobile ? 0.6 : 1;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "80px 16px",
        minHeight: isMobile ? 400 : 650,
        overflow: "hidden",
      }}
    >
      {/* Floating images */}
      {testimonials.slice(0, visibleCount).map((testimonial, index) => {
        const pos = imagePositions[index];
        const imgW = Math.round(pos.w * scale);
        const imgH = Math.round(pos.h * scale);

        const style: React.CSSProperties = {
          position: "absolute",
          top: pos.top,
          left: pos.left,
          right: pos.right,
          bottom: pos.bottom,
          width: imgW,
          height: imgH,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          border: "2px solid rgba(255,255,255,0.3)",
        };

        return (
          <motion.div
            key={index}
            style={style}
            variants={imageVariants}
            custom={index}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.15, zIndex: 20 }}
          >
            <motion.img
              src={testimonial.imgSrc}
              alt={testimonial.alt}
              animate={floatingAnimation(index * 1.7)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 14,
              }}
            />
          </motion.div>
        );
      })}

      {/* Central content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: isMobile ? "40px 10px" : "80px 20px",
        }}
      >
        {badgeText && (
          <div
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 999,
              background: "rgba(212,160,23,0.12)",
              color: "#d4a017",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            {badgeText}
          </div>
        )}
        <h2
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(24px, 5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#1a1a1a",
            marginBottom: 16,
            maxWidth: 700,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "#666",
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          {description}
        </p>
        <a
          href={ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 32px",
            borderRadius: 999,
            background: "#d4a017",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(212,160,23,0.3)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#b8933f";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#d4a017";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          }}
        >
          {ctaText}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
