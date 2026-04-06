#!/usr/bin/env python3
import os
import sys

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Import Flask app
from ncmds import app

# Export for Vercel + WSGI
application = app

if __name__ == "__main__":
    app.run()
