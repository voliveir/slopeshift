'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function Testimonial() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-large">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary-alpine/10 rounded-full flex items-center justify-center">
                <Quote className="h-8 w-8 text-primary-alpine" />
              </div>
            </div>
            
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed"
            >
              "SlopeShift's modular architecture let us retire three legacy tools before peak season—and our rental turnaround time dropped by 28%."
            </motion.blockquote>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-4">
                {/* TODO: Replace with actual profile image */}
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  COO, Alta Mountain
                </div>
                <div className="text-gray-600 text-sm">
                  Mountain Resort Operations
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 