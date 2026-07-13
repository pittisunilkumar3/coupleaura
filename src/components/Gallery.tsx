"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const categories = [
  "All",
  "Portrait",
  "Landscape",
  "Wedding",
  "Street",
  "Architecture",
];

const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    title: "Golden Hour Portrait",
    category: "Portrait",
    aspect: "3/4",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    title: "Mountain Serenity",
    category: "Landscape",
    aspect: "16/9",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    title: "Eternal Love",
    category: "Wedding",
    aspect: "3/4",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    title: "Urban Nights",
    category: "Street",
    aspect: "16/9",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    title: "Natural Beauty",
    category: "Portrait",
    aspect: "3/4",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=800&q=80",
    title: "Modern Lines",
    category: "Architecture",
    aspect: "4/3",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    title: "Alpine Dawn",
    category: "Landscape",
    aspect: "16/9",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    title: "First Dance",
    category: "Wedding",
    aspect: "3/4",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80",
    title: "City Lights",
    category: "Street",
    aspect: "4/3",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    title: "Character Study",
    category: "Portrait",
    aspect: "3/4",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    title: "Concrete Jungle",
    category: "Architecture",
    aspect: "16/9",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    title: "Valley of Dreams",
    category: "Landscape",
    aspect: "16/9",
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const currentIndex =
    selectedPhoto !== null
      ? filteredPhotos.findIndex((p) => p.id === selectedPhoto)
      : -1;

  const goToNext = () => {
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1].id);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1].id);
    }
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 relative bg-gray-50">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            Portfolio
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900">
            Selected <span className="text-gradient">Works</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            A curated collection of my finest work across various genres of
            photography
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Photo Grid - Masonry */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div layout className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500"
                onClick={() => setSelectedPhoto(photo.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full object-cover image-hover"
                    style={{ aspectRatio: photo.aspect }}
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs uppercase tracking-wider text-accent font-medium">
                      {photo.category}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white mt-1">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {currentIndex < filteredPhotos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedPhoto}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredPhotos.find((p) => p.id === selectedPhoto)?.src}
                alt=""
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <span className="text-xs uppercase tracking-wider text-accent">
                  {filteredPhotos.find((p) => p.id === selectedPhoto)?.category}
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-1">
                  {filteredPhotos.find((p) => p.id === selectedPhoto)?.title}
                </h3>
                <p className="text-sm text-white/50 mt-1">
                  {currentIndex + 1} / {filteredPhotos.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
