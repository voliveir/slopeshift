'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Mountain, MountainSnow, Trees } from 'lucide-react'

export function UseCases() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const useCases = [
    {
      icon: Mountain,
      title: 'Single-Mountain Resorts',
      description: 'Streamline daily operations with unified workflows and real-time visibility.',
      features: [
        'Centralized lift ticket management',
        'Integrated rental operations',
        'Real-time inventory tracking',
        'Unified staff scheduling'
      ],
      color: 'text-blue-600'
    },
    {
      icon: MountainSnow,
      title: 'Multi-Mountain Groups',
      description: 'Centralize inventory & reporting across multiple properties with shared resources.',
      features: [
        'Cross-property inventory management',
        'Unified reporting dashboard',
        'Shared customer database',
        'Centralized pricing strategies'
      ],
      color: 'text-green-600'
    },
    {
      icon: Trees,
      title: 'Year-Round Destinations',
      description: 'Switch seamlessly between winter and summer activities with seasonal workflows.',
      features: [
        'Seasonal activity switching',
        'Year-round customer engagement',
        'Flexible equipment management',
        'Multi-season pass options'
      ],
      color: 'text-purple-600'
    }
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % useCases.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + useCases.length) % useCases.length)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-primary-alpine to-primary-aqua">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Industry Use Cases
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Tailored solutions for every type of mountain resort operation
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-large"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className={`w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-8 ${useCases[currentIndex].color}`}>
                    {React.createElement(useCases[currentIndex].icon, { className: "h-10 w-10" })}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {useCases[currentIndex].title}
                  </h3>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {useCases[currentIndex].description}
                  </p>
                  <ul className="space-y-4">
                    {useCases[currentIndex].features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center text-gray-700"
                      >
                        <div className="w-2 h-2 bg-primary-alpine rounded-full mr-4"></div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="hidden lg:block">
                  <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      {React.createElement(useCases[currentIndex].icon, { className: "h-24 w-24 mx-auto mb-4 opacity-20" })}
                      <p className="text-lg font-semibold">Interactive Demo</p>
                      <p className="text-sm">TODO: Add interactive demo visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            
            <div className="flex space-x-2">
              {useCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
} 