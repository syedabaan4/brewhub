# 🚀 Quick Start Guide

## Current Status

✅ **Completed:**
- Frontend fully implemented (Next.js + TypeScript + Tailwind)
- Backend code ready (Laravel + MongoDB templates)
- All API endpoints designed and coded
- Sample product seeder ready
- Documentation complete

❌ **Required to Run:**
- Install PHP 8.1+ and Composer
- Set up MongoDB Atlas cluster
- Copy backend templates and run Laravel setup

## Next Steps (In Order)

### 1. Install PHP and Composer (15 minutes)

**PHP:**
```
1. Download: https://windows.php.net/download/ (Thread Safe ZIP)
2. Extract to C:\php
3. Add C:\php to System PATH
4. Copy php.ini-development to php.ini
5. Enable extensions: curl, fileinfo, mbstring, openssl, mongodb
```

**Composer:**
```
1. Download: https://getcomposer.org/Composer-Setup.exe
2. Run installer
3. Verify: Open new terminal, run "composer --version"
```

### 2. Set Up MongoDB Atlas (10 minutes)

```
1. Go to https://cloud.mongodb.com
2. Sign up / Log in
3. Create new project → Create cluster (Free M0)
4. Database Access → Add user → Save credentials
5. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
6. Connect → Drivers → Copy connection string
7. Replace <password> in connection string
```

### 3. Create Backend (5 minutes)

```bash
cd C:\Users\Pc\dev\Brewhub
composer create-project laravel/laravel backend
cd backend
composer require mongodb/laravel-mongodb laravel/sanctum
```

### 4. Copy Backend Files (5 minutes)

Copy from `backend-template/` to `backend/`:

```
backend-template/Models/* → backend/app/Models/
backend-template/Controllers/* → backend/app/Http/Controllers/
backend-template/Routes/api.php → backend/routes/api.php (replace)
backend-template/Seeders/* → backend/database/seeders/
backend-template/Config/cors.php → backend/config/cors.php (replace)
```

Update `backend/config/database.php` and `backend/config/sanctum.php` using the snippets in backend-template/Config/

### 5. Configure Backend (3 minutes)

Edit `backend/.env`:

```env
DB_CONNECTION=mongodb
DB_DSN=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/brewhub
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

Edit `backend/database/seeders/DatabaseSeeder.php`:

```php
public function run(): void
{
    $this->call([ProductSeeder::class]);
}
```

### 6. Run Backend Setup (2 minutes)

```bash
cd backend
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan db:seed
php artisan serve
```

Backend should now be running at http://localhost:8000

### 7. Configure and Run Frontend (2 minutes)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start frontend:

```bash
cd frontend
npm run dev
```

Frontend should now be running at http://localhost:3000

### 8. Test the Application (5 minutes)

1. Open http://localhost:3000
2. Click "Sign Up" → Create account
3. Login with your credentials
4. Browse menu → Add items to cart
5. View cart → Proceed to checkout
6. Enter delivery address → Place order
7. See order confirmation

## Total Time: ~45 minutes

## Troubleshooting

**"composer: command not found"**
- Close and reopen terminal after installing Composer
- Verify Composer is in PATH

**"Class 'MongoDB\Laravel\...' not found"**
- Run: `composer dump-autoload`
- Verify mongodb extension is enabled in php.ini

**CORS errors in browser**
- Check backend config/cors.php has 'http://localhost:3000'
- Run: `php artisan config:clear`

**Connection timeout to MongoDB**
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string in .env

**Port already in use**
- Backend: `php artisan serve --port=8001`
- Frontend: Update .env.local and run `npm run dev -- -p 3001`

## Files Reference

- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `README.md` - Project overview
- `frontend/README.md` - Frontend documentation
- `backend-template/README.md` - Backend documentation

## Need Help?

Review the detailed guides:
1. SETUP_INSTRUCTIONS.md - Step-by-step PHP/Composer installation
2. backend-template/README.md - Backend configuration details
3. README.md - Complete project documentation

---

**You're Almost There!** Just install PHP & Composer, set up MongoDB Atlas, and you'll have a fully working coffee ordering platform! ☕

