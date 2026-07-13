"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleElementHover = () => {
      const hoverables = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [tabindex]'
      );

      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    handleElementHover();
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <div
        className="cursor-dot hidden lg:block"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          opacity: isVisible ? 1 : 0,
          transform: isHovering ? "scale(0)" : "scale(1)",
          transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
        }}
      />
      {/* Ring */}
      <div
        className="cursor-ring hidden lg:block"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})`,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovering
            ? "rgba(184, 134, 11, 0.8)"
            : "rgba(184, 134, 11, 0.3)",
          transition:
            "transform 0.3s ease-out, opacity 0.3s ease-out, border-color 0.3s ease-out",
        }}
      />
    </>
  );
}
