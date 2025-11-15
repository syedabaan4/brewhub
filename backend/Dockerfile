# -------------------------------------------------
#  Laravel 12 + MongoDB (jenssegers/laravel-mongodb)
#  Deploy on Railway
# -------------------------------------------------
FROM php:8.2-fpm

# ---- System packages -------------------------------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ---- PHP core extensions ---------------------------------------------
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# ---- MongoDB driver (PECL) -------------------------------------------
#   mongodb/laravel-mongodb 5.5 needs ext-mongodb ^1.21|^2
RUN pecl install mongodb && \
    docker-php-ext-enable mongodb

# ---- Composer ---------------------------------------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ---- Working directory ------------------------------------------------
WORKDIR /var/www/html

# ---- Copy only what we need for install (speed up cache) -------------
COPY backend/composer.json backend/composer.lock ./

# Install production dependencies only
RUN composer install \
        --optimize-autoloader \
        --no-dev \
        --no-scripts \
        --no-interaction \
        --prefer-dist

# ---- Copy the rest of the app ----------------------------------------
COPY backend/ .

# ---- Permissions -------------------------------------------------------
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# ---- Laravel production optimisations ---------------------------------
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# ---- Optional: run migrations / seeders on container start ----------
#   (skip if you prefer Railway "Pre-Deploy Command")
RUN php artisan migrate --force || true && \
    php artisan db:seed --force || true

# ---- Expose Railway port -----------------------------------------------
EXPOSE $PORT

# ---- Start command ----------------------------------------------------
CMD php artisan serve --host=0.0.0.0 --port=$PORT
