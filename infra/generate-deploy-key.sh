#!/bin/bash
# Скрипт для создания SSH-ключа деплоя на сервере и вывода Base64.
# Запускать от root: bash /root/generate-deploy-key.sh

set -euo pipefail

KEY_FILE="/root/.ssh/id_ed25519"
DEPLOY_USER="deploy"

if [ "$(id -u)" -ne 0 ]; then
  echo "Запустите от root."
  exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
  echo "=== Генерация нового SSH-ключа ed25519 ==="
  install -d -m 700 /root/.ssh
  ssh-keygen -t ed25519 -f "$KEY_FILE" -N ""
else
  echo "=== Ключ уже существует: $KEY_FILE ==="
fi

echo "=== Добавление публичного ключа пользователю $DEPLOY_USER ==="
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 700 "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"

PUB_KEY="$(cat "$KEY_FILE.pub")"
if ! grep -Fxq "$PUB_KEY" "/home/$DEPLOY_USER/.ssh/authorized_keys"; then
  echo "$PUB_KEY" >> "/home/$DEPLOY_USER/.ssh/authorized_keys"
  echo "Публичный ключ добавлен."
else
  echo "Публичный ключ уже присутствует."
fi

echo ""
echo "=== Проверка подключения ==="
if ssh -i "$KEY_FILE" -o BatchMode=yes -o ConnectTimeout=10 "${DEPLOY_USER}@45.157.161.97" "echo SSH OK"; then
  echo "Подключение работает."
else
  echo "ОШИБКА: подключение не работает. Проверьте SSH и пользователя $DEPLOY_USER."
  exit 1
fi

echo ""
echo "=== Скопируйте эту строку в секрет GitHub VPS_SSH_KEY_BASE64 ==="
base64 -w 0 "$KEY_FILE"
echo ""
echo ""
echo "=== Инструкция ==="
echo "1. Откройте https://github.com/stass0707-art/n-tiv-gallery-/settings/secrets/actions"
echo "2. Создайте или обновите секрет VPS_SSH_KEY_BASE64"
echo "3. Вставьте скопированную выше длинную строку (одна строка без пробелов)"
echo "4. Удалите старые секреты VPS_SSH_KEY, VPS_HOST, VPS_USER, если они есть"
echo "5. Запустите workflow Deploy n-tiv.ru вручную через Actions → Run workflow"