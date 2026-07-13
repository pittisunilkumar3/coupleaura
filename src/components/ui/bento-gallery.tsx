"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  id: number;
  type: string;
  title: string;
  desc: string;
  url: string;
  span: string;
}

const defaultMedia: MediaItem[] = [
  { id: 1, type: "image", title: "Reception Drone", desc: "Grand celebrations from above", url: "/images/reception-drone.jpg", span: "col-span-2 row-span-4" },
  { id: 2, type: "image", title: "Big Day Candid", desc: "Every emotion on the big day", url: "/images/bigday-candid-photo.jpg", span: "col-span-1 row-span-3" },
  { id: 3, type: "image", title: "Sangeet Drone", desc: "Music and lights from above", url: "/images/sangeet-drone.jpg", span: "col-span-1 row-span-3" },
  { id: 4, type: "image", title: "Pellikuthuru Candid", desc: "Sacred bridal preparation", url: "/images/pellikuthuru-candid-photo.jpg", span: "col-span-1 row-span-4" },
  { id: 5, type: "image", title: "Big Day Traditional", desc: "Customs and traditions", url: "/images/bigday-traditional-photo.jpg", span: "col-span-2 row-span-3" },
  { id: 6, type: "image", title: "Pellikoduku Candid", desc: "The groom's ceremony", url: "/images/pellikoduku-candid-photo.jpg", span: "col-span-1 row-span-3" },
  { id: 7, type: "image", title: "Big Day Drone", desc: "Aerial celebration view", url: "/images/bigday-drone.jpg", span: "col-span-1 row-span-4" },
  { id: 8, type: "image", title: "Documentary Style", desc: "Storytelling through the lens", url: "/images/documentary-style.jpg", span: "col-span-1 row-span-3" },
  { id: 9, type: "image", title: "Candid Photo", desc: "Capturing real emotions", url: "/images/candid-photo.jpg", span: "col-span-2 row-span-3" },
  { id: 10, type: "image", title: "Traditional Photo", desc: "Classic wedding shots", url: "/images/traditional-photo.jpg", span: "col-span-1 row-span-3" },
];

/* Span resolver */
function getSpanStyle(span: string): React.CSSProperties {
  const styles: React.CSSProperties = {};
  const parts = span.split(" ");
  for (const p of parts) {
    if (p.startsWith("col-span-")) {
      const n = parseInt(p.replace("col-span-", ""));
      styles.gridColumn = `span ${n}`;
    }
    if (p.startsWith("row-span-")) {
      const n = parseInt(p.replace("row-span-", ""));
      styles.gridRow = `span ${n}`;
    }
  }
  return styles;
}

/* ===== Media Image ===== */
function MediaImage({ item, style, onClick }: { item: MediaItem; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <img
      src={item.url}
      alt={item.title}
      loading="lazy"
      draggable={false}
      onClick={onClick}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    />
  );
}

/* ===== Gallery Modal ===== */
function GalleryModal({
  selectedItem,
  onClose,
  setSelectedItem,
  mediaItems,
}: {
  selectedItem: MediaItem;
  onClose: () => void;
  setSelectedItem: (item: MediaItem | null) => void;
  mediaItems: MediaItem[];
}) {
  const [dockPos, setDockPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        const idx = mediaItems.findIndex((m) => m.id === selectedItem.id);
        setSelectedItem(mediaItems[(idx + 1) % mediaItems.length]);
      }
      if (e.key === "ArrowLeft") {
        const idx = mediaItems.findIndex((m) => m.id === selectedItem.id);
        setSelectedItem(mediaItems[(idx - 1 + mediaItems.length) % mediaItems.length]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedItem, mediaItems, onClose, setSelectedItem]);

  return (
    <>
      {/* Full-screen backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </motion.button>

        {/* Prev */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            const idx = mediaItems.findIndex((m) => m.id === selectedItem.id);
            setSelectedItem(mediaItems[(idx - 1 + mediaItems.length) % mediaItems.length]);
          }}
          whileHover={{ scale: 1.1 }}
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10001,
            width: 48,
            height: 48,
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </motion.button>

        {/* Next */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            const idx = mediaItems.findIndex((m) => m.id === selectedItem.id);
            setSelectedItem(mediaItems[(idx + 1) % mediaItems.length]);
          }}
          whileHover={{ scale: 1.1 }}
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10001,
            width: 48,
            height: 48,
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </motion.button>

        {/* Main image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItem.id}
            initial={{ y: 20, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "80vw",
              maxHeight: "75vh",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={selectedItem.url}
              alt={selectedItem.title}
              style={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                display: "block",
                background: "#111",
              }}
            />
            <div
              style={{
                padding: "16px 24px",
                background: "rgba(15,15,15,0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 4px",
                }}
              >
                {selectedItem.title}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>{selectedItem.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Draggable dock strip at bottom */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPos.x, y: dockPos.y }}
        onDragEnd={(_, info) => {
          setDockPos((prev) => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }));
        }}
        style={{
          position: "fixed",
          zIndex: 10002,
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          touchAction: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: -8,
            padding: "8px 14px",
            borderRadius: 14,
            background: "rgba(100,160,255,0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(100,160,255,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            cursor: "grab",
          }}
        >
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(item);
              }}
              style={{
                position: "relative",
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                marginLeft: index === 0 ? 0 : -8,
                zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                outline: selectedItem.id === item.id ? "2px solid rgba(255,255,255,0.7)" : "none",
              }}
              initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
              animate={{
                scale: selectedItem.id === item.id ? 1.2 : 1,
                rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                y: selectedItem.id === item.id ? -8 : 0,
              }}
              whileHover={{
                scale: 1.3,
                rotate: 0,
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

/* ===== Main Bento Gallery ===== */
export function InteractiveBentoGallery() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [items, setItems] = useState(defaultMedia);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <div
        style={{
          width: "100%",
          touchAction: "pan-y", // Allow vertical scrolling on mobile
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gridAutoRows: isMobile ? 45 : 55,
            gap: isMobile ? 6 : 10,
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: isMobile ? 8 : 12,
                cursor: "pointer",
                touchAction: "pan-y", // Allow vertical scrolling
                ...getSpanStyle(item.span),
              }}
              onClick={() => setSelectedItem(item)}
              initial={{ y: 30, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
                delay: index * 0.05,
              }}
              whileHover={{ scale: isMobile ? 1 : 1.03 }}
            >
              <MediaImage item={item} />
              {/* Hover overlay - only on desktop */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 14,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                    }}
                  />
                  <h3 style={{ position: "relative", color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>
                    {item.title}
                  </h3>
                  <p style={{ position: "relative", color: "rgba(255,255,255,0.6)", fontSize: 11, margin: 0, lineHeight: 1.3 }}>
                    {item.desc}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <GalleryModal
            selectedItem={selectedItem}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        )}
      </AnimatePresence>
    </>
  );
}
