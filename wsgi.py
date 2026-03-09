#!/usr/bin/env python3
"""
WSGI Entry Point for NCMDS - PRODUCTION ONLY

WARNING: This file is ONLY for production deployment (Vercel, Netlify, Gunicorn, etc.)
         DO NOT use this file for local development!
         
For local development, always use: python ncmds.py
"""

import os
import sys
from pathlib import Path

# Add the project directory to the path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask app from ncmds
from ncmds import app

# Ensure necessary directories exist
DOCS_DIR = 'docs'
STATIC_DIR = 'static'
TEMPLATES_DIR = 'templates'

os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# This is the WSGI application that will be used by production servers
application = app

if __name__ == "__main__":
    app.run()
