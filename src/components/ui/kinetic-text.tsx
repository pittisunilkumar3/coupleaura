"use client";

import React, { useEffect, useRef, useState } from "react";

interface KineticTextProps {
  words: string[];
  className?: string;
  style?: React.CSSProperties;
  interval?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function KineticText({
  words,
  className,
  style,
  interval = 10000,
  tag: Tag = "span",
}: KineticTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let animTimeout: ReturnType<typeof setTimeout>;
    let cycleTimeout: ReturnType<typeof setTimeout>;
    let mounted = true;

    function animateWord() {
      if (!mounted || !el) return;
      const word = words[indexRef.current];
      el.innerHTML = "";

      const chars = word.split("").map((char, i) => {
        const span = document.createElement("span");
        span.className = "kinetic-char kinetic-char-cycling";
        span.textContent = char === " " ? "\u00A0" : char;

        const fromX = (Math.random() - 0.5) * 300;
        const fromY = (Math.random() - 0.5) * 250;
        const fromZ = (Math.random() - 0.5) * 150;
        const fromRotX = (Math.random() - 0.5) * 120;
        const fromRotY = (Math.random() - 0.5) * 120;

        span.style.setProperty("--kf-from", `translate3d(${fromX}px,${fromY}px,${fromZ}px) rotateX(${fromRotX}deg) rotateY(${fromRotY}deg)`);
        span.style.animationName = "kinetic-fly-in";
        span.style.animationDelay = `${i * 0.08}s`;
        span.style.animationPlayState = "running";

        el.appendChild(span);
        return span;
      });

      // Total time for all letters to fly in
      const totalFlyIn = chars.length * 80 + 1000; // stagger + animation

      // Fly-out starts after word has been readable for a long time
      const holdTime = interval - totalFlyIn - 1500; // 1.5s reserved for fly-out

      animTimeout = setTimeout(() => {
        if (!mounted) return;
        chars.forEach((span, i) => {
          const toX = (Math.random() - 0.5) * 300;
          const toY = (Math.random() - 0.5) * 250;
          const toZ = (Math.random() - 0.5) * 150;
          const toRotX = (Math.random() - 0.5) * 120;
          const toRotY = (Math.random() - 0.5) * 120;

          span.style.setProperty("--kf-to", `translate3d(${toX}px,${toY}px,${toZ}px) rotateX(${toRotX}deg) rotateY(${toRotY}deg)`);
          span.style.animationName = "kinetic-fly-out";
          span.style.animationDelay = `${i * 0.04}s`;
        });
      }, totalFlyIn + Math.max(holdTime, 5000));

      cycleTimeout = setTimeout(() => {
        if (!mounted) return;
        indexRef.current = (indexRef.current + 1) % words.length;
        animateWord();
      }, interval);
    }

    animateWord();

    return () => {
      mounted = false;
      clearTimeout(animTimeout);
      clearTimeout(cycleTimeout);
    };
  }, [words, interval]);

  return (
    <Tag ref={textRef as React.RefObject<never>} className={className} style={{ ...style, perspective: 800, display: "inline-block" }} />
  );
}

/* ===== Single-word kinetic (no cycling, one-time fly-in on scroll) ===== */
export function KineticOnce({
  text,
  className,
  style,
  tag: Tag = "span",
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !triggered) return;
    el.textContent = text;
  }, [triggered, text]);

  return (
    <Tag ref={ref as React.RefObject<never>} className={className} style={{ ...style, perspective: 800, display: "inline-block" }} />
  );
}
