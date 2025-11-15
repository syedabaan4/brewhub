#!/bin/bash
set -e

echo "Starting application on port ${PORT}..."

# Replace PORT placeholder in nginx config
sed "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

echo "Nginx will listen on port ${PORT}"
cat /etc/nginx/conf.d/default.conf | grep listen

# Run Laravel optimizations
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel caches cleared and rebuilt"

# Test nginx configuration
nginx -t

echo "Nginx configuration is valid"

# Start supervisord
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisor.conf
