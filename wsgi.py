#!/usr/bin/env python3
"""
WSGI Entry Point for NCMDS - PRODUCTION ONLY

WARNING: This file is ONLY for production deployment (Vercel, Netlify, Gunicorn, etc.)
         DO NOT use this file for local development!
         
For local development, always use: python ncmds.py

Vercel Deployment:
- The @vercel/python runtime looks for an `app` variable (Flask app instance)
- Both `app` and `application` are exported for compatibility with different WSGI servers
"""

import os
import sys
from pathlib import Path

# Add the project directory to the path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask app from ncmds
from ncmds import app

# Ensure necessary directories exist (for serverless environments)
DOCS_DIR = 'docs'
STATIC_DIR = 'static'
TEMPLATES_DIR = 'templates'

os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Export both `app` (for Vercel) and `application` (for Gunicorn/traditional WSGI servers)
# Vercel's @vercel/python runtime requires the Flask app to be named `app`
application = app

if __name__ == "__main__":
    app.run()
