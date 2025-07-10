'use client'

import { motion } from 'framer-motion'
import { Play, Mountain } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-alpine via-primary-aqua to-blue-400">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Stylized mountain illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900/20 to-transparent">
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-primary-aqua/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            All-Season Resort Ops,
            <br />
            <span className="text-primary-aqua">Perfectly in Sync.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            From lift tickets to rentals, SlopeShift unifies every mountain workflow in one headless, modular platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-alpine px-8 py-4 rounded-full font-semibold shadow-large hover:shadow-glow transition-all duration-200 flex items-center space-x-2"
            >
              <span>Request a Demo</span>
              <Mountain className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Watch 90-sec Overview</span>
            </motion.button>
          </motion.div>

          {/* Partner logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="border-t border-white/20 pt-8"
          >
            <p className="text-white/60 text-sm mb-6">Trusted by leading mountain resorts</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* TODO: Replace with actual partner logos */}
              <div className="text-white/40 font-semibold">Alta Mountain</div>
              <div className="text-white/40 font-semibold">Vail Resorts</div>
              <div className="text-white/40 font-semibold">Aspen Snowmass</div>
              <div className="text-white/40 font-semibold">Whistler Blackcomb</div>
              <div className="text-white/40 font-semibold">Park City</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
} 