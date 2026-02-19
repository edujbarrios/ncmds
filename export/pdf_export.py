"""
PDF Export Module for NCMDS
Exports documentation to PDF with table of contents and cover page
Created by: edujbarrios
"""

from pathlib import Path
from io import BytesIO
from datetime import datetime

# Try to import weasyprint, handle gracefully if not available
try:
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError) as e:
    WEASYPRINT_AVAILABLE = False
    WEASYPRINT_ERROR = str(e)
    print(f"\n⚠️  Warning: WeasyPrint is not available: {e}")
    print("   PDF export functionality will be disabled.")
    print("   See export/WINDOWS_INSTALL.md for installation instructions.\n")


class PDFExporter:
    """Handles PDF export of documentation"""
    
    def __init__(self, config_manager):
        self.config = config_manager
        if not WEASYPRINT_AVAILABLE:
            print("⚠️  PDFExporter initialized but WeasyPrint is not available")
            self.font_config = None
        else:
            self.font_config = FontConfiguration()
    
    def _generate_cover_page(self, project_name, author=None, date=None):
        """Generate HTML for cover page"""
        author_text = author or self.config.get('author', 'Unknown Author')
        date_text = date or datetime.now().strftime('%B %d, %Y')
        
        cover_html = f"""
        <div class="pdf-cover">
            <div class="pdf-cover-content">
                <h1 class="pdf-title">{project_name}</h1>
                <div class="pdf-subtitle">Documentation</div>
                <div class="pdf-metadata">
                    <p class="pdf-author">By {author_text}</p>
                    <p class="pdf-date">{date_text}</p>
                </div>
            </div>
        </div>
        <div style="page-break-after: always;"></div>
        """
        return cover_html
    
    def _generate_toc(self, navigation):
        """Generate table of contents HTML"""
        toc_html = """
        <div class="pdf-toc">
            <h2 class="pdf-toc-title">Table of Contents</h2>
            <ul class="pdf-toc-list">
        """
        
        for item in navigation:
            title = item.get('title', 'Untitled')
            toc_html += f'<li class="pdf-toc-item">{title}</li>\n'
        
        toc_html += """
            </ul>
        </div>
        <div style="page-break-after: always;"></div>
        """
        return toc_html
    
    def _get_pdf_styles(self):
        """Get CSS styles for PDF export"""
        return """
        @page {
            size: A4;
            margin: 2cm;
            @top-right {
                content: counter(page);
                font-size: 10pt;
            }
        }
        
        .pdf-cover {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: -2cm;
            padding: 2cm;
        }
        
        .pdf-cover-content {
            width: 100%;
        }
        
        .pdf-title {
            font-size: 48pt;
            font-weight: bold;
            margin-bottom: 0.5em;
            line-height: 1.2;
        }
        
        .pdf-subtitle {
            font-size: 24pt;
            margin-bottom: 2em;
            opacity: 0.9;
        }
        
        .pdf-metadata {
            margin-top: 3em;
            font-size: 14pt;
        }
        
        .pdf-author, .pdf-date {
            margin: 0.5em 0;
        }
        
        .pdf-toc {
            padding: 2em 0;
        }
        
        .pdf-toc-title {
            font-size: 28pt;
            margin-bottom: 1em;
            border-bottom: 2px solid #333;
            padding-bottom: 0.3em;
        }
        
        .pdf-toc-list {
            list-style: none;
            padding: 0;
        }
        
        .pdf-toc-item {
            padding: 0.5em 0;
            border-bottom: 1px solid #eee;
            font-size: 14pt;
        }
        
        .pdf-content {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .pdf-content h1 {
            font-size: 28pt;
            margin-top: 1em;
            margin-bottom: 0.5em;
            color: #2c3e50;
            page-break-before: always;
        }
        
        .pdf-content h2 {
            font-size: 22pt;
            margin-top: 1em;
            margin-bottom: 0.5em;
            color: #34495e;
        }
        
        .pdf-content h3 {
            font-size: 18pt;
            margin-top: 0.8em;
            margin-bottom: 0.4em;
            color: #34495e;
        }
        
        .pdf-content p {
            margin: 0.5em 0;
            text-align: justify;
        }
        
        .pdf-content code {
            background: #f4f4f4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }
        
        .pdf-content pre {
            background: #f4f4f4;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
            page-break-inside: avoid;
        }
        
        .pdf-content pre code {
            background: none;
            padding: 0;
        }
        
        .pdf-content ul, .pdf-content ol {
            margin: 0.5em 0;
            padding-left: 2em;
        }
        
        .pdf-content li {
            margin: 0.3em 0;
        }
        
        .pdf-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
            page-break-inside: avoid;
        }
        
        .pdf-content th, .pdf-content td {
            border: 1px solid #ddd;
            padding: 0.5em;
            text-align: left;
        }
        
        .pdf-content th {
            background: #f4f4f4;
            font-weight: bold;
        }
        
        .pdf-content blockquote {
            margin: 1em 0;
            padding-left: 1em;
            border-left: 4px solid #667eea;
            color: #666;
            font-style: italic;
        }
        
        .pdf-doc-section {
            page-break-before: always;
        }
        
        .pdf-doc-section:first-child {
            page-break-before: avoid;
        }
        if not WEASYPRINT_AVAILABLE:
            raise RuntimeError(
                "WeasyPrint is not available. "
                "Please install GTK3 and WeasyPrint. "
                "See export/WINDOWS_INSTALL.md for instructions."
            )
        
        """
    
    def export_document(self, document, navigation, project_name=None):
        """Export a single document to PDF"""
        project_name = project_name or self.config.get('site_name', 'Documentation')
        
        # Build complete HTML
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{}</title>
        </head>
        <body>
        """.format(project_name)
        
        # Add cover page
        html_content += self._generate_cover_page(project_name)
        
        # Add table of contents (only current document)
        html_content += """
        <div class="pdf-toc">
            <h2 class="pdf-toc-title">Contents</h2>
        </div>
        <div style="page-break-after: always;"></div>
        """
        
        # Add document content
        html_content += f'<div class="pdf-content">{document["html"]}</div>'
        
        html_content += """
        </body>
        </html>
        """
        
        # Generate PDF
        pdf_buffer = BytesIO()
        if not WEASYPRINT_AVAILABLE:
            raise RuntimeError(
                "WeasyPrint is not available. "
                "Please install GTK3 and WeasyPrint. "
                "See export/WINDOWS_INSTALL.md for instructions."
            )
        
        HTML(string=html_content).write_pdf(
            pdf_buffer,
            stylesheets=[CSS(string=self._get_pdf_styles())],
            font_config=self.font_config
        )
        pdf_buffer.seek(0)
        
        return pdf_buffer
    
    def export_all_documents(self, documents_data, navigation, project_name=None):
        """Export all documents to a single PDF"""
        project_name = project_name or self.config.get('site_name', 'Documentation')
        
        # Build complete HTML
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{}</title>
        </head>
        <body>
        """.format(project_name)
        
        # Add cover page
        html_content += self._generate_cover_page(project_name)
        
        # Add table of contents
        html_content += self._generate_toc(navigation)
        
        # Add all documents
        html_content += '<div class="pdf-content">'
        for i, doc_data in enumerate(documents_data):
            section_class = "pdf-doc-section" if i > 0 else ""
            html_content += f'<div class="{section_class}">{doc_data["html"]}</div>'
        
        html_content += '</div>'
        html_content += """
        </body>
        </html>
        """
        
        # Generate PDF
        pdf_buffer = BytesIO()
        HTML(string=html_content).write_pdf(
            pdf_buffer,
            stylesheets=[CSS(string=self._get_pdf_styles())],
            font_config=self.font_config
        )
        pdf_buffer.seek(0)
        
        return pdf_buffer
