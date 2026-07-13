"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  previousX: number;
  previousY: number;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  shouldFadeQuickly: boolean;
  rotation: number;
  turbulence: number;
};

export function VaporizeLoader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [phase, setPhase] = useState<"running" | "fading" | "gone">("running");
  const [showSkip, setShowSkip] = useState(true); // Show skip button immediately

  const run = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Mobile detection for optimization
    const isMobile = w < 768;
    
    // Calculate font size
    const text = "COUPLE AURA";
    let fontSize = isMobile ? Math.min(w * 0.15, 120) : Math.min(w * 0.22, 320);
    ctx.font = `900 ${fontSize}px Georgia, serif`;
    while (ctx.measureText(text).width > (isMobile ? w * 0.9 : w * 0.85) && fontSize > 30) {
      fontSize -= 2;
      ctx.font = `900 ${fontSize}px Georgia, serif`;
    }

    // Draw text and sample pixels
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgb(201, 165, 92)";
    ctx.font = `900 ${fontSize}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const particles: Particle[] = [];
    // Larger step on mobile = fewer particles = faster
    const step = isMobile ? Math.max(3, Math.round(fontSize / 25)) : Math.max(1, Math.round(fontSize / 50));

    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        const idx = (py * w + px) * 4;
        const alpha = data[idx + 3];
        if (alpha > 20) {
          particles.push({
            x: px, y: py, originalX: px, originalY: py,
            previousX: px, previousY: py,
            opacity: alpha / 255, originalAlpha: alpha / 255,
            velocityX: 0, velocityY: 0,
            angle: Math.random() * Math.PI * 2, speed: 0,
            shouldFadeQuickly: Math.random() > 0.5,
            rotation: Math.random() * Math.PI * 2,
            turbulence: Math.random() * 0.3,
          });
        }
      }
    }

    ctx.clearRect(0, 0, w, h);

    // Animation phases - much faster on mobile
    let phase: "forming" | "holding" | "vaporizing" | "done" = "forming";
    let fadeOpacity = 0;
    let vaporizeProgress = 0;
    let rafId: number;
    let lastTime = performance.now();

    const drawGlow = (x: number, y: number, radius: number, color: string) => {
      if (isMobile) return; // Skip glow on mobile for performance
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(201, 165, 92, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      ctx.clearRect(0, 0, w, h);

      if (phase === "forming") {
        fadeOpacity += dt * (isMobile ? 4 : 2);
        const opacity = Math.min(1, fadeOpacity);
        particles.forEach((p) => {
          p.opacity = opacity * p.originalAlpha;
          ctx.fillStyle = `rgba(212,160,23,${p.opacity})`;
          ctx.fillRect(p.x, p.y, step, step);
          if (opacity > 0.6 && !isMobile) drawGlow(p.x, p.y, step + 1, `rgba(212,160,23,${p.opacity * 0.25})`);
        });
        if (opacity >= 1) phase = "holding";
      } else if (phase === "holding") {
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(212,160,23,${p.originalAlpha})`;
          ctx.fillRect(p.x, p.y, step, step);
        });
      } else if (phase === "vaporizing") {
        vaporizeProgress += dt * (isMobile ? 200 : 100);
        const progress = Math.min(100, vaporizeProgress);
        let allGone = true;

        particles.forEach((p) => {
          if (p.originalX <= (w * progress) / 100) {
            if (p.speed === 0) {
              p.speed = Math.random() * (isMobile ? 10 : 7) + 2;
              p.angle = Math.random() * Math.PI * 2;
              p.velocityX = Math.cos(p.angle) * p.speed;
              p.velocityY = Math.sin(p.angle) * p.speed;
            }
            p.velocityY += 0.04;
            p.velocityX *= 0.97;
            p.velocityY *= 0.97;
            p.velocityX += (Math.random() - 0.5) * p.turbulence;
            p.velocityY += (Math.random() - 0.5) * p.turbulence;
            p.previousX = p.x; p.previousY = p.y;
            p.x += p.velocityX; p.y += p.velocityY;

            if (p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 80) p.opacity = 0;
            p.opacity *= p.shouldFadeQuickly ? 0.90 : 0.95;

            if (p.opacity > 0.01) {
              allGone = false;
              if (!isMobile) {
                ctx.beginPath();
                ctx.moveTo(p.previousX, p.previousY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(212,160,23,${p.opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
              ctx.fillStyle = `rgba(212,160,23,${p.opacity})`;
              ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
            }
          } else {
            allGone = false;
            ctx.fillStyle = `rgba(212,160,23,${p.originalAlpha})`;
            ctx.fillRect(p.x, p.y, step, step);
          }
        });

        if (progress >= 100 && allGone) {
          phase = "done";
          setPhase("fading");
          setTimeout(() => {
            setPhase("gone");
            onCompleteRef.current();
          }, 300);
          return;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // Much shorter timings - fast everywhere
    const holdTime = isMobile ? 300 : 800;
    const vaporizeTimer = setTimeout(() => {
      phase = "vaporizing";
      vaporizeProgress = 0;
    }, holdTime);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(vaporizeTimer);
    };
  }, []);

  useEffect(() => {
    const cleanup = run();
    return () => { if (cleanup) cleanup(); };
  }, [run]);

  const handleSkip = () => {
    setPhase("fading");
    setTimeout(() => {
      setPhase("gone");
      onCompleteRef.current();
    }, 300);
  };

  if (phase === "gone") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0a0a0a",
        transition: "opacity 0.4s ease",
        opacity: phase === "fading" ? 0 : 1,
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      
      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            padding: "10px 24px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 50,
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
        >
          Skip →
        </button>
      )}
    </div>
  );
}
