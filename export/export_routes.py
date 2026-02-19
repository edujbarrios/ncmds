"""
Export Routes for NCMDS
Flask routes to handle QMD export requests
Created by: edujbarrios
"""

from flask import send_file, abort, jsonify
from pathlib import Path
from .qmd_export import QMDExporter


def register_export_routes(app, config_manager, site):
    """Register export routes with the Flask app"""
    
    qmd_exporter = QMDExporter(config_manager)
    
    @app.route('/export/qmd/all')
    def export_qmd_all():
        """Export all documents to a single QMD file"""
        docs_dir = Path(config_manager.get('directories.docs', 'docs'))
        
        # Get all documents with their markdown content
        documents_data = []
        for nav_item in site.navigation:
            # Find the markdown file
            doc_file = None
            for md_file in docs_dir.glob('*.md'):
                if str(md_file.stem).endswith(nav_item['path']) or md_file.stem == nav_item['path']:
                    doc_file = md_file
                    break
            
            if doc_file and doc_file.exists():
                with open(doc_file, 'r', encoding='utf-8') as f:
                    markdown_content = f.read()
                
                documents_data.append({
                    'title': nav_item['title'],
                    'markdown': markdown_content
                })
        
        if not documents_data:
            abort(404, description="No documents found to export")
        
        # Get project name from config
        project_name = config_manager.get('export.qmd.project_name') or \
                      config_manager.get('site_name', 'Documentation')
        
        # Export to QMD
        qmd_buffer = qmd_exporter.export_all_documents(
            documents_data,
            site.navigation,
            project_name=project_name
        )
        
        # Generate filename
        filename = f"{project_name.replace(' ', '_')}_documentation.qmd"
        
        return send_file(
            qmd_buffer,
            mimetype='text/markdown',
            as_attachment=True,
            download_name=filename
        )
    
    @app.route('/export/config')
    def export_config():
        """Get export configuration for client-side"""
        return jsonify({
            'qmd_enabled': config_manager.get('export.qmd.enabled', True),
            'qmd_button_text': config_manager.get('export.qmd.button_text', 'Export Documentation'),
            'show_on_all_pages': config_manager.get('export.show_on_all_pages', True)
        })
