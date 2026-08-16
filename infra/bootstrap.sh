#!/bin/bash
# n-tiv.ru — полная подготовка VPS одной командой.
# Запускать от root по SSH: bash bootstrap.sh
# Скрипт идемпотентный: повторный запуск безопасен и ничего не ломает.

set -euo pipefail

DB_USER="n_tiv"
DB_NAME="n_tiv"
DEPLOY_USER="deploy"
DOMAIN="n-tiv.ru"

log() { echo ""; echo "=== $* ==="; }

if [ "$(id -u)" -ne 0 ]; then
  echo "Запустите скрипт от root."
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

log "1/10 Обновление списка пакетов"
apt-get update -y

log "2/10 Базовые утилиты"
apt-get install -y curl wget ca-certificates gnupg lsb-release rsync openssl ufw

log "3/10 nginx"
apt-get install -y nginx
systemctl enable --now nginx

log "4/10 PostgreSQL"
if ! command -v psql >/dev/null 2>&1; then
  install -d -m 0755 /usr/share/postgresql-common/pgdg
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
  echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list
  apt-get update -y
  apt-get install -y postgresql-16 postgresql-client-16
fi
systemctl enable --now postgresql

log "5/10 Node.js 20 и pm2"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -c2-3)" -lt 20 ] 2>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
command -v pm2 >/dev/null 2>&1 || npm install -g pm2

log "6/10 certbot"
apt-get install -y certbot python3-certbot-nginx

log "7/10 Пользователь deploy, каталоги и sudo-хелпер"
id "$DEPLOY_USER" >/dev/null 2>&1 || useradd -m -s /bin/bash "$DEPLOY_USER"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 700 "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"

cat > /usr/local/sbin/n-tiv-prepare-dirs <<'HELPER'
#!/bin/sh
set -eu
install -d -o deploy -g deploy -m 755 /var/www/n-tiv
install -d -o deploy -g deploy -m 755 /var/www/n-tiv/dist
install -d -o deploy -g deploy -m 755 /var/www/n-tiv/uploads
install -d -o deploy -g deploy -m 755 /opt/n-tiv-api
HELPER
chown root:root /usr/local/sbin/n-tiv-prepare-dirs
chmod 755 /usr/local/sbin/n-tiv-prepare-dirs
printf '%s\n' 'deploy ALL=(root) NOPASSWD: /usr/local/sbin/n-tiv-prepare-dirs' > /etc/sudoers.d/n-tiv-deploy
chmod 440 /etc/sudoers.d/n-tiv-deploy
visudo -cf /etc/sudoers.d/n-tiv-deploy
/usr/local/sbin/n-tiv-prepare-dirs

log "8/10 База данных PostgreSQL"
if [ -f /root/.n-tiv-credentials ] && grep -q '^Database password: ' /root/.n-tiv-credentials; then
  DB_PASS="$(sed -n 's/^Database password: //p' /root/.n-tiv-credentials | head -n1)"
else
  DB_PASS="$(openssl rand -hex 24)"
fi

cat > /root/.n-tiv-credentials <<EOF
Database user: $DB_USER
Database name: $DB_NAME
Database password: $DB_PASS
Generated at: $(date -Iseconds)
EOF
chmod 600 /root/.n-tiv-credentials

sudo -u postgres psql -v ON_ERROR_STOP=1 --set=db_user="$DB_USER" --set=db_pass="$DB_PASS" <<'SQL'
SELECT format('CREATE USER %I WITH PASSWORD %L', :'db_user', :'db_pass')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'db_user')\gexec
SQL
sudo -u postgres psql -v ON_ERROR_STOP=1 --set=db_user="$DB_USER" --set=db_pass="$DB_PASS" <<'SQL'
SELECT format('ALTER USER %I WITH PASSWORD %L', :'db_user', :'db_pass')\gexec
SQL
sudo -u postgres psql -v ON_ERROR_STOP=1 --set=db_name="$DB_NAME" --set=db_user="$DB_USER" <<'SQL'
SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'db_name')\gexec
SQL

log "9/10 Файл окружения бэкенда /opt/n-tiv-api/.env"
if [ -f /opt/n-tiv-api/.env ] && grep -q '^SESSION_SECRET=' /opt/n-tiv-api/.env; then
  SESSION_SECRET="$(sed -n 's/^SESSION_SECRET=//p' /opt/n-tiv-api/.env | head -n1)"
else
  SESSION_SECRET="$(openssl rand -hex 32)"
fi
cat > /opt/n-tiv-api/.env <<EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
SESSION_SECRET=$SESSION_SECRET
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
chown "$DEPLOY_USER:$DEPLOY_USER" /opt/n-tiv-api/.env
chmod 600 /opt/n-tiv-api/.env

log "10/10 nginx-конфиг и файрвол"
if [ ! -f /etc/nginx/sites-available/$DOMAIN ] || ! grep -q "listen 443" /etc/nginx/sites-available/$DOMAIN; then
  # Конфиг, изменённый certbot (с блоком 443), не трогаем.
  cat > /etc/nginx/sites-available/$DOMAIN <<'NGINX'
server {
    listen 80;
    server_name n-tiv.ru www.n-tiv.ru;
    root /var/www/n-tiv/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/www/n-tiv/uploads/;
        try_files $uri =404;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
NGINX
fi
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default
# nginx должен читать каталог сайта
chmod 755 /var/www /var/www/n-tiv /var/www/n-tiv/dist
nginx -t
systemctl reload nginx

ufw allow OpenSSH >/dev/null 2>&1 || ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "==================================================="
echo "Сервер готов."
echo "Пароль базы данных: /root/.n-tiv-credentials"
echo "Файл окружения:     /opt/n-tiv-api/.env"
echo "Каталоги:           /var/www/n-tiv/dist, /var/www/n-tiv/uploads, /opt/n-tiv-api"
echo ""
echo "Осталось: добавить публичный SSH-ключ в /home/deploy/.ssh/authorized_keys"
echo "и запустить деплой в GitHub Actions."
echo "==================================================="
