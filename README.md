# 🏦 Quiz TopFinanzas - Credit Card Recommendation App

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square&logo=framer)

## 📋 Overview

Quiz TopFinanzas is an interactive web application that helps users find the perfect credit card based on their preferences and financial profile. The application features a sleek, multi-step form process with smooth animations and a responsive design optimized for mobile devices.

## ✨ Features

### 🔄 Multi-Step Form Experience

- **Step 1:** Select credit card preference (high credit limit, no annual fee, miles/points, etc.)
- **Step 2:** Indicate monthly income range
- **Step 3:** Fill in personal information (name, email, phone number)

### 🎯 User-Friendly Components

- **Progress Indicator:** Visual representation of form completion progress
- **Live Visitor Counter:** Shows number of successful applicants
- **Animated Transitions:** Smooth transitions between form steps using Framer Motion
- **Form Validation:** Comprehensive validation for email, name, and Mexican phone numbers

### 🎨 UI/UX Highlights

- **Modern Design:** Clean interface with TopFinanzas brand colors
- **Responsive Layout:** Optimized for mobile devices with 100% viewport height
- **Interactive Elements:** Animated buttons and form fields that provide visual feedback
- **Progress Bar:** Dynamic progress bar that updates as users complete each step

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15:** Leveraging the latest features of Next.js including server components
- **React 19:** Utilizing the latest React features and hooks

### Styling and UI

- **Tailwind CSS:** Utility-first CSS framework for rapid UI development
- **Framer Motion:** Animation library for creating smooth transitions between steps
- **Radix UI:** Headless UI components for accessible form elements
- **Shadcn UI:** Component collection built on top of Radix UI

### Form Management

- **Custom Form Handling:** State management for multi-step form validation
- **Zod:** Schema validation library

## 🚀 Project Structure

```markdown
quiz-topfinanzas-mx/
├── app/                  # Next.js application routes
│   ├── page.tsx          # Main entry point
│   ├── layout.tsx        # Root layout component
│   └── globals.css       # Global styles
├── components/           # UI components
│   ├── credit-card-form.tsx     # Main form container
│   ├── ProgressIndicator.tsx    # Form step indicator
│   ├── VisitorCounter.tsx       # Live visitor counter
│   ├── steps/                   # Step components
│   │   ├── step1.tsx            # Credit card preference
│   │   ├── step2.tsx            # Income selection
│   │   └── step3.tsx            # Personal info
│   └── ui/                      # Reusable UI components
├── lib/                  # Utility functions and constants
│   ├── constants.ts      # App constants
│   ├── strings.ts        # Text strings
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 📱 User Flow

1. **Initial View:** User sees step 1 with credit card preference options
2. **Selection Process:** After selecting a preference, automatically advances to step 2
3. **Income Selection:** User selects their income range, advances to final step
4. **Personal Information:** User enters contact details and submits the form
5. **Redirection:** Upon successful submission, user is redirected to the credit card options page

## 🔍 Key Features Detail

### Form Validation

- Email validation with Mexican domain awareness
- Name validation ensuring minimum character requirements
- Phone number validation specific to Mexican mobile numbers (10 digits)
- LADA code validation for Mexican phone numbers

### UI Animations

- Smooth transitions between steps with slide effects
- Progress bar animation that reflects completion percentage
- Button hover effects for better user interaction

## ⚙️ Development

### Prerequisites

- Node.js 18+
- npm or Bun package manager

### Setup

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun run dev
```

## 📄 License & Copyright

© Top Networks Inc. 2025. All rights reserved.

---

Built with ❤️ for TopFinanzas
