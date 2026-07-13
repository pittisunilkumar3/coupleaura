"use client";

import React from "react";
import { useInView } from "framer-motion";

// 15 photos from /Users/sunil/Documents/photoshopwebsitephotots
// Each mapped 1-to-1 from the user's actual photos
const columns: { src: string; alt: string; aspect: string }[][] = [
  // Column 1
  [
    { src: "/images/bride-haldi-candid-photo.jpg", alt: "Bride Haldi Ceremony", aspect: "800 / 1182" },
    { src: "/images/candid-wedding.jpg", alt: "Candid Wedding", aspect: "1200 / 788" },
    { src: "/images/mehandi-candid-photo.jpg", alt: "Mehandi Ceremony", aspect: "800 / 1182" },
    { src: "/images/pellikuthuru-traditional-photo.jpg", alt: "Pellikuthuru", aspect: "800 / 1107" },
    { src: "/images/vratham-traditional-photo.jpg", alt: "Vratham", aspect: "1200 / 800" },
  ],
  // Column 2
  [
    { src: "/images/groom-haldi-candid-photo.jpg", alt: "Groom Haldi", aspect: "1200 / 776" },
    { src: "/images/traditional-wedding.jpg", alt: "Traditional Wedding", aspect: "800 / 1213" },
    { src: "/images/sangeet-candid-photo.jpg", alt: "Sangeet Night", aspect: "800 / 1101" },
    { src: "/images/pellikoduku-traditional-photo.jpg", alt: "Pellikoduku", aspect: "1200 / 781" },
    { src: "/images/prewedding-both.jpg", alt: "Pre-Wedding", aspect: "800 / 1181" },
  ],
  // Column 3
  [
    { src: "/images/reception-candid-photo.jpg", alt: "Reception", aspect: "800 / 1200" },
    { src: "/images/drone-wedding.jpg", alt: "Drone Shot", aspect: "1200 / 800" },
    { src: "/images/cocktail-candid-photo.jpg", alt: "Cocktail Night", aspect: "1200 / 800" },
    { src: "/images/prewedding-photo.jpg", alt: "Pre-Wedding Portrait", aspect: "1200 / 800" },
    { src: "/images/reception-traditional-photo.jpg", alt: "Reception Traditional", aspect: "1200 / 800" },
  ],
];

export function MasonryGallery() {
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        alignItems: "start",
      }}>
        {columns.map((col, colIndex) => (
          <div key={colIndex} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {col.map((photo, i) => (
              <MasonryImage
                key={`${colIndex}-${i}`}
                src={photo.src}
                alt={photo.alt}
                aspect={photo.aspect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MasonryImage({ src, alt, aspect }: { src: string; alt: string; aspect: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const [loaded, setLoaded] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [error, setError] = React.useState(false);

  const visible = loaded || isInView;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        overflow: "hidden",
        background: "#eae8e0",
        cursor: "pointer",
        borderRadius: 6,
      }}
    >
      <img
        alt={alt}
        src={src}
        loading="lazy"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: error ? 0 : visible ? 1 : 0.3,
          transform: visible
            ? hovered ? "scale(1.06)" : "scale(1)"
            : "scale(1.08)",
          transition: hovered
            ? "transform 0.4s ease"
            : "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
        }}
      />

    </div>
  );
}
