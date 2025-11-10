# Brewhub Setup Instructions

## Prerequisites Installation

### 1. Install PHP (Required for Backend)

Download and install PHP 8.1 or higher:
- **Windows:** https://windows.php.net/download/
  - Download the "Thread Safe" ZIP file
  - Extract to `C:\php`
  - Add `C:\php` to your System PATH
  - Copy `php.ini-development` to `php.ini`
  - Enable required extensions in `php.ini`:
    ```ini
    extension=curl
    extension=fileinfo
    extension=mbstring
    extension=openssl
    extension=pdo_mysql
    extension=mongodb
    ```

### 2. Install Composer (Required for Backend)

Download and install Composer:
- **Windows:** https://getcomposer.org/Composer-Setup.exe
- Run the installer and follow the prompts

### 3. Verify Installation

Open a new terminal and run:
```bash
php --version
composer --version
```

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a free account (if you don't have one)
3. Create a new cluster (Free M0 tier)
4. Wait for the cluster to be created (2-3 minutes)
5. Click "Connect" → "Drivers"
6. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)
7. Replace `<password>` with your database user password
8. Add `/brewhub` at the end: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/brewhub`
9. In "Network Access", click "Add IP Address" → "Allow Access from Anywhere" (for development)

## Backend Setup (After Installing PHP & Composer)

1. Navigate to the project root:
```bash
cd C:\Users\Pc\dev\Brewhub
```

2. Create Laravel backend:
```bash
composer create-project laravel/laravel backend
cd backend
```

3. Install MongoDB and Sanctum packages:
```bash
composer require mongodb/laravel-mongodb
composer require laravel/sanctum
```

4. Configure environment (`.env` file):
```env
APP_NAME=Brewhub
APP_URL=http://localhost:8000

DB_CONNECTION=mongodb
DB_DSN=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/brewhub

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DRIVER=cookie
```

5. Publish Sanctum configuration:
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

6. Run migrations and seeders (after creating models):
```bash
php artisan migrate
php artisan db:seed
```

7. Start the backend server:
```bash
php artisan serve
```

The backend will run on http://localhost:8000

## Frontend Setup

1. Open a new terminal in the frontend directory:
```bash
cd C:\Users\Pc\dev\Brewhub\frontend
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create an account
3. Login with your credentials
4. Browse the menu and add items to cart
5. Proceed to checkout and place an order

## Troubleshooting

### CORS Errors
- Make sure `config/cors.php` has `'http://localhost:3000'` in `allowed_origins`
- Clear Laravel cache: `php artisan config:clear`

### MongoDB Connection Issues
- Verify your connection string in `.env`
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Port Already in Use
- Laravel: `php artisan serve --port=8001`
- Next.js: `npm run dev -- -p 3001`

## Next Steps After Backend Setup

You'll need to create:
1. Models (User, Product, Cart, Order)
2. Controllers for authentication and API endpoints
3. Routes in `routes/api.php`
4. Seeders for sample coffee products
5. CORS configuration

Detailed backend implementation files will be provided once PHP and Composer are installed.

