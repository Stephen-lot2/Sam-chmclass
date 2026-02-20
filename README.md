# Samuel ChemLab - Chemistry Learning Platform

A modern, responsive UI design system for a secondary school Chemistry learning and course management application built with React, Tailwind CSS, and Supabase.

## 🎨 Design Features

- **Soft Pastel Color Palette**: Clean, friendly colors inspired by modern learning apps
- **Smooth Gradients**: Beautiful gradient backgrounds and cards
- **Rounded Cards**: Modern card-based layouts with soft shadows
- **Responsive Design**: Optimized for both mobile and web screens
- **Modern Typography**: Inter font family for clean, readable text
- **Lightweight Analytics**: Progress tracking with charts and visualizations

## 📱 Mobile UI Components

- **Bottom Navigation**: 5-tab navigation (Home, Courses, Live Classes, Tests, Profile)
- **Onboarding Screens**: Welcome flow with custom illustrations
- **Dashboard**: Progress tracking, upcoming classes, and quick stats
- **Course List**: Grid view with progress indicators
- **Live Classes**: Join interface with participant list
- **Tests**: Exam interface with timer and question navigation
- **Profile**: User stats and settings

## 🖥 Web UI Components

- **Sidebar Navigation**: Fixed left sidebar with main navigation
- **Dashboard**: Comprehensive overview with stats, calendar, and learning reports
- **Course Catalog**: Grid layout with filters and search
- **Course Detail**: Video player, lesson list, and materials
- **Live Classroom**: Video interface with chat panel and controls
- **Exam Interface**: Timed test with question navigator
- **Orders**: Subscription plans and order history

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### Installation

```bash
npm install
```

### Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in your SQL Editor
3. (Optional) Run `supabase/seed.sql` for sample data
4. Copy `.env.example` to `.env` and add your credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📦 Tech Stack

- React 18
- Tailwind CSS 3
- Vite
- React Router DOM
- Lucide React (Icons)
- Supabase (Backend & Auth)

## 🎯 Key Features

- ✅ Responsive design (mobile & desktop)
- ✅ Authentication with Supabase
- ✅ User profiles and progress tracking
- ✅ Course management system
- ✅ Live class scheduling
- ✅ Test/exam interface
- ✅ Subscription management
- ✅ Real-time updates
- ✅ Row Level Security (RLS)

## 📚 Documentation

See [SETUP.md](SETUP.md) for detailed setup instructions.

## 🎨 Color Palette

- **Primary Blue**: `#0ea5e9` - Main brand color
- **Secondary Purple**: `#d946ef` - Accent color
- **Success Green**: `#22c55e` - Positive actions
- **Pastel Variants**: Soft backgrounds for cards and sections

## 📄 License

This project is created for educational purposes.
