"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const services = [
  "Wedding Photography & Videography",
  "Pre-Wedding Shoots",
  "Cinematic Wedding Films",
  "Instant Reels ⚡",
  "Engagement & Reception",
  "House Warming",
  "Birthday & Event Shoots",
  "Half Saree Ceremony",
  "Drone Shoots",
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 border-b border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
              Stay Inspired
            </h3>
            <p className="text-gray-400 mt-2">
              Subscribe to receive photography tips, behind-the-scenes content,
              and exclusive offers.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition-all"
            />
            <button className="px-6 py-3.5 bg-accent text-white font-semibold rounded-full hover:bg-accent-light transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="#home" className="flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="COUPLE AURA Logo"
                width={70}
                height={70}
                style={{ height: 70, width: 70, objectFit: "contain" }}
              />
            </Link>
            <p className="mt-6 text-gray-400 text-sm leading-relaxed">
              Capturing life&apos;s most precious moments with artistry and
              passion. Available worldwide.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="mailto:coupleaura1photography@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" /> coupleaura1photography@gmail.com
              </a>
              <a
                href="tel:+917893279292"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" /> 7893279292
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Flat no 104, Sri Balaji Towers, Kavuri Hills, Jubilee Hills, Hyderabad, Telangana 500018</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-white mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm text-gray-400 hover:text-accent transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-display font-bold text-white mb-6">
              Studio Hours
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-gray-300">9AM - 7PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-gray-300">10AM - 5PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-gray-300">By Appointment</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-xs text-accent">
                ✓ Available for weekend shoots and destination projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 COUPLE AURA Photography. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent fill-accent" /> by
            Devmitra
          </p>
        </div>
      </div>

      {/* Back to Top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-shadow z-50"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
