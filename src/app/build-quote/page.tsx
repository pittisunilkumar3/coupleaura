"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./build-quote.css";

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

type StepOption = { id: string; label: string; icon: string; description: string; price: number };
type Step = {
  title: string;
  description: string;
  multi: boolean;
  options: StepOption[];
  allowDays?: boolean;
  allowMessage?: boolean;
};
type EventCategory = {
  id: string;
  label: string;
  icon: string;
  heroImage: string;
  description: string;
  steps: Step[];
};

/* ══════════════════════════════════════════════════════════════
   OPTION BUILDER HELPERS
   ══════════════════════════════════════════════════════════════ */

const OPT: Record<string, Omit<StepOption, "id">> = {
  "trad-photo":    { label: "Traditional Photo",  icon: "📸", description: "Classic posed photographs",   price: 15000 },
  "trad-video":    { label: "Traditional Video",  icon: "🎥", description: "Full event video",  price: 15000 },
  "candid-photo":  { label: "Candid Photo",       icon: "📷", description: "Natural, spontaneous moments", price: 20000 },
  "candid-video":  { label: "Candid Video",       icon: "🎬", description: "Cinematic footage",         price: 20000 },
  "drone":         { label: "Drone",              icon: "🛸", description: "Aerial shots",              price: 15000 },
  "drone-fpv":     { label: "Drone FPV",          icon: "🛸", description: "First-person drone shots",  price: 25000 },
  "live":          { label: "Live Streaming",     icon: "📺", description: "Live event streaming",      price: 10000 },
  "led":           { label: "LED Wall",           icon: "🖥️", description: "LED display setup",          price: 15000 },
  "instant-reels": { label: "Instant Reels (2 Reels)", icon: "⚡", description: "2 edited reels (60 sec each)", price: 10000 },
};

const mk = (prefix: string, keys: string[]): StepOption[] =>
  keys.map(k => ({ id: `${prefix}-${k}`, ...OPT[k] }));

const ALL = ["trad-photo","trad-video","candid-photo","candid-video","drone","drone-fpv","live","led","instant-reels"];
const RESTRICTED = ["trad-photo","trad-video","candid-photo","candid-video","drone","drone-fpv","live","led","instant-reels"];
const VRATHAM = ["trad-photo","trad-video"];
const SMALL_EVENT = ["trad-photo","trad-video","candid-photo","candid-video"];
const SMALL_EVENT_EXTRA = ["drone","drone-fpv","live","led","instant-reels"];
const CEREMONY = ["trad-photo","trad-video","candid-photo","candid-video","instant-reels"];

/* Pre-wedding destination price overrides */
const PW_DEST: Record<string, number> = {
  "pw-candid-photo": 25000,
  "pw-candid-video": 25000,
  "pw-drone": 20000,
  "pw-instant-reels": 20000,
};

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

const EVENTS: EventCategory[] = [
  /* ── WEDDING ── */
  {
    id: "wedding", label: "Wedding", icon: "💍", heroImage: "/images/wedding1.jpg",
    description: "Complete wedding photography & videography packages",
    steps: [
      {
        title: "Documentary Style Cinematography", description: "If you choose Documentary Style, you must take Cinematography in all events.", multi: false,
        options: [
          { id: "w-doc-yes", label: "Yes — Documentary Style", icon: "🎬", description: "Cinematic documentary film", price: 35000 },
          { id: "w-doc-no",  label: "Skip",                     icon: "❌", description: "No documentary",          price: 0 },
        ],
      },
      {
        title: "Engagement", description: "Select services you need", multi: true,
        options: mk("w-eng", ALL),
      },
      {
        title: "Pellikoduku", description: "Groom's ceremony — select services, set days & photographers needed", multi: true, allowDays: true, allowMessage: true,
        options: mk("w-pk", CEREMONY),
      },
      {
        title: "Groom Haldi", description: "Groom haldi — select services, set days & photographers needed", multi: true, allowDays: true, allowMessage: true,
        options: mk("w-gh", CEREMONY),
      },
      {
        title: "Pellikuthuru", description: "Bride's ceremony — select services, set days & photographers needed", multi: true, allowDays: true, allowMessage: true,
        options: mk("w-pth", CEREMONY),
      },
      {
        title: "Bride Haldi", description: "Bride haldi — select services, set days & photographers needed", multi: true, allowDays: true, allowMessage: true,
        options: mk("w-bh", CEREMONY),
      },
      {
        title: "Reception", description: "Grand reception", multi: true,
        options: mk("w-rcpt", ALL),
      },
      {
        title: "Wedding Day", description: "Main wedding ceremony", multi: true,
        options: mk("w-bd", ALL),
      },
      { /* Vratham — traditional only */
        title: "Vratham", description: "Sacred vratham ceremony — traditional only", multi: true,
        options: mk("w-vr", VRATHAM),
      },
      {
        title: "Sangeet Night", description: "Music & dance celebration", multi: true,
        options: mk("w-sa", ALL),
      },
      {
        title: "Mehandi", description: "Beautiful mehandi ceremony", multi: true,
        options: mk("w-mh", RESTRICTED),
      },
      {
        title: "Cocktail Party", description: "Fun-filled cocktail night", multi: true,
        options: mk("w-ck", RESTRICTED),
      },
      {
        title: "Albums", description: "Select album types & sizes", multi: true,
        options: [
          { id: "w-album-classic-40",  label: "Classic Album — 40 Sheets",   icon: "📖", description: "40 sheets, classic finish",  price: 20000 },
          { id: "w-album-classic-20",  label: "Classic Album — 20 Sheets",   icon: "📖", description: "20 sheets, classic finish",  price: 12000 },
          { id: "w-album-premium-40",  label: "Premium Album — 40 Sheets",   icon: "📚", description: "40 sheets, premium finish", price: 40000 },
          { id: "w-album-premium-20",  label: "Premium Album — 20 Sheets",   icon: "📚", description: "20 sheets, premium finish", price: 25000 },
        ],
      },
      {
        title: "Post Production Delivery (Output)", description: "Final delivery after the shoot", multi: false,
        options: [
          { id: "w-out-30days", label: "30 Days Delivery", icon: "📅", description: "Post production output in 30 days", price: 85000 },
        ],
      },
    ],
  },

  /* ── PRE-WEDDING ── */
  {
    id: "prewedding", label: "Pre-Wedding", icon: "✨", heroImage: "/images/portrait2.jpg",
    description: "Romantic pre-wedding shoot packages",
    steps: [
      {
        title: "Location Type", description: "Where would you like the shoot?", multi: false,
        options: [
          { id: "pw-local",      label: "Local",      icon: "📍", description: "Local / nearby location",                               price: 0 },
          { id: "pw-destination", label: "Destination", icon: "✈️", description: "Outstation — client pays food, travel & stay",         price: 0 },
        ],
      },
      {
        title: "Photography & Video", description: "Select services (pricing varies by location)", multi: true,
        options: [
          { id: "pw-candid-photo",   label: "Candid Photo",   icon: "📷", description: "Natural moments",                  price: 20000 },
          { id: "pw-candid-video",   label: "Candid Video",   icon: "🎬", description: "Cinematic footage",               price: 20000 },
          { id: "pw-drone",          label: "Drone",          icon: "🛸", description: "Aerial shots",                    price: 18000 },
          { id: "pw-instant-reels",  label: "Instant Reels (2 Reels)",  icon: "⚡", description: "2 edited reels (60 sec each)",    price: 10000 },
        ],
        allowMessage: true,
      },
      {
        title: "Albums", description: "Select album types & sizes", multi: true,
        options: [
          { id: "pw-album-classic-40",  label: "Classic Album — 40 Sheets",   icon: "📖", description: "40 sheets, classic finish",  price: 20000 },
          { id: "pw-album-classic-20",  label: "Classic Album — 20 Sheets",   icon: "📖", description: "20 sheets, classic finish",  price: 12000 },
          { id: "pw-album-premium-40",  label: "Premium Album — 40 Sheets",   icon: "📚", description: "40 sheets, premium finish", price: 40000 },
          { id: "pw-album-premium-20",  label: "Premium Album — 20 Sheets",   icon: "📚", description: "20 sheets, premium finish", price: 25000 },
        ],
      },
    ],
  },

  /* ── BIRTHDAY ── */
  {
    id: "birthday", label: "Birthday", icon: "🎂", heroImage: "/images/wedding2.jpg",
    description: "Birthday party photography & videography packages",
    steps: [
      {
        title: "Event Type", description: "What kind of birthday?", multi: false,
        options: [
          { id: "b-kids",     label: "Kids Birthday",              icon: "🎈", description: "Fun-filled kids party",     price: 0 },
          { id: "b-adult",    label: "Adult Birthday",             icon: "🥳", description: "Adult celebration",         price: 0 },
          { id: "b-surprise", label: "Surprise Party",             icon: "🎁", description: "Surprise celebration",      price: 0 },
          { id: "b-milestone",label: "Milestone (18th/25th/50th)", icon: "🌟", description: "Landmark birthday",         price: 0 },
        ],
      },
      {
        title: "Photography & Videography", description: "Select services", multi: true,
        options: mk("b", SMALL_EVENT),
      },

      {
        title: "Photo Booth", description: "Fun photo booth for guests", multi: false,
        options: [
          { id: "b-booth-yes", label: "Yes — Photo Booth", icon: "📸", description: "Props + instant prints", price: 50000 },
          { id: "b-booth-no",  label: "Skip",              icon: "❌", description: "No photo booth",        price: 0 },
        ],
      },
      {
        title: "Albums", description: "Select album types & sizes", multi: true,
        options: [
          { id: "b-album-classic-40",  label: "Classic Album — 40 Sheets",   icon: "📖", description: "40 sheets, classic finish",  price: 20000 },
          { id: "b-album-classic-20",  label: "Classic Album — 20 Sheets",   icon: "📖", description: "20 sheets, classic finish",  price: 12000 },
          { id: "b-album-premium-40",  label: "Premium Album — 40 Sheets",   icon: "📚", description: "40 sheets, premium finish", price: 40000 },
          { id: "b-album-premium-20",  label: "Premium Album — 20 Sheets",   icon: "📚", description: "20 sheets, premium finish", price: 25000 },
        ],
      },
      {
        title: "Post Production Delivery (Output)", description: "Final delivery after the shoot", multi: false,
        options: [
          { id: "b-out-30days", label: "30 Days Delivery", icon: "📅", description: "Post production output in 30 days", price: 85000 },
        ],
      },
    ],
  },

  /* ── CORPORATE ── */
  {
    id: "corporate", label: "Corporate", icon: "🏢", heroImage: "/images/landscape1.jpg",
    description: "Professional corporate event photography & videography",
    steps: [
      {
        title: "Event Type", description: "What kind of corporate event?", multi: false,
        options: [
          { id: "c-conference", label: "Conference / Summit", icon: "🎤", description: "Business conferences",    price: 0 },
          { id: "c-launch",     label: "Product Launch",      icon: "🚀", description: "Product unveiling events", price: 0 },
          { id: "c-team",       label: "Team Building",       icon: "🤝", description: "Team outings & activities", price: 0 },
          { id: "c-annual",     label: "Annual Day",          icon: "🎉", description: "Company celebrations",     price: 0 },
          { id: "c-awards",     label: "Award Ceremony",      icon: "🏆", description: "Award nights",             price: 0 },
        ],
      },
      {
        title: "Photography", description: "Select photography services", multi: true,
        options: [
          { id: "c-candid-photo",   label: "Candid Photography",  icon: "📷", description: "Natural event photos",   price: 15000 },
          { id: "c-trad-photo",     label: "Stage & Group Photos", icon: "📸", description: "Formal stage & group shots", price: 10000 },
          { id: "c-product-photo",  label: "Product Photography",  icon: "📦", description: "Product / booth shots",     price: 12000 },
        ],
      },
      {
        title: "Videography", description: "Select video services", multi: true,
        options: [
          { id: "c-candid-video",    label: "Candid Video",        icon: "🎬", description: "Cinematic event footage",   price: 20000 },
          { id: "c-trad-video",     label: "Traditional Video",   icon: "🎥", description: "Complete event recording", price: 18000 },
          { id: "c-testimonial-video", label: "Testimonial Videos", icon: "🗣️", description: "Attendee interviews",     price: 15000 },
          { id: "c-instant-reel",      label: "Instant Reel (Same Day)", icon: "⚡", description: "₹1,999/hr",           price: 1999 },
        ],
      },
      {
        title: "Live Streaming", description: "Live stream your event", multi: false,
        options: [
          { id: "c-livestream-yes", label: "Yes — Live Streaming", icon: "📺", description: "Multi-platform live stream", price: 25000 },
          { id: "c-livestream-no",  label: "Skip",                 icon: "❌", description: "No live streaming",          price: 0 },
        ],
      },
      {
        title: "Drone", description: "Aerial shots of the venue", multi: false,
        options: [
          { id: "c-drone-yes", label: "Yes — Drone", icon: "🛸", description: "Aerial venue shots", price: 18000 },
          { id: "c-drone-no",  label: "Skip",                 icon: "❌", description: "No drone",           price: 0 },
        ],
      },
    ],
  },

  /* ── HOUSE WARMING ── */
  {
    id: "housewarming", label: "House Warming", icon: "🏠", heroImage: "/images/landscape2.jpg",
    description: "Griha Pravesh ceremony photography & videography",
    steps: [
      {
        title: "Ceremony Type", description: "What kind of celebration?", multi: false,
        options: [
          { id: "h-traditional", label: "Traditional Puja",   icon: "🪔", description: "Sacred griha pravesh puja",  price: 0 },
          { id: "h-modern",      label: "Modern House Party",  icon: "🎉", description: "Contemporary celebration",    price: 0 },
          { id: "h-both",        label: "Both",                icon: "🙏", description: "Puja + party celebration",   price: 0 },
        ],
      },
      {
        title: "Photography & Videography", description: "Select services", multi: true,
        options: mk("h", SMALL_EVENT),
      },

      {
        title: "Albums", description: "Select album types & sizes", multi: true,
        options: [
          { id: "h-album-classic-40",  label: "Classic Album — 40 Sheets",   icon: "📖", description: "40 sheets, classic finish",  price: 20000 },
          { id: "h-album-classic-20",  label: "Classic Album — 20 Sheets",   icon: "📖", description: "20 sheets, classic finish",  price: 12000 },
          { id: "h-album-premium-40",  label: "Premium Album — 40 Sheets",   icon: "📚", description: "40 sheets, premium finish", price: 40000 },
          { id: "h-album-premium-20",  label: "Premium Album — 20 Sheets",   icon: "📚", description: "20 sheets, premium finish", price: 25000 },
        ],
      },
      {
        title: "Post Production Delivery (Output)", description: "Final delivery after the shoot", multi: false,
        options: [
          { id: "h-out-30days", label: "30 Days Delivery", icon: "📅", description: "Post production output in 30 days", price: 85000 },
        ],
      },
    ],
  },

  /* ── HALF SAREE ── */
  {
    id: "halfsaree", label: "Half Saree", icon: "🌸", heroImage: "/images/portrait1.jpg",
    description: "Half Saree ceremony photography & videography",
    steps: [
      {
        title: "Photography & Videography", description: "Select services", multi: true,
        options: mk("hs", SMALL_EVENT),
      },

      {
        title: "Albums", description: "Select album types & sizes", multi: true,
        options: [
          { id: "hs-album-classic-40",  label: "Classic Album — 40 Sheets",   icon: "📖", description: "40 sheets, classic finish",  price: 20000 },
          { id: "hs-album-classic-20",  label: "Classic Album — 20 Sheets",   icon: "📖", description: "20 sheets, classic finish",  price: 12000 },
          { id: "hs-album-premium-40",  label: "Premium Album — 40 Sheets",   icon: "📚", description: "40 sheets, premium finish", price: 40000 },
          { id: "hs-album-premium-20",  label: "Premium Album — 20 Sheets",   icon: "📚", description: "20 sheets, premium finish", price: 25000 },
        ],
      },
      {
        title: "Post Production Delivery (Output)", description: "Final delivery after the shoot", multi: false,
        options: [
          { id: "hs-out-30days", label: "30 Days Delivery", icon: "📅", description: "Post production output in 30 days", price: 85000 },
        ],
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

type SelectedItem = { label: string; price: number; stepTitle: string; photographers: number; days: number; message: string };

export default function BuildQuotePage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  /* ── Browser back button: go one step back instead of leaving the page ── */
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [showInstantReel, setShowInstantReel] = useState(false);
  const [instantReelHours, setInstantReelHours] = useState(1);
  const [instantReelMode, setInstantReelMode] = useState<"perReel" | "singleReel">("perReel");
  const [formData, setFormData] = useState({ fullName: '', eventDate: '', venue: '', phone: '', email: '', eventDescription: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  /* ── NEW STATE: photographer counts, days, messages ── */
  const [photographerCounts, setPhotographerCounts] = useState<Record<string, number>>({});
  const [daysCounts, setDaysCounts] = useState<Record<string, number>>({});
  const [stepMessages, setStepMessages] = useState<Record<string, string>>({});

  const activeEvent = EVENTS.find(e => e.id === activeTab) || null;

  /* Listen for browser back/forward — read the step from history state.
     When the back button is pressed, the browser has ALREADY navigated to the
     previous history entry. We read e.state.step to sync the React UI. */
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.wizard) {
        setCurrentStep(e.state.step);
        setShowCongrats(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* ── helpers ── */
  const stepKey = (idx: number) => `${activeTab}-${idx}`;
  const toggle = (stepIdx: number, optId: string) => {
    const key = stepKey(stepIdx);
    const step = activeEvent!.steps[stepIdx];
    setSelections(prev => {
      const cur = prev[key] || [];
      return { ...prev, [key]: step.multi ? (cur.includes(optId) ? cur.filter(x => x !== optId) : [...cur, optId]) : [optId] };
    });
  };
  const isSelected = (stepIdx: number, optId: string) => (selections[stepKey(stepIdx)] || []).includes(optId);

  /* pre-wedding dynamic price */
  const isPWDest = () => activeTab === "prewedding" && (selections["prewedding-0"] || []).includes("pw-destination");
  const getEffectivePrice = (stepIdx: number, opt: StepOption): number => {
    if (activeTab === "prewedding" && stepIdx === 1 && isPWDest()) return PW_DEST[opt.id] || opt.price;
    return opt.price;
  };

  /* per-option quantity */
  const optQtyKey = (stepIdx: number, optId: string) => `${stepKey(stepIdx)}__${optId}`;
  const getQty = (stepIdx: number, optId: string) => photographerCounts[optQtyKey(stepIdx, optId)] || 1;
  const setQty = (stepIdx: number, optId: string, v: number) => setPhotographerCounts(p => ({ ...p, [optQtyKey(stepIdx, optId)]: v }));

  /* selected items with multipliers */
  const getSelectedOptions = (): SelectedItem[] => {
    if (!activeEvent) return [];
    const items: SelectedItem[] = [];
    activeEvent.steps.forEach((step, sIdx) => {
      const sel = selections[stepKey(sIdx)] || [];
      const k = stepKey(sIdx);
      const dCount = step.allowDays ? (daysCounts[k] || 1) : 1;
      const msg = step.allowMessage ? (stepMessages[k] || '') : '';
      step.options.forEach(opt => {
        if (sel.includes(opt.id) && getEffectivePrice(sIdx, opt) > 0) {
          const qty = getQty(sIdx, opt.id);
          items.push({ label: opt.label, price: getEffectivePrice(sIdx, opt), stepTitle: step.title, photographers: qty, days: dCount, message: msg });
        }
      });
    });
    return items;
  };

  const calculateTotal = () => getSelectedOptions().reduce((s, i) => s + i.price * i.photographers * i.days, 0);

  /* Collect all step messages */
  const getAllMessages = () => {
    if (!activeEvent) return [];
    const msgs: { stepTitle: string; message: string }[] = [];
    activeEvent.steps.forEach((step, sIdx) => {
      if (step.allowMessage) {
        const m = stepMessages[stepKey(sIdx)];
        if (m && m.trim()) msgs.push({ stepTitle: step.title, message: m });
      }
    });
    return msgs;
  };

  const handleNext = () => {
    if (!activeEvent) return;
    if (currentStep < activeEvent.steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      window.history.pushState({ wizard: true, step: next }, "");
    }
    else { setShowCongrats(true); window.history.pushState({ wizard: true, step: currentStep, congrats: true }, ""); }
  };
  /* Custom Previous button: call history.back() which triggers popstate,
     which reads e.state.step and updates currentStep — one consistent path. */
  const handlePrev = () => { if (currentStep > 0) window.history.back(); };

  const resetAll = () => {
    setActiveTab(null); setCurrentStep(0); setSelections({}); setShowCongrats(false);
    setShowInstantReel(false); setInstantReelHours(1); setInstantReelMode("perReel");
    setFormSubmitted(false);
    setFormData({ fullName: '', eventDate: '', venue: '', phone: '', email: '', eventDescription: '' });
    setPhotographerCounts({}); setDaysCounts({}); setStepMessages({});
  };

  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      const selectedItems = getSelectedOptions();
      const allMsgs = getAllMessages();
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          service: activeEvent?.label || "Quote Request",
          date: formData.eventDate,
          venue: formData.venue,
          eventDescription: formData.eventDescription,
          total: formatPrice(calculateTotal()),
          selectedServices: selectedItems.map(item => {
            const parts = [item.label];
            if (item.photographers > 1) parts.push(`${item.photographers} photographers`);
            if (item.days > 1) parts.push(`${item.days} days`);
            parts.push(formatPrice(item.price * item.photographers * item.days));
            return parts.join(" | ");
          }),
          stepMessages: allMsgs.map(m => `${m.stepTitle}: ${m.message}`),
          isQuote: true,
          message: "Quote request submitted from Build Quote page",
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFormSubmitted(true);
      } else {
        alert(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      alert("Network error. Please check your connection.");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  /* ── COUNTER UI HELPER ── */
  const CounterBtn = ({ label, value, onChange, min = 1, max = 20 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
      <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginRight: 4 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(212,160,23,0.3)', background: 'rgba(255,255,255,0.03)' }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} style={{ width: 48, height: 48, border: 'none', background: 'rgba(212,160,23,0.08)', color: value <= min ? 'rgba(212,160,23,0.3)' : '#d4a017', fontSize: 22, fontWeight: 700, cursor: value <= min ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>−</button>
        <div style={{ width: 56, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,160,23,0.03)', color: '#fff', fontSize: 20, fontWeight: 700, borderLeft: '1px solid rgba(212,160,23,0.2)', borderRight: '1px solid rgba(212,160,23,0.2)' }}>{value}</div>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 48, height: 48, border: 'none', background: 'rgba(212,160,23,0.08)', color: '#d4a017', fontSize: 22, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>+</button>
      </div>
    </div>
  );

  /* ═══════════════════ CONGRATS PAGE ═══════════════════ */
  if (showCongrats && activeEvent) {
    const items = getSelectedOptions();
    const total = calculateTotal();
    const msgs = getAllMessages();
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)", padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#d4a017", marginBottom: 8 }}>
              {activeEvent.label} Quotation
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>Your personalized {activeEvent.label.toLowerCase()} quotation</p>
          </div>

          {/* Summary */}
          <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 16, padding: 30, marginBottom: 30 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, fontWeight: 700, color: "#d4a017", marginBottom: 24, textAlign: "center" }}>Quote Summary</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 100px", gap: 10, padding: "14px 20px", background: "rgba(212,160,23,0.15)", borderRadius: 10, marginBottom: 16 }}>
              <span style={{ color: "#d4a017", fontWeight: 700, fontSize: 13 }}>Service</span>
              <span style={{ color: "#d4a017", fontWeight: 700, fontSize: 13 }}>Qty</span>
              <span style={{ color: "#d4a017", fontWeight: 700, fontSize: 13, textAlign: "right" }}>Amount</span>
            </div>
            {items.map((item, i) => {
              const qty = [];
              if (item.photographers > 1) qty.push(`× ${item.photographers}`);
              if (item.days > 1) qty.push(`${item.days} days`);
              const lineTotal = item.price * item.photographers * item.days;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 100px", gap: 10, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#fff", fontSize: 14 }}><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{item.stepTitle} → </span>{item.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{qty.length > 0 ? qty.join(' × ') : '× 1'}</span>
                  <span style={{ color: "#fff", fontSize: 14, textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>{formatPrice(lineTotal)}</span>
                </div>
              );
            })}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 100px", gap: 10, padding: "20px", background: "linear-gradient(135deg, #d4a017 0%, #f0c040 100%)", borderRadius: 10, marginTop: 24 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Final Total</span>
              <span />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, textAlign: "right", fontFamily: "monospace" }}>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Messages from steps */}
          {msgs.length > 0 && (
            <div style={{ background: "rgba(212,160,23,0.06)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: 16, padding: 24, marginBottom: 30 }}>
              <h3 style={{ color: "#d4a017", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Event Notes</h3>
              {msgs.map((m, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{m.stepTitle}: </span>
                  <span style={{ color: "#fff", fontSize: 14 }}>{m.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pre-wedding destination note */}
          {activeTab === "prewedding" && isPWDest() && (
            <div style={{ background: "rgba(212,160,23,0.06)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: 16, padding: 24, marginBottom: 30, textAlign: "center" }}>
              <p style={{ color: "#d4a017", fontSize: 14, fontWeight: 600 }}>📍 Destination Shoot — Client has to pay for food, travel & stay.</p>
            </div>
          )}

          {/* Contact Form */}
          {!formSubmitted ? (
            <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 16, padding: 40, marginBottom: 30 }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, fontWeight: 700, color: "#d4a017", marginBottom: 8, textAlign: "center" }}>Get Your Final Quote</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 30, textAlign: "center" }}>Fill in your details and we&apos;ll send you the complete quotation</p>
              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 500, margin: "0 auto" }}>
                {[
                  { key: "fullName", label: "Full Name *", type: "text", placeholder: "Enter your full name" },
                  { key: "eventDate", label: "Event Date *", type: "date", placeholder: "" },
                  { key: "venue", label: "Event Venue / Location *", type: "text", placeholder: "Enter venue or city" },
                  { key: "phone", label: "Phone Number *", type: "tel", placeholder: "7893279292" },
                  { key: "email", label: "Email ID *", type: "email", placeholder: "your@email.com" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: "block", color: "#d4a017", fontSize: 13, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{field.label}</label>
                    <input
                      type={field.type} required
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10, color: "#fff", fontSize: 15, outline: "none", transition: "border-color 0.3s" }}
                      onFocus={(e) => e.target.style.borderColor = "#d4a017"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(212,160,23,0.3)"}
                    />
                  </div>
                ))}
                {/* Event description message */}
                <div>
                  <label style={{ display: "block", color: "#d4a017", fontSize: 13, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Describe Your Event (optional)</label>
                  <textarea
                    value={formData.eventDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDescription: e.target.value }))}
                    placeholder="Any special requirements or details about your event..."
                    rows={3}
                    style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10, color: "#fff", fontSize: 15, outline: "none", transition: "border-color 0.3s", resize: "vertical", fontFamily: "inherit" }}
                    onFocus={(e) => e.target.style.borderColor = "#d4a017"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(212,160,23,0.3)"}
                  />
                </div>
                <button type="submit" disabled={quoteSubmitting} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 32px", background: "linear-gradient(135deg, #d4a017 0%, #f0c040 100%)", color: "#fff", fontSize: 16, fontWeight: 600, borderRadius: 50, border: "none", cursor: quoteSubmitting ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(212,160,23,0.3)", marginTop: 10, opacity: quoteSubmitting ? 0.7 : 1 }}>
                  {quoteSubmitting ? "Submitting..." : <>Submit &amp; Get Quote</>}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 16, padding: 40, marginBottom: 30, textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 24, fontWeight: 700, color: "#d4a017", marginBottom: 12 }}>Thank You, {formData.fullName}!</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 20, lineHeight: 1.6 }}>
                Your {activeEvent.label.toLowerCase()} quotation has been submitted.<br />
                We will contact you at <strong style={{ color: "#d4a017" }}>{formData.email}</strong> or <strong style={{ color: "#d4a017" }}>{formData.phone}</strong> shortly.
              </p>
              <div style={{ background: "rgba(212,160,23,0.1)", borderRadius: 10, padding: 20, maxWidth: 400, margin: "0 auto" }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Estimated Total</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#d4a017", fontFamily: "monospace" }}>{formatPrice(total)}</p>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button onClick={resetAll} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "transparent", color: "#d4a017", fontSize: 14, fontWeight: 600, borderRadius: 50, border: "2px solid #d4a017", cursor: "pointer" }}>Start New Quote</button>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "linear-gradient(135deg, #d4a017 0%, #f0c040 100%)", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 50, border: "none", cursor: "pointer", textDecoration: "none" }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════ STEP BUILDER ═══════════════════ */
  if (activeEvent && activeTab) {
    const step = activeEvent.steps[currentStep];
    const key = stepKey(currentStep);
    return (
      <div className="build-quote-page">
        {/* Hero */}
        <section className="quote-hero" style={{ flexDirection: "column" }}>
          <div className="quote-hero-bg"><img src={activeEvent.heroImage} alt={activeEvent.label} className="quote-hero-img" /></div>
          <div className="quote-hero-overlay" />
          <div className="quote-hero-content">
            <div className="quote-hero-badge">
              <img src="/images/logo.png" alt="COUPLE AURA" width={56} height={56} style={{ height: 56, width: 56, objectFit: "contain" }} />
              <span>COUPLE AURA</span>
            </div>
            <h1 className="quote-hero-title">Build Your<br /><span className="text-accent">{activeEvent.label} Quotation</span></h1>
            <p className="quote-hero-subtitle">{activeEvent.description}</p>
            <div style={{ cursor: "pointer", marginTop: 30, textAlign: "center", WebkitTapHighlightColor: "transparent" }}
              onClick={() => { const ns = document.querySelector('.quote-hero')?.nextElementSibling; if (ns) ns.scrollIntoView({ behavior: 'smooth' }); }}>
              <style>{`@keyframes scrollBounce{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:.3}}@keyframes scrollRing{0%{transform:scale(1);opacity:.6}50%{transform:scale(1.3);opacity:0}100%{transform:scale(1);opacity:0}}@keyframes scrollPulse{0%,100%{box-shadow:0 0 0 0 rgba(212,160,23,.4)}50%{box-shadow:0 0 20px 4px rgba(212,160,23,.15)}}`}</style>
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 20px", borderRadius: 30, background: "rgba(212,160,23,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(212,160,23,0.2)", animation: "scrollPulse 3s ease-in-out infinite" }}>
                <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 4, color: "#d4a017", fontWeight: 700 }}>Scroll</span>
                <div style={{ position: "relative", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}><polyline points="6 9 12 15 18 9" /></svg>
                  <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1.5px solid rgba(212,160,23,0.3)", animation: "scrollRing 2s ease-out infinite" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section style={{ padding: "80px 20px", background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 1000, width: "100%", textAlign: "center" }}>
            <button onClick={resetAll} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "8px 20px", borderRadius: 50, cursor: "pointer", fontSize: 13, marginBottom: 30 }}>← Change Event Type</button>

            {/* Step indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 30, flexWrap: "wrap" }}>
              {activeEvent.steps.map((_, i) => (
                <div key={i} style={{ width: currentStep === i ? 32 : 22, height: 22, borderRadius: "50%", background: currentStep >= i ? "#d4a017" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", transition: "all 0.3s", flexShrink: 0 }}>{currentStep >= i ? i + 1 : ""}</div>
              ))}
            </div>

            {/* Running total */}
            <div style={{ marginBottom: 20, padding: "12px 24px", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 50, display: "inline-block" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Current Total: </span>
              <span style={{ color: "#d4a017", fontSize: 18, fontWeight: 700 }}>{formatPrice(calculateTotal())}</span>
            </div>

            {/* Step title */}
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              Step {currentStep + 1}: {step.title}
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 50 }}>{step.description}</p>

            {/* Pre-wedding destination note */}
            {activeTab === "prewedding" && currentStep === 1 && isPWDest() && (
              <div style={{ marginBottom: 30, padding: "14px 24px", background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 12, display: "inline-block" }}>
                <span style={{ color: "#d4a017", fontSize: 14, fontWeight: 600 }}>📍 Destination pricing active — Client pays food, travel & stay</span>
              </div>
            )}

            {/* Options grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
              {step.options.map(opt => {
                const sel = isSelected(currentStep, opt.id);
                const ePrice = getEffectivePrice(currentStep, opt);
                const qty = getQty(currentStep, opt.id);
                return (
                  <div key={opt.id}
                    onClick={() => toggle(currentStep, opt.id)}
                    style={{
                      padding: 24, borderRadius: 16, cursor: "pointer", textAlign: "center",
                      display: "flex", flexDirection: "column", justifyContent: "center",
                      border: sel ? "2px solid #d4a017" : "2px solid rgba(255,255,255,0.1)",
                      background: sel ? "rgba(212,160,23,0.12)" : "rgba(255,255,255,0.03)",
                      transition: "all 0.3s",
                      boxShadow: sel ? "0 8px 30px rgba(212,160,23,0.2)" : "none",
                    }}
                  >
                      <div style={{ fontSize: 32, marginBottom: 12 }}>{opt.icon}</div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: sel ? "#d4a017" : "#fff", marginBottom: 4 }}>{opt.label}</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{opt.description}</p>
                      {ePrice > 0 && <p style={{ fontSize: 15, color: "#d4a017", fontWeight: 700, marginBottom: 0 }}>{formatPrice(ePrice)}</p>}
                      {sel && ePrice > 0 && <div style={{ marginTop: 8, width: 24, height: 24, background: "#d4a017", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</div>}
                    {/* Per-card +/- counter — only for multi-select priced items (skip for single-select steps like Documentary Style) */}
                    {sel && ePrice > 0 && step.multi && (
                      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
                        <button onClick={(e) => { e.stopPropagation(); setQty(currentStep, opt.id, Math.max(1, qty - 1)); }} disabled={qty <= 1} style={{
                          width: 40, height: 40, border: 'none', borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
                          background: 'rgba(212,160,23,0.15)', color: qty <= 1 ? 'rgba(212,160,23,0.3)' : '#d4a017',
                          fontSize: 20, fontWeight: 700, cursor: qty <= 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                        }}>−</button>
                        <div style={{ width: 48, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,160,23,0.06)', color: '#fff', fontSize: 18, fontWeight: 700, borderTop: '1px solid rgba(212,160,23,0.2)', borderBottom: '1px solid rgba(212,160,23,0.2)' }}>{qty}</div>
                        <button onClick={(e) => { e.stopPropagation(); setQty(currentStep, opt.id, Math.min(20, qty + 1)); }} style={{
                          width: 40, height: 40, border: 'none', borderTopRightRadius: 10, borderBottomRightRadius: 10,
                          background: 'rgba(212,160,23,0.15)', color: '#d4a017',
                          fontSize: 20, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        }}>+</button>
                      </div>
                    )}
                    {sel && qty > 1 && step.multi && (
                      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{qty} × {formatPrice(ePrice)} = <span style={{ color: '#d4a017', fontWeight: 700 }}>{formatPrice(ePrice * qty)}</span></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Days count (-/+) */}
            {step.allowDays && (
              <CounterBtn
                label="📅 No. of Days"
                value={daysCounts[key] || 1}
                onChange={(v) => setDaysCounts(p => ({ ...p, [key]: v }))}
              />
            )}

            {/* Message textarea */}
            {step.allowMessage && (
              <div style={{ marginTop: 28, maxWidth: 600, margin: "28px auto 0" }}>
                <label style={{ display: "block", color: "#d4a017", fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Describe your event (if required)</label>
                <textarea
                  value={stepMessages[key] || ''}
                  onChange={(e) => setStepMessages(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="Any special requirements, venue details, timing..."
                  rows={3}
                  style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }}
                  onFocus={(e) => e.target.style.borderColor = "#d4a017"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(212,160,23,0.3)"}
                />
              </div>
            )}

            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 30 }}>
              {currentStep > 0 && (
                <button onClick={handlePrev} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "transparent", color: "#d4a017", fontSize: 15, fontWeight: 600, borderRadius: 50, border: "2px solid #d4a017", cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Previous
                </button>
              )}
              <button onClick={handleNext} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "linear-gradient(135deg, #d4a017 0%, #f0c040 100%)", color: "#fff", fontSize: 15, fontWeight: 600, borderRadius: 50, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(212,160,23,0.3)" }}>
                {currentStep === activeEvent.steps.length - 1 ? "Get Quote" : "Next Step"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </section>

        <BuildQuoteFooter />
      </div>
    );
  }

  /* ═══════════════════ INSTANT REEL BOOKING ═══════════════════ */
  if (showInstantReel) {
    const extraHours = instantReelHours > 1 ? instantReelHours - 1 : 0;
    const reelTotal = instantReelMode === "perReel" ? 1999 * instantReelHours : 1999 + 499 * extraHours;
    const reelCount = instantReelMode === "perReel" ? instantReelHours : 1;
    if (formSubmitted) {
      return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)", padding: "60px 20px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 700, color: "#d4a017", marginBottom: 12 }}>Booking Confirmed!</h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 30 }}>
              Thank you, <strong style={{ color: "#d4a017" }}>{formData.fullName}</strong>!<br />
              We will reach out to you at <strong style={{ color: "#d4a017" }}>{formData.email}</strong> or <strong style={{ color: "#d4a017" }}>{formData.phone}</strong> shortly.
            </p>
            <div style={{ background: "rgba(212,160,23,0.1)", borderRadius: 16, padding: 24, maxWidth: 400, margin: "0 auto 30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Package</span><span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{instantReelMode === "perReel" ? "1 Reel / Hour" : "1 Reel Only"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Duration</span><span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{instantReelHours} Hour{instantReelHours > 1 ? 's' : ''}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Reels Delivered</span><span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{reelCount} Reel{reelCount > 1 ? 's' : ''} (60 sec each)</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: 4 }}><span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Total</span><span style={{ color: "#d4a017", fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{formatPrice(reelTotal)}</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <button onClick={resetAll} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "transparent", color: "#d4a017", fontSize: 14, fontWeight: 600, borderRadius: 50, border: "2px solid #d4a017", cursor: "pointer" }}>Book Another</button>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "linear-gradient(135deg, #d4a017 0%, #f0c040 100%)", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 50, border: "none", cursor: "pointer", textDecoration: "none" }}>Back to Home</Link>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)", padding: "60px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <button onClick={() => setShowInstantReel(false)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "8px 20px", borderRadius: 50, cursor: "pointer", fontSize: 13, marginBottom: 30 }}>← Back</button>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>⚡</div>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Instant <span style={{ color: "#d4a017" }}>Reel</span></h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 16px" }}>Same-day highlight reel delivery for all your memorable celebrations</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 32px", background: "linear-gradient(135deg, #d4a017, #f0c040)", borderRadius: 50, marginBottom: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>₹1,999</span><span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>/ hour</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>•</span><span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>1 Edited Reel (60 sec)</span>
            </div>
          </div>
          {/* Pricing Mode */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6, textAlign: "center" }}>Choose Your Plan</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px", textAlign: "center" }}>How would you like your reels?</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div onClick={() => setInstantReelMode("perReel")} style={{ padding: 24, borderRadius: 16, cursor: "pointer", textAlign: "center", border: instantReelMode === "perReel" ? "2px solid #d4a017" : "2px solid rgba(255,255,255,0.1)", background: instantReelMode === "perReel" ? "rgba(212,160,23,0.12)" : "rgba(255,255,255,0.03)", transition: "all 0.3s" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎬</div>
                <h4 style={{ color: instantReelMode === "perReel" ? "#d4a017" : "#fff", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>1 Reel / Hour</h4>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "0 0 12px" }}>Get 1 edited reel for every hour of coverage</p>
                <div style={{ background: "rgba(212,160,23,0.15)", borderRadius: 10, padding: "8px 14px", display: "inline-block" }}><span style={{ color: "#d4a017", fontSize: 18, fontWeight: 800 }}>₹1,999</span><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}> / hour</span></div>
              </div>
              <div onClick={() => setInstantReelMode("singleReel")} style={{ padding: 24, borderRadius: 16, cursor: "pointer", textAlign: "center", border: instantReelMode === "singleReel" ? "2px solid #d4a017" : "2px solid rgba(255,255,255,0.1)", background: instantReelMode === "singleReel" ? "rgba(212,160,23,0.12)" : "rgba(255,255,255,0.03)", transition: "all 0.3s" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎥</div>
                <h4 style={{ color: instantReelMode === "singleReel" ? "#d4a017" : "#fff", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Just 1 Reel</h4>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "0 0 12px" }}>Multiple hours of coverage, but only 1 final reel</p>
                <div style={{ background: "rgba(212,160,23,0.15)", borderRadius: 10, padding: "8px 14px", display: "inline-block" }}><span style={{ color: "#d4a017", fontSize: 18, fontWeight: 800 }}>₹1,999</span><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}> + ₹499/hr extra</span></div>
              </div>
            </div>
          </div>
          {/* Duration */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, marginBottom: 24 }}>
            <label style={{ display: "block", textAlign: "center", fontSize: 16, color: "#fff", marginBottom: 6, fontWeight: 600 }}>Hours of Coverage</label>
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>{instantReelMode === "perReel" ? "1 edited reel (60 sec) per hour" : "Full coverage, 1 final edited reel (60 sec)"}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(h => (
                <button key={h} onClick={() => setInstantReelHours(h)} style={{ width: 56, height: 56, borderRadius: 14, border: instantReelHours === h ? "2px solid #d4a017" : "2px solid rgba(255,255,255,0.1)", background: instantReelHours === h ? "rgba(212,160,23,0.15)" : "rgba(255,255,255,0.03)", color: instantReelHours === h ? "#d4a017" : "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.3s" }}>
                  <div>{h}</div><div style={{ fontSize: 8, fontWeight: 500, opacity: 0.6 }}>hr{h > 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
            <div style={{ background: "rgba(212,160,23,0.08)", borderRadius: 14, border: "1px solid rgba(212,160,23,0.2)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
                <div style={{ padding: "14px 12px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>Duration</div><div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{instantReelHours} hr{instantReelHours > 1 ? 's' : ''}</div></div>
                <div style={{ padding: "14px 12px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>You Get</div><div style={{ color: "#d4a017", fontSize: 18, fontWeight: 700 }}>{reelCount} Reel{reelCount > 1 ? 's' : ''}</div></div>
                <div style={{ padding: "14px 12px", textAlign: "center" }}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>Total</div><div style={{ color: "#d4a017", fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{formatPrice(reelTotal)}</div></div>
              </div>
            </div>
          </div>
          {/* What's included */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, textAlign: "center" }}>What&apos;s Included</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ icon: "🎬", text: instantReelMode === "perReel" ? "1 Edited Reel (60 sec) per hour" : "1 Edited Reel (60 sec) final output" }, { icon: "⚡", text: "Instant On-the-Spot Delivery" }, { icon: "🎵", text: "Trending Music & Audio" }, { icon: "📱", text: "Instagram Reel Format (9:16)" }, { icon: "💬", text: "WhatsApp Status Ready" }, { icon: "✂️", text: "Professional Editing & Transitions" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}><span style={{ fontSize: 18 }}>{item.icon}</span><span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{item.text}</span></div>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 16, padding: 40, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700, color: "#d4a017", marginBottom: 20, textAlign: "center" }}>Book Instant Reel</h2>
            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 460, margin: "0 auto" }}>
              {[{ key: "fullName", label: "Full Name *", type: "text", placeholder: "Your name" }, { key: "eventDate", label: "Event Date *", type: "date", placeholder: "" }, { key: "venue", label: "Event Venue *", type: "text", placeholder: "Event location" }, { key: "phone", label: "Phone *", type: "tel", placeholder: "7893279292" }, { key: "email", label: "Email *", type: "email", placeholder: "your@email.com" }].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", color: "#d4a017", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{field.label}</label>
                  <input type={field.type} required value={formData[field.key as keyof typeof formData]} onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))} placeholder={field.placeholder} style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }} onFocus={(e) => e.target.style.borderColor = "#d4a017"} onBlur={(e) => e.target.style.borderColor = "rgba(212,160,23,0.3)"} />
                </div>
              ))}
              <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 28px", background: "linear-gradient(135deg, #d4a017, #f0c040)", color: "#fff", fontSize: 15, fontWeight: 700, borderRadius: 50, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(212,160,23,0.3)", marginTop: 8 }}>⚡ Book Instant Reel — {formatPrice(reelTotal)}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════ TAB SELECTION (landing) ═══════════════════ */
  return (
    <div className="build-quote-page">
      <section className="quote-hero" style={{ flexDirection: "column" }}>
        <div className="quote-hero-bg"><img src="/images/wedding1.jpg" alt="Build Quote" className="quote-hero-img" /></div>
        <div className="quote-hero-overlay" />
        <div className="quote-hero-content">
          <div className="quote-hero-badge">
            <img src="/images/logo.png" alt="COUPLE AURA" width={56} height={56} style={{ height: 56, width: 56, objectFit: "contain" }} />
            <span>COUPLE AURA</span>
          </div>
          <h1 className="quote-hero-title">Ready To Build Your Own<br /><span className="text-accent">Quotation?</span></h1>
          <p className="quote-hero-subtitle">Select your event type and get instant pricing</p>
          <div style={{ cursor: "pointer", marginTop: 30, textAlign: "center", WebkitTapHighlightColor: "transparent" }} onClick={() => { const ns = document.querySelector('.quote-hero')?.nextElementSibling; if (ns) ns.scrollIntoView({ behavior: 'smooth' }); }}>
            <style>{`@keyframes scrollBounce{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(10px);opacity:.3}}@keyframes scrollRing{0%{transform:scale(1);opacity:.6}50%{transform:scale(1.3);opacity:0}100%{transform:scale(1);opacity:0}}@keyframes scrollPulse{0%,100%{box-shadow:0 0 0 0 rgba(212,160,23,.4)}50%{box-shadow:0 0 20px 4px rgba(212,160,23,.15)}}`}</style>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 20px", borderRadius: 30, background: "rgba(212,160,23,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(212,160,23,0.2)", animation: "scrollPulse 3s ease-in-out infinite" }}>
              <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 4, color: "#d4a017", fontWeight: 700 }}>Scroll</span>
              <div style={{ position: "relative", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}><polyline points="6 9 12 15 18 9" /></svg>
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1.5px solid rgba(212,160,23,0.3)", animation: "scrollRing 2s ease-out infinite" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Tabs */}
      <section style={{ padding: "80px 20px", background: "linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>Choose Your <span style={{ color: "#d4a017" }}>Event Type</span></h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 60, maxWidth: 500, margin: "0 auto 60px" }}>Select the type of event you&apos;re planning and we&apos;ll customize your quotation</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 }}>
            {[...EVENTS, { id: "instant-reel", label: "Instant Reel", icon: "⚡", description: "Same-day highlight reel delivery — 1 edited reel per hour" }].map(ev => (
              <div key={ev.id} onClick={() => { if (ev.id === 'instant-reel') { setShowInstantReel(true); setFormSubmitted(false); setFormData({ fullName: '', eventDate: '', venue: '', phone: '', email: '', eventDescription: '' }); } else { setActiveTab(ev.id); setCurrentStep(0); setSelections({}); setShowCongrats(false); setPhotographerCounts({}); setDaysCounts({}); setStepMessages({}); window.history.pushState({ wizard: true, step: 0 }, ""); } }}
                style={{ padding: "36px 20px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", textAlign: "center" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.5)"; e.currentTarget.style.background = "rgba(212,160,23,0.08)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(212,160,23,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{ev.icon}</div>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{ev.label}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>{ev.description}</p>
                <div style={{ marginTop: 16, padding: "8px 20px", background: "linear-gradient(135deg, #d4a017, #f0c040)", borderRadius: 50, display: "inline-block" }}><span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Get Quote →</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 20px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, color: "#fff", marginBottom: 50 }}>How It <span style={{ color: "#d4a017" }}>Works</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[{ icon: "1️⃣", title: "Select Event", desc: "Choose your event type" }, { icon: "2️⃣", title: "Customize", desc: "Pick services & photographers" }, { icon: "3️⃣", title: "Get Price", desc: "See instant pricing" }, { icon: "4️⃣", title: "Book", desc: "Submit & we'll reach out" }].map((item, i) => (
              <div key={i} style={{ padding: 30, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BuildQuoteFooter />
    </div>
  );
}

/* ═══════════════════ FOOTER ═══════════════════ */

function BuildQuoteFooter() {
  return (
    <footer className="quote-footer">
      <div className="quote-footer-grid">
        <div className="quote-footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <img src="/images/logo.png" alt="COUPLE AURA" width={60} height={60} style={{ height: 60, width: 60, objectFit: "contain" }} />
            <span className="quote-footer-brand-name">COUPLE AURA</span>
          </div>
          <p>Capturing love stories with artistry and passion.</p>
        </div>
        <div className="quote-footer-links">
          <h4>Quick Links</h4>
          <Link href="/">Home</Link>
          <Link href="/build-quote">Build Quote</Link>
          <Link href="/our-clicks">Our Clicks</Link>
        </div>
        <div className="quote-footer-contact">
          <h4>Contact Us</h4>
          <a href="mailto:coupleaura1photography@gmail.com">coupleaura1photography@gmail.com</a>
          <a href="tel:+917893279292">7893279292</a>
        </div>
      </div>
      <div className="quote-footer-bottom">
        <p>Made With ❤️ by Devmitra</p>
        <p>© 2025 COUPLE AURA Photography. All rights reserved.</p>
      </div>
    </footer>
  );
}
