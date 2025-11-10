# ☕ Brewhub

A full-stack coffee ordering platform with Next.js, Laravel, and MongoDB Atlas.

## Features

- JWT authentication with email validation and password strength enforcement
- Product menu with category filtering
- Shopping cart and checkout
- User profile management
- Responsive design with coffee shop aesthetic

## Tech Stack

**Frontend:** Next.js 14+ (TypeScript), Tailwind CSS, Zustand  
**Backend:** Laravel 10+ (PHP 8.1+), MongoDB Atlas, Sanctum

## Prerequisites

- Node.js 18+, npm 10+
- PHP 8.1+, Composer
- MongoDB Atlas account

## Quick Start

### Backend Setup

```bash
cd backend
composer install
# Configure .env with MongoDB connection string
php artisan db:seed
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

**Public:** `/api/register`, `/api/login`, `/api/products`  
**Protected:** `/api/user`, `/api/cart`, `/api/orders`, `/api/profile`

See individual README files in `frontend/` and `backend/` for more details.

## Project Structure

```
Brewhub/
├── frontend/                    # Next.js Frontend
│   ├── app/                     # App Router (Next.js 14+)
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── menu/               # Product menu page
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── profile/            # User profile page
│   │   ├── layout.tsx          # Root layout with Navbar
│   │   ├── page.tsx            # Home/landing page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   │   └── Navbar.tsx          # Navigation bar
│   ├── lib/                    # Utilities & client-side logic
│   │   ├── api.ts              # Axios API client
│   │   └── store.ts            # Zustand state stores
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Shared types (User, Product, Cart, etc.)
│   └── package.json            # Dependencies (Next.js, React, Zustand, Axios)
│
└── backend/                     # Laravel Backend API
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
    │       └── WelcomeEmail.php
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