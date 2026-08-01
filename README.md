# 🛠️ FixItNow — On-Demand Home Service & Technician Booking Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**FixItNow** is a modern, full-stack, on-demand home repair and technician booking application. It seamlessly connects customers seeking reliable home services (AC repair, plumbing, electrical work, carpentry, painting, etc.) with background-checked, expert technicians.

---

## 🚀 Live Demo & Deployment

- **Frontend Live URL:** [https://frontend-five-sand-57.vercel.app](https://frontend-five-sand-57.vercel.app)
- **Backend API URL:** [https://fix-it-now-brown.vercel.app](https://fix-it-now-brown.vercel.app)

---

## ✨ Key Features & User Roles

### 🌐 Public Portal
- **Hero & Banner**: Interactive service ticket preview, quick category search, and dynamic visual design system.
- **Popular Service Categories**: Dynamic categories list fetched from backend with custom category icons & skeleton loaders.
- **Top Rated Technicians Grid**: Showcases verified technicians with rating badges, locations, hourly rates, and instant booking CTA.
- **Interactive Contact Page**: Contact form with loading/success states, company info cards, and integrated **Google Maps embed** for Banani, Dhaka location.
- **Legal & Compliance (`/legal`)**: Interactive multi-tab documentation covering Terms of Service, Privacy Policy, Refund Guidelines, and Technician Code of Conduct with print capabilities.

### 👤 Customer Dashboard (`/dashboard`)
- **Command Center Overview**: Real-time KPI cards for Total Bookings, Active Services, Completed Jobs, and Total Spent.
- **My Bookings (`/dashboard/bookings`)**: Manage appointment slots, live status tracking (PENDING, ACCEPTED, DECLINED, COMPLETED), and review submissions.
- **Online Payments**: Integrated SSLCommerz / gateway online payment workflow with instant invoice state updates.
- **Profile & Security (`/dashboard/profile`)**: Update name, account details, and **Change Password modal** with live validation.

### 👨‍🔧 Technician Dashboard (`/technician-dashboard`)
- **Profile & Skills Management**: Customize public bio, location, base hourly rate, and category skill tags.
- **Availability Schedule**: Set active booking status toggle, working days (Mon-Sun), and daily working hours.
- **Job Requests**: Manage incoming client requests and mark job progress.
- **Security**: Dedicated Change Password modal and profile updates.

### 👑 Admin Dashboard (`/admin-dashboard`)
- **Platform Analytics**: Total System Users count, Category statistics, System Revenue (৳), and Account restrictions health.
- **User Management (`/admin-dashboard/users`)**: Search users, filter by roles (Customer, Technician, Admin), and **Ban / Unban** accounts instantly.
- **Category CRUD (`/admin-dashboard/categories`)**: Create, edit, search, and delete service categories with automatic revalidation.
- **Payment Audit (`/admin-dashboard/payments`)**: Monitor platform-wide transaction history and status logs.

---

## 🛠️ Tech Stack & Libraries

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Design System (`#FF5A36` Coral, `#0FA894` Teal, `#14171C` Ink)
- **Icons & UI Utilities:** [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.si/) (Toast Notifications)
- **HTTP & Authentication:** JWT Cookie Session Handler & Next.js Revalidation Tags (`revalidateTag`, `revalidatePath`)

---

## 📁 Repository Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (authGroup)/             # Authentication routes & server actions
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── _actions/            # authActions.ts, profileActions.ts
│   │   ├── (withcommonlayout)/      # Public pages with header & footer navigation
│   │   │   ├── categories/
│   │   │   ├── contact/             # Contact Us with Google Maps embed
│   │   │   ├── legal/               # Legal & Compliance document tabs
│   │   │   ├── services/
│   │   │   ├── technicians/         # Technicians listing & JS sticky sidebar
│   │   │   └── page.tsx             # Main Landing Homepage
│   │   └── (withoutcommonlayout)/   # Role-based App Dashboards
│   │       ├── admin-dashboard/     # Admin Command Center & Management
│   │       ├── dashboard/           # Customer App Dashboard & Bookings
│   │       └── technician-dashboard/ # Technician Profile & Schedule Manager
│   └── components/
│       ├── home/                    # Banner, FeaturedCategories, FeaturedTechnicians, Faq
│       └── shared/                  # Navbar, Footer, UI Cards
├── public/                          # Static assets
└── package.json
```

---

## ⚙️ Getting Started Locally

### Prerequisites

- Node.js `v18.x` or higher
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nafi0123/FixItNow_fronted.git
   cd FixItNow_fronted
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   BACKEND_API_URL=http://localhost:5001
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Type Check & Build Verification

To verify TypeScript types prior to production build:
```bash
npx tsc --noEmit
npm run build
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
