#!/usr/bin/env python3
"""
NCMDS - No Code Markdown Sites
A Simple Documentation Site Builder
Created by: edujbarrios
"""

import os
import sys
import markdown
from pathlib import Path
from flask import Flask, render_template, send_from_directory, abort

# Añadir directorio config al path para importar settings
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'config'))
from settings import ConfigManager

app = Flask(__name__)

# Inicializar configuración modular
config_manager = ConfigManager('config/config.yaml')
config = config_manager.get_all()

# Directorios desde configuración
DOCS_DIR = config_manager.get('directories.docs', 'docs')
STATIC_DIR = config_manager.get('directories.static', 'static')
TEMPLATES_DIR = config_manager.get('directories.templates', 'templates')


class MarkdownProcessor:
    """Process Markdown files with extensions"""
    
    def __init__(self):
        self.md = markdown.Markdown(extensions=[
            'fenced_code',
            'tables',
            'toc',
            'codehilite',
            'attr_list',
            'md_in_html',
            'admonition',
            'meta'
        ])
    
    def convert(self, content):
        """Convert markdown to HTML"""
        self.md.reset()
        html = self.md.convert(content)
        metadata = getattr(self.md, 'Meta', {})
        toc = getattr(self.md, 'toc', '')
        
        return {
            'html': html,
            'metadata': metadata,
            'toc': toc
        }


class DocumentationSite:
    """Main documentation site manager"""
    
    def __init__(self, config_manager):
        self.config_manager = config_manager
        self.processor = MarkdownProcessor()
        self.docs_dir = Path(DOCS_DIR)
        self.navigation = self.build_navigation()
    
    def build_navigation(self):
        """Build navigation structure from docs directory"""
        nav = []
        
        if not self.docs_dir.exists():
            return nav
        
        # Get all markdown files
        md_files = list(self.docs_dir.rglob('*.md'))
        
        for md_file in md_files:
            rel_path = md_file.relative_to(self.docs_dir)
            url_path = str(rel_path.with_suffix('')).replace('\\', '/')
            
            # Read title and order from file
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                first_line = content.split('\n')[0].strip()
                title = first_line.lstrip('#').strip() if first_line.startswith('#') else rel_path.stem
                
                # Check for order metadata
                order = 999  # Default order
                if '---' in content:
                    # Parse front matter
                    parts = content.split('---', 2)
                    if len(parts) >= 3:
                        try:
                            import yaml
                            metadata = yaml.safe_load(parts[1])
                            order = metadata.get('order', 999)
                        except:
                            pass
                
                # Also check for numeric prefix in filename (e.g., 01-file.md)
                filename = md_file.stem
                if '-' in filename:
                    prefix = filename.split('-')[0]
                    if prefix.isdigit():
                        order = int(prefix)
                        # Remove numeric prefix from title display
                        title = title if not title.startswith(prefix) else title[len(prefix):].lstrip('- ')
            
            nav.append({
                'title': title,
                'path': url_path,
                'file': str(rel_path),
                'order': order
            })
        
        # Sort by order, then by title
        nav.sort(key=lambda x: (x['order'], x['title'].lower()))
        
        return nav
    
    def get_document(self, path):
        """Get and process a document"""
        # Handle root and index paths
        if path == '' or path == 'index':
            doc_path = self.docs_dir / '01-index.md'
            if not doc_path.exists():
                doc_path = self.docs_dir / 'index.md'  # Fallback
        else:
            # Try with numeric prefix first, then without
            doc_path = None
            for md_file in self.docs_dir.glob('*.md'):
                if str(md_file.stem).endswith(path) or md_file.stem == path:
                    doc_path = md_file
                    break
            
            # Fallback to direct path
            if not doc_path:
                doc_path = self.docs_dir / f"{path}.md"
        
        if not doc_path.exists():
            return None
        
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        result = self.processor.convert(content)
        result['path'] = path
        
        return result


# Initialize
site = DocumentationSite(config_manager)


@app.route('/')
def index():
    """Home page - Hero only"""
    site_name = config_manager.get('site_name')
    return render_template(
        'home.html',
        title=site_name,
        config=config
    )


@app.route('/docs/<path:doc_path>')
def document(doc_path):
    """Render a documentation page"""
    doc = site.get_document(doc_path)
    
    if not doc:
        abort(404)
    
    site_name = config_manager.get('site_name')
    title = site_name
    if doc['metadata'].get('title'):
        title = f"{doc['metadata']['title'][0]} - {title}"
    
    # Find previous and next documents in navigation
    prev_doc = None
    next_doc = None
    
    for i, nav_item in enumerate(site.navigation):
        # Check if this is the current document
        if nav_item['path'] == doc_path or nav_item['path'].endswith(doc_path):
            if i > 0:
                prev_doc = site.navigation[i - 1]
            if i < len(site.navigation) - 1:
                next_doc = site.navigation[i + 1]
            break
    
    return render_template(
        'layout.html',
        content=doc['html'],
        title=title,
        toc=doc['toc'],
        navigation=site.navigation,
        prev_doc=prev_doc,
        next_doc=next_doc,
        config=config
    )


@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory(STATIC_DIR, filename)


@app.errorhandler(404)
def page_not_found(e):
    """404 error handler"""
    return render_template(
        'layout.html',
        content='<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>',
        title='404 - Page Not Found',
        toc='',
        navigation=site.navigation,
        config=config
    ), 404


@app.context_processor
def inject_config():
    """Inject configuration into all templates"""
    return {'site_config': config}


@app.route('/api/themes')
def list_themes():
    """API endpoint to list available themes"""
    from flask import jsonify
    themes = config_manager.get_available_themes()
    return jsonify({
        'themes': themes,
        'active_theme': config_manager.get('active_theme_name')
    })


if __name__ == '__main__':
    # Create necessary directories
    os.makedirs(DOCS_DIR, exist_ok=True)
    os.makedirs(STATIC_DIR, exist_ok=True)
    os.makedirs(config_manager.get('directories.templates', 'templates'), exist_ok=True)
    
    # Reload navigation on startup
    site.navigation = site.build_navigation()
    
    # Get active theme information
    active_theme = config_manager.get('active_theme_name', 'ocean')
    themes_available = len(config_manager.get_available_themes())
    
    # Server configuration
    server_host = config_manager.get('server.host', '0.0.0.0')
    server_port = config_manager.get('server.port', 5000)
    server_debug = config_manager.get('server.debug', True)
    
    print(f"""
╔═══════════════════════════════════════════════════╗
║      NCMDS - No Code Markdown Sites Builder       ║
║           Created by edujbarrios                  ║
╚═══════════════════════════════════════════════════╝

Server starting...
Docs directory: {DOCS_DIR}
Active theme: {active_theme} ({themes_available} themes available)
Documents: {len(site.navigation)} found
URL: http://localhost:{server_port}

 Tips:
   - Change themes in config/config.yaml
   - Add new themes in config/themes/
   - Customize colors for each theme
   - View available themes: http://localhost:{server_port}/api/themes

Press Ctrl+C to stop
""")
    
    # Note: use_reloader disabled due to Python 3.13+ compatibility issues with watchdog
    app.run(debug=server_debug, host=server_host, port=server_port, use_reloader=False)
