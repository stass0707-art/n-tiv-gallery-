#!/bin/bash
set -e

# Run this as root on the server AFTER DNS A-records for n-tiv.ru and www point to this server.
# This script obtains and installs SSL certificates via Let's Encrypt.

# Stop nginx briefly to allow certbot standalone validation if needed
certbot --nginx -d n-tiv.ru -d www.n-tiv.ru --non-interactive --agree-tos --email admin@n-tiv.ru --redirect

# Test automatic renewal
certbot renew --dry-run

echo ""
echo "SSL certificates installed for n-tiv.ru and www.n-tiv.ru"
