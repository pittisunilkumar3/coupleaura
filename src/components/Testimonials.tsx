"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah & James",
    role: "Wedding Clients",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    quote:
      "Alex captured our wedding day so beautifully that every time we look at our photos, we relive those magical moments. The attention to emotion and detail is unmatched. We couldn't have asked for a better photographer.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Corporate Client",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    quote:
      "Working with Alex was an incredible experience. The brand photography for our tech company was exactly what we needed — modern, professional, and full of character. Our team headshots have never looked better.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Magazine Editor",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    quote:
      "Alex's editorial work is consistently outstanding. The creative vision and technical mastery combine to produce images that tell compelling stories. We always look forward to collaborating on new projects.",
    rating: 5,
  },
  {
    id: 4,
    name: "David & Lisa",
    role: "Family Portrait",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    quote:
      "Our family portrait session was so much fun! Alex has a natural ability to make everyone feel comfortable and relaxed. The photos captured our family's personality perfectly — candid, warm, and full of joy.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900">
            Client <span className="text-gradient">Stories</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-3xl p-8 md:p-12 relative border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 md:top-12 md:right-12">
                <Quote className="w-12 h-12 text-accent/20" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed mb-8">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-accent/30"
                />
                <div>
                  <div className="font-display font-bold text-gray-900">
                    {testimonials[current].name}
                  </div>
                  <div className="text-sm text-accent">
                    {testimonials[current].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === current
                      ? "w-8 h-2 bg-accent"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
