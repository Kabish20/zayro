#!/usr/bin/env bash
# ==============================================================================
# ZAYRO Men's Grooming Lounge - Production Server Deployment Script
# Target Server: 172.105.56.236 (Ubuntu 22.04 / 24.04 LTS)
# Repository: https://github.com/Kabish20/zayro
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}    ZAYRO Automated Deployment Script for 172.105.56.236        ${NC}"
echo -e "${CYAN}================================================================${NC}"

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR] This deployment script must be run as root.${NC}"
    echo "Please re-run as root: sudo bash deploy.sh"
    exit 1
fi

APP_DIR="/var/www/zayro"
REPO_URL="https://github.com/Kabish20/zayro.git"
BACKEND_PORT="5000"

# ------------------------------------------------------------------------------
# 1. System Package Requirements
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[1/7] Updating apt repositories and installing prerequisites...${NC}"
apt-get update -y
apt-get install -y git curl wget ufw nginx build-essential

# ------------------------------------------------------------------------------
# 2. Node.js 20 LTS Installation (if not present or outdated)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/7] Checking Node.js installation...${NC}"
NODE_OK=0
if command -v node >/dev/null 2>&1; then
    NODE_VER=$(node -v | tr -d 'v' | cut -d. -f1)
    if [ "$NODE_VER" -ge 18 ]; then
        echo -e "${GREEN}Node.js $(node -v) is already installed.${NC}"
        NODE_OK=1
    fi
fi

if [ "$NODE_OK" -eq 0 ]; then
    echo "Installing Node.js 20 LTS via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}Node.js $(node -v) and npm $(npm -v) installed successfully.${NC}"
fi

# ------------------------------------------------------------------------------
# 3. Clone or Update Repository
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/7] Fetching Zayro codebase from GitHub...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository exists at $APP_DIR. Pulling latest main branch..."
    cd "$APP_DIR"
    git fetch origin main
    git reset --hard origin/main
else
    echo "Cloning fresh repository to $APP_DIR..."
    rm -rf "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# ------------------------------------------------------------------------------
# 4. Environment Variables Configuration (.env)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/7] Configuring environment variables...${NC}"
cat << 'EOF' > "$APP_DIR/.env"
# Zayro Production Environment Configuration
PORT=5000

# Salon360 Online Booking API
SALON360_CLIENT_KEY=64afb73f-ec89-4d1f-b639-914960f34f47
SALON360_CLIENT_SECRET=b3c52a47-845c-40af-bb43-37e52df12ce7
SALON360_API_KEY=64afb73f-ec89-4d1f-b639-914960f34f47:b3c52a47-845c-40af-bb43-37e52df12ce7
SALON360_API_BASE=https://api.salon360app.com/api/online-booking/v1/booking
EOF

chmod 600 "$APP_DIR/.env"
chown -R www-data:www-data "$APP_DIR"

# ------------------------------------------------------------------------------
# 5. Install Dependencies and Build Vite Frontend
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[5/7] Installing npm packages & compiling Vite SPA...${NC}"
cd "$APP_DIR"
npm install
npm run build

# Secure file permissions
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod 600 "$APP_DIR/.env"

# ------------------------------------------------------------------------------
# 6. Systemd Service Setup (Zayro Salon360 Backend Proxy)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[6/7] Setting up Systemd background service for server.js...${NC}"
cat << 'EOF' > /etc/systemd/system/zayro-backend.service
[Unit]
Description=Zayro Salon360 Backend Proxy Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/zayro
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=5000

# Security sandboxing
NoNewPrivileges=true
ProtectSystem=full

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable zayro-backend.service
systemctl restart zayro-backend.service

# Check backend status
sleep 2
if systemctl is-active --quiet zayro-backend.service; then
    echo -e "${GREEN}✓ zayro-backend.service is ACTIVE and running on port 5000.${NC}"
else
    echo -e "${RED}✗ Failed to start zayro-backend.service. Inspect with: journalctl -u zayro-backend -n 20${NC}"
    exit 1
fi

# ------------------------------------------------------------------------------
# 7. Nginx Web Server Configuration
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[7/7] Configuring Nginx reverse proxy on Port 80...${NC}"
cat << 'EOF' > /etc/nginx/sites-available/zayro
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name 172.105.56.236 zayrosalon.com www.zayrosalon.com zayroclub.com www.zayroclub.com _;

    root /var/www/zayro/dist;
    index index.html;

    # Gzip compression for performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Static assets caching
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
    }

    # Salon360 Backend API Proxy
    location /salon360-api/ {
        proxy_pass http://127.0.0.1:5000/salon360-api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 30s;
    }

    # Health Check Endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        proxy_set_header Host $host;
    }

    # KK Nagar Grand Opening Invitation Page
    location = /kknagarinvite {
        try_files /kknagarinvite/index.html =404;
    }
    location /kknagarinvite/ {
        try_files $uri /kknagarinvite/index.html =404;
    }

    # Frontend Single Page Application Routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Enable site & disable default Nginx page
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/zayro /etc/nginx/sites-enabled/

# Test Nginx syntax
nginx -t
systemctl reload nginx

# ------------------------------------------------------------------------------
# Final Verification
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}================================================================${NC}"
echo -e "${GREEN}✓ ZAYRO DEPLOYMENT SUCCESSFUL ON 172.105.56.236!${NC}"
echo -e "${CYAN}================================================================${NC}"

echo -e "\nTesting Local Endpoints:"
echo -n "  • Node.js Backend (/health): "
curl -s http://127.0.0.1:5000/health || echo -e "${RED}FAILED${NC}"

echo -n -e "\n  • Nginx Proxy (/health):     "
curl -s http://127.0.0.1/health || echo -e "${RED}FAILED${NC}"

echo -n -e "\n  • Frontend Status (Port 80): "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}HTTP 200 OK${NC}"
else
    echo -e "${YELLOW}HTTP $HTTP_CODE${NC}"
fi

echo -e "\n${GREEN}Live Website URLs:${NC}"
echo -e "  🌐 Main Web Application: http://172.105.56.236/"
echo -e "  ✉️  Grand Opening Invite: http://172.105.56.236/kknagarinvite"
echo -e "  🩺 Health Diagnostics:   http://172.105.56.236/health"
echo -e "${CYAN}================================================================${NC}"
