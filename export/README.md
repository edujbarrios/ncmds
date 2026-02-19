# NCMDS Export Module

## Description

Export module for NCMDS that allows exporting documentation to PDF and QMD (Quarto Markdown) formats.

## Features

### PDF Export
- ✅ Customized cover page with project name
- ✅ Automatic table of contents
- ✅ Current document export
- ✅ Export all documentation to a single PDF
- ✅ Print-optimized styles
- ✅ Syntax highlighted code
- ✅ Automatic pagination

### QMD Export
- ✅ Quarto Markdown file generation
- ✅ Configured YAML frontmatter
- ✅ Ready to render with Quarto
- ✅ Current document export
- ✅ Export all documentation
- ✅ Rendering instructions included

## Installation

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

The main dependency is `weasyprint` for PDF generation.

### 2. Configuration

The module is configured in `config/config.yaml`:

```yaml
export:
  # Show buttons on all pages
  show_on_all_pages: true
  
  # PDF Configuration
  pdf:
    enabled: true
    button_text: "Export to PDF"
    project_name: ""  # Leave empty to use site_name
    show_all_option: true
    paper_size: "A4"
    margins: "2cm"
  
  # QMD Configuration
  qmd:
    enabled: true
    button_text: "Export to QMD"
    project_name: ""  # Leave empty to use site_name
    show_all_option: true
    default_format: "pdf"
```

## Usage

### From the Web Interface

Export buttons appear automatically in the bottom-right corner of each documentation page.

**Available buttons:**
- 🟣 **Export to PDF** - Exports the current document
- 🟣 **All Docs** (PDF) - Exports all documentation to PDF
- 🔴 **Export to QMD** - Exports the current document to QMD
- 🔴 **All Docs** (QMD) - Exports all documentation to QMD

### API Routes

#### PDF
- `/export/pdf/<doc_path>` - Exports a specific document to PDF
- `/export/pdf/all` - Exports all documentation to PDF

#### QMD
- `/export/qmd/<doc_path>` - Exports a specific document to QMD
- `/export/qmd/all` - Exports all documentation to QMD

#### Configuration
- `/export/config` - Returns export configuration (JSON)

### Programmatic Usage

```python
from export import PDFExporter, QMDExporter

# Create instances
pdf_exporter = PDFExporter(config_manager)
qmd_exporter = QMDExporter(config_manager)

# Export document to PDF
pdf_buffer = pdf_exporter.export_document(
    document,
    navigation,
    project_name="My Project"
)

# Export document to QMD
qmd_buffer = qmd_exporter.export_document(
    markdown_content,
    title="My Document",
    project_name="My Project"
)
```

## Module Structure

```
export/
├── __init__.py          # Module initialization
├── pdf_export.py        # PDF export logic
├── qmd_export.py        # QMD export logic
├── export_routes.py     # Flask routes for exports
└── README.md           # This documentation
```

## Customization

### PDF Styles

PDF styles can be customized by modifying the `_get_pdf_styles()` method in `pdf_export.py`.

Configurable elements:
- Page size
- Margins
- Typography
- Cover page colors
- Code styles
- Table formatting

### QMD Frontmatter

QMD frontmatter can be customized by modifying the `_generate_yaml_frontmatter()` method in `qmd_export.py`.

Available options:
- Output format (pdf, html, docx)
- Code highlighting theme
- Section numbering
- Table of contents configuration
- Page geometry

## Rendering QMD Files

To render exported QMD files, you need to have [Quarto](https://quarto.org) installed.

```bash
# Install Quarto
# Visit: https://quarto.org/docs/get-started/

# Render to PDF
quarto render document.qmd --to pdf

# Render to HTML
quarto render document.qmd --to html

# Render to Word
quarto render document.qmd --to docx
```

## Troubleshooting

### Error installing weasyprint

**Windows:**
```bash
# Install GTK manually
# Download from: https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer
```

**Linux:**
```bash
sudo apt-get install python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0
```

**macOS:**
```bash
brew install python cairo pango gdk-pixbuf libffi
```

### Buttons don't appear

1. Verify that `export.show_on_all_pages` is set to `true`
2. Verify that `export.pdf.enabled` and/or `export.qmd.enabled` are set to `true`
3. Clear browser cache

### Error generating PDF

- Verify that weasyprint is installed correctly
- Check that HTML content is valid
- Check server logs for more details

## Future Features

- [ ] Export to static HTML
- [ ] Export to plain Markdown
- [ ] Configurable cover page templates
- [ ] Customizable watermarks
- [ ] Digital signature for PDFs
- [ ] PDF compression
- [ ] Scheduled batch exports

## Contributing

To contribute to the module:

1. Create a branch for your feature
2. Implement changes
3. Add tests if necessary
4. Update documentation
5. Create pull request

## License

This module is part of NCMDS and is under the same license as the main project.

---

**Created by:** edujbarrios  
**Version:** 1.0.0  
**Last Updated:** February 2026
