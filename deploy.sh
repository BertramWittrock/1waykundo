#!/bin/bash

# Build the application
npm run build

# Create a deployment package
tar -czf deploy.tar.gz dist/

# Instructions for deployment
echo "Deployment package created: deploy.tar.gz"
echo ""
echo "To deploy to your DigitalOcean droplet:"
echo "1. Copy the deploy.tar.gz file to your droplet:"
echo "   scp deploy.tar.gz root@YOUR_DROPLET_IP:/var/www/html/"
echo ""
echo "2. SSH into your droplet:"
echo "   ssh root@YOUR_DROPLET_IP"
echo ""
echo "3. On the droplet, run:"
echo "   cd /var/www/html"
echo "   tar -xzf deploy.tar.gz"
echo "   rm deploy.tar.gz"
echo ""
echo "4. Make sure Nginx is configured to serve from /var/www/html/dist" 