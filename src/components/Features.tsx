"use client";

import { motion } from "framer-motion";
import { Eye, Palette, Aperture, Layers, Sun, Focus } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Artistic Vision",
    description:
      "Every photograph is composed with intention, balancing light, shadow, and emotion to create visual poetry.",
  },
  {
    icon: Palette,
    title: "Color Mastery",
    description:
      "Expert color grading and tonal adjustments that give each image a distinctive, cinematic quality.",
  },
  {
    icon: Aperture,
    title: "Technical Excellence",
    description:
      "Precision in every exposure. Mastering the technical craft to deliver flawless images every time.",
  },
  {
    icon: Layers,
    title: "Storytelling",
    description:
      "Weaving narratives through imagery — each photo sequence tells a complete, compelling story.",
  },
  {
    icon: Sun,
    title: "Light Whisperer",
    description:
      "Harnessing natural and artificial light to sculpt scenes that evoke deep emotional responses.",
  },
  {
    icon: Focus,
    title: "Detail Oriented",
    description:
      "Nothing escapes our lens. From the grandest vista to the subtlest expression, every detail matters.",
  },
];

export default function Features() {
  return (
    <section className="py-24 md:py-32 relative bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            Why Choose Me
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900">
            The <span className="text-gradient">Difference</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            What sets my work apart and why clients trust me with their most
            important moments
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all duration-500">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-display font-light text-gray-300 italic max-w-3xl mx-auto">
            &ldquo;Photography is the art of frozen time... the ability to store
            emotion and feelings within a frame.&rdquo;
          </blockquote>
          <p className="mt-4 text-accent text-sm">— Alex Morgan</p>
        </motion.div>
      </div>
    </section>
  );
}
