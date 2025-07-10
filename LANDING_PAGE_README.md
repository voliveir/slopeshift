# SlopeShift Landing Page

A modern, high-converting SaaS landing page for SlopeShift - the complete mountain resort operations platform.

## 🎨 Design System

### Brand Colors
- **Primary Alpine Blue**: `#1B4FFF` - Used for CTAs and primary actions
- **Primary Aqua**: `#2AE7E3` - Used for gradients and accents
- **Deep Alpine Blue**: `#1B4FFF` - Primary brand color
- **Aqua**: `#2AE7E3` - Secondary brand color

### Typography
- **Font Stack**: Inter (sans-serif)
- **Headings**: Bold weights with tight line heights
- **Body**: Medium weight for readability

### Animations
- **Framer Motion**: Used for scroll-reveal and hover animations
- **Subtle transitions**: Scale, fade, and slide effects
- **Performance optimized**: Uses `whileInView` for scroll-triggered animations

## 📁 Component Structure

```
components/landing/
├── Header.tsx          # Sticky navigation with mobile menu
├── Hero.tsx           # Main hero section with CTAs
├── Difference.tsx     # "The SlopeShift Difference" section
├── FeaturesGrid.tsx   # Feature modules grid (6 cards)
├── UseCases.tsx      # Industry use-case carousel
├── Integrations.tsx  # Integration logos and links
├── Pricing.tsx       # Transparent pricing panel
├── Testimonial.tsx   # Customer testimonial block
├── FinalCTA.tsx      # Final call-to-action section
└── Footer.tsx        # Footer with links and social
```

## 🚀 Features Implemented

### ✅ Completed Sections

1. **Header (Sticky)**
   - Logo with wordmark
   - Navigation links (Features, Pricing, Integrations, Resources, About)
   - Login button (outline style)
   - Request Demo CTA (primary style)
   - Mobile-responsive hamburger menu

2. **Hero Section**
   - Headline: "All-Season Resort Ops, Perfectly in Sync."
   - Sub-headline with value proposition
   - Primary CTA: "Request a Demo"
   - Secondary CTA: "Watch 90-sec Overview"
   - Background: Blue-to-aqua gradient with mountain illustration
   - Partner logos strip (placeholder)

3. **The SlopeShift Difference**
   - Three-column layout
   - Tailored in Weeks
   - Built for Modern Resorts
   - Headless & Modular

4. **Feature Modules Grid**
   - 6 feature cards with icons
   - Ticketing & Passes
   - Rental & Demo Gear
   - Retail & F&B POS
   - Lift & Trail Maintenance
   - Snowmaking & Grooming
   - Finance & Analytics

5. **Industry Use-Case Carousel**
   - Single-Mountain Resorts
   - Multi-Mountain Groups
   - Year-Round Destinations
   - Interactive navigation

6. **Integrations Strip**
   - Logo wall with 12 integrations
   - RTP, Axess, Inntopia, Shopify, Stripe, QuickBooks, Xero, Mailchimp, Snowcat, WeatherFlow, OpenSnow, Snowflake
   - "View all integrations" link

7. **Pricing Panel**
   - Usage-based + flat support fee
   - No per-user charges
   - Implementation & training included
   - Starting at $2,500/month

8. **Testimonial Block**
   - Quote from COO, Alta Mountain
   - 28% improvement in rental turnaround time
   - Full-width light gray background

9. **Final CTA**
   - "Ready to future-proof your mountain?"
   - Request Demo button
   - Trust indicators (no credit card, 30-day trial)

10. **Footer**
    - Quick links mirroring header nav
    - Social icons (LinkedIn, Twitter)
    - Copyright notice
    - Organized link categories

### 🎯 Design Principles

- **Minimal & Spacious**: Plenty of white space like Tailor.tech
- **Modern UI**: Pill-shaped buttons with gentle shadows
- **Subtle Animations**: Fade-in and scale-up hover effects
- **Responsive**: Mobile-first design with breakpoint optimization
- **Accessible**: WCAG AA color contrast compliance

## 🛠 Technical Implementation

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

### Key Features
- **Component-based**: Modular, reusable components
- **Performance**: Lazy loading and optimized animations
- **SEO-friendly**: Semantic HTML5 structure
- **Mobile-responsive**: Touch-friendly interactions

## 📋 TODO Items

### Dynamic Content
- [ ] Replace placeholder partner logos with actual images
- [ ] Add real integration logos
- [ ] Replace testimonial profile image
- [ ] Add interactive demo visualizations in UseCases carousel

### Functionality
- [ ] Implement actual form handling for CTAs
- [ ] Add video modal for "Watch 90-sec Overview"
- [ ] Connect pricing calculator
- [ ] Add analytics tracking

### Performance
- [ ] Optimize images and SVGs
- [ ] Implement proper lazy loading
- [ ] Add loading states for interactive elements

## 🎨 Design Tokens

All design tokens are exported in `design-tokens.json` for use in:
- Design tools (Figma, Sketch)
- Development consistency
- Brand guidelines
- Future component libraries

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **View the landing page**:
   Open http://localhost:3000

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Conversion Optimization

- **Clear CTAs**: Primary actions prominently displayed
- **Social Proof**: Partner logos and testimonials
- **Value Proposition**: Clear benefits in hero section
- **Trust Indicators**: No credit card required, free trial
- **Progressive Disclosure**: Information revealed as user scrolls

## 🔧 Customization

### Colors
Update `tailwind.config.js` to modify brand colors:
```javascript
colors: {
  primary: {
    alpine: '#1B4FFF',
    aqua: '#2AE7E3',
    // ... other shades
  }
}
```

### Animations
Modify animation timing in component files:
```javascript
transition={{ duration: 0.8, delay: 0.2 }}
```

### Content
Update text content directly in component files or create a content management system.

## 📄 License

This landing page is part of the SlopeShift project. All rights reserved. 