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
  - `GET /api/products/{id}/reviews` - Get reviews for a product

**Protected Routes (Requires Bearer Token)**

  - **Auth:** `POST /api/logout`, `GET /api/user`
  - **Profile:** `GET /api/profile`, `PUT /api/profile`
  - **Cart:** `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/update/{productId}`, `DELETE /api/cart/remove/{productId}`, `DELETE /api/cart/clear`
  - **Orders:** `GET /api/orders`, `POST /api/orders`, `GET /api/orders/{id}`
  - **Reviews:** `POST /api/reviews`, `GET /api/orders/{id}/review-status`

**Admin Routes (Requires Bearer Token + Admin Role)**

  - `GET /api/admin/orders` - List all orders (admin view)
  - `PUT /api/admin/orders/{id}` - Update order status

See individual README files in `frontend/` and `backend/` for more details.

## Project Structure

```
Brewhub/
├── frontend/                     # Next.js Frontend
│   ├── app/                      # App Router (Next.js 14+)
│   │   ├── admin/               # Admin section
│   │   │   └── orders/          # Admin order management page
│   │   ├── cart/                # Shopping cart page
│   │   ├── checkout/            # Checkout page
│   │   ├── login/               # Login page
│   │   ├── menu/                # Product menu page
│   │   ├── orders/              # Order history
│   │   │   └── [id]/            # Order details page
│   │   ├── profile/             # User profile page
│   │   ├── register/            # Registration page
│   │   ├── favicon.ico          # Site favicon
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout with Navbar
│   │   └── page.tsx             # Home/landing page
│   ├── components/              # Reusable React components
│   │   ├── AddOnModal.tsx       # Add-ons selection modal for drink customization
│   │   ├── ConfirmModal.tsx     # Confirmation dialog for actions
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── OrderNotifications.tsx   # Real-time order status notifications
│   │   ├── ReviewFormModal.tsx  # Modal for submitting product reviews
│   │   └── ReviewsModal.tsx     # Modal for viewing product reviews
│   ├── lib/                     # Utilities & client-side logic
│   │   ├── api.ts               # Axios API client
│   │   └── store.ts             # Zustand state stores
│   ├── public/                  # Static assets
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # Shared types (User, Product, Cart, etc.)
│   └── package.json             # Dependencies (Next.js, React, Zustand, Axios)
│
└── backend/                      # Laravel Backend API
    ├── app/
    │   ├── Auth/                # Authentication utilities
    │   │   └── NewAccessToken.php
    │   ├── Http/
    │   │   ├── Controllers/     # API Controllers
    │   │   │   ├── AuthController.php       # Login, register, logout
    │   │   │   ├── CartController.php       # Cart operations
    │   │   │   ├── OrderController.php      # Order management
    │   │   │   ├── ProductController.php    # Product listing
    │   │   │   ├── ProfileController.php    # User profile
    │   │   │   └── ReviewController.php     # Product reviews
    │   │   └── Middleware/      # Custom middleware
    │   │       └── AdminMiddleware.php      # Admin access control
    │   ├── Models/              # MongoDB Models
    │   │   ├── Cart.php         # Shopping cart items
    │   │   ├── Order.php        # Customer orders
    │   │   ├── PersonalAccessToken.php  # API token model
    │   │   ├── Product.php      # Coffee products
    │   │   ├── Review.php       # Product reviews
    │   │   └── User.php         # User model with authentication
    │   ├── Notifications/       # Email notifications
    │   │   ├── OrderConfirmation.php    # Order confirmation email
    │   │   ├── OrderStatusUpdated.php   # Order status change notification
    │   │   └── WelcomeEmail.php         # Welcome email on registration
    │   └── Rules/               # Custom validation rules
    │       └── StrongPassword.php
    ├── config/
    │   ├── cors.php             # CORS configuration
    │   ├── database.php         # MongoDB connection config
    │   ├── mail.php             # Email configuration
    │   └── sanctum.php          # JWT authentication config
    ├── database/
    │   ├── seeders/             # Database seeders
    │   │   ├── DatabaseSeeder.php
    │   │   └── ProductSeeder.php    # Sample products
    │   └── database.sqlite      # Local SQLite (optional)
    ├── deploy/                  # Deployment configuration
    │   ├── nginx.conf           # Nginx server config
    │   ├── start.sh             # Startup script
    │   └── supervisor.conf      # Process manager config
    ├── routes/
    │   └── api.php              # API routes definition
    ├── Dockerfile               # Docker container config
    └── composer.json            # Dependencies (Laravel, MongoDB, Sanctum)
```

## License

Open source for educational purposes.
