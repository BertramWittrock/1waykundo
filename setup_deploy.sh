#!/bin/bash

# Exit on error
set -e

# Configuration
APP_DIR="/var/www/1waykundo"
DOMAIN="_" # Catch-all domain, change to your domain if needed
FRONTEND_PORT=3000
BACKEND_PORT=3001
REPO_DIR=$(pwd)

echo "Starting deployment setup..."

# 1. Install Dependencies
echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y curl git nginx rsync

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed."
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
else
    echo "PM2 is already installed."
fi

# Install serve if not present
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    sudo npm install -g serve
else
    echo "serve is already installed."
fi

# 2. Setup Directory Structure
echo "Setting up directory structure..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Copy files to app directory
echo "Copying files to $APP_DIR..."
# Exclude node_modules to make copy faster, separate install later
rsync -av --progress $REPO_DIR/ $APP_DIR --exclude node_modules --exclude .git --exclude dist --exclude server/node_modules

# 3. Backend Setup
echo "Setting up Backend..."
cd $APP_DIR/server
npm install
# Ensure data directory exists
mkdir -p data

# 4. Frontend Setup
echo "Setting up Frontend..."
cd $APP_DIR
npm install --include=dev # Install dev deps for build
echo "Building Frontend..."
# Set API URL for build
export VITE_API_URL="http://localhost:$BACKEND_PORT" 
# NOTE: For client-side code, localhost refers to the user's browser machine. 
# If accessing from outside, this needs to be the public IP/Domain.
# However, since we are proxying /api via Nginx, we can make the frontend requests relative or point to /api
# Let's set it to /api to use the Nginx proxy
export VITE_API_URL="http://31.97.182.106"

npm run build

# 5. PM2 Configuration
echo "Configuring PM2..."
cd $APP_DIR

# Stop existing processes if any
pm2 delete 1waykundo-backend 2>/dev/null || true
pm2 delete 1waykundo-frontend 2>/dev/null || true

# Start Backend
echo "Starting Backend..."
cd server
pm2 start index.js --name "1waykundo-backend" --env PORT=$BACKEND_PORT

# Start Frontend
echo "Starting Frontend..."
cd $APP_DIR
pm2 start "serve -s dist -l $FRONTEND_PORT" --name "1waykundo-frontend"

# Save PM2 list
pm2 save
# Generate startup script (user needs to run the output command manually usually, but we can try)
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER || echo "Please run 'pm2 startup' manually if needed"

# 6. Nginx Configuration
echo "Configuring Nginx..."

NGINX_CONF="/etc/nginx/sites-available/1waykundo"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        # Remove /api prefix before passing to backend if backend doesn't expect it
        # Based on inspection, backend routes start with /api (e.g., /api/config), so pass as is.
        proxy_pass http://localhost:$BACKEND_PORT; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
if [ -L /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

if [ ! -L /etc/nginx/sites-enabled/1waykundo ]; then
    sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Test and Restart Nginx
echo "Testing Nginx configuration..."
sudo nginx -t

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment Complete!"
echo "Your app should be live on http://$(curl -s ifconfig.me) or your configured domain."
