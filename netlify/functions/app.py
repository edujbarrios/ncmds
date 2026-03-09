#!/usr/bin/env python3
"""
Netlify Serverless Function for NCMDS
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from wsgi import application

def handler(event, context):
    """Netlify function handler"""
    # Import serverless WSGI handler
    try:
        from serverless_wsgi import handle_request
        return handle_request(application, event, context)
    except ImportError:
        # Fallback: use the app directly
        return {
            'statusCode': 200,
            'body': 'NCMDS is running. Please install serverless-wsgi for full compatibility.'
        }
