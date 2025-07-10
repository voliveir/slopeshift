'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function Integrations() {
  const integrations = [
    'RTP',
    'Axess',
    'Inntopia',
    'Shopify',
    'Stripe',
    'QuickBooks',
    'Xero',
    'Mailchimp',
    'Snowcat',
    'WeatherFlow',
    'OpenSnow',
    'Snowflake'
  ]

  return (
    <section id="integrations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Native Integrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with your existing tools and workflows seamlessly
          </p>
        </motion.div>

        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={integration}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-gray-500 font-semibold text-sm">
                    {integration.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {integration}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all integrations link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <motion.a
            href="#"
            whileHover={{ x: 5 }}
            className="inline-flex items-center text-primary-alpine font-semibold hover:text-primary-alpine/80 transition-colors duration-200"
          >
            View all integrations
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
} 