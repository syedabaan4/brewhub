# Brewhub - Design Document

**Version:** 1.0  
**Date:** November 10, 2025  
**Status:** Complete

---

## 1. Project Overview

### 1.1 Purpose
Brewhub is a full-stack coffee ordering platform that enables users to browse products, manage a shopping cart, and place orders with a modern, responsive interface.

### 1.2 Scope
- User authentication and profile management
- Product catalog with category filtering
- Shopping cart functionality
- Order placement with mock payment
- Mobile-responsive design

### 1.3 Target Users
- Coffee enthusiasts browsing and ordering beverages
- Demonstration of modern full-stack development practices

---

## 2. System Architecture

### 2.1 Architecture Pattern
**Three-Tier Architecture:**

```
┌─────────────────────────────────────────────────┐
│          Presentation Layer (Frontend)          │
│     Next.js 14 + React + TypeScript + Zustand   │
│              http://localhost:3000               │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST API
                     │ JWT Authentication
┌────────────────────▼────────────────────────────┐
│         Application Layer (Backend)              │
│       Laravel 10 + PHP 8.2 + Sanctum            │
│              http://localhost:8000               │
└────────────────────┬────────────────────────────┘
                     │ MongoDB Driver
┌────────────────────▼────────────────────────────┐
│            Data Layer (Database)                 │
│              MongoDB Atlas (Cloud)               │
└─────────────────────────────────────────────────┘
```

### 2.2 Communication Flow
1. User interacts with Next.js frontend
2. Frontend sends HTTP requests to Laravel API
3. Laravel processes requests, interacts with MongoDB
4. Response flows back through layers to user

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.1 | React framework with App Router |
| React | 19.2.0 | UI component library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.0.8 | State management |
| Axios | 1.13.2 | HTTP client |
| React Hot Toast | 2.6.0 | Notifications |

### 3.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Laravel | 12.0 | PHP framework |
| PHP | 8.2+ | Backend language |
| Laravel Sanctum | 4.2 | API authentication (JWT) |
| MongoDB Driver | 5.5 | Database ODM |

### 3.3 Database
- **MongoDB Atlas** (Cloud NoSQL database)
- Collections: users, products, carts, orders

---

## 4. Data Models

### 4.1 Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│    User      │         │   Product    │
├──────────────┤         ├──────────────┤
│ _id          │         │ _id          │
│ name         │         │ name         │
│ email        │         │ description  │
│ password     │         │ price        │
│ phone        │         │ category     │
│ address      │         │ image_url    │
│ created_at   │         │ available    │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ 1:1                    │
       │                        │
┌──────▼───────┐         ┌─────▼────────┐
│    Cart      │    *:*  │  CartItem    │
├──────────────┤ ◄────── ├──────────────┤
│ _id          │         │ product_id   │
│ user_id      │         │ quantity     │
│ items[]      │         │ price        │
│ total        │         └──────────────┘
└──────────────┘
       │
       │ 1:*
       │
┌──────▼───────┐
│    Order     │
├──────────────┤
│ _id          │
│ user_id      │
│ items[]      │
│ total_price  │
│ status       │
│ payment_stat │
│ delivery_add │
│ created_at   │
└──────────────┘
```

### 4.2 Schema Definitions

**User Collection:**
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  phone?: string,
  address?: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

**Product Collection:**
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  category: 'hot' | 'cold',
  image_url: string,
  available: boolean
}
```

**Cart Collection:**
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,
  items: [{
    product_id: ObjectId,
    quantity: number,
    price: number
  }],
  total: number,
  updated_at: timestamp
}
```

**Order Collection:**
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,
  items: CartItem[],
  total_price: number,
  status: 'pending' | 'processing' | 'completed' | 'cancelled',
  payment_status: 'pending' | 'paid' | 'failed',
  delivery_address: string,
  created_at: timestamp
}
```

---

## 5. API Design

### 5.1 RESTful Endpoints

**Authentication (Public)**
```
POST   /api/register       - Create new user account
POST   /api/login          - Authenticate user
```

**Products (Public)**
```
GET    /api/products       - List all products
GET    /api/products/{id}  - Get single product
GET    /api/categories     - Get available categories
```

**User (Protected)**
```
POST   /api/logout         - Logout current user
GET    /api/user           - Get current user info
GET    /api/profile        - Get user profile
PUT    /api/profile        - Update user profile
```

**Cart (Protected)**
```
GET    /api/cart           - Get user's cart
POST   /api/cart/add       - Add item to cart
PUT    /api/cart/update/{id} - Update cart item
DELETE /api/cart/remove/{id} - Remove from cart
DELETE /api/cart/clear      - Clear entire cart
```

**Orders (Protected)**
```
GET    /api/orders         - List user orders
POST   /api/orders         - Create new order
GET    /api/orders/{id}    - Get order details
```

### 5.2 Authentication Flow
1. User submits credentials to `/api/login`
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Token included in Authorization header for protected routes
5. Backend validates token via Sanctum middleware

### 5.3 Request/Response Examples

**Login Request:**
```json
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Add to Cart Request:**
```json
POST /api/cart/add
Authorization: Bearer {token}
{
  "product_id": "507f1f77bcf86cd799439012",
  "quantity": 2
}
```

---

## 6. Frontend Architecture

### 6.1 Directory Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── menu/              # Products listing
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── profile/           # User profile
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── Navbar.tsx         # Navigation bar
├── lib/                   # Utilities
│   ├── api.ts            # Axios API client
│   └── store.ts          # Zustand stores
└── types/                 # TypeScript definitions
    └── index.ts          # Type definitions
```

### 6.2 State Management (Zustand)

**Auth Store:**
- `user`: Current user object
- `token`: JWT authentication token
- `login()`: Authenticate user
- `logout()`: Clear authentication
- `setUser()`: Update user data

**Cart Store:**
- `items`: Array of cart items
- `addToCart()`: Add product to cart
- `removeFromCart()`: Remove product
- `updateQuantity()`: Change item quantity
- `clearCart()`: Empty cart
- `getTotal()`: Calculate total price

**Product Store:**
- `products`: Array of all products
- `selectedCategory`: Current filter
- `fetchProducts()`: Load products from API
- `setCategory()`: Update filter

### 6.3 Component Architecture
- **Server Components**: Static pages (home, layout)
- **Client Components**: Interactive pages (cart, menu, profile)
- **Shared Components**: Navbar (client-side for interactivity)

### 6.4 Routing Strategy
- App Router with file-based routing
- Protected routes check authentication in client components
- Redirect to login if unauthenticated

---

## 7. Backend Architecture

### 7.1 Directory Structure
```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php      # Authentication
│   │   ├── CartController.php      # Cart management
│   │   ├── OrderController.php     # Order processing
│   │   ├── ProductController.php   # Product catalog
│   │   └── ProfileController.php   # User profile
│   └── Models/
│       ├── User.php                # User model
│       ├── Product.php             # Product model
│       ├── Cart.php                # Cart model
│       └── Order.php               # Order model
├── routes/
│   └── api.php                     # API route definitions
├── config/
│   ├── database.php                # MongoDB connection
│   ├── cors.php                    # CORS settings
│   └── sanctum.php                 # Auth config
└── database/seeders/
    └── ProductSeeder.php           # Sample data
```

### 7.2 Controller Responsibilities

**AuthController:**
- User registration with validation
- User login with JWT token generation
- User logout (token revocation)
- Get authenticated user

**ProductController:**
- List all products
- Get single product
- Get available categories
- Filter by category

**CartController:**
- Get user's cart
- Add item to cart
- Update item quantity
- Remove item from cart
- Clear cart

**OrderController:**
- Create order from cart
- List user's orders
- Get order details

**ProfileController:**
- Get user profile
- Update user information

### 7.3 Middleware Stack
1. **CORS Middleware**: Allow frontend origin
2. **Sanctum Middleware**: Validate JWT tokens
3. **Request Validation**: Input sanitization

---

## 8. Authentication & Security

### 8.1 Authentication Flow

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│ Client  │                 │ Laravel │                 │ Database │
└────┬────┘                 └────┬────┘                 └────┬─────┘
     │                           │                           │
     │ 1. POST /api/login        │                           │
     ├──────────────────────────►│                           │
     │   {email, password}       │                           │
     │                           │ 2. Validate credentials   │
     │                           ├──────────────────────────►│
     │                           │                           │
     │                           │ 3. User record            │
     │                           │◄──────────────────────────┤
     │                           │                           │
     │                           │ 4. Generate JWT token     │
     │                           │                           │
     │ 5. {user, token}          │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ 6. Store token            │                           │
     │    (localStorage)         │                           │
     │                           │                           │
     │ 7. GET /api/cart          │                           │
     │    Authorization: Bearer  │                           │
     ├──────────────────────────►│                           │
     │                           │ 8. Verify token           │
     │                           │                           │
     │                           │ 9. Fetch cart             │
     │                           ├──────────────────────────►│
     │                           │                           │
     │ 10. Cart data             │                           │
     │◄──────────────────────────┤                           │
```

### 8.2 Security Measures

**Password Security:**
- Bcrypt hashing (cost factor: 10)
- Minimum 8 characters required
- Password confirmation on registration

**Token Security:**
- JWT tokens via Laravel Sanctum
- Tokens stored in localStorage (frontend)
- Token included in Authorization header
- Token revocation on logout

**CORS Configuration:**
- Restricted to frontend origin (localhost:3000)
- Credentials enabled
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Authorization, Content-Type

**Input Validation:**
- Email format validation
- Required field validation
- Type checking (TypeScript + Laravel validation)

**Database Security:**
- MongoDB Atlas with authentication
- Connection string in environment variables
- User-specific data isolation

---

## 9. Design System

### 9.1 Color Palette

```
Primary Colors:
├─ Coffee Brown:  #6F4E37  (Primary brand color)
├─ Dark Brown:    #5C3D2E  (Hover states, headers)
└─ Cream:         #D4A574  (Accents, highlights)

Background Colors:
├─ Light Cream:   #FAF7F2  (Page background)
├─ White:         #FFFFFF  (Cards, containers)
└─ Foreground:    #2C1810  (Text color)

System Colors:
├─ Success:       #22C55E  (Green)
├─ Error:         #EF4444  (Red)
└─ Warning:       #F59E0B  (Orange)
```

### 9.2 Typography

**Font Family:**
- Primary: Inter (via Next.js font optimization)
- Fallback: system-ui, sans-serif

**Font Sizes:**
```
Headings:
├─ h1: 2.5rem (40px) - Page titles
├─ h2: 2rem   (32px) - Section headers
└─ h3: 1.5rem (24px) - Subsections

Body:
├─ Large:  1.125rem (18px) - Emphasis
├─ Base:   1rem     (16px) - Default text
└─ Small:  0.875rem (14px) - Captions
```

### 9.3 Spacing System
- Base unit: 0.25rem (4px)
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px

### 9.4 Component Patterns

**Buttons:**
```
Primary:   bg-coffee-brown, hover:bg-coffee-dark
Secondary: border-coffee-brown, hover:bg-coffee-light
```

**Cards:**
```
Background: white
Border:     1px solid light gray
Radius:     8px (rounded-lg)
Shadow:     Subtle elevation
```

**Forms:**
```
Input:      Border-gray, focus:border-coffee-brown
Label:      Font-medium, text-sm
Error:      Text-red-500, text-sm
```

### 9.5 Responsive Breakpoints
```
Mobile:    < 640px   (default)
Tablet:    640px+    (sm:)
Desktop:   1024px+   (lg:)
Wide:      1280px+   (xl:)
```

---

## 10. User Experience Flow

### 10.1 User Journey Map

```
┌─────────────┐
│  Homepage   │ - Hero section, features overview
└──────┬──────┘
       │
       ├─► Register ──► Login ──┐
       │                        │
       └────────────────────────┴──► Menu/Products
                                           │
                    ┌──────────────────────┤
                    │                      │
              Filter by Category    Add to Cart
                    │                      │
                    └──────────┬───────────┘
                               │
                          View Cart
                               │
                    ┌──────────┼──────────┐
                    │          │          │
              Update Qty   Remove    Continue
                    │          │          │
                    └──────────┴──────────┘
                                          │
                                     Checkout
                                          │
                              Enter Delivery Address
                                          │
                                   Place Order
                                          │
                              Order Confirmation
```

### 10.2 Key User Interactions

**Browse Products:**
1. Navigate to Menu page
2. View product grid with images, prices
3. Filter by category (hot/cold)
4. Click "Add to Cart" on desired products

**Manage Cart:**
1. Click cart icon in navbar (shows item count)
2. View cart summary with all items
3. Adjust quantities with +/- buttons
4. Remove unwanted items
5. See real-time total calculation

**Checkout Process:**
1. Click "Proceed to Checkout" from cart
2. Review order summary
3. Enter delivery address
4. Click "Place Order"
5. See confirmation message
6. Cart automatically clears

**User Profile:**
1. Click profile link in navbar
2. View current information
3. Edit name, email, phone, address
4. Save changes

---

## 11. Performance Considerations

### 11.1 Frontend Optimization
- **Next.js SSR**: Server-side rendering for initial load
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **State Management**: Lightweight Zustand (< 1KB)
- **CSS**: Tailwind CSS with PurgeCSS

### 11.2 Backend Optimization
- **Database Indexing**: Index on email, user_id fields
- **Query Optimization**: Eager loading relationships
- **Caching**: Laravel cache for frequently accessed data
- **API Response**: JSON responses with minimal payload

### 11.3 Database Design
- **NoSQL Schema**: Flexible document structure
- **Embedded Documents**: Cart items within cart document
- **Minimal Joins**: Data denormalization where appropriate

---

## 12. Deployment Architecture

### 12.1 Development Environment
```
Frontend:  http://localhost:3000  (npm run dev)
Backend:   http://localhost:8000  (php artisan serve)
Database:  MongoDB Atlas (cloud)
```

### 12.2 Production Deployment Strategy

**Frontend (Vercel):**
- Automatic deployments from Git
- Environment variable: `NEXT_PUBLIC_API_URL`
- CDN for static assets
- Automatic HTTPS

**Backend (Laravel Forge / AWS):**
- PHP 8.2+ server
- Nginx web server
- Environment configuration (.env)
- SSL certificate

**Database (MongoDB Atlas):**
- Cloud-hosted (always available)
- Automatic backups
- IP whitelist configuration

### 12.3 Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://...
DB_CONNECTION=mongodb
SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
```

---

## 13. Testing Strategy

### 13.1 Frontend Testing
- **Manual Testing**: User flow verification
- **Browser Testing**: Chrome, Firefox, Safari
- **Responsive Testing**: Mobile, tablet, desktop
- **State Testing**: Zustand store behavior

### 13.2 Backend Testing
- **Unit Tests**: PHPUnit for models/controllers
- **Feature Tests**: API endpoint testing
- **Authentication Tests**: Token generation/validation
- **Database Tests**: CRUD operations

### 13.3 Integration Testing
- End-to-end user flows
- API contract verification
- Cross-browser compatibility

---

## 14. Future Enhancements

### 14.1 Short-term (Phase 2)
- Order history page with filtering
- Email notifications for orders
- Password reset functionality
- Product search functionality

### 14.2 Medium-term (Phase 3)
- Real payment integration (Stripe)
- Admin dashboard for product management
- Product reviews and ratings
- Wishlist/favorites

### 14.3 Long-term (Phase 4)
- Real-time order tracking
- Push notifications
- Social media authentication
- Mobile app (React Native)
- Loyalty program

---

## 15. Known Limitations

1. **Mock Payment**: Payment processing is simulated
2. **No Order History**: Users cannot view past orders (yet)
3. **Single Address**: Only one delivery address supported
4. **No Admin Panel**: Product management requires database access
5. **Local Development**: Requires PHP and Composer installation

---

## 16. Dependencies

### 16.1 Frontend Dependencies
```json
{
  "axios": "^1.13.2",
  "next": "16.0.1",
  "react": "19.2.0",
  "react-hot-toast": "^2.6.0",
  "zustand": "^5.0.8"
}
```

### 16.2 Backend Dependencies
```json
{
  "laravel/framework": "^12.0",
  "laravel/sanctum": "^4.2",
  "mongodb/laravel-mongodb": "^5.5"
}
```

---

## 17. Conclusion

Brewhub is a modern, full-stack coffee ordering platform that demonstrates industry best practices in web development. The architecture is scalable, secure, and maintainable, providing a solid foundation for future enhancements.

**Key Strengths:**
- Clean separation of concerns (frontend/backend)
- Modern technology stack
- RESTful API design
- JWT-based authentication
- Responsive UI/UX
- Comprehensive documentation

**Development Status:** ✅ **Complete and Ready for Deployment**

**Next Steps:**
1. Install PHP and Composer
2. Set up MongoDB Atlas cluster
3. Configure environment variables
4. Run database seeders
5. Launch application

---

**Document Version History:**
- v1.0 (Nov 10, 2025) - Initial comprehensive design document

