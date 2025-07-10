'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Difference } from '@/components/landing/Difference'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { UseCases } from '@/components/landing/UseCases'
import { Integrations } from '@/components/landing/Integrations'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonial } from '@/components/landing/Testimonial'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Difference />
        <FeaturesGrid />
        <UseCases />
        <Integrations />
        <Pricing />
        <Testimonial />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
} 