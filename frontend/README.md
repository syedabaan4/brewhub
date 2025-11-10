# Brewhub Frontend

Next.js 14+ frontend for the Brewhub coffee ordering platform.

## Features

- ✅ User authentication (login/register)
- ✅ Browse coffee menu with category filtering
- ✅ Shopping cart functionality
- ✅ Checkout with mock payment
- ✅ User profile management
- ✅ Responsive design with Tailwind CSS
- ✅ State management with Zustand
- ✅ Toast notifications

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (Laravel)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── menu/              # Menu/products page
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── Navbar.tsx         # Navigation bar
├── lib/                   # Utilities
│   ├── api.ts            # Axios API client
│   └── store.ts          # Zustand stores
└── types/                 # TypeScript types
    └── index.ts          # Type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the Laravel backend API. Make sure the backend is running on `http://localhost:8000` or update the `NEXT_PUBLIC_API_URL` in `.env.local`.

## Authentication

Authentication uses JWT tokens stored in localStorage. The API client automatically attaches the token to all authenticated requests.

## Color Scheme

The app uses a coffee shop aesthetic with brown/cream colors:
- Primary: `#6F4E37` (Coffee brown)
- Accent: `#D4A574` (Cream)
- Background: `#FAF7F2` (Light cream)

## Future Enhancements

- Order history
- Real payment integration
- Admin panel
- Real-time order tracking
- Product reviews and ratings
