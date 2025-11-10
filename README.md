# ☕ Brewhub - Coffee Ordering Platform

A full-stack coffee ordering platform built with Next.js (frontend) and Laravel (backend) using MongoDB Atlas as the database.

## 🚀 Features

- **User Authentication:** Secure JWT-based authentication with registration and login
- **Product Menu:** Browse coffee products with category filtering
- **Shopping Cart:** Add, update, and remove items from cart
- **Checkout:** Place orders with mock payment system
- **User Profile:** View and update profile information
- **Responsive Design:** Modern coffee shop aesthetic with mobile-first approach

## 📋 Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **UI Notifications:** React Hot Toast

### Backend
- **Framework:** Laravel 10+
- **Language:** PHP 8.1+
- **Database:** MongoDB Atlas
- **Authentication:** Laravel Sanctum (JWT)
- **ODM:** MongoDB Laravel Driver

## 📁 Project Structure

```
Brewhub/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   ├── lib/             # API client & stores
│   └── types/           # TypeScript types
├── backend-template/     # Laravel backend files (ready to use)
│   ├── Models/          # MongoDB models
│   ├── Controllers/     # API controllers
│   ├── Routes/          # API routes
│   ├── Config/          # Configuration files
│   └── Seeders/         # Database seeders
└── SETUP_INSTRUCTIONS.md # Detailed setup guide
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (✅ Already installed)
- **npm** 10+ (✅ Already installed)
- **PHP** 8.1+ (❌ Not installed - required for backend)
- **Composer** (❌ Not installed - required for backend)
- **MongoDB Atlas** account (Free tier available)

## 🛠️ Installation

### Step 1: Install Missing Prerequisites

**Install PHP:**
- Download from: https://windows.php.net/download/
- Extract to `C:\php` and add to PATH
- Enable required extensions in `php.ini`

**Install Composer:**
- Download from: https://getcomposer.org/Composer-Setup.exe
- Run the installer

See `SETUP_INSTRUCTIONS.md` for detailed instructions.

### Step 2: Set Up MongoDB Atlas

1. Create a free account at https://cloud.mongodb.com
2. Create a new cluster (Free M0 tier)
3. Create a database user
4. Whitelist your IP address
5. Get the connection string

### Step 3: Set Up Backend

```bash
# Create Laravel project
composer create-project laravel/laravel backend
cd backend

# Install dependencies
composer require mongodb/laravel-mongodb
composer require laravel/sanctum

# Copy template files from backend-template/
# See backend-template/README.md for detailed instructions

# Configure .env with MongoDB connection
# Run seeders
php artisan db:seed

# Start backend server
php artisan serve
```

### Step 4: Set Up Frontend

```bash
cd frontend

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
```

## 🚦 Running the Application

1. **Start the backend** (in one terminal):
   ```bash
   cd backend
   php artisan serve
   ```
   Backend runs on: http://localhost:8000

2. **Start the frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

3. **Open your browser** and navigate to http://localhost:3000

## 📖 Usage

1. **Sign Up:** Create a new account from the registration page
2. **Login:** Log in with your credentials
3. **Browse Menu:** View available coffee products, filter by category
4. **Add to Cart:** Click "Add to Cart" on products you want to order
5. **View Cart:** Check your cart and adjust quantities
6. **Checkout:** Enter delivery address and place order
7. **Profile:** Update your profile information

## 🎨 Design

The application features a modern coffee shop aesthetic with:
- **Primary Color:** Coffee Brown (#6F4E37)
- **Accent Color:** Cream (#D4A574)
- **Background:** Light Cream (#FAF7F2)
- Responsive design that works on mobile, tablet, and desktop

## 📡 API Endpoints

### Public
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/products` - List products
- `GET /api/categories` - List categories

### Protected (Requires Authentication)
- `GET /api/user` - Get current user
- `POST /api/logout` - Logout
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/{id}` - Update cart item
- `DELETE /api/cart/remove/{id}` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can register with valid data
- [ ] User can login with correct credentials
- [ ] User can view products on menu page
- [ ] User can filter products by category
- [ ] User can add products to cart
- [ ] Cart displays correct items and quantities
- [ ] User can update item quantities in cart
- [ ] User can remove items from cart
- [ ] User can proceed to checkout
- [ ] User can place order with delivery address
- [ ] Order confirmation is displayed
- [ ] User can view and update profile

## 🔧 Troubleshooting

### Frontend Issues
- **API connection errors:** Check that backend is running on port 8000
- **CORS errors:** Verify CORS configuration in Laravel

### Backend Issues
- **MongoDB connection:** Check connection string in `.env`
- **Class not found:** Run `composer dump-autoload`
- **Sanctum errors:** Verify middleware configuration

See `SETUP_INSTRUCTIONS.md` for more detailed troubleshooting.

## 🚀 Future Enhancements

- [ ] Order history page
- [ ] Real payment integration (Stripe/PayPal)
- [ ] Admin panel for product management
- [ ] Real-time order tracking
- [ ] Product reviews and ratings
- [ ] Favorites/wishlist
- [ ] Multiple delivery addresses
- [ ] Order notifications

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs.

## 📧 Support

For issues or questions, please refer to:
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `frontend/README.md` - Frontend documentation
- `backend-template/README.md` - Backend documentation

---

**Note:** This is an MVP (Minimum Viable Product) for demonstration purposes. The payment system is mocked and should be replaced with a real payment gateway for production use.

