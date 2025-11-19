# ☕ Brewhub

A full-stack coffee ordering platform built with Next.js, Laravel, and MongoDB Atlas.

**Live Demo:** [https://brewhub-rosy.vercel.app/](https://brewhub-rosy.vercel.app/)

> **⚠️ Note on Backend Performance:**
> The backend is hosted on **Render's free tier**, which spins down after 15 minutes of inactivity. If the application seems unresponsive initially, please allow **30-50 seconds** for the server to wake up. Subsequent requests will be instant.

## Features

  - JWT authentication with email validation and password strength enforcement
  - Product menu with category filtering and availability status
  - Drink customization with add-ons (extra shot, milk alternatives, syrups)
  - Shopping cart and checkout with add-on support
  - Order history and confirmation emails
  >📧 Note on Email Delivery: This project uses Mailtrap Sandbox for SMTP services. Since there is no verified sending domain, confirmation and welcome emails will not be delivered to real inboxes. Instead, they are intercepted and stored in the Mailtrap virtual inbox for safe testing.
  - User profile management
  - Responsive design with coffee shop aesthetic

## Tech Stack

**Frontend:** Next.js 14+ (TypeScript), Tailwind CSS, Zustand
**Backend:** Laravel 10+ (PHP 8.1+), MongoDB Atlas, Sanctum

## Prerequisites

  - Node.js 18+, npm 10+
  - PHP 8.1+, Composer
  - **MongoDB PHP Extension** (Required for Laravel to communicate with Atlas)
  - MongoDB Atlas account

## Quick Start

### Backend Setup

```bash
cd backend
cp .env.example .env
# Configure .env with your MongoDB connection string (DB_DSN)

composer install
php artisan key:generate
php artisan serve  # Runs on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev  # Runs on http://localhost:3000
```

## API Endpoints

**Public Routes**

  - `GET /api/health` - Server status check
  - `POST /api/register` - User registration
  - `POST /api/login` - User login
  - `GET /api/products` - List all products
  - `GET /api/products/{id}` - Product details
  - `GET /api/categories` - List product categories

**Protected Routes (Requires Bearer Token)**

  - **Auth:** `POST /api/logout`, `GET /api/user`
  - **Profile:** `GET /api/profile`, `PUT /api/profile`
  - **Cart:** `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/update/{id}`, `DELETE /api/cart/remove/{id}`
  - **Orders:** `GET /api/orders`, `POST /api/orders`, `GET /api/orders/{id}`

See individual README files in `frontend/` and `backend/` for more details.

## Project Structure

```
Brewhub/
├── frontend/                     # Next.js Frontend
│   ├── app/                      # App Router (Next.js 14+)
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── menu/                # Product menu page
│   │   ├── cart/                # Shopping cart page
│   │   ├── checkout/            # Checkout page
│   │   ├── profile/             # User profile page
│   │   ├── layout.tsx           # Root layout with Navbar
│   │   ├── page.tsx             # Home/landing page
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable React components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── AddOnModal.tsx       # Add-ons selection modal for drink customization
│   │   └── ConfirmModal.tsx     # Confirmation dialog for actions
│   ├── lib/                     # Utilities & client-side logic
│   │   ├── api.ts               # Axios API client
│   │   └── store.ts             # Zustand state stores
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # Shared types (User, Product, Cart, etc.)
│   └── package.json             # Dependencies (Next.js, React, Zustand, Axios)
│
└── backend/                      # Laravel Backend API
    ├── app/
    │   ├── Http/Controllers/    # API Controllers
    │   │   ├── AuthController.php       # Login, register, logout
    │   │   ├── CartController.php       # Cart operations
    │   │   ├── OrderController.php      # Order management
    │   │   ├── ProductController.php    # Product listing
    │   │   └── ProfileController.php    # User profile
    │   ├── Models/              # MongoDB Models
    │   │   ├── User.php         # User model with authentication
    │   │   ├── Product.php      # Coffee products
    │   │   ├── Cart.php         # Shopping cart items
    │   │   └── Order.php        # Customer orders
    │   ├── Rules/               # Custom validation rules
    │   │   └── StrongPassword.php
    │   └── Notifications/       # Email notifications
    │       ├── WelcomeEmail.php         # Welcome email on registration
    │       └── OrderConfirmation.php    # Order confirmation email with details
    ├── routes/
    │   └── api.php              # API routes definition
    ├── database/
    │   ├── seeders/             # Database seeders
    │   │   ├── ProductSeeder.php    # Sample products
    │   │   └── DatabaseSeeder.php
    │   └── database.sqlite      # Local SQLite (optional)
    ├── config/
    │   ├── database.php         # MongoDB connection config
    │   ├── sanctum.php          # JWT authentication config
    │   └── cors.php             # CORS configuration
    └── composer.json            # Dependencies (Laravel, MongoDB, Sanctum)
```

## License

Open source for educational purposes.
