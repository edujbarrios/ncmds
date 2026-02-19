# Documentation Export

NCMDS includes a powerful export module that allows you to export your documentation to different formats with just one click.

## Features

### 📄 PDF Export
- Professional cover page with your project name
- Automatic table of contents
- Print-optimized styles
- Syntax highlighted code
- Automatic pagination

### 📝 QMD Export (Quarto Markdown)
- Files ready to render with Quarto
- Pre-configured YAML frontmatter
- Compatible with multiple output formats (PDF, HTML, Word)
- Rendering instructions included

## Basic Usage

### From the Interface

Export buttons appear automatically in the bottom-right corner of each documentation page.

**Available options:**
- 🟣 **Export to PDF** - Exports only the current document
- 🟣 **All Docs (PDF)** - Exports all documentation in a single PDF
- 🔴 **Export to QMD** - Exports the current document to QMD format
- 🔴 **All Docs (QMD)** - Exports all documentation to QMD

### Export Individual Document

1. Navigate to the document you want to export
2. Click on **"Export to PDF"** or **"Export to QMD"**
3. The file will download automatically

### Export All Documentation

1. From any page, click on **"All Docs"** (PDF or QMD)
2. A single file will be generated with all your documentation
3. The file includes table of contents and cover page

## Configuration

You can customize export options in `config/config.yaml`:

```yaml
export:
  # Show buttons on all pages
  show_on_all_pages: true
  
  # PDF Configuration
  pdf:
    enabled: true
    button_text: "Export to PDF"
    project_name: "My Project"  # Name on cover page
    show_all_option: true
    paper_size: "A4"
    margins: "2cm"
  
  # QMD Configuration
  qmd:
    enabled: true
    button_text: "Export to QMD"
    project_name: "My Project"
    show_all_option: true
    default_format: "pdf"  # pdf, html, docx
```

### Available Options

#### General Configuration

- **show_on_all_pages**: Show buttons on all pages (`true`/`false`)

#### PDF Configuration

- **enabled**: Enable PDF export (`true`/`false`)
- **button_text**: Custom button text
- **project_name**: Project name for cover page (leave empty to use `site_name`)
- **show_all_option**: Show "All Docs" button (`true`/`false`)
- **paper_size**: Paper size (`A4`, `Letter`, `Legal`)
- **margins**: Margins in CSS format (e.g., `2cm`, `1in`)

#### QMD Configuration

- **enabled**: Enable QMD export (`true`/`false`)
- **button_text**: Custom button text
- **project_name**: Project name (leave empty to use `site_name`)
- **show_all_option**: Show "All Docs" button (`true`/`false`)
- **default_format**: Default output format (`pdf`, `html`, `docx`)

## Rendering QMD Files

Exported QMD files can be rendered using [Quarto](https://quarto.org).

### Install Quarto

Visit [https://quarto.org/docs/get-started/](https://quarto.org/docs/get-started/) and download the installer for your operating system.

### Rendering Commands

```bash
# Render to PDF
quarto render document.qmd --to pdf

# Render to HTML
quarto render document.qmd --to html

# Render to Word (.docx)
quarto render document.qmd --to docx

# Interactive preview
quarto preview document.qmd
```

### Customize Rendering

You can edit the YAML frontmatter of the exported QMD file to customize the output:

```yaml
---
title: "My Documentation"
author: "Your Name"
date: "2026-02-19"
format:
  pdf:
    documentclass: article
    papersize: a4
    toc: true
    number-sections: true
    highlight-style: github
---
```

## Advanced Customization

### PDF Styles

PDF styles can be customized by modifying `export/pdf_export.py`:

```python
def _get_pdf_styles(self):
    return """
    @page {
        size: A4;
        margin: 2cm;
    }
    
    .pdf-cover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        /* Customize the cover gradient */
    }
    
    /* More custom styles... */
    """
```

### QMD Frontmatter

Customize frontmatter in `export/qmd_export.py`:

```python
def _generate_yaml_frontmatter(self, project_name, author=None, date=None):
    # Customize default values
    frontmatter = f"""---
title: "{project_name}"
subtitle: "Your custom subtitle"
author: "{author}"
# More options...
---
"""
```

## Disable Export

If you don't need the export functionality:

1. Open `config/config.yaml`
2. Change to `false`:

```yaml
export:
  show_on_all_pages: false
  pdf:
    enabled: false
  qmd:
    enabled: false
```

## Troubleshooting

### Buttons don't appear

✅ **Solution:**
1. Verify that `export.show_on_all_pages: true` in `config.yaml`
2. Verify that `export.pdf.enabled` or `export.qmd.enabled` are set to `true`
3. Clear browser cache (Ctrl+F5)

### Error generating PDF

✅ **Solution:**
1. Verify that `weasyprint` is installed: `pip install weasyprint`
2. On Windows, install GTK: [GTK Runtime](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer)
3. Check server logs for more details

### Error with special characters

✅ **Solution:**
- Make sure your `.md` files are encoded in UTF-8
- Verify charset configuration in `config.yaml`

### PDF too large

✅ **Solution:**
- Reduce images before adding them to documentation
- Use optimized image formats (WebP, optimized JPG)
- Consider splitting documentation into multiple PDFs

## Export API

### HTTP Routes

```
GET /export/pdf/<doc_path>      # Export document to PDF
GET /export/pdf/all             # Export all to PDF
GET /export/qmd/<doc_path>      # Export document to QMD
GET /export/qmd/all             # Export all to QMD
GET /export/config              # Get configuration
```

### Programmatic Usage

```python
from export import PDFExporter, QMDExporter

# Create exporters
pdf_exporter = PDFExporter(config_manager)
qmd_exporter = QMDExporter(config_manager)

# Export to PDF
pdf_buffer = pdf_exporter.export_document(
    document=doc,
    navigation=nav,
    project_name="My Project"
)

# Export to QMD
qmd_buffer = qmd_exporter.export_document(
    markdown_content=content,
    title="Title",
    project_name="My Project"
)
```

## Tips and Best Practices

### For Quality PDFs

1. ✅ Use hierarchical headings (H1, H2, H3)
2. ✅ Include strategic page breaks
3. ✅ Optimize images before adding them
4. ✅ Use code blocks with defined syntax
5. ✅ Avoid very wide tables

### For Optimal QMD

1. ✅ Keep Markdown structure clean
2. ✅ Use standard Markdown when possible
3. ✅ Leverage Quarto extensions
4. ✅ Document your equations with LaTeX
5. ✅ Use cross-references

## Upcoming Features

- [ ] Export to EPUB
- [ ] Export to static HTML
- [ ] Customizable cover page templates
- [ ] PDF watermarks
- [ ] Automatic PDF compression
- [ ] Digital document signing
- [ ] Scheduled exports

---

Need additional help? Check the [export module README](../export/README.md) or report an issue on GitHub.
