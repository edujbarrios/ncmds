"""
QMD (Quarto Markdown) Export Module for NCMDS
Exports documentation to QMD format for Quarto rendering
Created by: edujbarrios
"""

from pathlib import Path
from datetime import datetime
from io import BytesIO


class QMDExporter:
    """Handles QMD export of documentation"""
    
    def __init__(self, config_manager):
        self.config = config_manager
    
    def _generate_yaml_frontmatter(self, project_name, author=None, date=None, format_type='pdf'):
        """Generate YAML frontmatter for QMD file"""
        author_text = author or self.config.get('author', 'Unknown Author')
        date_text = date or datetime.now().strftime('%Y-%m-%d')
        
        frontmatter = f"""---
title: "{project_name}"
subtitle: "Documentation"
author: "{author_text}"
date: "{date_text}"
format:
  {format_type}:
    documentclass: article
    papersize: a4
    geometry:
      - margin=2.5cm
    toc: true
    toc-depth: 3
    toc-title: "Table of Contents"
    number-sections: true
    colorlinks: true
    linkcolor: blue
    urlcolor: blue
    fig-pos: 'h'
    code-block-bg: true
    code-block-border-left: true
    highlight-style: github
---

"""
        return frontmatter
    
    def _clean_markdown_content(self, markdown_text):
        """Clean and prepare markdown content for QMD"""
        # Remove any existing frontmatter
        if markdown_text.startswith('---'):
            parts = markdown_text.split('---', 2)
            if len(parts) >= 3:
                markdown_text = parts[2].strip()
        
        return markdown_text
    
    def export_document(self, markdown_content, title=None, project_name=None):
        """Export a single document to QMD"""
        project_name = project_name or self.config.get('site_name', 'Documentation')
        doc_title = title or project_name
        
        # Build QMD content
        qmd_content = self._generate_yaml_frontmatter(doc_title)
        qmd_content += "\n"
        qmd_content += self._clean_markdown_content(markdown_content)
        
        # Add rendering instructions at the end
        qmd_content += "\n\n"
        qmd_content += """
<!-- 
To render this document to PDF:
  quarto render document.qmd --to pdf

To render to HTML:
  quarto render document.qmd --to html

To render to Word:
  quarto render document.qmd --to docx
-->
"""
        
        return BytesIO(qmd_content.encode('utf-8'))
    
    def export_all_documents(self, documents_data, navigation, project_name=None):
        """Export all documents to a single QMD file"""
        project_name = project_name or self.config.get('site_name', 'Documentation')
        
        # Build QMD content
        qmd_content = self._generate_yaml_frontmatter(project_name)
        qmd_content += "\n"
        
        # Add all documents with section breaks
        for i, doc_data in enumerate(documents_data):
            if i > 0:
                qmd_content += "\n\n# " + doc_data.get('title', f'Section {i+1}') + "\n\n"
            
            markdown_text = doc_data.get('markdown', '')
            qmd_content += self._clean_markdown_content(markdown_text)
            qmd_content += "\n\n"
        
        # Add rendering instructions
        qmd_content += """
<!-- 
To render this document to PDF:
  quarto render documentation.qmd --to pdf

To render to HTML:
  quarto render documentation.qmd --to html

To render to Word:
  quarto render documentation.qmd --to docx

For more information about Quarto, visit: https://quarto.org
-->
"""
        
        return BytesIO(qmd_content.encode('utf-8'))
    
    def create_quarto_project(self, documents_data, navigation, project_name=None):
        """Create a complete Quarto project structure"""
        project_name = project_name or self.config.get('site_name', 'Documentation')
        
        # Create _quarto.yml configuration
        quarto_config = f"""project:
  type: book
  output-dir: _output

book:
  title: "{project_name}"
  author: "{self.config.get('author', 'Unknown Author')}"
  date: "{datetime.now().strftime('%Y-%m-%d')}"
  chapters:
"""
        
        # Add chapters
        for i, nav_item in enumerate(navigation):
            filename = f"chapter_{i+1}.qmd"
            quarto_config += f"    - {filename}\n"
        
        quarto_config += """
format:
  html:
    theme: cosmo
    toc: true
  pdf:
    documentclass: book
    toc: true
"""
        
        return {
            '_quarto.yml': BytesIO(quarto_config.encode('utf-8')),
            'chapters': documents_data
        }
