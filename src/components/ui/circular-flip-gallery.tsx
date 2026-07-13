"use client";

import { useState, useEffect, useRef } from "react";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

const cardData = [
  { image: "/images/landscape1.jpg", title: "Landscape", description: "Nature's breathtaking canvas" },
  { image: "/images/landscape2.jpg", title: "Scenic View", description: "Beauty in every direction" },
  { image: "/images/street1.jpg", title: "Urban Life", description: "Stories woven through city streets" },
  { image: "/images/street2.jpg", title: "City Nights", description: "When the city comes alive" },
  { image: "/images/hero1.jpg", title: "Studio", description: "Creative studio portraits" },
  { image: "/images/team1.jpg", title: "Creative Team", description: "Passionate artists behind the lens" },
  { image: "/images/team2.jpg", title: "Team Spirit", description: "Working together for perfection" },
  { image: "/images/team3.jpg", title: "Our Crew", description: "Dedicated professionals" },
  { image: "/images/team4.jpg", title: "Behind the Scenes", description: "Making magic happen" },
  { image: "/images/bride-haldi-candid-photo.jpg", title: "Bride Haldi", description: "Joyful haldi celebration" },
  { image: "/images/groom-haldi-candid-photo.jpg", title: "Groom Haldi", description: "Vibrant haldi ceremony" },
  { image: "/images/pellikuthuru-candid-photo.jpg", title: "Pellikuthuru", description: "Sacred bridal rituals" },
  { image: "/images/pellikoduku-candid-photo.jpg", title: "Pellikoduku", description: "Groom's traditional ceremony" },
  { image: "/images/sangeet-candid-photo.jpg", title: "Sangeet Night", description: "Music, dance & celebration" },
  { image: "/images/mehandi-candid-photo.jpg", title: "Mehandi", description: "Intricate mehandi artistry" },
  { image: "/images/reception-candid-photo.jpg", title: "Reception", description: "Grand reception evening" },
  { image: "/images/cocktail-candid-photo.jpg", title: "Cocktail Party", description: "Fun-filled cocktail night" },
  { image: "/images/wedding1.jpg", title: "Wedding Day", description: "The big day celebrations" },
  { image: "/images/wedding2.jpg", title: "First Dance", description: "A magical first dance" },
];

function FlipCard({ image, title, description, className, style, onClick }: {
  image: string; title: string; description: string; className?: string; style?: React.CSSProperties; onClick: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={cn(className)}
      style={{
        ...style,
        perspective: 1000,
        width: 160,
        height: 210,
        cursor: "pointer",
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={onClick}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          transition: "transform 0.7s ease",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — image */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden", backfaceVisibility: "hidden" }}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </div>
        {/* Back — title & description */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 12,
          background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 10, textAlign: "center", backfaceVisibility: "hidden", transform: "rotateY(180deg)",
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#f5f5f5", margin: "0 0 6px" }}>{title}</h3>
          <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.5 }}>{description}</p>
          <p style={{ fontSize: 11, color: "#d4a017", margin: "8px 0 0" }}>Click to view</p>
        </div>
      </div>
    </div>
  );
}

/* ===== Image Modal ===== */
function ImageModal({ card, onClose, onNext, onPrev }: {
  card: { image: string; title: string; description: string };
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: visible ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0)",
        backdropFilter: "blur(8px)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Close button */}
      <button
        onClick={close}
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 10001,
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", fontSize: 22, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
      >
        ×
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        style={{
          position: "absolute", left: 20, top: "50%", zIndex: 10001,
          transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        style={{
          position: "absolute", right: 20, top: "50%", zIndex: 10001,
          transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* Modal content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "90vh",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
          opacity: visible ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <img
          src={card.image}
          alt={card.title}
          style={{
            maxWidth: "80vw", maxHeight: "75vh",
            objectFit: "contain", borderRadius: 12,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            display: "block",
          }}
        />
        <div style={{
          textAlign: "center", marginTop: 20, padding: "16px 24px",
          background: "rgba(20,20,20,0.8)", borderRadius: 12,
          backdropFilter: "blur(10px)",
        }}>
          <h3 style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px",
          }}>
            {card.title}
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>{card.description}</p>
        </div>
      </div>
    </div>
  );
}

/* ===== Main Gallery ===== */
export function CircularFlipGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (galleryRef.current) setSize(galleryRef.current.offsetWidth);
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (galleryRef.current) ro.observe(galleryRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let id: number;
    const animate = () => {
      setRotation((prev) => prev + 0.00005);
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  const radius = size * 0.4;
  const centerX = size / 2;
  const centerY = size / 2;

  const handleNext = () => {
    setSelected((prev) => prev !== null ? (prev + 1) % cardData.length : null);
  };
  const handlePrev = () => {
    setSelected((prev) => prev !== null ? (prev - 1 + cardData.length) % cardData.length : null);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 0",
        }}
      >
        <div
          ref={galleryRef}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1000,
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Central text */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 10, pointerEvents: "none", padding: 40,
          }}>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(18px, 3vw, 32px)", fontWeight: 700,
              color: "#fff", textAlign: "center", lineHeight: 1.3,
              textShadow: "0 4px 12px rgba(0,0,0,0.5)", margin: "0 0 8px",
            }}>
              Every Photo<br />Tells a Story
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 3, fontWeight: 500, margin: 0 }}>
              Hover to flip • Click to view
            </p>
          </div>

          {/* Circular cards */}
          {size > 0 && cardData.map((card, index) => {
            const angle = (index / cardData.length) * 2 * Math.PI - Math.PI / 2 + rotation;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            return (
              <FlipCard
                key={index}
                image={card.image}
                title={card.title}
                description={card.description}
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${(angle + Math.PI / 2) * (180 / Math.PI)}deg)`,
                  zIndex: 5,
                }}
                onClick={() => setSelected(index)}
              />
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected !== null && (
        <ImageModal
          card={cardData[selected]}
          onClose={() => setSelected(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
}
