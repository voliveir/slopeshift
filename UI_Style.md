# SlopeShift UI/UX Style Guide

## Landing Page
- **Layout:**
  - Centered, responsive sections with generous vertical spacing.
  - Uses a modern, clean hero section with a gradient background.
  - Content sections (Features, Use Cases, Integrations, Pricing, Testimonials, CTA) are stacked vertically with clear separation.
- **Color:**
  - Primary: Blue gradients (`from-blue-600` to `to-cyan-400`), white backgrounds, and dark footer (`bg-gray-900`).
  - Accent: Aqua for highlights and icons.
- **Typography:**
  - Large, bold headlines for hero and section titles.
  - Clean, sans-serif font (Inter).
  - Subtle, readable body text in gray.
- **Navigation:**
  - Top navigation bar with logo, links, and CTA button.
  - Footer with four columns: Product, Company, Resources, Legal (rightmost), and social icons.
- **Interaction:**
  - Smooth hover transitions on links and buttons.
  - Animated entrance for sections (Framer Motion).

## Dashboard (Client View)
- **Layout:**
  - Sidebar on the left with SlopeShift logo at the top, vertically aligned with the top bar.
  - Main content area to the right, with a top bar for page title and actions.
  - Responsive, max-width content containers.
- **Color:**
  - Light background (`bg-secondary-50`), white cards, and primary blue accents.
  - Dark mode supported with `dark:` classes.
- **Typography:**
  - Bold, clear section titles.
  - Consistent font sizes for navigation and content.
- **Navigation:**
  - Sidebar shows only modules enabled for the client, with icons and labels.
  - Top bar includes search, notifications, and user menu.
- **Interaction:**
  - Sidebar links highlight on hover.
  - Impersonation banner (if active) is full-width and prominent at the top.
  - Buttons have soft shadows and smooth transitions.

## Admin Page
- **Layout:**
  - Sidebar on the left with fixed admin links (Clients, Modules, Billing, Logs).
  - Main content area for admin management (client list, module assignment, etc.).
- **Color:**
  - Similar to dashboard, but with more neutral backgrounds for admin clarity.
- **Typography:**
  - Clear, bold labels for navigation and admin actions.
- **Navigation:**
  - Sidebar is always visible, with clear separation from main content.
- **Interaction:**
  - Admin actions (edit, impersonate, etc.) are clearly indicated with buttons or icons.
  - Consistent hover and focus states for accessibility.

---

**General Principles:**
- Responsive design for all screen sizes.
- Consistent use of Tailwind CSS utility classes.
- Accessible color contrast and focus states.
- Smooth, modern transitions and animations.
- Minimal, clean, and professional look throughout. 