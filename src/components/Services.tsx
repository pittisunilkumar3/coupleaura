"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Heart,
  Video,
  Sparkles,
  Zap,
  Home,
  Cake,
  Palmtree,
  Drone,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Wedding Photography & Videography",
    description:
      "Capturing the magic of your special day with an artistic, documentary approach. Every tear, every laugh, every moment preserved forever.",
    features: ["Full day coverage", "Candid & traditional mix", "Online gallery", "500+ edited photos"],
    popular: true,
  },
  {
    icon: Camera,
    title: "Pre-Wedding Shoots",
    description:
      "Beautiful pre-wedding shoots at stunning locations. Tell your love story before the big day with cinematic frames.",
    features: ["Location of your choice", "Multiple outfits", "Creative concepts", "Retouched images"],
    popular: false,
  },
  {
    icon: Sparkles,
    title: "Candid Photography",
    description:
      "Authentic, natural moments captured as they unfold. Real emotions, real stories — no posed awkwardness.",
    features: ["Documentary style", "Natural moments", "Storytelling approach", "High-quality edits"],
    popular: false,
  },
  {
    icon: Video,
    title: "Cinematic Wedding Films",
    description:
      "Hollywood-style cinematic films that bring your wedding day to life. Relive every emotion on screen.",
    features: ["4K cinematic video", "Highlight reel", "Full ceremony coverage", "Professional grading"],
    popular: true,
  },
  {
    icon: Zap,
    title: "Instant Reels ⚡",
    description:
      "Same-day delivery reels ready to share on social media. Quick turnaround, stunning quality — get your reels before the event ends!",
    features: ["Same day delivery", "Social media ready", "Trending formats", "Quick turnaround"],
    popular: false,
  },
  {
    icon: Camera,
    title: "Engagement & Reception Coverage",
    description:
      "Complete coverage of your engagement ceremony and reception. Every sparkle, every smile, beautifully documented.",
    features: ["Full event coverage", "Candid & formal shots", "Video coverage", "Same-day previews"],
    popular: false,
  },
  {
    icon: Home,
    title: "House Warming (Griha Pravesh)",
    description:
      "Celebrate your new beginning with beautiful photographs of your Griha Pravesh ceremony. Traditions and joy, captured perfectly.",
    features: ["Ceremony coverage", "Family portraits", "Puja moments", "House highlights"],
    popular: false,
  },
  {
    icon: Cake,
    title: "Birthday & Event Shoots",
    description:
      "From milestone birthdays to special celebrations. Fun, vibrant photography that captures the energy of your event.",
    features: ["Full event coverage", "Candid moments", "Group photos", "Decor details"],
    popular: false,
  },
  {
    icon: Palmtree,
    title: "Half Saree Ceremony",
    description:
      "A cherished tradition beautifully documented. Capturing the elegance, rituals, and joy of this milestone celebration.",
    features: ["Ceremony coverage", "Traditional portraits", "Candid moments", "Family photos"],
    popular: false,
  },
  {
    icon: Drone,
    title: "Drone Shoots",
    description:
      "Stunning aerial photography and videography. Breathtaking views of your venue, event, or special location from above.",
    features: ["Aerial photography", "4K drone video", "Venue overviews", "Creative angles"],
    popular: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 relative bg-gray-50">
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
            Services
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900">
            What We <span className="text-gradient">Offer</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            From weddings to celebrations, we capture every moment with artistry and passion
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all duration-500"
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 right-6 px-4 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-accent" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex items-center justify-center pt-6 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent transition-colors group/btn">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-6">
            Need something custom? Let&apos;s discuss your vision.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-full hover:shadow-xl hover:shadow-accent/25 transition-all duration-300"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
