# 🎃 GhostFrame Deployment Guide

Complete guide for deploying GhostFrame to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 16+ installed
- [ ] PostgreSQL 13+ database
- [ ] Domain name (optional)
- [ ] SSL certificate (recommended)
- [ ] Server with at least 2GB RAM

---

## 🗄️ Database Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE ghostframe;
CREATE USER ghostframe_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ghostframe TO ghostframe_user;

# Exit
\q
```

### 3. Run Schema

```bash
cd backend
psql -U ghostframe_user -d ghostframe -f src/database/schema.sql
```

---

## ⚙️ Environment Configuration

### 1. Backend Configuration

Create `backend/.env`:

```bash
# Copy example
cp backend/.env.example backend/.env

# Edit with your values
nano backend/.env
```

**Required variables:**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ghostframe
DB_USER=ghostframe_user
DB_PASSWORD=your_secure_password

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_jwt_secret_here

# AI Services (optional)
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
```

### 2. Frontend Configuration

Create `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 📦 Installation

### 1. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd backend && npm install
cd ../frontend && npm install
cd ../cli && npm install
```

### 2. Build Applications

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

---

## 🚀 Deployment Options

### Option A: PM2 (Recommended)

**Install PM2:**
```bash
npm install -g pm2
```

**Create ecosystem file** `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'ghostframe-backend',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'ghostframe-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

**Start services:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Monitor:**
```bash
pm2 status
pm2 logs
pm2 monit
```

### Option B: Docker

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ghostframe
      POSTGRES_USER: ghostframe_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/src/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      NODE_ENV: production
      DB_HOST: postgres
    ports:
      - "3001:3001"
    volumes:
      - ./backend/.env:/app/.env

  frontend:
    build: ./frontend
    depends_on:
      - backend
    environment:
      NODE_ENV: production
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

**Deploy:**
```bash
docker-compose up -d
docker-compose logs -f
```

### Option C: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

**Backend (Render):**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Set up monitoring/logging
- [ ] Regular database backups
- [ ] Use environment variables (never commit secrets)

---

## 🌐 Nginx Configuration

**Create `/etc/nginx/sites-available/ghostframe`:**

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable and restart:**
```bash
sudo ln -s /etc/nginx/sites-available/ghostframe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Frontend health
curl https://yourdomain.com
```

### Logs

**PM2:**
```bash
pm2 logs ghostframe-backend
pm2 logs ghostframe-frontend
```

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Monitoring

```bash
# Connection count
psql -U ghostframe_user -d ghostframe -c "SELECT count(*) FROM pg_stat_activity;"

# Database size
psql -U ghostframe_user -d ghostframe -c "SELECT pg_size_pretty(pg_database_size('ghostframe'));"
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm run install:all

# Build
cd backend && npm run build
cd ../frontend && npm run build

# Restart services
pm2 restart all
```

### Database Migrations

```bash
# Backup first!
pg_dump -U ghostframe_user ghostframe > backup_$(date +%Y%m%d).sql

# Run migration
psql -U ghostframe_user -d ghostframe -f migrations/001_new_migration.sql
```

### Backup Strategy

**Automated daily backups:**
```bash
# Create backup script
cat > /usr/local/bin/ghostframe-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/ghostframe"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U ghostframe_user ghostframe | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/ghostframe-backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/ghostframe-backup.sh
```

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check logs
pm2 logs ghostframe-backend --lines 100

# Check database connection
psql -U ghostframe_user -d ghostframe -c "SELECT 1;"

# Check environment variables
pm2 env 0
```

### Frontend build fails

```bash
# Clear cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Database connection issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📞 Support

- Documentation: https://docs.ghostframe.dev
- Issues: https://github.com/your-org/ghostframe/issues
- Email: support@ghostframe.dev

---

## ✅ Post-Deployment Checklist

- [ ] All services running
- [ ] Database connected
- [ ] SSL certificates installed
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Logs accessible
- [ ] Rate limiting active
- [ ] CORS configured
- [ ] Admin account created
- [ ] Test critical flows
- [ ] Document any custom configuration

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Version:** _____________

🎃 **GhostFrame is now live!**
