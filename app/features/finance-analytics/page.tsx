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
  "/demo/finance-dashboard.png",
  "/demo/finance-whatif.png",
  "/demo/finance-close.png",
];

// Social proof
const testimonials = [
  {
    quote:
      "SlopeShift's dashboards let us see the whole mountain in one place—no more spreadsheet wrangling.",
    name: "CFO, Alta Mountain",
    avatar: "/demo/avatar-alta.png",
    logo: "/demo/logo-alta.svg",
  },
  {
    quote:
      "Automated close and Xero sync save us days every month.",
    name: "Controller, Park City",
    avatar: "/demo/avatar-parkcity.png",
    logo: "/demo/logo-parkcity.svg",
  },
  {
    quote:
      "Role-based alerts mean we never miss a KPI breach—finance and ops are always in sync.",
    name: "Finance Lead, Whistler Blackcomb",
    avatar: "/demo/avatar-whistler.png",
    logo: "/demo/logo-whistler.svg",
  },
];

const kpis = [
  { value: "2h → 5min", label: "Daily Flash Reporting" },
  { value: "12d → 4d", label: "Month-End Close" },
  { value: "±18% → ±5%", label: "Forecast Accuracy" },
];

const timeline = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0070F3"/><path d="M10 16h12M16 10v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Unified Data Warehouse",
    desc: "Auto-ingest from Ticketing, POS, Rentals, HR—one source of truth.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#00D1B2"/><path d="M10 16l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Dashboards & What-If Modeling",
    desc: "RevPAR, F&B margin, rental yield, pass usage, and scenario planning—all out of the box.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0070F3"/><path d="M16 10v12M10 16h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Automated Financial Close",
    desc: "Map to your chart of accounts, sync with Xero, QuickBooks, or NetSuite.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#00D1B2"/><path d="M10 22l6-12 6 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    ),
    title: "Role-Based Alerts",
    desc: "SMS/Slack when KPIs breach thresholds—finance and ops always in sync.",
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

export default function FinanceAnalyticsFeaturePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <div className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden" style={{background: "linear-gradient(45deg, #0070F3 0%, #00D1B2 100%)"}}>
        {/* Video BG */}
        <video
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          src="/demo/finance-hero.mp4"
          poster="/demo/finance-hero.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-label="Finance and analytics dashboard in action"
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
              From Snowflakes to P&L
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-2xl text-white/90 mb-8 max-w-xl"
            >
              A single analytics layer turns operational data into board-room insights.
            </motion.p>
            <div className="flex gap-4 mb-8">
              <button
                className="bg-gradient-to-r from-blue-600 to-teal-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform text-lg"
                onClick={() => window.location.href = "/contact"}
              >
                Schedule a Walkthrough
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
                src="/demo/finance-overview.mp4"
                poster="/demo/finance-hero.jpg"
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
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-700">Unified Data Warehouse</h2>
            <p className="text-lg text-gray-700 mb-6">
              Auto-ingest from Ticketing, POS, Rentals, HR. One source of truth for every department.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Automated data ingestion</li>
              <li>Connects all modules</li>
              <li>Eliminates data silos</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="order-2"
          >
            <DeviceFrame src={screenshots[0]} alt="Finance Dashboard screenshot" />
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
            <DeviceFrame src={screenshots[1]} alt="What-If Modeling screenshot" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-1 md:order-2"
          >
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-700">Dashboards & What-If Modeling</h2>
            <p className="text-lg text-gray-700 mb-6">
              RevPAR, F&B margin, rental yield, pass usage, and scenario planning—all out of the box.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Out-of-the-box dashboards</li>
              <li>What-if scenario modeling</li>
              <li>Forecasting & margin analysis</li>
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
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-blue-700">Automated Financial Close</h2>
            <p className="text-lg text-gray-700 mb-6">
              Mapping to your chart of accounts with Xero, QuickBooks, or NetSuite sync. Save days every month.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Automated close process</li>
              <li>ERP/accounting sync</li>
              <li>Role-based alerts for KPIs</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="order-2"
          >
            <DeviceFrame src={screenshots[2]} alt="Automated Financial Close screenshot" />
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
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Ready to turn data into downhill momentum?</h2>
            <p className="text-white/90 mb-8 text-lg max-w-md">
              A single analytics layer turns operational data into board-room insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform text-lg"
              >
                Schedule a Walkthrough
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