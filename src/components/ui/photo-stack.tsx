"use client";

import * as React from "react";

export interface PhotoStackItem {
  src: string;
  name: string;
}

export interface InteractivePhotoStackProps {
  items: PhotoStackItem[];
  title: React.ReactNode;
  className?: string;
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateNonOverlappingTransforms = (count: number) => {
  const positions: { x: number; y: number; r: number }[] = [];
  const maxRetries = 100;

  for (let i = 0; i < count; i++) {
    let newPos;
    let collision;
    let retries = 0;

    do {
      collision = false;
      const x = random(-45, 45);
      const y = random(-25, 25);
      const r = random(-25, 25);
      newPos = { x, y, r };

      for (const pos of positions) {
        const dx = Math.abs(newPos.x - pos.x);
        const dy = Math.abs(newPos.y - pos.y);
        if (dx < 25 && dy < 45) {
          collision = true;
          break;
        }
      }
      retries++;
    } while (collision && retries < maxRetries);

    positions.push(newPos);
  }

  return positions.map(
    (pos) => `translate(${pos.x}vw, ${pos.y}vh) rotate(${pos.r}deg)`
  );
};

const InteractivePhotoStack = React.forwardRef<
  HTMLDivElement,
  InteractivePhotoStackProps
>(({ items, title, ...props }, ref) => {
  const [topCardIndex, setTopCardIndex] = React.useState(0);
  const [isGroupHovered, setIsGroupHovered] = React.useState(false);
  const [clickedIndex, setClickedIndex] = React.useState<number | null>(null);
  const [spreadTransforms, setSpreadTransforms] = React.useState<string[]>([]);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const displayedItems = items.slice(0, 5);
  const baseRotations = [2, -2, 4, -4, 6];

  React.useEffect(() => {
    const check = () => setIsTouchDevice(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    const newTransforms = generateNonOverlappingTransforms(displayedItems.length);
    setSpreadTransforms(newTransforms);
    setIsGroupHovered(true);
  };

  const handleCardClick = (index: number) => {
    if (isTouchDevice) return;
    if (isGroupHovered) {
      setClickedIndex(index);
      setTimeout(() => {
        setIsGroupHovered(false);
        setTopCardIndex(index);
        setClickedIndex(null);
      }, 700);
    } else {
      setTopCardIndex(index);
    }
  };

  /* ===== MOBILE / TABLET: Horizontal Slider ===== */
  if (isTouchDevice) {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: "100%",
        }}
        {...props}
      >
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            padding: "8px 24px 16px",
            width: "100%",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayedItems.map((item) => (
            <div
              key={item.name}
              style={{
                flexShrink: 0,
                width: 200,
                borderRadius: 12,
                background: "#fff",
                padding: 8,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                scrollSnapAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ width: "100%", height: 220, overflow: "hidden", borderRadius: 8, background: "#222" }}>
                <img
                  src={item.src}
                  alt={item.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44 }}>
                <p style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 16,
                  fontStyle: "italic",
                  color: "#1a1a1a",
                  margin: 0,
                }}>
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <h3 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>
          {title}
        </h3>
      </div>
    );
  }

  /* ===== DESKTOP: Stacked / Spread ===== */
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
      }}
      {...props}
    >
      <div
        style={{ position: "relative", height: 384, width: "100%" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => !clickedIndex && setIsGroupHovered(false)}
      >
        <div
          style={{
            position: "relative",
            left: "50%",
            top: "50%",
            height: 320,
            width: 256,
            transform: "translate(-50%, -50%)",
          }}
        >
          {displayedItems.map((item, index) => {
            const isTopCard = index === topCardIndex;
            const numItems = displayedItems.length;
            let stackPosition = index - topCardIndex;
            if (stackPosition < 0) stackPosition += numItems;
            const isClicked = index === clickedIndex;

            const rotation = isGroupHovered
              ? 0
              : isTopCard
              ? 0
              : baseRotations[stackPosition] || 0;

            const transform = isGroupHovered
              ? spreadTransforms[index]
              : `translateY(${stackPosition * 0.5}rem) scale(${1 - stackPosition * 0.05})`;

            return (
              <div
                key={item.name}
                onClick={() => handleCardClick(index)}
                style={{
                  position: "absolute",
                  inset: 0,
                  height: 320,
                  width: 256,
                  cursor: "pointer",
                  borderRadius: 12,
                  background: "#fff",
                  padding: 8,
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                  transition: "all 0.5s ease-in-out",
                  transform: `${transform} rotate(${rotation}deg)`,
                  zIndex: isClicked
                    ? 200
                    : isGroupHovered
                    ? 100
                    : isTopCard
                    ? numItems
                    : numItems - stackPosition,
                }}
                onMouseEnter={(e) => {
                  if (isGroupHovered && !isClicked) {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      spreadTransforms[index] + " scale(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isGroupHovered && !isClicked) {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      spreadTransforms[index] || transform;
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <div style={{ height: 256, width: "100%" }}>
                    <img
                      src={item.src}
                      alt={item.name}
                      loading="lazy"
                      draggable={false}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 6,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      height: 48,
                      flex: "1 1 0%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 20,
                        fontStyle: "italic",
                        color: "#1a1a1a",
                        margin: 0,
                      }}
                    >
                      {item.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <h3 style={{ textAlign: "center", fontSize: 24, fontWeight: 700, color: "#fff" }}>
        {title}
      </h3>
    </div>
  );
});

InteractivePhotoStack.displayName = "InteractivePhotoStack";

export { InteractivePhotoStack };
