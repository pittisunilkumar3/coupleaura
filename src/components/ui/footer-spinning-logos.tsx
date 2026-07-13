"use client";

import React from "react";

/* Social SVG icons — each 16x16 viewbox, stroked white */
const SocialIcons: Record<string, React.FC<{ size?: number }>> = {
  Instagram: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Facebook: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  YouTube: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  Twitter: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  TikTok: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
  LinkedIn: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
};

const logos = [
  { name: "YouTube", color: "#FF0000", href: "https://www.youtube.com/@CoupleauraPhotography" },
  { name: "Instagram", color: "#E4405F", href: "https://www.instagram.com/coupleaura_official?igsh=aHd1bWdyZXp2c3dv&utm_source=qr" },
  { name: "Facebook", color: "#1877F2", href: "https://www.facebook.com/share/1EP1ZZLNwz/" },
];

export function FooterSpinningLogos() {
  const radiusToCenter = 44;
  const iconSize = 28;
  const ringSize = radiusToCenter * 2 + iconSize + 14;

  const toRad = (deg: number) => (Math.PI / 180) * deg;

  return (
    <div
      className="footer-spinning-ring"
      style={{
        width: ringSize,
        height: ringSize,
        position: "relative",
        margin: "16px auto 0",
        borderRadius: "50%",
        border: "1px solid rgba(212,160,23,0.2)",
        background: "rgba(212,160,23,0.05)",
      }}
    >
      {/* Spinning ring — pauses on parent hover via CSS */}
      <div className="footer-spin-track">
        {logos.map((logo, index) => {
          const angle = (360 / logos.length) * index - 90;
          const cx = ringSize / 2;
          const cy = ringSize / 2;
          const x = cx + radiusToCenter * Math.cos(toRad(angle)) - iconSize / 2;
          const y = cy + radiusToCenter * Math.sin(toRad(angle)) - iconSize / 2;
          const IconComp = SocialIcons[logo.name];

          return (
            <a
              key={index}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.name}
              className="footer-spin-icon"
              style={{
                position: "absolute",
                top: y,
                left: x,
                width: iconSize,
                height: iconSize,
                borderRadius: "50%",
                background: logo.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 10px ${logo.color}66`,
                cursor: "pointer",
                textDecoration: "none",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              {IconComp && <IconComp size={13} />}
            </a>
          );
        })}
      </div>

      {/* Center logo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <img
          src="/images/logo.png"
          alt="CA"
          width={40}
          height={40}
          style={{
            width: 40,
            height: 40,
            objectFit: "contain",
          }}
        />
      </div>

      <style>{`
        /* Track: spins forward */
        .footer-spin-track {
          position: absolute;
          inset: 0;
          z-index: 2;
          animation: footer-spin 15s linear infinite;
        }

        /* Each icon: counter-rotates to stay upright */
        .footer-spin-icon {
          animation: footer-spin-reverse 15s linear infinite;
        }

        /* Hover on icon: scale up */
        .footer-spin-icon:hover {
          transform: scale(1.25);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
          z-index: 10;
        }

        /* ===== PAUSE on parent hover ===== */
        .footer-spinning-ring:hover .footer-spin-track {
          animation-play-state: paused;
        }
        .footer-spinning-ring:hover .footer-spin-icon {
          animation-play-state: paused;
        }

        @keyframes footer-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes footer-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
