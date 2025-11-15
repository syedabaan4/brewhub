# ============================
# 1) Build Stage
# ============================
FROM php:8.2-fpm AS build

RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libzip-dev libonig-dev libxml2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
RUN pecl install mongodb && docker-php-ext-enable mongodb

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# ============================
# 2) Production Stage
# ============================
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
RUN pecl install mongodb && docker-php-ext-enable mongodb

WORKDIR /var/www/html

# Copy application
COPY --chown=www-data:www-data . .
COPY --from=build --chown=www-data:www-data /app/vendor ./vendor

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Create directories
RUN mkdir -p /var/log/supervisor /var/log/nginx /run/php

# Remove default nginx config
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default

# Copy configs
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./deploy/supervisor.conf /etc/supervisor/conf.d/supervisor.conf
COPY ./deploy/start.sh /start.sh

RUN chmod +x /start.sh

# Default port
ENV PORT=8080

EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

CMD ["/start.sh"]
