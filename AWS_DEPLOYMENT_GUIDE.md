# 🚀 Complete AWS EC2 Deployment Guide - Frontend & Backend with PM2

## 📋 **Prerequisites**
- AWS Account with free tier
- Domain name (e.g., `omarkarem.me`)
- GitHub repository with your code
- MongoDB Atlas account

---

## 🖥️ **Part 1: AWS EC2 Setup**

### **Step 1: Create EC2 Instance**

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
3. **Instance Type**: t2.micro (Free tier)
4. **Key Pair**: Create new → Name: `nexus-server-key` → Download `.pem` file
5. **Security Group**: Create new with these rules:
   ```
   Type        Port    Protocol    Source          Description
   SSH         22      TCP         Your IP         SSH access
   HTTP        80      TCP         0.0.0.0/0       Web traffic
   HTTPS       443     TCP         0.0.0.0/0       Secure web traffic
   Custom TCP  4000    TCP         0.0.0.0/0       Backend API
   ```
6. **Storage**: 8GB (Free tier default)
7. **Launch Instance**

### **Step 2: Connect to Server**

```bash
# Connect via SSH (replace with your IP and key path)
ssh -i "nexus-server-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP

# If permission denied:
chmod 400 nexus-server-key.pem
```

### **Step 3: Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2, Nginx, Git
sudo npm install -g pm2 serve
sudo apt install nginx git -y

# Verify installations
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
pm2 --version     # Should show PM2 version
nginx -v          # Should show nginx version
```

---

## 🗄️ **Part 2: Database Setup**

### **MongoDB Atlas Configuration**

1. **Get EC2 Public IP**:
   ```bash
   curl ifconfig.me
   ```

2. **MongoDB Atlas**:
   - Go to MongoDB Atlas Dashboard
   - Click **Network Access** → **Add IP Address**
   - Add your EC2 public IP (or `0.0.0.0/0` for all IPs)
   - Click **Confirm**

---

## 💻 **Part 3: Deploy Your Code**

### **Step 1: Clone Repository**

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/Nexus.git
cd Nexus
```

### **Step 2: Backend Setup**

```bash
cd ~/Nexus/server

# Install dependencies
npm install

# Create .env file
nano .env
```

**Backend `.env` content:**
```bash
NODE_ENV=production
PORT=4000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=https://grity.omarkarem.me
SERVER_URL=https://grity-server.omarkarem.me

# AWS S3 Configuration (if using S3)
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
```

### **Step 3: Frontend Setup**

```bash
cd ~/Nexus/client

# Install dependencies
npm install

# Create .env file
nano .env
```

**Frontend `.env` content:**
```bash
REACT_APP_API_URL=https://grity-server.omarkarem.me/api
REACT_APP_SERVER_URL=https://grity-server.omarkarem.me
```

```bash
# Build for production
npm run build
```

---

## ⚙️ **Part 4: PM2 Process Management**

### **Step 1: Create PM2 Ecosystem File**

```bash
cd ~/Nexus
nano ecosystem.config.js
```

**Add this configuration:**
```javascript
module.exports = {
  apps: [
    {
      name: 'grity-backend',
      script: './server/server.js',
      cwd: './server',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/home/ubuntu/.pm2/logs/grity-backend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/grity-backend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/grity-backend.log',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s'
    },
    {
      name: 'grity-frontend',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: './client',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/ubuntu/.pm2/logs/grity-frontend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/grity-frontend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/grity-frontend.log',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
```

### **Step 2: Start PM2 Services**

```bash
# Start both services
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
# Follow the command it gives you (usually starts with sudo env PATH=...)

# Check status
pm2 status
pm2 logs
```

---

## 🌐 **Part 5: Nginx Configuration**

### **Step 1: Create Nginx Configs**

**Backend Configuration:**
```bash
sudo nano /etc/nginx/sites-available/grity-server.omarkarem.me
```

**Add:**
```nginx
server {
    listen 80;
    server_name grity-server.omarkarem.me;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        
        # Essential WebSocket headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket specific timeouts
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
        proxy_connect_timeout 86400;
        
        # Disable buffering for WebSockets
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Specific location for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:4000/socket.io/;
        proxy_http_version 1.1;
        
        # WebSocket upgrade headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket timeouts
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
        proxy_connect_timeout 86400;
        
        # Disable caching for WebSockets
        proxy_buffering off;
        proxy_cache off;
    }
}
```

**Frontend Configuration:**
```bash
sudo nano /etc/nginx/sites-available/grity.omarkarem.me
```

**Add:**
```nginx
server {
    listen 80;
    server_name grity.omarkarem.me;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # React Router support
        proxy_set_header Accept-Encoding "";
    }
}
```

### **Step 2: Enable Sites**

```bash
# Enable both sites
sudo ln -sf /etc/nginx/sites-available/grity-server.omarkarem.me /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/grity.omarkarem.me /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🌍 **Part 6: Domain Configuration**

### **Step 1: Get Server IP**

```bash
# Get your EC2 server's public IP
curl ifconfig.me
```

### **Step 2: Configure DNS Records**

**Go to your domain provider and add these DNS records:**

```
Type: A
Name: grity
Value: YOUR_EC2_PUBLIC_IP
TTL: 300

Type: A
Name: grity-server
Value: YOUR_EC2_PUBLIC_IP
TTL: 300
```

### **Step 3: Wait for DNS Propagation**

```bash
# Wait 5-30 minutes, then test:
nslookup grity.omarkarem.me
nslookup grity-server.omarkarem.me

# Both should return your EC2 IP
```

---

## 🔒 **Part 7: SSL Certificates**

### **Step 1: Install Certbot**

```bash
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### **Step 2: Get SSL Certificates**

```bash
# Get certificates for both domains
sudo certbot --nginx -d grity.omarkarem.me -d grity-server.omarkarem.me

# Follow prompts:
# 1. Enter your email
# 2. Agree to terms (Y)
# 3. Share email with EFF (Y/N - your choice)
# 4. Redirect HTTP to HTTPS (recommended)
```

### **Step 3: Test Auto-renewal**

```bash
sudo certbot renew --dry-run
```

---

## ✅ **Part 8: Testing & Verification**

### **Test Backend**

```bash
# Test health endpoint
curl https://grity-server.omarkarem.me/api/health

# Should return: {"success":true,"message":"Server is running!",...}
```

### **Test Frontend**

```bash
# Test frontend loads
curl -I https://grity.omarkarem.me

# Should return: HTTP/1.1 200 OK
```

### **Test PM2 Services**

```bash
# Check PM2 status
pm2 status

# Should show both services as 'online'

# Check logs
pm2 logs --lines 20
```

### **Test WebSocket Connection**

```bash
# Test Socket.IO endpoint
curl -I https://grity-server.omarkarem.me/socket.io/
# Should return HTTP/1.1 400 Bad Request (this is normal for Socket.IO)
```

### **Test in Browser**

1. Open `https://grity.omarkarem.me` - should load your React app
2. Test login functionality
3. Check browser console for WebSocket connection
4. Test real-time updates between multiple browser tabs/devices

---

## 🔧 **Part 9: Useful Commands**

### **PM2 Management**

```bash
# Check status
pm2 status

# View logs
pm2 logs
pm2 logs grity-frontend
pm2 logs grity-backend

# Restart services
pm2 restart grity-frontend
pm2 restart grity-backend
pm2 restart all

# Monitor services
pm2 monit

# Stop services
pm2 stop all

# Delete services
pm2 delete all

# Reload services (zero-downtime)
pm2 reload ecosystem.config.js
```

### **Nginx Management**

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### **SSL Management**

```bash
# Check certificates
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot --nginx -d grity.omarkarem.me -d grity-server.omarkarem.me --force-renewal
```

### **System Monitoring**

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check server IP
curl ifconfig.me

# Check DNS resolution
nslookup grity.omarkarem.me
dig grity.omarkarem.me

# Monitor real-time processes
htop
```

---

## 🚀 **Part 10: Deployment Updates**

### **Update Frontend**

```bash
cd ~/Nexus/client
git pull
npm install
npm run build
pm2 restart grity-frontend
```

### **Update Backend**

```bash
cd ~/Nexus/server
git pull
npm install
pm2 restart grity-backend
```

### **Update Both**

```bash
cd ~/Nexus
git pull
cd client && npm install && npm run build
cd ../server && npm install
pm2 restart all
```

### **Complete Redeployment**

```bash
# Stop all services
pm2 stop all
pm2 delete all

# Pull latest code
cd ~/Nexus
git pull

# Rebuild frontend
cd client
npm install
npm run build

# Update backend
cd ../server
npm install

# Restart with ecosystem
cd ..
pm2 start ecosystem.config.js
pm2 save
```

---

## 🎯 **Final Architecture**

```
Internet
    ↓
DNS Records (A records → EC2 IP)
    ↓
┌─────────────────────────────────────────────┐
│            AWS EC2 Server                   │
│                                             │
│  https://grity.omarkarem.me (Port 443)     │
│             ↓                               │
│         Nginx + SSL                         │
│             ↓                               │
│    PM2: grity-frontend (Port 3000)         │
│         React App served by 'serve'        │
│                                             │
│  https://grity-server.omarkarem.me (443)   │
│             ↓                               │
│         Nginx + SSL                         │
│             ↓                               │
│    PM2: grity-backend (Port 4000)          │
│         Node.js + WebSockets               │
└─────────────────────────────────────────────┘
           ↓
    MongoDB Atlas + AWS S3
```

---

## 🔥 **Troubleshooting Common Issues**

### **SSL Certificate Fails**
```bash
# Check DNS propagation
nslookup grity.omarkarem.me
dig grity.omarkarem.me

# Check Nginx configuration
sudo nginx -t

# Check if domains point to your server
curl -I http://grity.omarkarem.me
curl -I http://grity-server.omarkarem.me

# Try individual domain certificates
sudo certbot --nginx -d grity.omarkarem.me
sudo certbot --nginx -d grity-server.omarkarem.me
```

### **PM2 Services Won't Start**
```bash
# Check logs for errors
pm2 logs

# Check .env files exist
ls -la ~/Nexus/server/.env
ls -la ~/Nexus/client/.env

# Check MongoDB connection
cd ~/Nexus/server
node -e "require('dotenv').config(); console.log('MONGODB_URI:', process.env.MONGODB_URI)"

# Restart individual services
pm2 restart grity-backend
pm2 restart grity-frontend
```

### **Domain Not Loading**
```bash
# Verify DNS records
nslookup grity.omarkarem.me
nslookup grity-server.omarkarem.me

# Check Nginx sites are enabled
ls -la /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Check PM2 services
pm2 status

# Check if ports are listening
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :4000
```

### **WebSocket Issues**
```bash
# Check backend WebSocket server
pm2 logs grity-backend | grep -i socket

# Test Socket.IO endpoint
curl -I https://grity-server.omarkarem.me/socket.io/

# Check Nginx WebSocket configuration
sudo nginx -t
sudo systemctl restart nginx

# Monitor Nginx access logs for WebSocket upgrades
sudo tail -f /var/log/nginx/access.log | grep -i upgrade
```

### **CORS Issues**
```bash
# Check backend CORS configuration
cd ~/Nexus/server
grep -A 10 -B 5 "cors" server.js

# Test CORS with curl
curl -H "Origin: https://grity.omarkarem.me" -H "Access-Control-Request-Method: GET" -X OPTIONS https://grity-server.omarkarem.me/api/health
```

### **MongoDB Connection Issues**
```bash
# Check if MongoDB Atlas allows your IP
curl https://httpbin.org/ip

# Test MongoDB connection from server
cd ~/Nexus/server
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
"
```

---

## 📱 **Security Best Practices**

### **Firewall Configuration**
```bash
# Install and configure UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

### **Keep System Updated**
```bash
# Regular system updates
sudo apt update && sudo apt upgrade -y

# Update Node.js and npm
sudo npm update -g

# Update PM2
sudo npm update -g pm2
```

### **Monitor Logs**
```bash
# Check system logs
sudo journalctl -f

# Monitor failed login attempts
sudo tail -f /var/log/auth.log

# Check disk usage
sudo du -sh /var/log/*
```

---

## 🎉 **Success Checklist**

- [ ] EC2 instance created and accessible via SSH
- [ ] Node.js, PM2, Nginx, and Git installed
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured for both frontend and backend
- [ ] PM2 ecosystem file created and services started
- [ ] Nginx configurations created for both domains
- [ ] DNS records added and propagated
- [ ] SSL certificates obtained and auto-renewal enabled
- [ ] Both domains loading over HTTPS
- [ ] Backend API responding correctly
- [ ] WebSocket connections working
- [ ] Real-time updates functioning between devices

**🎉 You now have a complete production-ready deployment with WebSockets, SSL, and process management!**

---

## 📞 **Need Help?**

If you encounter issues:

1. **Check the logs**: `pm2 logs`, `sudo tail -f /var/log/nginx/error.log`
2. **Verify DNS**: `nslookup your-domain.com`
3. **Test services**: `pm2 status`, `sudo nginx -t`
4. **Check connectivity**: `curl -I https://your-domain.com`

Remember to replace all instances of:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_EC2_PUBLIC_IP` with your actual EC2 IP
- `grity.omarkarem.me` and `grity-server.omarkarem.me` with your actual domains
- MongoDB URI, JWT secrets, and AWS credentials with your actual values

