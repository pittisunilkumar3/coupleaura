"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxDividerProps {
  imageUrl: string;
  quote?: string;
  author?: string;
  height?: string;
}

export default function ParallaxDivider({
  imageUrl,
  quote,
  author,
  height = "h-[400px]",
}: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={ref} className={`relative ${height} overflow-hidden`}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {quote && (
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display font-light text-white italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </blockquote>
            {author && (
              <p className="mt-6 text-accent-light text-sm uppercase tracking-wider">
                — {author}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
