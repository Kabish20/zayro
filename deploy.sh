#!/usr/bin/env bash
# ==============================================================================
# ZAYRO Men's Grooming Lounge - Production Server Deployment Script
# Architecture:
#   - Frontend: Vite 8 + React 19 SPA (Nginx port 80)
#   - Backend: Python 3 + Django 5 + Django REST Framework (Gunicorn port 8000)
#   - Database: PostgreSQL (zayro_db / zayro_user)
#   - Integration: Salon360 Online Booking API (Store 868 / Org 555)
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}    ZAYRO Production Deployment: Django + PostgreSQL + React     ${NC}"
echo -e "${CYAN}================================================================${NC}"

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR] This deployment script must be run as root.${NC}"
    exit 1
fi

APP_DIR="/var/www/zayro"
BACKEND_DIR="$APP_DIR/backend"
REPO_URL="https://github.com/Kabish20/zayro.git"
DB_NAME="zayro_db"
DB_USER="zayro_user"
DB_PASS="DCXServer123$"

# ------------------------------------------------------------------------------
# 1. System Packages & Prerequisites
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[1/8] Installing system dependencies (Python, PostgreSQL, Nginx)...${NC}"
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y \
    git curl wget nginx \
    postgresql postgresql-contrib libpq-dev \
    python3 python3-pip python3-venv python3-dev \
    build-essential

# ------------------------------------------------------------------------------
# 2. Setup PostgreSQL Database
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/8] Configuring PostgreSQL database ($DB_NAME)...${NC}"
systemctl enable postgresql
systemctl start postgresql

sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo -e "${GREEN}✓ PostgreSQL database '$DB_NAME' is configured.${NC}"

# ------------------------------------------------------------------------------
# 3. Node.js Installation (for Frontend SPA)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/8] Checking Node.js installation...${NC}"
if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}Node.js $(node -v) is active.${NC}"

# ------------------------------------------------------------------------------
# 4. Fetch Codebase from GitHub
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/8] Updating Zayro codebase...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR"
    git fetch origin main
    git reset --hard origin/main
else
    rm -rf "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# ------------------------------------------------------------------------------
# 5. Configure Production Environments
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[5/8] Configuring environment (.env)...${NC}"
cat << 'EOF' > "$APP_DIR/.env"
# Zayro Production Environment
PORT=8000
DEBUG=False
DJANGO_SECRET_KEY=django-prod-zayro-salon360-key-2026-secure
ALLOWED_HOSTS=*

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=zayro_db
DB_USER=zayro_user
DB_PASSWORD=DCXServer123$
DB_HOST=localhost
DB_PORT=5432

# Salon360 Online Booking API
SALON360_STORE_ID=868
SALON360_ORG_ID=555
SALON360_CLIENT_KEY=64afb73f-ec89-4d1f-b639-914960f34f47
SALON360_CLIENT_SECRET=b3c52a47-845c-40af-bb43-37e52df12ce7
SALON360_API_KEY=64afb73f-ec89-4d1f-b639-914960f34f47:b3c52a47-845c-40af-bb43-37e52df12ce7
SALON360_API_BASE=https://api.salon360app.com/api/online-booking/v1/booking
VITE_SALON360_BOOKING_URL=https://api.salon360app.com/api/online-booking/v1/external/booking?storeId=868&orgId=555
EOF

cp "$APP_DIR/.env" "$BACKEND_DIR/.env"
chmod 600 "$APP_DIR/.env" "$BACKEND_DIR/.env"

# ------------------------------------------------------------------------------
# 6. Setup Python Django Virtualenv & Migrations
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[6/8] Setting up Python virtual environment and Django migrations...${NC}"
cd "$BACKEND_DIR"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

python manage.py makemigrations booking || true
python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

# ------------------------------------------------------------------------------
# 7. Build Frontend SPA
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[7/8] Compiling React Vite Frontend...${NC}"
cd "$APP_DIR"
npm install
npm run build

chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod 600 "$APP_DIR/.env" "$BACKEND_DIR/.env"

# ------------------------------------------------------------------------------
# 8. Configure Systemd & Nginx
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[8/8] Configuring Systemd service (Gunicorn) and Nginx reverse proxy...${NC}"

# Gunicorn Systemd service for Django
cat << 'EOF' > /etc/systemd/system/zayro-django.service
[Unit]
Description=Zayro Django Backend (Gunicorn)
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/zayro/backend
ExecStart=/var/www/zayro/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 zayro_backend.wsgi:application
Restart=always
RestartSec=5
EnvironmentFile=/var/www/zayro/backend/.env

[Install]
WantedBy=multi-user.target
EOF

# Stop old Node proxy if running and start Django Gunicorn
systemctl stop zayro-backend.service 2>/dev/null || true
systemctl disable zayro-backend.service 2>/dev/null || true

systemctl daemon-reload
systemctl enable zayro-django.service
systemctl restart zayro-django.service

# Nginx Site Configuration
cat << 'EOF' > /etc/nginx/sites-available/zayro
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 172.105.56.236 zayrosalon.com www.zayrosalon.com zayroclub.com www.zayroclub.com _;

    root /var/www/zayro/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Static assets caching
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
    }

    # Django Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # Salon360 Backend Proxy
    location /salon360-api/ {
        proxy_pass http://127.0.0.1:8000/salon360-api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }


    # Online Booking Direct Link / Redirect
    location = /online-booking {
        proxy_pass http://127.0.0.1:8000/online-booking/;
    }

    # Frontend SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/zayro /etc/nginx/sites-enabled/

nginx -t
systemctl reload nginx

echo -e "\n${CYAN}================================================================${NC}"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE! (Django + PostgreSQL + React SPA)${NC}"
echo -e "${CYAN}================================================================${NC}"

sleep 2
echo "Verification of Services:"
echo -n "  • Django Gunicorn Status: "
systemctl is-active zayro-django.service
echo -n "  • PostgreSQL Status:     "
systemctl is-active postgresql
echo -n "  • Nginx Status:          "
systemctl is-active nginx
echo -n "  • Backend Health Check:  "
curl -s http://127.0.0.1:8000/health/
echo ""
echo -n "  • Salon360 API Config:   "
curl -s http://127.0.0.1:8000/api/salon360/config/ | head -c 160
echo ""
