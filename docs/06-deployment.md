# Deployment Guide

Deploy your NCMDS documentation site to production and make it accessible to your users worldwide.

## 🎯 Deployment Overview

NCMDS is a Flask application that can be deployed to:

- **Traditional servers** (VPS, dedicated hosting)
- **Container platforms** (Docker, Kubernetes)  
- **Platform-as-a-Service** (Heroku, Railway, Render)
- **Cloud providers** (AWS, GCP, Azure)

This guide covers the most common deployment methods.

## 🏠 Local Development Server

For testing and development only:

```bash
python ncmds.py
```

**Characteristics:**
- ✅ Quick and easy
- ✅ Good for development
- ❌ Not suitable for production
- ❌ Single-threaded
- ❌ No process management

**Access:** `http://localhost:5000`

## 🚀 Production Deployment Methods

### Method 1: Gunicorn (Recommended)

Gunicorn is a production-grade WSGI server for Python applications.

#### Installation

```bash
pip install gunicorn
```

#### Basic Usage

```bash
# Single worker
gunicorn ncmds:app --bind 0.0.0.0:8000

# Multiple workers (recommended)
gunicorn ncmds:app --bind 0.0.0.0:8000 --workers 4

# With logging
gunicorn ncmds:app \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --access-logfile access.log \
  --error-logfile error.log
```

#### Systemd Service (Linux)

Create `/etc/systemd/system/ncmds.service`:

```ini
[Unit]
Description=NCMDS Documentation Server
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/ncmds
Environment="PATH=/opt/ncmds/venv/bin"
ExecStart=/opt/ncmds/venv/bin/gunicorn ncmds:app \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --timeout 120
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable ncmds
sudo systemctl start ncmds
sudo systemctl status ncmds
```

### Method 2: Docker

Containerize NCMDS for consistent deployment across environments.

#### Create Dockerfile

```dockerfile
# Use official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for WeasyPrint (PDF export)
RUN apt-get update && apt-get install -y \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 ncmds && chown -R ncmds:ncmds /app
USER ncmds

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD python -c "import requests; requests.get('http://localhost:8000')"

# Run with Gunicorn
CMD ["gunicorn", "ncmds:app", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120"]
```

#### Build and Run

```bash
# Build image
docker build -t ncmds:latest .

# Run container
docker run -d \
  --name ncmds \
  -p 8000:8000 \
  -v $(pwd)/docs:/app/docs \
  -v $(pwd)/config:/app/config \
  --restart unless-stopped \
  ncmds:latest

# View logs
docker logs -f ncmds

# Stop container
docker stop ncmds
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ncmds:
    build: .
    container_name: ncmds
    ports:
      - "8000:8000"
    volumes:
      - ./docs:/app/docs
      - ./config:/app/config
    environment:
      - NCMDS_AI_KEY=${NCMDS_AI_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python", "-c", "import requests; requests.get('http://localhost:8000')"]
      interval: 30s
      timeout: 3s
      retries: 3

  # Optional: Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: ncmds-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - ncmds
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

### Method 3: Heroku

Deploy to Heroku's platform-as-a-service with git push.

#### Prerequisites

```bash
# Install Heroku CLI
# Windows: https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew install heroku/brew/heroku
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

#### Setup Files

**1. Create `Procfile`:**

```
web: gunicorn ncmds:app --bind 0.0.0.0:$PORT --workers 4
```

**2. Create `runtime.txt`:**

```
python-3.11.7
```

**3. Update `requirements.txt`:**

Ensure gunicorn is listed:
```
Flask==3.0.0
Markdown==3.5.1
PyYAML==6.0.1
weasyprint==60.1
gunicorn==21.2.0
```

#### Deploy

```bash
# Create Heroku app
heroku create your-ncmds-docs

# Set environment variables
heroku config:set NCMDS_AI_KEY=your-api-key-here

# Deploy
git push heroku main

# Open in browser
heroku open

# View logs
heroku logs --tail
```

#### Custom Domain

```bash
heroku domains:add docs.yourcompany.com
```

Then configure your DNS provider to point to the Heroku DNS target.

### Method 4: Railway

Deploy to Railway with automatic deploys from GitHub.

#### Via Railway Dashboard

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your NCMDS repository
4. Railway auto-detects Flask and deploys
5. Set environment variables in Settings:
   - `NCMDS_AI_KEY`: Your API key

#### Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set variables
railway variables set NCMDS_AI_KEY=your-key-here

# Deploy
railway up
```

**Custom Domain:**
- Go to project Settings → Domains
- Add your custom domain
- Configure DNS as instructed

### Method 5: Render

Deploy to Render with zero-config deploys.

1. Go to [Render.com](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** ncmds-docs
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn ncmds:app --bind 0.0.0.0:$PORT --workers 4`
5. Add Environment Variables:
   - Key: `NCMDS_AI_KEY`
   - Value: [your-api-key]
6. Click "Create Web Service"

Render automatically deploys on every git push to main branch.

### Method 6: Traditional VPS (Ubuntu/Debian)

Deploy on a virtual private server with full control.

#### Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3.11 python3-pip python3-venv nginx

# Install WeasyPrint dependencies
sudo apt install -y \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libgdk-pixbuf2.0-0 \
  libffi-dev \
  shared-mime-info

# Create user for app
sudo useradd -m -s /bin/bash ncmds
```

#### Application Setup

```bash
# Switch to ncmds user
sudo su - ncmds

# Clone repository
git clone https://github.com/yourusername/ncmds.git
cd ncmds

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Exit ncmds user
exit
```

#### Configure Systemd

Create `/etc/systemd/system/ncmds.service` (shown earlier in Gunicorn section).

#### Configure Nginx

Create `/etc/nginx/sites-available/ncmds`:

```nginx
server {
    listen 80;
    server_name docs.yourcompany.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # For large documentation
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Serve static files directly
    location /static {
        alias /home/ncmds/ncmds/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/ncmds /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d docs.yourcompany.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```
## ⚙️ Production Configuration

### Update config.yaml for Production

```yaml
server:
  host: "0.0.0.0"  # Required for external access
  port: 8000       # Or whatever port your platform uses
  debug: false     # IMPORTANT: Disable debug in production!

# Use environment variables for sensitive data
ai_chat:
  api_key: "${NCMDS_AI_KEY}"

# Optimize features
features:
  auto_reload: false  # Disable in production
```

### Environment Variables

**Set these in your deployment platform:**

```bash
# Required for AI chat
NCMDS_AI_KEY=your-api-key-here

# Optional
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

**Platform-specific:**

- **Heroku:** `heroku config:set VAR_NAME=value`
- **Railway:** Dashboard → Variables tab
- **Render:** Dashboard → Environment tab
- **Docker:** `-e VAR_NAME=value` or use `.env` file
- **VPS:** Add to systemd service file or `/etc/environment`

### Security Checklist

- [ ] Set `debug: false` in production
- [ ] Use environment variables for API keys
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Configure firewall (only ports 80, 443 open)
- [ ] Regularly update dependencies (`pip install --upgrade`)
- [ ] Set strong server passwords
- [ ] Use non-root user to run application
- [ ] Implement rate limiting (via nginx or CloudFlare)
- [ ] Regular backups of documentation
- [ ] Monitor application logs

## 📊 Monitoring & Logging

### Application Logs

**View logs by platform:**

```bash
# Heroku
heroku logs --tail

# Railway  
railway logs

# Render
# View in dashboard under "Logs" tab

# Docker
docker logs -f ncmds

# Systemd
sudo journalctl -u ncmds -f

# Gunicorn (file-based)
tail -f access.log error.log
```

### Health Check Endpoint

NCMDS automatically provides a health check at `/`:

```bash
curl http://your-domain.com/
# Should return 200 OK
```

### Performance Optimization

**1. Use a CDN for static files:**

Serve `/static` files via CDN (CloudFlare, AWS CloudFront).

**2. Enable Gzip Compression in Nginx:**

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

**3. Cache Static Files:**

```nginx
location /static {
    alias /path/to/ncmds/static;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**4. Optimize Worker Count:**

Gunicorn workers formula: `(2 x CPU cores) + 1`

```bash
# For 2 CPU cores
gunicorn ncmds:app --workers 5
```

## 🔧 Deployment Troubleshooting

### Common Issues

**1. Application won't start:**

```bash
# Check logs first
docker logs ncmds  # or platform-specific command

# Common causes:
# - Missing dependencies
# - Port already in use
# - Config file syntax error
# - Missing environment variables
```

**2. 502 Bad Gateway (Nginx):**

```bash
# Check if app is running
sudo systemctl status ncmds

# Check if app is listening on correct port
sudo netstat -tulpn | grep 8000

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

**3. Static files not loading:**

```bash
# Check static files path in config
# Check nginx configuration
# Verify file permissions:
sudo chmod -R 755 /path/to/ncmds/static
```

**4. PDF export not working:**

```bash
# Install WeasyPrint dependencies
# Ubuntu/Debian:
sudo apt install libpango-1.0-0 libpangocairo-1.0-0

# Check logs for specific error
```

**5. AI chat not responding:**

```bash
# Verify API key is set
echo $NCMDS_AI_KEY

# Check API endpoint is accessible
curl -X POST https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer $NCMDS_AI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
```

## 📦 Deployment Checklist

Before going live:

- [ ] Update `config.yaml` for production
- [ ] Set `debug: false`
- [ ] Configure custom domain
- [ ] Enable HTTPS/SSL
- [ ] Set environment variables
- [ ] Test all features (navigation, export, AI chat)
- [ ] Configure backups
- [ ] Set up monitoring/alerts
- [ ] Test mobile responsiveness
- [ ] Document deployment process for your team
- [ ] Create rollback plan

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-ncmds-app"
          heroku_email: "your-email@example.com"
```

### Auto-deploy from Git

**Railway/Render:** Automatic on git push to main

**Heroku:**
```bash
git push heroku main  # Manual
# Or enable auto-deploy in Heroku dashboard
```

## 🎯 Next Steps

After deployment:

1. **Test thoroughly** - Check all features work in production
2. **Monitor performance** - Watch logs and response times
3. **Gather feedback** - Ask users about their experience
4. **Update regularly** - Keep dependencies up to date
5. **Backup documentation** - Regular backups of `/docs` folder

## 📚 Further Reading

- [Configuration Guide](03-configuration.md) - Fine-tune your deployment
- [Getting Started](02-getting-started.md) - Review features
- [Flask Deployment](https://flask.palletsprojects.com/en/latest/deploying/) - Official Flask docs
- [Gunicorn Documentation](https://docs.gunicorn.org/) - WSGI server guide
```

## Monitoring

Monitor your deployment with tools like:

- **Uptime Kuma**: Self-hosted monitoring
- **Datadog**: Application monitoring
- **New Relic**: Performance monitoring
- **Sentry**: Error tracking

## Backup Strategy

Regular backups of your documentation:

```bash
# Backup script
#!/bin/bash
tar -czf ncmds-backup-$(date +%Y%m%d).tar.gz docs/ config/
```

## Updates

Keep NCMDS updated:

```bash
git pull origin main
pip install -r requirements.txt --upgrade
systemctl restart ncmds
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 <PID>
```

### Permission Denied
```bash
# Fix permissions
chmod +x ncmds.py
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/edujbarrios/ncmds/issues)
- Review server logs
- Contact via [GitHub Discussions](https://github.com/edujbarrios/ncmds/discussions)
