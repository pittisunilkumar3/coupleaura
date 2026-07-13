"use client";

import React, { useState, useEffect, useRef, useCallback, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

/* ===== Image Modal ===== */
function ImageModal({
  item,
  onClose,
  onNext,
  onPrev,
}: {
  item: GalleryItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Close button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10001,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </motion.button>

      {/* Previous button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10001,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </motion.button>

      {/* Next button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10001,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </motion.button>

      {/* Main image */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "85vh",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src={item.photo.url}
          alt={item.photo.text}
          style={{
            width: "100%",
            maxHeight: "75vh",
            objectFit: "contain",
            display: "block",
            background: "#111",
          }}
        />
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8))",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            {item.common}
          </h3>
          <p style={{ fontSize: 14, color: "#d4a017", margin: "0 0 4px", fontStyle: "italic" }}>
            {item.binomial}
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Photo by: {item.photo.by}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 500, autoRotateSpeed = 0.02, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const dragStartX = useRef(0);
    const dragStartRotation = useRef(0);
    const lastDragX = useRef(0);
    const dragVelocity = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Mobile swipe tracking
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
    const isHorizontalSwipe = useRef(false);
    const swipeDetected = useRef(false);

    // Detect mobile
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        setRotation(scrollProgress * 360);

        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    // Auto-rotate when not scrolling and not dragging
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isDragging && !swipeDetected.current) {
          // Apply drag momentum
          if (Math.abs(dragVelocity.current) > 0.01) {
            setRotation((prev) => prev + dragVelocity.current);
            dragVelocity.current *= 0.95; // friction
          } else {
            dragVelocity.current = 0;
            setRotation((prev) => prev + autoRotateSpeed);
          }
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, isDragging, autoRotateSpeed]);

    // Touch handlers for mobile swipe
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isHorizontalSwipe.current = false;
      swipeDetected.current = false;
      dragVelocity.current = 0;
    }, []);

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        // Determine swipe direction on first significant movement
        if (!isHorizontalSwipe.current && !swipeDetected.current) {
          if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
            isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
            if (isHorizontalSwipe.current) {
              swipeDetected.current = true;
              setIsDragging(true);
              dragStartX.current = touchStartRef.current.x;
              lastDragX.current = touchStartRef.current.x;
              dragStartRotation.current = rotation;
            }
            // If vertical swipe detected, let the browser handle scrolling
          }
        }

        // Only handle horizontal swipe - let vertical pass through
        if (isHorizontalSwipe.current && swipeDetected.current) {
          // Don't call e.preventDefault() - let browser handle both
          const sensitivity = 0.5;
          const newRotation = dragStartRotation.current + deltaX * sensitivity;
          setRotation(newRotation);

          // Track velocity for momentum
          dragVelocity.current = (touch.clientX - lastDragX.current) * sensitivity;
          lastDragX.current = touch.clientX;
        }
        // If vertical swipe, do nothing - browser will scroll naturally
      },
      [rotation]
    );

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
      // Keep momentum going after swipe ends
      if (isHorizontalSwipe.current) {
        swipeDetected.current = false;
      }
      isHorizontalSwipe.current = false;
    }, []);

    // Mouse drag handlers (desktop)
    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (e.button !== 0 || isMobile) return;
        setIsDragging(true);
        dragStartX.current = e.clientX;
        lastDragX.current = e.clientX;
        dragStartRotation.current = rotation;
        dragVelocity.current = 0;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      },
      [rotation, isMobile]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging || isMobile) return;
        const deltaX = e.clientX - dragStartX.current;
        const sensitivity = 0.4;
        const newRotation = dragStartRotation.current + deltaX * sensitivity;
        setRotation(newRotation);

        // Track velocity for momentum
        dragVelocity.current = (e.clientX - lastDragX.current) * sensitivity;
        lastDragX.current = e.clientX;
      },
      [isDragging, isMobile]
    );

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle image click
    const handleImageClick = useCallback(
      (item: GalleryItem, index: number) => {
        // Only open modal if it wasn't a swipe gesture
        if (!swipeDetected.current) {
          setSelectedItem(item);
          setSelectedIndex(index);
        }
      },
      []
    );

    // Navigate modal
    const handleNext = useCallback(() => {
      const nextIndex = (selectedIndex + 1) % items.length;
      setSelectedIndex(nextIndex);
      setSelectedItem(items[nextIndex]);
    }, [selectedIndex, items]);

    const handlePrev = useCallback(() => {
      const prevIndex = (selectedIndex - 1 + items.length) % items.length;
      setSelectedIndex(prevIndex);
      setSelectedItem(items[prevIndex]);
    }, [selectedIndex, items]);

    const anglePerItem = 360 / items.length;

    return (
      <>
        <div
          ref={(node) => {
            (containerRef as any).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as any).current = node;
          }}
          role="region"
          aria-label="Circular 3D Gallery"
          className={cn("relative w-full h-full flex items-center justify-center", className)}
          style={{
            perspective: "2000px",
            cursor: isMobile ? "grab" : isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "pan-y", // Allow vertical scroll, we handle horizontal manually
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          {...props}
        >
          <div
            className="relative w-full h-full"
            style={{
              transform: `rotateY(${rotation}deg)`,
              transformStyle: "preserve-3d",
              transition: isDragging ? "none" : undefined,
            }}
          >
            {items.map((item, i) => {
              const itemAngle = i * anglePerItem;
              const totalRotation = rotation % 360;
              const relativeAngle = (itemAngle + totalRotation + 360) % 360;
              const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
              const opacity = Math.max(0.3, 1 - normalizedAngle / 180);
              const scale = 1 - (normalizedAngle / 360) * 0.15;

              return (
                <div
                  key={item.photo.url}
                  role="group"
                  aria-label={item.common}
                  className="absolute w-[280px] h-[370px]"
                  style={{
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
                    left: "50%",
                    top: "50%",
                    marginLeft: "-140px",
                    marginTop: "-185px",
                    opacity,
                    transition: isDragging ? "none" : "opacity 0.3s linear, transform 0.3s linear",
                  }}
                >
                  <div
                    onClick={() => handleImageClick(item, i)}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow:
                        normalizedAngle < 60
                          ? "0 25px 60px rgba(212,160,23,0.2), 0 10px 30px rgba(0,0,0,0.4)"
                          : "0 20px 50px rgba(0,0,0,0.3)",
                      border:
                        normalizedAngle < 60
                          ? "1px solid rgba(212,160,23,0.3)"
                          : "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(12px)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 30px 70px rgba(212,160,23,0.3), 0 15px 40px rgba(0,0,0,0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        normalizedAngle < 60
                          ? "0 25px 60px rgba(212,160,23,0.2), 0 10px 30px rgba(0,0,0,0.4)"
                          : "0 20px 50px rgba(0,0,0,0.3)";
                    }}
                  >
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      loading="lazy"
                      draggable={false}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: item.photo.pos || "center",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        padding: "20px 16px",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
                        color: "#fff",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          margin: "0 0 4px",
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        {item.common}
                      </h2>
                      <em style={{ fontSize: 13, opacity: 0.8, color: "#d4a017" }}>{item.binomial}</em>
                      <p style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
                        Photo by: {item.photo.by}
                      </p>
                    </div>

                    {/* View icon overlay - desktop only */}
                    {!isMobile && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.3)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          pointerEvents: "none",
                        }}
                        className="view-overlay"
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "rgba(212,160,23,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                          >
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipe indicator for mobile */}
        {isMobile && (
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "10px 20px",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.1)",
              zIndex: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
              Swipe to rotate
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedItem && (
            <ImageModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </AnimatePresence>

        <style jsx>{`
          div:hover .view-overlay {
            opacity: 1 !important;
          }
        `}</style>
      </>
    );
  }
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
