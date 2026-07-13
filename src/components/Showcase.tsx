"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const x2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const images1 = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80",
  ];

  const images2 = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80",
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 overflow-hidden bg-white">
      {/* Row 1 */}
      <motion.div style={{ x: x1 }} className="flex gap-4 mb-4">
        {[...images1, ...images1].map((img, i) => (
          <div
            key={`row1-${i}`}
            className="flex-shrink-0 w-64 md:w-80 h-48 md:h-56 rounded-xl overflow-hidden group shadow-sm"
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover image-hover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>

      {/* Row 2 */}
      <motion.div style={{ x: x2 }} className="flex gap-4">
        {[...images2, ...images2].map((img, i) => (
          <div
            key={`row2-${i}`}
            className="flex-shrink-0 w-64 md:w-80 h-48 md:h-56 rounded-xl overflow-hidden group shadow-sm"
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover image-hover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
