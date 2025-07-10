'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, predictable pricing that scales with your resort
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-large">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Usage-based + Flat Support
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Pay only for what you use, with no per-user charges. Includes implementation and training.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary-alpine rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Usage-based pricing</h4>
                      <p className="text-gray-600">Pay per transaction, lift ticket, or rental</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary-alpine rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">No per-user charges</h4>
                      <p className="text-gray-600">Unlimited users included in your plan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary-alpine rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Implementation included</h4>
                      <p className="text-gray-600">Full setup and training at no extra cost</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-primary-alpine rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">24/7 support</h4>
                      <p className="text-gray-600">Dedicated support team for mountain operations</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-alpine text-white px-8 py-4 rounded-full font-semibold shadow-large hover:shadow-glow transition-all duration-200 flex items-center space-x-2"
                >
                  <span>See detailed pricing</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="bg-gradient-to-br from-primary-alpine/5 to-primary-aqua/5 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    Starting at
                  </div>
                  <div className="text-6xl font-bold text-primary-alpine mb-4">
                    $2,500
                  </div>
                  <div className="text-gray-600 mb-6">
                    per month
                  </div>
                  <div className="text-sm text-gray-500">
                    *Pricing varies based on resort size and modules selected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 