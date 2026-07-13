"use client";

import { useState, useEffect } from "react";
import {
  InteractivePhotoStack,
} from "@/components/ui/photo-stack";
import { MasonryGallery } from "@/components/ui/masonry-gallery";
import { CircularFlipGallery } from "@/components/ui/circular-flip-gallery";
import { ExpandingGallery } from "@/components/ui/expanding-gallery";
import { InteractiveBentoGallery } from "@/components/ui/bento-gallery";
import { CircularGallery } from "@/components/ui/circular-gallery";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { ImageGallery } from "@/components/ui/image-gallery";
import { KineticText, KineticOnce } from "@/components/ui/kinetic-text";
import { VaporizeLoader } from "@/components/ui/vaporize-loader";
import { AnimatedTestimonialGrid } from "@/components/ui/animated-testimonials";
import { FooterSpinningLogos } from "@/components/ui/footer-spinning-logos";

const photos = [
  { id: 1, src: "/images/portrait1.jpg", title: "Golden Hour Portrait", category: "Portrait", tall: true },
  { id: 2, src: "/images/landscape2.jpg", title: "Mountain Serenity", category: "Landscape" },
  { id: 3, src: "/images/wedding1.jpg", title: "Eternal Love", category: "Wedding" },
  { id: 4, src: "/images/street1.jpg", title: "Urban Nights", category: "Street", tall: true },
  { id: 5, src: "/images/portrait2.jpg", title: "Natural Beauty", category: "Portrait" },
  { id: 7, src: "/images/landscape1.jpg", title: "Alpine Dawn", category: "Landscape", tall: true },
  { id: 8, src: "/images/wedding2.jpg", title: "First Dance", category: "Wedding" },
  { id: 9, src: "/images/street2.jpg", title: "City Lights", category: "Street" },
];

const categories = ["All", "Portrait", "Landscape", "Wedding", "Street", "Architecture"];

const services = [
  { icon: "💍", title: "Wedding Photography & Videography", desc: "Capturing every ritual, emotion, and celebration of your big day with cinematic brilliance and timeless artistry.", popular: true },
  { icon: "📸", title: "Pre-Wedding Shoots", desc: "Romantic, creative, and fun — we craft beautiful pre-wedding stories at stunning locations that reflect your love." },
  { icon: "✨", title: "Candid Photography", desc: "Real emotions, unscripted moments. We document the laughter, tears, and joy as they naturally unfold." },
  { icon: "🎬", title: "Cinematic Wedding Films", desc: "Hollywood-style wedding films with dramatic storytelling, breathtaking transitions, and soul-stirring music." },
  { icon: "⚡", title: "Instant Reels (Same Day Delivery ⚡)", desc: "Get stunning highlight reels delivered on your wedding day itself — perfect for sharing on social media instantly!" },
  { icon: "💍", title: "Engagement & Reception Coverage", desc: "From ring ceremonies to grand receptions, we capture every sparkle and smile of your celebration." },
  { icon: "🏠", title: "House Warming (Griha Pravesh)", desc: "Preserving the sacred traditions and joyful moments of your new beginning with family and loved ones." },
  { icon: "🎂", title: "Birthday & Event Shoots", desc: "Milestone birthdays, anniversaries, corporate events — every celebration deserves to be remembered beautifully." },
  { icon: "🌸", title: "Half Saree Ceremony", desc: "Celebrating this beautiful milestone with vibrant, elegant captures that honour tradition and youth." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10 7 7"/><path d="m10 14-3 3"/><path d="m14 10 3-3"/><path d="m14 14 3 3"/><path d="M14.205 4.139a4 4 0 1 1 5.439 5.863"/><path d="M19.637 14a4 4 0 1 1-5.432 5.868"/><path d="M4.367 10a4 4 0 1 1 5.438-5.862"/><path d="M9.795 19.862a4 4 0 1 1-5.429-5.873"/><rect x="10" y="8" width="4" height="8" rx="1"/></svg>, title: "Drone Shoots", desc: "Stunning aerial perspectives that add a grand, cinematic scale to your wedding and event coverage." },
  { icon: "🏢", title: "Corporate Shoots", desc: "Professional photography and videography for corporate events, brand campaigns, team profiles, and business promotions." },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem("coupleAura_animationShown");
    if (!hasSeenAnimation) {
      sessionStorage.setItem("coupleAura_animationShown", "true");
      setLoading(true);
    }
  }, []);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setSubmitError(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ===== VAPORIZE LOADER ===== */}
      {loading && <VaporizeLoader onComplete={() => setLoading(false)} />}

      {/* ===== MAIN SITE ===== */}
      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.6s ease" }}>

      {/* ==================== HERO ==================== */}
      <section className="hero">
        {/* Full background gallery */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <ImageGallery />
        </div>

        {/* Dark overlay for text readability */}
        <div className="hero-overlay" />

        {/* Text overlay on top */}
        <div style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 20px",
          marginTop: "-60px",
          pointerEvents: "none",
        }}
        className="hero-text-overlay"
        >
          <div style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <img
              src="/images/logo.png"
              alt="COUPLE AURA"
              style={{
                height: 180,
                width: 180,
                objectFit: "contain",
                margin: "0 auto 8px",
                display: "block",
              }}
            />
            <h1 className="hero-title" style={{ marginBottom: 40 }}>
              Capturing <span style={{ WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset', background: 'none', color: '#fff' }}>Timeless Beauty</span>
            </h1>
            <div className="hero-buttons">
              <a href="#portfolio" className="btn-accent">
                View Portfolio
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
              </a>
              <button className="btn-outline" onClick={() => setShowVideo(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Our Story
              </button>
              <a href="/build-quote" className="btn-accent" style={{ background: "rgba(212,160,23,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(212,160,23,0.4)", color: "#d4a017" }}>
                Build Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* ==================== PORTFOLIO ==================== */}
      <section id="portfolio" style={{ padding: "80px 0 0" }}>
        <div className="section-header" style={{ padding: "0 40px", marginBottom: 40 }}>
          <KineticOnce text="Portfolio" tag="div" className="section-label" />
          <h2 className="section-title"><KineticOnce text="Selected Works" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="A curated collection of my finest work across various genres of photography" tag="p" className="section-desc" style={{ fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <MasonryGallery />
      </section>

      {/* ==================== CIRCULAR FLIP GALLERY ==================== */}
      <section style={{ background: "#0a0a0a", padding: "60px 40px" }}>
        <div className="section-header">
          <KineticOnce text="Gallery" tag="div" className="section-label" style={{ color: "#d4a017" }} />
          <h2 className="section-title" style={{ color: "#fff" }}><KineticOnce text="Photo Circle" tag="span" style={{ color: "#fff", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="Hover cards to flip and reveal details" tag="p" className="section-desc" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <CircularFlipGallery />
      </section>

      {/* ==================== INFINITE SCROLL ==================== */}
      <section style={{ background: "#0a0a0a" }}>
        <div style={{ textAlign: "center", paddingTop: 60, paddingBottom: 20 }}>
          <KineticOnce text="Showcase" tag="div" className="section-label" style={{ color: "#d4a017" }} />
          <h2 className="section-title" style={{ color: "#fff" }}><KineticOnce text="Nature Gallery" tag="span" style={{ color: "#fff", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="Hover to pause the scroll" tag="p" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8 }} />
        </div>
        <InfiniteScroll />
      </section>

      {/* ==================== PHOTO DIVIDER ==================== */}
      <div className="photo-divider">
        <img src="/images/hero1.jpg" alt="" loading="lazy" />
        <div className="photo-divider-overlay">
          <div className="photo-divider-quote">
            &ldquo;<KineticOnce text="Every family has a story, and we capture the emotions that words cannot express" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", color: "inherit" }} />&rdquo;
            <span>— Couple Aura</span>
          </div>
        </div>
      </div>

      {/* ==================== BENTO GALLERY (HIDDEN) ==================== */}
      {/*
      <section className="section" style={{ padding: "80px 0 0" }}>
        <div className="section-header" style={{ padding: "0 40px", marginBottom: 40 }}>
          <KineticOnce text="Gallery" tag="div" className="section-label" />
          <h2 className="section-title"><KineticOnce text="Creative Bento" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="Click to view" tag="p" className="section-desc" style={{ fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <InteractiveBentoGallery />
      </section>
      */}

      {/* ==================== 3D CIRCULAR GALLERY (HIDDEN) ==================== */}
      {/*
      <section style={{ width: "100%", background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)" }}>
        <div style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ textAlign: "center", position: "absolute", top: 40, zIndex: 10 }}>
            <KineticOnce text="Gallery" tag="div" className="section-label" style={{ color: "#d4a017" }} />
            <h2 className="section-title" style={{ color: "#fff" }}><KineticOnce text="3D Carousel" tag="span" style={{ color: "#fff", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
            <KineticOnce text="Scroll to rotate" tag="p" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8 }} />
          </div>
          <div style={{ width: "100%", height: "100%" }}>
            <CircularGallery
              items={[
                { common: "Big Day Drone", binomial: "Aerial Photography", photo: { url: "/images/bigday-drone.jpg", text: "Aerial celebration", by: "Couple Aura" } },
                { common: "Sangeet Drone", binomial: "Aerial Photography", photo: { url: "/images/sangeet-drone.jpg", text: "Sangeet from above", by: "Couple Aura" } },
                { common: "Reception Drone", binomial: "Aerial Photography", photo: { url: "/images/reception-drone.jpg", text: "Grand aerial view", by: "Couple Aura" } },
                { common: "Big Day Candid", binomial: "Candid Photography", photo: { url: "/images/bigday-candid-photo.jpg", text: "Big day emotions", by: "Couple Aura" } },
                { common: "Big Day Traditional", binomial: "Traditional", photo: { url: "/images/bigday-traditional-photo.jpg", text: "Traditional customs", by: "Couple Aura" } },
                { common: "Documentary", binomial: "Documentary Style", photo: { url: "/images/documentary-style.jpg", text: "Storytelling", by: "Couple Aura" } },
                { common: "Pellikuthuru", binomial: "Candid Photography", photo: { url: "/images/pellikuthuru-candid-photo.jpg", text: "Bridal preparation", by: "Couple Aura" } },
                { common: "Pellikoduku", binomial: "Candid Photography", photo: { url: "/images/pellikoduku-candid-photo.jpg", text: "Groom's ceremony", by: "Couple Aura" } },
              ]}
              radius={500}
              autoRotateSpeed={0.015}
            />
          </div>
        </div>
      </section>
      */}

      {/* ==================== ABOUT (HIDDEN) ==================== */}
      {/*
      <section id="about" className="section section-alt">
        <div className="about-grid">
          <div className="about-img-wrap">
            <img src="/images/candid-photo.jpg" alt="Photographer" className="about-img" loading="lazy" />
            <div className="about-img-card">
              <div className="about-img-card-num">12+</div>
              <div className="about-img-card-txt">Years of Experience</div>
            </div>
          </div>
          <div className="about-content">
            <KineticOnce text="About Me" tag="div" className="section-label" />
            <h3><KineticOnce text="The Artist Behind the Lens" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h3>
            <p>I&apos;m Alex Morgan, a passionate photographer based in India. For over 12 years, I&apos;ve been dedicated to the art of visual storytelling.</p>
            <p>My philosophy is simple: every person, every place, every moment has a unique beauty. My job is to find it, frame it, and preserve it forever.</p>
            <div className="skills">
              {[["Portrait Photography", 98], ["Landscape Photography", 95], ["Wedding Photography", 97], ["Photo Editing", 92]].map(([name, val]) => (
                <div key={name} className="skill">
                  <div className="skill-header"><span className="skill-name">{name}</span><span className="skill-value">{val}%</span></div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: `${val}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* ==================== INTERACTIVE PHOTO STACK / OUR TEAM (HIDDEN) ==================== */}
      {/*
      <section className="section" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", color: "#fff" }}>
        <div className="section-header">
          <KineticOnce text="Showcase" tag="div" className="section-label" style={{ color: "#d4a017" }} />
          <h2 className="section-title" style={{ color: "#fff" }}><KineticOnce text="Our Team" tag="span" style={{ color: "#fff", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="Hover to spread, click to bring to front" tag="p" className="section-desc" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <InteractivePhotoStack
          items={[
            { src: "/images/candid-moments.jpg", name: "Candid" },
            { src: "/images/wedding1.jpg", name: "Studio" },
            { src: "/images/wedding2.jpg", name: "Traditional" },
            { src: "/images/documentary-style.jpg", name: "Documentary" },
            { src: "/images/traditional-photo.jpg", name: "Wedding" },
          ]}
          title={<>Our Creative Team</>}
        />
      </section>
      */}

      {/* ==================== SERVICES ==================== */}
      <section id="services" className="section">
        <div className="section-header">
          <KineticOnce text="Services" tag="div" className="section-label" />
          <h2 className="section-title"><KineticOnce text="What We Offer" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="From intimate ceremonies to grand celebrations, we bring your vision to life" tag="p" className="section-desc" style={{ fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              {s.popular && <div className="service-popular">Most Popular</div>}
              <div className="service-icon"><span>{typeof s.icon === 'string' ? s.icon : s.icon}</span></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="#contact" className="service-link" style={{ marginTop: "auto" }}>Book Now <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></a>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== VIDEO SHOWREEL SECTION ==================== */}
      <section id="showreel" style={{
        position: "relative",
        padding: "100px 40px",
        background: "linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Decorative glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.1) 0%, rgba(212,160,23,0.03) 50%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <KineticOnce text="Showreel" tag="div" className="section-label" style={{ color: "#d4a017" }} />
          <h2 className="section-title" style={{ color: "#fff", marginBottom: 12 }}>
            <KineticOnce text="Watch Our Story" tag="span" style={{ color: "#fff", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} />
          </h2>
          <KineticOnce text="A glimpse into how we capture love, emotion, and timeless moments" tag="p" style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 50, fontFamily: "inherit" }} />

          {/* Video Player */}
          <div style={{
            maxWidth: 1000,
            margin: "0 auto",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(212,160,23,0.15)",
            border: "1px solid rgba(212,160,23,0.25)",
            position: "relative",
          }}>
            <video
              controls
              preload="metadata"
              poster="/images/hero1.jpg"
              style={{
                width: "100%",
                display: "block",
                borderRadius: 20,
              }}
            >
              <source src="/videos/couple-aura-reel.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* ==================== EXPANDING GALLERY ==================== */}
      <section className="section">
        <div className="section-header">
          <KineticOnce text="Latest Work" tag="div" className="section-label" />
          <h2 className="section-title"><KineticOnce text="Our Creations" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="Each piece crafted with intention and style" tag="p" className="section-desc" style={{ fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <ExpandingGallery />
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section id="testimonials" className="section section-alt">
        <AnimatedTestimonialGrid
          testimonials={[
            { imgSrc: "/images/avatar1.jpg", alt: "Client" },
            { imgSrc: "/images/avatar2.jpg", alt: "Client" },
            { imgSrc: "/images/avatar3.jpg", alt: "Client" },
          ]}
          badgeText="Testimonials"
          title={<>What Our Clients Say About <span style={{ color: "#d4a017" }}>COUPLE AURA</span></>}
          description={<>Don&apos;t just take our word for it. Here&apos;s what our clients have to say about their experience working with us.</>}
          ctaText="Read More Stories"
          ctaHref="#contact"
        />
      </section>

      {/* ==================== CONTACT ==================== */}
      <section id="contact" className="section">
        <div className="section-header">
          <KineticOnce text="Contact" tag="div" className="section-label" />
          <h2 className="section-title"><KineticOnce text="Let's Connect" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <KineticOnce text="Ready to create something beautiful together?" tag="p" className="section-desc" style={{ fontFamily: "inherit", fontSize: "inherit" }} />
        </div>
        <div className="contact-grid">
          <div>
            <h3 className="section-title" style={{ fontSize: 26, marginBottom: 20, textAlign: "left" }}><KineticOnce text="Get in Touch" tag="span" style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }} /></h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--secondary)", marginBottom: 28 }}>Whether you have a specific project in mind or just want to explore possibilities, I&apos;m here to help.</p>
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>, label: "Email", value: "coupleaura1photography@gmail.com" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>, label: "Phone", value: "7893279292" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>, label: "Studio", value: "Flat no 104, Sri Balaji Towers, Kavuri Hills, Jubilee Hills, Hyderabad, Telangana 500018" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Hours", value: "Mon - Sat, 9AM - 7PM" },
            ].map(item => (
              <div key={item.label} className="contact-info-card">
                <div className="contact-info-icon">{item.icon}</div>
                <div><div className="contact-info-label">{item.label}</div><div className="contact-info-value">{item.value}</div></div>
              </div>
            ))}
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" placeholder="John Doe" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Service</label><select className="form-select" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}><option value="">Select a service</option><option value="wedding">Wedding</option><option value="portrait">Portrait</option><option value="commercial">Commercial</option><option value="event">Event</option></select></div>
              <div className="form-group full"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Tell me about your project..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
            </div>
            <button type="submit" className="form-submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
            </button>
            {isSubmitted && <div className="form-success">✓ Thank you! Your message has been sent. I&apos;ll respond within 24 hours.</div>}
            {submitError && <div className="form-error" style={{color:'#ef4444',marginTop:12,fontSize:14}}>✗ {submitError}</div>}
          </form>
        </div>

        {/* ==================== MAP VIEW ==================== */}
        <div style={{ maxWidth: 1200, width: "100%", margin: "48px auto 0", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <iframe
            src="https://maps.google.com/maps?q=C9PW%2BH4+Hyderabad,+Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="350"
            style={{ border: 0, width: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Couple Aura Photography Studio Location"
          />
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ marginBottom: 8 }}>
              <img
                src="/images/logo.png"
                alt="COUPLE AURA Logo"
                width={70}
                height={70}
                style={{ height: 70, width: 70, objectFit: "contain" }}
              />
            </div>
            <p>Capturing life&apos;s most precious moments with artistry and passion. Available worldwide.</p>
            <FooterSpinningLogos />
          </div>
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="/build-quote">Build Quote</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">{["Wedding Photography", "Pre-Wedding Shoots", "Cinematic Films", "Drone Shoots", "Event Coverage"].map(l => <li key={l}><a href="#services">{l}</a></li>)}</ul>
          </div>
          <div>
            <h4 className="footer-title">Studio Hours</h4>
            <ul className="footer-links"><li><a href="#">Mon-Fri: 9AM-7PM</a></li><li><a href="#">Sat: 10AM-5PM</a></li><li><a href="#">Sun: By Appointment</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 COUPLE AURA Photography. All rights reserved.</p>
          <p>Made with ❤️ by <a href="#">Devmitra</a></p>
        </div>
      </footer>

      {/* ==================== VIDEO MODAL ==================== */}
      {showVideo && (
        <div
          onClick={() => setShowVideo(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowVideo(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              zIndex: 10001,
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            ✕
          </button>

          {/* Video */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90vw",
              maxWidth: 1000,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
            }}
          >
            <video
              controls
              autoPlay
              preload="auto"
              style={{ width: "100%", display: "block" }}
            >
              <source src="/videos/couple-aura-reel.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* BACK TO TOP */}
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6" /></svg>
      </button>

      </div>{/* end main site wrapper */}
    </>
  );
}
