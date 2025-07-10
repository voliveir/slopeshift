'use client'

import { motion } from 'framer-motion'
import { 
  Ticket, 
  Snowflake, 
  ShoppingBag, 
  Mountain, 
  CloudSnow, 
  BarChart3,
  ArrowRight 
} from 'lucide-react'

export function FeaturesGrid() {
  const features = [
    {
      icon: Ticket,
      title: 'Ticketing & Passes',
      description: 'Streamline season pass sales and day ticket management with real-time inventory.',
      color: 'text-blue-600'
    },
    {
      icon: Snowflake,
      title: 'Rental & Demo Gear',
      description: 'Track equipment inventory and streamline the rental process from check-in to return.',
      color: 'text-green-600'
    },
    {
      icon: ShoppingBag,
      title: 'Retail & F&B POS',
      description: 'Unified point-of-sale system for all retail and food & beverage operations.',
      color: 'text-purple-600'
    },
    {
      icon: Mountain,
      title: 'Lift & Trail Maintenance',
      description: 'Monitor lift operations and trail conditions with real-time status updates.',
      color: 'text-orange-600'
    },
    {
      icon: CloudSnow,
      title: 'Snowmaking & Grooming',
      description: 'Coordinate snowmaking operations and track grooming schedules across all terrain.',
      color: 'text-cyan-600'
    },
    {
      icon: BarChart3,
      title: 'Finance & Analytics',
      description: 'Comprehensive reporting and analytics for data-driven resort management decisions.',
      color: 'text-indigo-600'
    }
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Feature Modules
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the modules you need and add more as your resort grows
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-medium transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-50 transition-colors duration-300 ${feature.color}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <motion.a
                href="#"
                whileHover={{ x: 5 }}
                className="inline-flex items-center text-primary-alpine font-semibold hover:text-primary-alpine/80 transition-colors duration-200"
              >
                Learn more
                <ArrowRight className="h-4 w-4 ml-2" />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 