# 🍔 CampusBite (karthi-CampusBite) – Smart Canteen Food Ordering System

CampusBite is a modern, responsive digital canteen food ordering web application designed specifically for college campuses. It allows students to order meals ahead of time, skip lengthy counter queues, simulate online or cash payments, and track live food preparation status. It also includes an integrated Admin & Kitchen Staff Portal to monitor daily revenue, queue metrics, update order stages, and manage canteen menu catalogs in real-time.

---

## 🌟 Key Features

### 🧑‍🎓 Student Portal
- **Menu Discovery**: Browse categories (*Breakfast, Meals, Snacks, Beverages, Fast Food*) with prices, prep times, and descriptions.
- **Dietary Filter**: Instant toggle for **Pure Veg Only** with distinct green/red visual indicators.
- **Instant Search**: Real-time fuzzy search across dish names and descriptions.
- **Tray & Cart Management**: Add items, adjust quantities, view subtotal, eco-packaging fee, and grand total.
- **Special Kitchen Notes**: Add custom instructions (*e.g., "extra sambar", "less spice"*).
- **Pickup Counter Selection**: Select between *Main Canteen Counter 1*, *Snack Counter 2*, or *Beverage Station 3*.
- **Mock Payment Gateway**:
  - **UPI QR / App**: Simulated QR code with countdown timer and one-click authorization.
  - **Debit / Credit Card**: Masked card form with instant validation.
  - **Cash on Pickup**: Pay in cash at the counter upon food collection.
- **Live Visual Order Tracker**:
  - 5-step animated progress stepper:
    $$\text{Order Received} \longrightarrow \text{Confirmed} \longrightarrow \text{In Kitchen} \longrightarrow \text{Ready for Pickup} \longrightarrow \text{Completed}$$
  - Live auto-refreshing polling (every 4 seconds) to show kitchen progress without page reload.
  - Estimated pickup time countdown.
  - Order cancellation option before cooking starts.
- **Order History**: Review previous meals, receipts, and order tokens.

### 👨‍🍳 Admin & Kitchen Staff Portal
- **Canteen Operations Dashboard**:
  - Total Orders Today
  - Active Orders In Kitchen / Queue
  - Completed Orders Today
  - Today's Total Revenue in ₹ (INR)
  - Top Selling Campus Dish
- **Live Kitchen Order Management**:
  - Visual status pill badges.
  - One-click progression buttons (*"Confirm Order"*, *"Start Cooking"*, *"Mark Ready"*, *"Complete Handover"*).
  - Filter orders by status (*All, Pending, Preparing, Ready, Completed, Cancelled*).
- **Menu Catalog Management**:
  - Add new food items with name, price, category, veg/non-veg badge, and photo.
  - Curated quick photo presets for instant testing.
  - Real-time **In Stock / Out of Stock** single-click toggle.
  - Edit and Delete food items with confirmation alerts.

---

## 🚀 One-Click Demo Credentials

CampusBite includes a **Bootcamp Demo Switcher ribbon** at the top of the interface for instantaneous 1-click role swapping:

| Role | Email | Password | Student / Staff ID |
| :--- | :--- | :--- | :--- |
| **Canteen Admin** | `admin@campusbite.com` | `admin123` | `STAFF-01` |
| **Student (Rahul)** | `rahul@campus.edu` | `student123` | `CS2024-042` |
| **Student (Priya)** | `priya@campus.edu` | `student123` | `EC2024-118` |

---

## 🛠️ Technology Stack

- **Backend**: Node.js & Express 5 REST API
- **Database**: Zero-setup embedded SQLite using Node's native `node:sqlite` (`campusbite.sqlite`). Automatically seeds users, dishes, and realistic orders upon first boot!
- **Frontend**: React 19 & Vite 6
- **Styling**: Modern Vanilla CSS Design System (Custom variables, glassmorphism, fluid typography with Google Outfit & Plus Jakarta Sans, CSS micro-animations)
- **Icons**: Lucide Icons
- **Celebration Effects**: Canvas Confetti

---

## 💻 Local Setup & Running Instructions

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm

### 1. Install Dependencies
Run from the project root:
```bash
npm install
cd client && npm install && cd ..
```

### 2. Start the Application
To run the production-ready server and client together:
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your web browser.

### 3. Run in Development Mode (With Hot Reloading)
```bash
npm run dev
```
- Frontend Dev Server: `http://localhost:5173`
- Backend API Server: `http://localhost:5000`

### 4. Run Automated Test Suite
```bash
npm test
```
Runs 10 end-to-end integration tests verifying health checks, authentication, menu filtering, order placement, order tracking, admin stats, and cancellation rules.

---

## 📁 Project Folder Structure

```
CampusBite/
├── campusbite.sqlite         # Native SQLite database (auto-created & seeded)
├── package.json              # Root scripts (start, dev, build, test, seed)
├── README.md                 # Setup & demonstration guide
├── server/
│   ├── server.js             # Express API entry point & static SPA host
│   ├── db/
│   │   ├── database.js       # SQLite connection & table schemas
│   │   └── seed.js           # Seed data (15+ canteen items, users, orders)
│   ├── middleware/
│   │   └── auth.js           # JWT authentication & role-based guards
│   └── routes/
│       ├── authRoutes.js     # Student & Admin registration and login
│       ├── menuRoutes.js     # Public menu query + Admin CRUD & stock toggle
│       ├── orderRoutes.js    # Order creation, history, live tracking & cancel
│       └── adminRoutes.js    # Admin analytics metrics & kitchen queue
├── client/
│   ├── index.html            # HTML entry with Google Fonts
│   ├── vite.config.js        # Vite config with API proxy
│   ├── package.json          # React, Lucide, Confetti dependencies
│   └── src/
│       ├── App.jsx           # Root orchestrator & role switcher ribbon
│       ├── main.jsx          # React DOM entry
│       ├── styles/
│       │   └── index.css     # Complete design system & custom CSS
│       ├── context/
│       │   ├── AuthContext.jsx # Auth state, token, 1-click login helpers
│       │   └── CartContext.jsx # Cart state, persistence, bill totals
│       ├── components/
│       │   ├── Navbar.jsx    # Sticky navigation, cart badge, mobile drawer
│       │   ├── Footer.jsx    # Hours, pickup counter locations, hotline
│       │   ├── FoodCard.jsx  # Food cards with veg badge, price, add to tray
│       │   ├── StatusBadge.jsx # Color-coded status pills
│       │   ├── OrderTracker.jsx # Visual 5-step progress bar
│       │   ├── MockPaymentModal.jsx # UPI QR, Card & Cash simulation
│       │   └── Toast.jsx     # Transient feedback notifications
│       └── pages/
│           ├── HomePage.jsx  # Hero banner, 3-step guide, featured food
│           ├── MenuPage.jsx  # Search, categories, veg toggle, dishes grid
│           ├── CartPage.jsx  # Tray items, quantity stepper, instructions
│           ├── CheckoutPage.jsx # Student details, counter picker, pay trigger
│           ├── TrackOrderPage.jsx # Auto-polling 5-step live tracker
│           ├── OrderHistoryPage.jsx # Past orders and digital receipts
│           ├── AuthModal.jsx # Login/register modal with demo credentials
│           └── admin/
│               ├── AdminDashboard.jsx # Revenue, orders, popular dish KPI
│               ├── AdminOrders.jsx    # Live queue with 1-click status actions
│               └── AdminMenu.jsx      # Menu CRUD & stock toggle switches
└── test/
    └── api-test.js           # Automated end-to-end integration test suite
```

