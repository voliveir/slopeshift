"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Dummy resort logos
const resortLogos = [
  "/demo/logo-alta.svg",
  "/demo/logo-vail.svg",
  "/demo/logo-aspen.svg",
  "/demo/logo-whistler.svg",
  "/demo/logo-parkcity.svg",
];

// Dummy screenshots
const screenshots = [
  "/demo/retail-cart.png",
  "/demo/retail-kitchen.png",
  "/demo/retail-inventory.png",
];

// Social proof
const testimonials = [
  {
    quote:
      "We finally have one POS for every shop and café—no more end-of-day chaos.",
    name: "F&B Director, Park City",
    avatar: "/demo/avatar-parkcity.png",
    logo: "/demo/logo-parkcity.svg",
  },
  {
    quote:
      "Gift cards and loyalty work everywhere, and our finance team loves the reporting.",
    name: "Retail Lead, Aspen Snowmass",
    avatar: "/demo/avatar-aspen.png",
    logo: "/demo/logo-aspen.svg",
  },
  {
    quote:
      "Offline mode saved us during a storm—never lost a sale.",
    name: "Ops Manager, Whistler Blackcomb",
    avatar: "/demo/avatar-whistler.png",
    logo: "/demo/logo-whistler.svg",
  },
];

const kpis = [
  { value: "1", label: "Unified POS" },
  { value: "100%", label: "Revenue Visibility" },
  { value: "Minutes", label: "End-of-Day Closeout" },
];

const timeline = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0070F3"/><path d="M10 16h12M16 10v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Omnichannel Cart",
    desc: "Sell online, in-store, or on-mountain—one customer profile, one cart.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#00D1B2"/><path d="M10 16l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Kitchen Display & Bump Screens",
    desc: "Fire orders instantly to the kitchen, reduce ticket times, and keep guests happy.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0070F3"/><path d="M16 10v12M10 16h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Inventory Matrix",
    desc: "Track sizes, colors, and style codes—automate re-order points and never run out.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#00D1B2"/><path d="M10 22l6-12 6 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Tip & Service Charge Wizard",
    desc: "Compliant pooling, payroll export, and easy tip management for every venue.",
  },
];

function ChevronBounce() {
  return (
    <motion.div
      aria-label="Scroll down"
      initial={{ y: 0 }}
      animate={{ y: [0, 12, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <path d="M8 14l10 10 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.div>
  );
}

function DeviceFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-2xl shadow-inner bg-gray-100 p-2 max-w-xs mx-auto">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={200}
        className="rounded-xl object-cover"
        placeholder="blur"
        blurDataURL="/demo/blur.png"
      />
    </div>
  );
}

export default function RetailFnbPosFeaturePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <div className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden" style={{background: "linear-gradient(45deg, #0070F3 0%, #00D1B2 100%)"}}>
        {/* Video BG */}
        <video
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          src="/demo/retail-hero.mp4"
          poster="/demo/retail-hero.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-label="Retail and F&B POS in action"
          style={{ opacity: 0.32 }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 to-teal-400/80 z-10" />
        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 flex flex-col md:flex-row items-center min-h-screen">
          <div className="flex-1 flex flex-col justify-center items-start pt-32 md:pt-0">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-lg"
            >
              Every Register, One Source of Truth
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-2xl text-white/90 mb-8 max-w-xl"
            >
              Unified POS for soft-goods, hard-goods, cafés, and food courts—online and on-mountain.
            </motion.p>
            <div className="flex gap-4 mb-8">
              <button
                className="bg-gradient-to-r from-blue-600 to-teal-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform text-lg"
                onClick={() => window.location.href = "/contact"}
              >
                Book a Demo
              </button>
              <button
                className="border border-white/80 text-white/90 font-semibold px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lg"
                onClick={() => setVideoOpen(true)}
                aria-label="Watch 60-sec overview"
              >
                Watch 60-sec overview
              </button>
            </div>
          </div>
        </div>
        <ChevronBounce />
        {/* Video Modal */}
        {videoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-2xl"
                onClick={() => setVideoOpen(false)}
                aria-label="Close video"
              >
                ×
              </button>
              <video
                src="/demo/retail-overview.mp4"
                poster="/demo/retail-hero.jpg"
                controls
                autoPlay
                className="w-full rounded-xl"
                aria-label="60-second overview video"
              />
            </div>
          </div>
        )}
      </section>

      {/* LOGO BAR */}
      <section className="w-full bg-white py-6 border-b border-gray-100">
        <div className="container mx-auto px-6 overflow-x-auto">
          <div className="flex gap-10 items-center justify-center min-w-[600px] md:min-w-0">
            {resortLogos.map((logo, i) => (
              <Image
                key={logo}
                src={logo}
                alt={`Resort logo ${i+1}`}
                width={120}
                height={40}
                className="opacity-60 grayscale hover:opacity-100 transition-opacity h-10 w-auto"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="container mx-auto px-6 py-20 max-w-screen-xl">
        {/* Block A */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-1"
          >
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-700">Omnichannel Cart</h2>
            <p className="text-lg text-gray-700 mb-6">
              Sell goggles online, redeem gift cards in the lodge, same customer profile. One cart, everywhere.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Unified customer profile</li>
              <li>Gift cards & loyalty work everywhere</li>
              <li>Online, in-store, and on-mountain</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="order-2"
          >
            <DeviceFrame src={screenshots[0]} alt="Omnichannel Cart screenshot" />
          </motion.div>
        </div>
        {/* Block B */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <DeviceFrame src={screenshots[1]} alt="Kitchen Display screenshot" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-1 md:order-2"
          >
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-700">Kitchen Display & Bump Screens</h2>
            <p className="text-lg text-gray-700 mb-6">
              Fire orders instantly, reduce ticket times, and keep guests happy. No more lost chits.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Instant order firing</li>
              <li>Bump screens for fast service</li>
              <li>Reduce ticket times</li>
            </ul>
          </motion.div>
        </div>
        {/* Block C */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-1"
          >
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-700">Inventory Matrix</h2>
            <p className="text-lg text-gray-700 mb-6">
              Sizes, colors, style codes with automated re-order points. Never run out, never overstock.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Automated re-order points</li>
              <li>Track sizes, colors, style codes</li>
              <li>Full inventory visibility</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="order-2"
          >
            <DeviceFrame src={screenshots[2]} alt="Inventory Matrix screenshot" />
          </motion.div>
        </div>
      </section>

      {/* STATS RIBBON */}
      <section className="w-full bg-gradient-to-r from-blue-600/90 to-teal-400/90 py-8">
        <div className="container mx-auto px-6 flex flex-wrap gap-6 justify-center">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="backdrop-blur-md bg-white/40 rounded-xl px-8 py-6 flex flex-col items-center min-w-[160px] shadow-md"
            >
              <span className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">{kpi.value}</span>
              <span className="text-sm font-medium text-blue-900/80 uppercase tracking-wide bg-white/60 rounded-full px-3 py-1 mt-1">
                {kpi.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS TIMELINE */}
      <section className="container mx-auto px-6 py-20 max-w-screen-md">
        <h2 className="text-2xl md:text-4xl font-semibold mb-12 text-center text-blue-700">How It Works</h2>
        <div className="relative border-l-4 border-gradient-to-b from-blue-600 to-teal-400 ml-6">
          {timeline.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="mb-12 flex items-start"
            >
              <div className="-ml-10 mr-6 flex flex-col items-center">
                <div className="bg-white rounded-full shadow-lg p-2 mb-2">{step.icon}</div>
                {i < timeline.length - 1 && (
                  <div className="w-1 h-16 bg-gradient-to-b from-blue-600 to-teal-400" />
                )}
              </div>
              <div className={`flex-1 ${i % 2 === 0 ? "text-left" : "text-right"}`}>
                <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">{step.title}</h3>
                <p className="text-gray-700 mb-2 max-w-xs md:max-w-sm">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF CAROUSEL */}
      <section className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-2xl md:text-4xl font-semibold mb-10 text-center text-blue-700">What Resorts Say</h2>
          <div className="relative">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center"
            >
              <Image
                src={testimonials[testimonialIdx].avatar}
                alt={testimonials[testimonialIdx].name}
                width={64}
                height={64}
                className="rounded-full mb-4 object-cover"
              />
              <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-4 leading-relaxed">
                “{testimonials[testimonialIdx].quote}”
              </blockquote>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-blue-700">{testimonials[testimonialIdx].name}</span>
                <Image
                  src={testimonials[testimonialIdx].logo}
                  alt="Resort logo"
                  width={48}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </motion.div>
            {/* Carousel controls */}
            <div className="flex justify-center gap-4 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === testimonialIdx ? "bg-blue-600" : "bg-gray-300"}`}
                  onClick={() => setTestimonialIdx(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING/CTA BLOCK */}
      <section className="w-full bg-gradient-to-r from-blue-100 to-teal-50 py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-gradient-to-br from-blue-600/90 to-teal-400/90 rounded-2xl shadow-xl p-10 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Ready to move your mountain?</h2>
            <p className="text-white/90 mb-8 text-lg max-w-md">
              Consolidate revenue streams, cut end-of-day closeout from hours to minutes, and feed data directly into Finance & Analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform text-lg"
              >
                Request Pricing
              </a>
              <a
                href="/features"
                className="text-white/90 border border-white/80 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lg"
              >
                Explore all modules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12">
        {/* Replace with your global footer import if available */}
        <div className="container mx-auto px-6 py-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SlopeShift. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 