#!/bin/bash
set -e

echo "Starting application on port ${PORT}..."

# Run Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Replace PORT placeholder in nginx config
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisor.conf
