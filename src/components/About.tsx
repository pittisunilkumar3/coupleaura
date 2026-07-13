"use client";

import { motion } from "framer-motion";
import { Camera, Award, Heart, Globe } from "lucide-react";

const skills = [
  { name: "Portrait Photography", level: 98 },
  { name: "Landscape Photography", level: 95 },
  { name: "Wedding Photography", level: 97 },
  { name: "Photo Editing", level: 92 },
];

const highlights = [
  {
    icon: Camera,
    title: "Creative Vision",
    description:
      "I see the world differently. Every shadow, every ray of light tells a story I'm compelled to capture.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description:
      "Recognized internationally for excellence in photography with over 15 prestigious awards.",
  },
  {
    icon: Heart,
    title: "Passionate",
    description:
      "Photography isn't just my profession — it's my life's passion. I pour my heart into every shot.",
  },
  {
    icon: Globe,
    title: "Worldwide",
    description:
      "Available for projects worldwide. I've shot in over 30 countries across 5 continents.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                  alt="Photographer at work"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -right-4 md:-right-8 bg-white rounded-2xl p-6 max-w-[240px] shadow-lg border border-gray-100"
              >
                <div className="text-4xl font-display font-bold text-accent">
                  12+
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Years of capturing life&apos;s most beautiful moments
                </div>
              </motion.div>

              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-accent/30 rounded-br-2xl" />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
              About Me
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold leading-tight text-gray-900">
              The Artist Behind{" "}
              <span className="text-gradient">the Lens</span>
            </h2>
            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              I&apos;m Alex Morgan, a passionate photographer based in India
              City. For over 12 years, I&apos;ve been dedicated to the art of
              visual storytelling, capturing the essence of every moment with
              authenticity and creativity.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              My philosophy is simple: every person, every place, every moment
              has a unique beauty. My job is to find it, frame it, and preserve
              it forever. Whether it&apos;s the tender glance between newlyweds
              or the dramatic silhouette of a mountain at sunset, I strive to
              create images that move people.
            </p>

            {/* Skills */}
            <div className="mt-10 space-y-5">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {skill.name}
                    </span>
                    <span className="text-sm text-accent">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: 0.2 + index * 0.1,
                        ease: "easeOut",
                      }}
                      className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Signature */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="font-display text-2xl text-accent italic">
                Alex Morgan
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Professional Photographer
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 text-center group hover:bg-white hover:shadow-lg hover:border-accent/30 border border-transparent transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
