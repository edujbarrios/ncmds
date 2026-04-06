#!/usr/bin/env python3
"""
WSGI Entry Point for NCMDS - PRODUCTION ONLY

WARNING: This file is ONLY for production deployment (Vercel serverless function).
         DO NOT use this file for local development!
         
For local development, always use: python ncmds.py

Vercel Deployment:
- Located at /api/index.py for Vercel's modern serverless functions config
- The @vercel/python runtime looks for an `app` variable (Flask app instance)
- Both `app` and `application` are exported for compatibility with different WSGI servers
"""

import os
import sys

# Add the project root directory to the path (one level up from /api/)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Import the Flask app from ncmds
from ncmds import app

# Ensure necessary directories exist (for serverless environments)
os.makedirs(os.path.join(project_root, 'docs'), exist_ok=True)
os.makedirs(os.path.join(project_root, 'static'), exist_ok=True)
os.makedirs(os.path.join(project_root, 'templates'), exist_ok=True)

# Export both `app` (for Vercel) and `application` (for Gunicorn/traditional WSGI servers)
# Vercel's @vercel/python runtime requires the Flask app to be named `app`
application = app

if __name__ == "__main__":
    app.run()
