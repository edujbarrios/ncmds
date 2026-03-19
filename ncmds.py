#!/usr/bin/env python3
"""
NCMDS - No Code Markdown Sites
A Simple Documentation Site Builder
Created by: edujbarrios

DEFAULT MODE: Local Development
===============================
This is the main file to run NCMDS on your local machine.

Usage:
    python ncmds.py

This will start the server on http://localhost:5000

For production deployment (optional), see wsgi.py and DEPLOYMENT.md
"""

import os
import sys
import re
import markdown
import yaml
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, send_from_directory, abort, jsonify, request

# Add config directory to the path so settings can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'config'))
from settings import ConfigManager

# Import export module
from export import register_export_routes

# Import AI chat module
from ai_chat import register_ai_chat_routes

app = Flask(__name__)

# Initialize modular configuration
config_manager = ConfigManager('config/config.yaml')
config = config_manager.get_all()

# Directories from configuration
DOCS_DIR = config_manager.get('directories.docs', 'docs')
STATIC_DIR = config_manager.get('directories.static', 'static')
TEMPLATES_DIR = config_manager.get('directories.templates', 'templates')


class MarkdownProcessor:
    """Process Markdown files with extensions"""
    
    def __init__(self):
        self.md = markdown.Markdown(
            extensions=[
                'fenced_code',
                'tables',
                'toc',
                'codehilite',
                'attr_list',
                'md_in_html',
                'admonition',
                'meta'
            ],
            extension_configs={
                'toc': {
                    'toc_depth': '1-2'  # Only show H1 and H2 headers in TOC
                }
            }
        )
    
    def convert(self, content):
        """Convert markdown to HTML"""
        self.md.reset()
        content = self._convert_github_alerts_to_admonitions(content)
        html = self.md.convert(content)
        html = self._enhance_shields_badges(html)
        metadata = getattr(self.md, 'Meta', {})
        toc = getattr(self.md, 'toc', '')
        
        return {
            'html': html,
            'metadata': metadata,
            'toc': toc
        }

    def _convert_github_alerts_to_admonitions(self, content):
        """Convert GitHub-style alert blocks to Python-Markdown admonition syntax.

        Supported syntax:
            > [!NOTE]
            > Message text
        """
        alert_types = {
            'NOTE': 'note',
            'TIP': 'tip',
            'IMPORTANT': 'important',
            'WARNING': 'warning',
            'CAUTION': 'caution'
        }

        lines = content.splitlines()
        converted_lines = []
        i = 0

        while i < len(lines):
            line = lines[i]
            alert_match = re.match(r'^\s*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$', line, re.IGNORECASE)

            if not alert_match:
                converted_lines.append(line)
                i += 1
                continue

            alert_type = alert_types[alert_match.group(1).upper()]
            i += 1

            blockquote_lines = []
            while i < len(lines):
                quoted_line_match = re.match(r'^\s*>\s?(.*)$', lines[i])
                if quoted_line_match:
                    blockquote_lines.append(quoted_line_match.group(1))
                    i += 1
                    continue
                break

            while blockquote_lines and not blockquote_lines[0].strip():
                blockquote_lines.pop(0)
            while blockquote_lines and not blockquote_lines[-1].strip():
                blockquote_lines.pop()

            converted_lines.append(f'!!! {alert_type}')
            if blockquote_lines:
                for block_line in blockquote_lines:
                    converted_lines.append(f'    {block_line}' if block_line else '    ')
            else:
                converted_lines.append('    ')

            converted_lines.append('')

            while i < len(lines) and not lines[i].strip():
                i += 1

        converted_content = '\n'.join(converted_lines)
        if content.endswith('\n'):
            converted_content += '\n'
        return converted_content

    def _add_css_class(self, tag_html, class_name):
        """Append a CSS class to an HTML tag string without removing existing classes."""
        class_match = re.search(r'\bclass="([^"]*)"', tag_html)

        if class_match:
            existing_classes = class_match.group(1).split()
            if class_name not in existing_classes:
                new_classes = f"{class_match.group(1)} {class_name}".strip()
                tag_html = (
                    tag_html[:class_match.start(1)]
                    + new_classes
                    + tag_html[class_match.end(1):]
                )
            return tag_html

        return re.sub(
            r'\s*/?>$',
            lambda match: f' class="{class_name}"{match.group(0)}',
            tag_html
        )

    def _enhance_shields_badges(self, html):
        """Detect shields.io images and style them as native badges in rendered docs."""
        html = re.sub(
            r'<img\b[^>]*\bsrc="[^"]*(?:img\.)?shields\.io[^"]*"[^>]*>',
            lambda match: self._add_css_class(match.group(0), 'ncmds-shield-badge'),
            html,
            flags=re.IGNORECASE
        )

        # Convert paragraphs containing only shields badges into a horizontal badge row.
        html = re.sub(
            r'<p>(\s*(?:<a\b[^>]*>\s*<img\b[^>]*\bncmds-shield-badge\b[^>]*>\s*</a>|<img\b[^>]*\bncmds-shield-badge\b[^>]*>)\s*)+</p>',
            lambda match: match.group(0).replace('<p>', '<p class="ncmds-shield-row">', 1),
            html,
            flags=re.IGNORECASE
        )

        return html


class DocumentationSite:
    """Main documentation site manager"""
    
    def __init__(self, config_manager):
        self.config_manager = config_manager
        self.processor = MarkdownProcessor()
        self.docs_dir = Path(DOCS_DIR)
        self.navigation = self.build_navigation()

    def _extract_front_matter(self, content):
        """Extract YAML frontmatter and return (metadata, markdown_content)."""
        front_matter_match = re.match(r'^---\s*\r?\n(.*?)\r?\n---\s*\r?\n?', content, re.DOTALL)

        if not front_matter_match:
            return {}, content

        try:
            parsed = yaml.safe_load(front_matter_match.group(1)) or {}
            if not isinstance(parsed, dict):
                parsed = {}
        except Exception:
            # Keep original content if frontmatter is malformed.
            return {}, content

        markdown_content = content[front_matter_match.end():]
        return parsed, markdown_content

    def _extract_title_from_content(self, content, fallback):
        """Extract first markdown heading from content."""
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith('#'):
                return stripped.lstrip('#').strip() or fallback
        return fallback

    def _normalize_tags(self, raw_tags):
        """Normalize frontmatter tags to a clean, deduplicated list of strings."""
        if isinstance(raw_tags, str):
            candidates = [part.strip() for part in raw_tags.split(',')] if ',' in raw_tags else [raw_tags.strip()]
        elif isinstance(raw_tags, list):
            candidates = [str(item).strip() for item in raw_tags if item is not None]
        else:
            return []

        tags = []
        seen = set()
        for tag in candidates:
            if not tag:
                continue
            key = tag.lower()
            if key in seen:
                continue
            seen.add(key)
            tags.append(tag)

        return tags

    def _normalize_text_value(self, value):
        """Normalize a metadata value to a stripped string."""
        if value is None:
            return ''
        return str(value).strip()

    def _to_int_or_default(self, value, default):
        """Safely cast values to int, returning default when invalid."""
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    def _build_doc_metadata(self, front_matter):
        """Build normalized document taxonomy metadata with sensible defaults."""
        default_author = self._normalize_text_value(self.config_manager.get('author', ''))

        tags = self._normalize_tags(front_matter.get('tags', []))
        if not tags:
            tags = ['documentation']

        difficulty = self._normalize_text_value(front_matter.get('difficulty')) or 'general'
        owner = self._normalize_text_value(front_matter.get('owner')) or default_author

        # Accept both writer and misspelled writter for compatibility.
        writer_raw = (
            front_matter.get('writer')
            or front_matter.get('writter')
            or front_matter.get('author')
        )
        writer = self._normalize_text_value(writer_raw) or default_author

        return {
            'tags': tags,
            'difficulty': difficulty,
            'owner': owner,
            'writer': writer
        }
    
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

            # Read title and metadata from file
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

            front_matter, markdown_content = self._extract_front_matter(content)
            title = self._normalize_text_value(front_matter.get('title'))
            if not title:
                title = self._extract_title_from_content(markdown_content, rel_path.stem)

            order = self._to_int_or_default(front_matter.get('order', 999), 999)
            doc_metadata = self._build_doc_metadata(front_matter)

            # Keep filename prefix ordering for backward compatibility (e.g., 01-file.md)
            filename = md_file.stem
            if '-' in filename:
                prefix = filename.split('-')[0]
                if prefix.isdigit():
                    order = int(prefix)
                    title = title if not title.startswith(prefix) else title[len(prefix):].lstrip('- ')
            
            nav.append({
                'title': title,
                'path': url_path,
                'file': str(rel_path),
                'order': order,
                'tags': doc_metadata['tags'],
                'difficulty': doc_metadata['difficulty'],
                'owner': doc_metadata['owner'],
                'writer': doc_metadata['writer']
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
            for md_file in self.docs_dir.rglob('*.md'):
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

        front_matter, markdown_content = self._extract_front_matter(content)
        result = self.processor.convert(markdown_content)
        doc_metadata = self._build_doc_metadata(front_matter)
        result['path'] = path
        result['front_matter'] = front_matter
        result['tags'] = doc_metadata['tags']
        result['difficulty'] = doc_metadata['difficulty']
        result['owner'] = doc_metadata['owner']
        result['writer'] = doc_metadata['writer']

        # Frontmatter title should be available even without markdown meta extension fields.
        frontmatter_title = self._normalize_text_value(front_matter.get('title'))
        if frontmatter_title and not result['metadata'].get('title'):
            result['metadata']['title'] = [frontmatter_title]

        # Expose file modification time for per-document metadata in the UI.
        modified_at = datetime.fromtimestamp(doc_path.stat().st_mtime)
        result['last_updated_display'] = modified_at.strftime('%d/%m/%Y %H:%M')
        result['last_updated_iso'] = modified_at.isoformat(timespec='seconds')
        
        return result


# Initialize
site = DocumentationSite(config_manager)

# Register export routes
register_export_routes(app, config_manager, site)

# Register AI chat routes
register_ai_chat_routes(app, config_manager)


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
    metadata_title = doc['metadata'].get('title')
    if isinstance(metadata_title, list):
        metadata_title = metadata_title[0] if metadata_title else ''
    metadata_title = str(metadata_title).strip() if metadata_title else ''

    if metadata_title:
        title = f"{metadata_title} - {title}"
    
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
        doc_last_updated=doc.get('last_updated_display'),
        doc_last_updated_iso=doc.get('last_updated_iso'),
        doc_tags=doc.get('tags', []),
        doc_difficulty=doc.get('difficulty', ''),
        doc_owner=doc.get('owner', ''),
        doc_writer=doc.get('writer', ''),
        config=config
    )


@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory(STATIC_DIR, filename)


@app.route('/api/search')
def search_docs():
    """
    Search through documentation
    Query params:
        q: search query (optional when using filters)
        tag: filter by tag (optional)
        difficulty: filter by difficulty (optional)
        owner: filter by owner (optional)
        writer: filter by writer (optional)
        limit: max results to return (default: 10)
    """
    query = request.args.get('q', '').strip()
    tag_filter = request.args.get('tag', '').strip().lower()
    difficulty_filter = request.args.get('difficulty', '').strip().lower()
    owner_filter = request.args.get('owner', '').strip().lower()
    writer_filter = request.args.get('writer', '').strip().lower()
    limit = int(request.args.get('limit', 10))

    if not query and not tag_filter and not difficulty_filter and not owner_filter and not writer_filter:
        return jsonify({'results': [], 'query': query})

    # Search through all documents
    results = []
    query_lower = query.lower()

    for nav_item in site.navigation:
        doc = site.get_document(nav_item['path'])
        if not doc:
            continue

        doc_tags = doc.get('tags', [])
        doc_difficulty = doc.get('difficulty', '')
        doc_owner = doc.get('owner', '')
        doc_writer = doc.get('writer', '')
        doc_tags_lower = [tag.lower() for tag in doc_tags]

        if tag_filter and tag_filter not in doc_tags_lower:
            continue

        if difficulty_filter and difficulty_filter != doc_difficulty.lower():
            continue

        if owner_filter and owner_filter != doc_owner.lower():
            continue

        if writer_filter and writer_filter != doc_writer.lower():
            continue

        # Get document title
        title = nav_item.get('title', '')

        # Get plain text content (strip HTML tags)
        content = doc['html']
        plain_text = re.sub(r'<[^>]+>', '', content)
        plain_text_lower = plain_text.lower()

        title_match = False
        content_match = False
        tag_match = False
        metadata_match = False

        if query:
            # Check if query matches title, content, or metadata tags
            title_match = query_lower in title.lower()
            content_match = query_lower in plain_text_lower
            tag_match = any(query_lower in tag.lower() for tag in doc_tags)
            metadata_match = (
                query_lower in doc_difficulty.lower()
                or query_lower in doc_owner.lower()
                or query_lower in doc_writer.lower()
            )
            query_matches = title_match or content_match or tag_match or metadata_match
        else:
            # Filters-only searches should return matching documents.
            query_matches = True

        if query_matches:
            # Find context around the match
            context = ''
            if content_match:
                # Find position of first match
                match_pos = plain_text_lower.find(query_lower)
                start = max(0, match_pos - 80)
                end = min(len(plain_text), match_pos + len(query) + 80)
                context = plain_text[start:end].strip()
                
                # Add ellipsis if truncated
                if start > 0:
                    context = '...' + context
                if end < len(plain_text):
                    context = context + '...'
            elif tag_match:
                context = f"Matched in tags: {', '.join(doc_tags)}"
            elif metadata_match:
                metadata_bits = [
                    f"difficulty: {doc_difficulty}",
                    f"owner: {doc_owner}",
                    f"writer: {doc_writer}"
                ]
                context = f"Matched in metadata ({', '.join(metadata_bits)})"
            
            results.append({
                'title': title,
                'path': nav_item['path'],
                'context': context
            })

            if len(results) >= limit:
                break

    return jsonify({'results': results, 'query': query})


def cli():
    """CLI entry point for running NCMDS"""
    import sys
    from pathlib import Path
    
    # Get the port from command line args or environment
    port = int(os.environ.get('PORT', 5000))
    
    # Check if running in production or development
    is_production = os.environ.get('FLASK_ENV') == 'production'
    
    if is_production:
        print(f"🚀 NCMDS running on production on port {port}")
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        print(f"🚀 NCMDS running locally on http://localhost:{port}")
        app.run(host='localhost', port=port, debug=True)


if __name__ == '__main__':
    cli()
            
            results.append({
                'title': title,
                'path': nav_item['path'],
                'url': f"/docs/{nav_item['path']}",
                'context': context,
                'title_match': title_match,
                'tags': doc_tags,
                'difficulty': doc_difficulty,
                'owner': doc_owner,
                'writer': doc_writer
            })

            # Stop if we've reached the limit
            if len(results) >= limit:
                break

    return jsonify({
        'results': results,
        'query': query,
        'total': len(results),
        'filters': {
            'tag': tag_filter,
            'difficulty': difficulty_filter,
            'owner': owner_filter,
            'writer': writer_filter
        }
    })


@app.errorhandler(404)
def page_not_found(e):
    """404 error handler"""
    error_title = config_manager.get('ui_text.error_404_title', '404 - Page Not Found')
    error_heading = config_manager.get('ui_text.error_404_heading', '404 - Page Not Found')
    error_message = config_manager.get('ui_text.error_404_message', 'The page you are looking for does not exist.')
    
    return render_template(
        'layout.html',
        content=f'<h1>{error_heading}</h1><p>{error_message}</p>',
        title=error_title,
        toc='',
        navigation=site.navigation,
        config=config
    ), 404


@app.context_processor
def inject_config():
    """Inject configuration into all templates"""
    return {'site_config': config}


if __name__ == '__main__':
    # Create necessary directories
    os.makedirs(DOCS_DIR, exist_ok=True)
    os.makedirs(STATIC_DIR, exist_ok=True)
    os.makedirs(config_manager.get('directories.templates', 'templates'), exist_ok=True)
    
    # Reload navigation on startup
    site.navigation = site.build_navigation()
    
    # Get active theme information
    active_theme = config_manager.get('active_theme_name', 'ncmds_default')
    
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
Theme: {active_theme}
Documents: {len(site.navigation)} found
URL: http://localhost:{server_port}

 Tips:
   - Add .md files to docs/ folder
   - Edit config/config.yaml to customize
   - Optimized dark theme for comfortable reading

Press Ctrl+C to stop
""")
    
    # Note: use_reloader disabled due to Python 3.13+ compatibility issues with watchdog
    app.run(debug=server_debug, host=server_host, port=server_port, use_reloader=False)
