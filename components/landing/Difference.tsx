'use client'

import { motion } from 'framer-motion'
import { Zap, Smartphone, Puzzle } from 'lucide-react'

export function Difference() {
  const differences = [
    {
      icon: Zap,
      title: 'Tailored in Weeks',
      description: 'Low-code customization for unique resort needs.',
      color: 'text-blue-600'
    },
    {
      icon: Smartphone,
      title: 'Built for Modern Resorts',
      description: 'Mobile-first UI, API-first backend.',
      color: 'text-green-600'
    },
    {
      icon: Puzzle,
      title: 'Headless & Modular',
      description: 'Pick only the modules you need, add as you grow.',
      color: 'text-purple-600'
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The SlopeShift Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built specifically for the unique challenges of mountain resort operations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {differences.map((difference, index) => (
            <motion.div
              key={difference.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-6 ${difference.color}`}>
                <difference.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {difference.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {difference.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 