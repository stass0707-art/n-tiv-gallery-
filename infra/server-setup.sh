#!/bin/bash
set -e

# Run this as root on the fresh Ubuntu 22.04 VPS

# Variables
DB_NAME="n_tiv"
DB_USER="n_tiv"
DEPLOY_USER="deploy"

# 1. Update system
apt update && apt upgrade -y

# 2. Install essential tools
apt install -y curl wget gnupg2 ca-certificates lsb-release software-properties-common apt-transport-https

# 3. Install nginx
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# 4. Install PostgreSQL 16
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update
apt install -y postgresql-16 postgresql-client-16
systemctl enable postgresql
systemctl start postgresql

# 5. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 6. Install pm2
npm install -g pm2

# 7. Install certbot
apt install -y certbot python3-certbot-nginx

# 8. Configure firewall
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 9. Create deploy user
if ! id "$DEPLOY_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER"
fi

# 10. Create directories
mkdir -p /var/www/n-tiv/dist
mkdir -p /var/www/n-tiv/uploads
mkdir -p /opt/n-tiv-api
chown -R "$DEPLOY_USER:$DEPLOY_USER" /var/www/n-tiv
chown -R "$DEPLOY_USER:$DEPLOY_USER" /opt/n-tiv-api

# 11. Database setup
if [ -z "$DB_PASS" ]; then
  echo "Creating PostgreSQL database and user..."
  read -sp "Enter password for database user $DB_USER: " DB_PASS
  echo
else
  echo "Using provided database password from DB_PASS environment variable."
fi

sudo -u postgres psql <<EOF
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

# 12. Configure PostgreSQL to listen only on localhost
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/16/main/postgresql.conf
systemctl restart postgresql

# 13. Create .env file for backend
cat > /opt/n-tiv-api/.env <<EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
SESSION_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
PORT=3000
UPLOAD_DIR=/var/www/n-tiv/uploads
ADMIN_EMAIL=admin@n-tiv.ru
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
LEAD_NOTIFICATION_EMAIL=
EOF

# 14. Disable root password login
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd

echo ""
echo "Base server setup complete. Next steps:"
echo "1. Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "2. Deploy the project (manually or via GitHub Actions)"
echo "3. Configure nginx using the config from n-tiv-gallery/infra/nginx-n-tiv.conf"
echo "4. Run certbot for SSL"
