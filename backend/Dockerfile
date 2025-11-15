# ============================
# 1) Build Stage (Composer)
# ============================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# ============================
# 2) App Stage (PHP-FPM + Nginx)
# ============================
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    git \
    unzip \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install MongoDB extension (if needed)
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Setup working directory
WORKDIR /var/www/html

# Copy app code
COPY . .

# Copy vendor files from build stage
COPY --from=vendor /app/vendor ./vendor

# Laravel optimizations
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# ============================
# Nginx configuration
# ============================
RUN rm /etc/nginx/sites-enabled/default
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

# ============================
# Supervisor configuration
# ============================
COPY ./deploy/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Railway exposes this
ARG PORT=8080
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["/usr/bin/supervisord"]
