# SlopeShift - Ski Resort Management Platform

A modern, polished SaaS application for ski resort managers to schedule staff, oversee housing, and track certifications. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### 🔐 Authentication
- Branded login page with alpine tech design
- Secure authentication flow
- Demo credentials: `admin@slopeshift.com` / `password`

### 🎨 Design System
- **Alpine Tech Theme**: Cool blues & deep navy with bright accent colors
- **Dark Mode**: Toggle that persists between sessions
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Micro-animations**: Smooth transitions and hover effects

### 📊 Dashboard
- KPI cards with real-time metrics
- Activity feed with recent actions
- Revenue and staff utilization tracking
- Responsive grid layout

### 👥 Staff Management
- Searchable staff directory
- Department and status filtering
- Staff cards with contact information
- Role and certification tracking

### 🏠 Housing Management
- Tabular view of housing units
- Occupancy tracking with visual indicators
- Status management (available, full, maintenance)
- Amenities and location details

### 🏆 Certifications
- Certification tracking with expiry dates
- Status indicators (active, expired, expiring soon)
- Issuing authority and certificate numbers
- Renewal reminders

### 📅 Shift Scheduling
- Interactive calendar view
- Drag-and-drop functionality (ready for implementation)
- Shift details with time, location, and status
- Monthly navigation

### 🔍 Global Features
- **Search**: Global search across all modules
- **Notifications**: Real-time notification system
- **User Menu**: Profile management and settings
- **Responsive Layout**: Sidebar becomes slide-over on mobile

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons

### Styling & Design
- **Custom Design Tokens**: Alpine tech color palette
- **Glass Effects**: Subtle backdrop blur effects
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection

### State Management
- **React Hooks**: Local state management
- **Next.js App Router**: Server-side rendering
- **Mock Data**: Comprehensive sample data

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slopeshift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login
- **Email**: `admin@slopeshift.com`
- **Password**: `password`

## 📁 Project Structure

```
slopeshift/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── staff/         # Staff management
│   │   ├── housing/       # Housing management
│   │   ├── certifications/# Certifications tracking
│   │   ├── shifts/        # Shift scheduling
│   │   └── layout.tsx     # App layout with sidebar
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Login page
├── components/            # Reusable components
│   ├── sidebar.tsx        # Navigation sidebar
│   ├── top-bar.tsx        # Top navigation bar
│   └── theme-provider.tsx # Dark mode provider
├── data/                  # Mock data
│   └── mock-data.ts       # Sample data for all entities
├── lib/                   # Utility functions
│   └── utils.ts           # Common utilities
├── types/                 # TypeScript definitions
│   └── index.ts           # Type definitions
└── public/                # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Cool blues (#0ea5e9 to #082f49)
- **Secondary**: Deep navy grays (#f8fafc to #020617)
- **Accent**: Bright orange (#f2751a)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono
- **Responsive**: Fluid type scaling

### Spacing & Layout
- **Consistent Rhythm**: 4px base unit
- **Rounded Corners**: Large radius for modern feel
- **Shadows**: Soft, medium, and large variants
- **Glass Effects**: Backdrop blur with transparency

## 🔧 Customization

### Adding New Pages
1. Create a new directory in `app/(app)/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `components/sidebar.tsx`

### Modifying the Theme
1. Edit `tailwind.config.js` for color changes
2. Update `app/globals.css` for custom styles
3. Modify component classes for layout changes

### Adding New Data Types
1. Define types in `types/index.ts`
2. Add mock data in `data/mock-data.ts`
3. Create corresponding components and pages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Environment variables will be handled automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Next Steps

### Backend Integration
- Replace mock data with real API calls
- Implement authentication with NextAuth.js
- Add database integration (PostgreSQL, MongoDB)
- Set up real-time updates with WebSockets

### Enhanced Features
- **Drag & Drop**: Implement react-beautiful-dnd for shifts
- **Real-time Notifications**: WebSocket integration
- **File Upload**: Staff photos and certification documents
- **Reporting**: Advanced analytics and reporting
- **Mobile App**: React Native companion app

### Performance Optimizations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for better loading
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern SaaS patterns and alpine aesthetics
- **Icons**: Lucide React for beautiful, consistent icons
- **Animations**: Framer Motion for smooth interactions
- **Styling**: Tailwind CSS for rapid development

---

Built with ❄️ for ski resort managers everywhere. 