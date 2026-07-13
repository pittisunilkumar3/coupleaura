"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

class SeededRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number { this.seed = (this.seed * 9301 + 49297) % 233280; return this.seed / 233280; }
  range(min: number, max: number): number { return min + this.next() * (max - min); }
}

interface ImageData { src: string; alt: string; id: string; }
interface ScatterPosition { x: number; y: number; rotation: number; scale: number; }

const DEFAULT_IMAGES: ImageData[] = [
  { id: "1", src: "/images/bigday-candid-video.jpg", alt: "Big Day" },
  { id: "2", src: "/images/bride-haldi-candid-video.jpg", alt: "Bride Haldi" },
  { id: "3", src: "/images/cocktail-candid-video.jpg", alt: "Cocktail" },
  { id: "4", src: "/images/groom-haldi-candid-video.jpg", alt: "Groom Haldi" },
  { id: "5", src: "/images/mehandi-traditional-video.jpg", alt: "Mehandi" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0.8 } },
};

const cardVariants = {
  hidden: () => ({
    x: 0, y: 0, rotate: 0, scale: 0.8, opacity: 0,
  }),
  visible: (custom: { position: ScatterPosition; zIndex: number; springConfig: any }) => ({
    x: custom.position.x,
    y: custom.position.y,
    rotate: custom.position.rotation,
    scale: custom.position.scale,
    opacity: 1,
    zIndex: custom.zIndex,
    transition: custom.springConfig,
  }),
};

export default function ImageStack({
  images = DEFAULT_IMAGES,
  maxRotation = 12,
  seed = 12345,
  className = "",
}: {
  images?: ImageData[];
  maxRotation?: number;
  seed?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [scatterPositions, setScatterPositions] = React.useState<ScatterPosition[]>([]);
  const [currentSeed, setCurrentSeed] = React.useState(seed);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Stable reference — only regenerate when seed changes
  const generateScatterPositions = React.useCallback(
    (seedValue: number) => {
      const rng = new SeededRandom(seedValue);
      return images.map((_, i) => ({
        x: rng.range(-420, 420),
        y: rng.range(-120, 120),
        rotation: rng.range(-maxRotation, maxRotation),
        scale: rng.range(0.9, 1.05),
      }));
    },
    [images, maxRotation]
  );

  // Preload once — use empty deps, images are stable
  React.useEffect(() => {
    let cancelled = false;
    const preload = async () => {
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              const i = new Image();
              i.onload = () => resolve();
              i.onerror = () => resolve();
              i.src = img.src;
            })
        )
      );
      if (!cancelled) setImagesLoaded(true);
    };
    preload();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    setScatterPositions(generateScatterPositions(currentSeed));
  }, [currentSeed, generateScatterPositions]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imagesLoaded) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [imagesLoaded]);

  const reshuffle = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setCurrentSeed(newSeed);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 150);
  };

  const springConfig = prefersReducedMotion
    ? { type: "tween" as const, duration: 0.3 }
    : { type: "spring" as const, stiffness: 80, damping: 18 };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      className={className}
    >
      <motion.div
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "100%", perspective: 1200 }}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {!imagesLoaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 16 }}>
            Loading images...
          </div>
        )}

        {images.map((image, index) => {
          const position = scatterPositions[index];
          if (!position) return null;

          return (
            <motion.div
              key={`${image.id}-${currentSeed}`}
              variants={cardVariants}
              custom={{
                position,
                zIndex: images.length - index,
                springConfig,
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: -190,
                marginTop: -260,
              }}
            >
              <div
                onClick={reshuffle}
                style={{
                  background: "#fff",
                  padding: 16,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                  border: "1px solid #e8e5df",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  width: 340,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 30px 60px rgba(212,160,23,0.3)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px) scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.15)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  style={{ width: "100%", height: 380, objectFit: "cover", display: "block", borderRadius: 2 }}
                />
                <div style={{ padding: "14px 8px 8px", textAlign: "center" }}>
                  <h4 style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    margin: "0 0 4px",
                  }}>
                    {image.alt}
                  </h4>
                  <p style={{
                    fontSize: 12,
                    color: "#999",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}>
                    Click to reshuffle
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
