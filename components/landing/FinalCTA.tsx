'use client'

import { motion } from 'framer-motion'
import { Mountain } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-alpine to-primary-aqua">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to future-proof your mountain?
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join leading resorts already using SlopeShift to streamline their operations
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-alpine px-12 py-6 rounded-full font-semibold text-lg shadow-large hover:shadow-glow transition-all duration-200 flex items-center space-x-3 mx-auto"
          >
            <span>Request a Demo</span>
            <Mountain className="h-6 w-6" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/70 mt-8 text-sm"
          >
            No credit card required • 30-day free trial • Full implementation support
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
} 