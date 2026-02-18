# Deployment Guide

Deploy your NCMDS documentation site to production.

## 🚀 Deployment Options

### Development Server

For local development:

```bash
python ncmds.py
```

Access at `http://localhost:5000`

### Production with Gunicorn

For production environments, use a WSGI server like Gunicorn:

1. **Install Gunicorn:**

```bash
pip install gunicorn
``````bash
gunicorn ncmds:app --bind 0.0.0.0:8000
```

3. **With Workers:**

```bash
gunicorn ncmds:app --bind 0.0.0.0:8000 --workers 4
```

### Docker Deployment

1. **Create Dockerfile:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . .

EXPOSE 8000

CMD ["gunicorn", "ncmds:app", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

2. **Build and Run:**

```bash
docker build -t ncmds .
docker run -p 8000:8000 ncmds
```

### Heroku Deployment

1. **Create Procfile:**

```
web: gunicorn ncmds:app
```

2. **Create runtime.txt:**

```
python-3.11.0
```

3. **Deploy:**

```bash
heroku create your-app-name
git push heroku main
```

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Railway will auto-detect Flask and deploy
3. Set environment variables if needed

### Vercel/Netlify

NCMDS is a Flask application and works best with traditional hosting. For static site generation, consider exporting to HTML.

## Configuration for Production

### Update config.yaml

```yaml
server:
  host: "0.0.0.0"
  port: 8000
  debug: false  # Important: Set to false in production
```

### Environment Variables

Set sensitive configuration via environment variables:

```bash
export FLASK_ENV=production
export SECRET_KEY=your-secret-key
```

### Security Considerations

1. **Disable Debug Mode**: Set `debug: false` in production
2. **Use HTTPS**: Always use SSL/TLS certificates
3. **Firewall Rules**: Restrict access to necessary ports only
4. **Regular Updates**: Keep dependencies up to date
5. **Backup**: Regularly backup your documentation files

## Nginx Reverse Proxy

Use Nginx as a reverse proxy for better performance:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static {
        alias /path/to/ncmds/static;
        expires 30d;
    }
}
```

## Performance Tips

1. **Use a CDN**: Serve static files from a CDN
2. **Enable Caching**: Cache responses when possible
3. **Compress Assets**: Use gzip compression
4. **Optimize Images**: Compress images in documentation
5. **Monitor**: Use monitoring tools to track performance

## CI/CD Pipeline Example

### GitHub Actions

```yaml
name: Deploy NCMDS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          ssh user@your-server "cd /path/to/ncmds && git pull && systemctl restart ncmds"
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
