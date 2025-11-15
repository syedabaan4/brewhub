# ============================
# 1) Build Stage (Installer)
# ============================
FROM php:8.2-fpm AS build

RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libzip-dev libonig-dev libxml2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

RUN pecl install mongodb && docker-php-ext-enable mongodb

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy full project so artisan exists
COPY . .

RUN composer install --no-dev --optimize-autoloader --prefer-dist


# ============================
# 2) Production Stage
# ============================
FROM php:8.2-fpm

# Install system dependencies including nginx and supervisor
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

# PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# MongoDB extension
RUN pecl install mongodb && docker-php-ext-enable mongodb

WORKDIR /var/www/html

# Copy application code
COPY . .

# Copy vendor from build stage
COPY --from=build /app/vendor ./vendor

# Laravel optimizations
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Nginx config
RUN rm /etc/nginx/sites-enabled/default
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Supervisor config
COPY ./deploy/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

ARG PORT=8080
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["/usr/bin/supervisord"]
