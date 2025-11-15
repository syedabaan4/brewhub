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
COPY . .
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# ============================
# 2) Production Stage
# ============================
FROM php:8.2-fpm

# Install system dependencies including nginx, supervisor, and gettext-base for envsubst
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    git \
    unzip \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    gettext-base \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
RUN pecl install mongodb && docker-php-ext-enable mongodb

WORKDIR /var/www/html

# Copy application code
COPY . .

# Copy vendor from build stage
COPY --from=build /app/vendor ./vendor

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Create log directories
RUN mkdir -p /var/log/supervisor /var/log/nginx

# Nginx config template (will be processed by envsubst)
RUN rm -f /etc/nginx/sites-enabled/default
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Supervisor config
COPY ./deploy/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Set default port
ENV PORT=8080

EXPOSE ${PORT}

# Start script
COPY ./deploy/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
