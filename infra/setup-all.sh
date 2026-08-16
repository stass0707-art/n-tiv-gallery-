#!/bin/bash
set -e

# Run this as root on the fresh Ubuntu 22.04 VPS after the server is created.
# This script:
#   1. Updates the system and installs all dependencies (nginx, PostgreSQL 16, Node.js 20, pm2, certbot, ufw).
#   2. Creates the deploy user and database with an auto-generated password.
#   3. Configures nginx for n-tiv.ru and www.n-tiv.ru.
#   4. Opens firewall ports.
#
# After this script finishes, you need to:
#   - Add your SSH public key to /home/deploy/.ssh/authorized_keys.
#   - Deploy the project via GitHub Actions.
#   - Update DNS A-records for n-tiv.ru and www to point to this server IP.
#   - Run certbot for SSL (see infra/ssl.sh).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Generate a random password for the database if not provided.
if [ -z "$DB_PASS" ]; then
  DB_PASS="$(openssl rand -base64 24)"
  export DB_PASS
  echo "Generated database password saved to /root/.n-tiv-credentials"
  echo "Keep this file secure — it is needed only for recovery."
fi

cat > /root/.n-tiv-credentials <<EOF
Database user: $DB_USER
Database name: $DB_NAME
Database password: $DB_PASS
Generated at: $(date -Iseconds)
EOF
chmod 600 /root/.n-tiv-credentials

# Run base setup
"$SCRIPT_DIR/server-setup.sh"

# Configure nginx
if [ ! -f /etc/nginx/sites-available/n-tiv.ru ]; then
    cp "$SCRIPT_DIR/nginx-n-tiv.conf" /etc/nginx/sites-available/n-tiv.ru
fi
ln -sf /etc/nginx/sites-available/n-tiv.ru /etc/nginx/sites-enabled/n-tiv.ru
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Create SSH directory for deploy user so you can add a public key later.
mkdir -p /home/deploy/.ssh
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

echo ""
echo "Base server setup and nginx configuration complete."
echo "Database password is saved in /root/.n-tiv-credentials"
echo "Next steps:"
echo "1. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Deploy the project via GitHub Actions"
echo "3. Update DNS A-records for n-tiv.ru and www to point to $(curl -s ifconfig.me)"
echo "4. Run infra/ssl.sh on the server to obtain SSL certificates"
