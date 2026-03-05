# Getting Started with NCMDS

This comprehensive guide will take you from installation to creating your first professional documentation site with NCMDS.

## 📦 Installation

### System Requirements

**Minimum Requirements:**
- Python 3.7 or higher (Python 3.10+ recommended)
- pip package manager
- 100 MB free disk space
- Any modern web browser

**For PDF Export (optional):**
- WeasyPrint dependencies (automatically installed)
- On Windows: GTK+ libraries (usually included)
- On Linux: `libpango`, `libcairo2` (install via package manager)

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds

# Or using SSH
git clone git@github.com:edujbarrios/ncmds.git
cd ncmds
```

#### 2. Install Python Dependencies

```bash
# Install all required packages
pip install -r requirements.txt

# Or using virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Then install dependencies
pip install -r requirements.txt
```

#### 3. Verify Installation

```bash
# Check if all dependencies are installed
pip list | grep -E "Flask|markdown|PyYAML|weasyprint"

# Should show:
# Flask==2.x.x
# Markdown==3.x.x
# PyYAML==6.x.x
# weasyprint==xx.x
```

#### 4. Start the Server

```bash
python ncmds.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

#### 5. Access Your Documentation

Open your browser and navigate to:
- `http://localhost:5000` - Your documentation homepage
- `http://127.0.0.1:5000` - Alternative address (same server)

## 📝 Creating Your First Documentation

### Understanding the `docs/` Folder

All your Markdown files go in the `docs/` directory. NCMDS automatically discovers and serves them.

**Current structure:**
```
docs/
├── 01-index.md              ← Homepage
├── 02-getting-started.md    ← This guide
├── 03-configuration.md      ← Config guide
├── 04-markdown-guide.md     ← Markdown reference
├── 05-themes.md             ← Theme guide
├── 06-deployment.md         ← Deploy guide
└── 07-components.md         ← Component guide
```

### Create Your First Page

#### Step 1: Create the File

Create `docs/08-my-first-page.md` with your text editor:

```markdown
# My First Documentation Page

Welcome to my custom documentation!

## Introduction

This page demonstrates how easy it is to create documentation with NCMDS.

## Features I Love

- **Zero configuration** - Just write Markdown
- **Instant preview** - Refresh to see changes
- **Beautiful styling** - Professional look out of the box

## Code Example

```python
def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}! Welcome to NCMDS."

print(greet("World"))
```

## What's Next?

Now I can add more pages, customize the theme, and even set up AI assistance!
```

#### Step 2: View Your Page

1. Save the file
2. Go to your browser
3. Refresh the page (`F5` or `Ctrl+R`)
4. Look in the sidebar—your new page appears!
5. Click on "My First Page" to view it

**That's it!** No compilation, no build step, no webpack. Just write and refresh.

## 📋 Document Ordering

Control the order of pages in the sidebar menu using three methods:

### Method 1: Numeric Prefix (Recommended)

Add a number prefix to your filename:

```
docs/
├── 01-index.md          # First
├── 02-getting-started.md # Second
├── 03-configuration.md   # Third
├── 10-advanced.md        # Fourth
└── 99-appendix.md        # Last
```

**Benefits:**
- Easy to see order at a glance
- Simple to reorder (rename files)
- No need to edit file contents

### Method 2: YAML Frontmatter

Add metadata at the top of your `.md` file:

```markdown
---
order: 10
title: "Custom Page Title"
---

# My Document

Content starts here...
```

**Options:**
- `order`: Numeric value for sorting (lower numbers appear first)
- `title`: Override the filename for display in navigation

### Method 3: Alphabetical (Default)

If no prefix or `order` metadata exists, files sort alphabetically:

```
docs/
├── api-reference.md     # First (A)
├── deployment.md        # Second (D)
├── getting-started.md   # Third (G)
└── troubleshooting.md   # Fourth (T)
```

## 📤 Exporting Documentation

NCMDS can export your documentation to PDF or QMD (Quarto Markdown) formats.

### Quick Export

**To export any page:**

1. Navigate to the page you want to export
2. Look for the floating action buttons in the bottom-right corner
3. Click one of these buttons:
   - **📄 Export to PDF** - Download current page as PDF
   - **📑 All Docs (PDF)** - Download entire site as single PDF
   - **📋 Export to QMD** - Download current page as Quarto Markdown
   - **📚 All Docs (QMD)** - Download all pages as QMD files (ZIP)

### PDF Export Features

**What you get:**
- Professional cover page with your project name
- Automatic table of contents
- Syntax-highlighted code blocks
- Optimized for printing and digital reading
- Page numbers and headers/footers

**Example uses:**
- Offline reading
- Sharing with non-technical stakeholders
- Archiving documentation versions
- Printing user manuals

### QMD Export Features

**What you get:**
- Quarto Markdown files with YAML frontmatter
- Ready to render with Quarto CLI
- Preserves all Markdown formatting
- Configurable output formats (PDF, HTML, DOCX)

**How to use QMD files:**

```bash
# Install Quarto (if not already installed)
# Download from https://quarto.org/docs/get-started/

# Render to PDF
quarto render document.qmd --to pdf

# Render to HTML
quarto render document.qmd --to html

# Render to Word
quarto render document.qmd --to docx
```

### Configure Export Settings

Edit `config/config.yaml`:

```yaml
export:
  show_on_all_pages: true  # Show export buttons on all pages
  
  pdf:
    enabled: true
    project_name: "My Project"  # Appears on cover page
    paper_size: "A4"  # Or "Letter"
    margins: "2cm"
  
  qmd:
    enabled: true
    project_name: "My Project"
    default_format: "pdf"  # Or "html", "docx"
```

## 💡 Best Practices

Follow these guidelines for excellent documentation:

### Writing Guidelines

**1. Clear Titles**
- Use descriptive, specific titles
- Start with action verbs: "Installing", "Configuring", "Deploying"
- Avoid vague titles like "Info" or "Stuff"

**2. Structure Content**
```markdown
# Main Topic (H1 - once per page)

Brief introduction explaining what this page covers.

## Section (H2)

Main content sections.

### Subsection (H3)

Detailed topics within sections.

#### Detail (H4)

Specific details or examples.
```

**3. Use Examples Liberally**
- Code examples for every feature
- Screenshots where helpful
- Before/after comparisons
- Real-world use cases

**4. Keep Pages Focused**
- One topic per page
- Break large topics into multiple pages
- Link related pages together

**5. Test Your Docs**
- Read them with fresh eyes
- Have someone else review them
- Check all links and code examples

### File Organization

**For small sites (< 20 pages):**
```
docs/
├── 01-index.md
├── 02-installation.md
├── 03-usage.md
└── 04-api-reference.md
```

**For medium sites (20-50 pages):**
```
docs/
├── 01-index.md
├── 02-getting-started.md
├── 10-user-guide.md
├── 11-basic-usage.md
├── 12-advanced-features.md
├── 20-api-reference.md
├── 21-api-endpoints.md
└── 30-deployment.md
```

**For large sites (50+ pages):**
Consider organizing by folders (coming soon) or using gaps in numbering:

```
docs/
├── 01-index.md
├── 10-introduction.md
├── 20-installation.md
├── 30-tutorials.md
├── 31-tutorial-basics.md
├── 32-tutorial-advanced.md
├── 40-guides.md
├── 41-guide-authentication.md
├── 50-api-reference.md
└── 90-troubleshooting.md
```

## 📂 Project Structure Explained

Understanding NCMDS file organization:

```
ncmds/
├── ncmds.py                 # Main application entry point
├── requirements.txt         # Python dependencies
├── README.md               # Project README
│
├── config/                 # Configuration files
│   ├── config.yaml        # Main site configuration
│   └── settings.py        # Config management code
│
├── docs/                   # YOUR DOCUMENTATION GOES HERE
│   ├── 01-index.md        # Homepage
│   └── *.md               # Your Markdown files
│
├── templates/              # HTML templates (Jinja2)
│   ├── layout.html        # Base page layout
│   ├── home.html          # Homepage template
│   └── components/        # Reusable components
│
├── static/                 # Static assets
│   ├── main.css           # Main stylesheet
│   ├── ai_chat.js         # AI chat functionality
│   └── default_theme/     # Theme CSS files
│
├── export/                 # Export functionality
│   ├── pdf_export.py      # PDF generation
│   ├── qmd_export.py      # QMD generation
│   └── export_routes.py   # Export API routes
│
├── ai_chat/                # AI chat functionality
│   ├── llm_client.py      # LLM API client
│   └── routes.py          # Chat API routes
│
└── utils/                  # Utility modules
    └── math_render.py      # Math rendering
```

### What You Should Edit

**Always edit:**
- `config/config.yaml` - Your site settings
- `docs/*.md` - Your documentation content

**Sometimes edit:**
- `templates/` - If customizing HTML structure
- `static/main.css` or `static/default_theme/` - If customizing styles

**Rarely edit:**
- `ncmds.py` - Only if adding core features
- `export/` or `ai_chat/` - Only if modifying these features

## 🚀 Next Steps

Now that you understand the basics:

1. **[Configure Your Site](03-configuration.md)** - Set up site name, theme, AI chat
2. **[Learn Markdown](04-markdown-guide.md)** - Master all supported Markdown features
3. **[Customize Themes](05-themes.md)** - Create your own color scheme
4. **[Deploy to Production](06-deployment.md)** - Share your docs with the world

## 🆘 Getting Help

If you encounter issues:

1. Check the documentation (you're reading it!)
2. Look at example `.md` files in `docs/`
3. Review `config/config.yaml` for configuration options
4. Open an issue on [GitHub](https://github.com/edujbarrios/ncmds/issues)

Common issues and solutions:

**Server won't start:**
```bash
# Check if dependencies are installed
pip install -r requirements.txt

# Check if port 5000 is already in use
# Change port in config.yaml if needed
```

**Page doesn't appear:**
- Ensure file has `.md` extension
- Check file is in `docs/` directory
- Refresh browser (Ctrl+R or F5)
- Check terminal for errors

**Export buttons don't appear:**
- Check `export.show_on_all_pages: true` in config
- Ensure WeasyPrint is installed for PDF export
- Check browser console for JavaScript errors
├── docs/                      # Documentation source files
│   ├── 01-index.md
│   ├── 02-getting-started.md
│   ├── 03-configuration.md
│   ├── 04-markdown-guide.md
│   ├── 05-themes.md
│   └── 06-deployment.md
├── templates/
│   ├── home.html             # Hero landing page
│   ├── layout.html           # Main layout (modular)
│   └── components/           # Template components (organized by type)
│       ├── html/             # HTML template components
│       │   ├── head.html     # Meta tags, CSS, theme variables
│       │   ├── header.html   # Site header with logo and toggles
│       │   ├── sidebar.html  # Navigation sidebar
│       │   ├── toc.html      # Table of contents
│       │   ├── doc_navigation.html  # Prev/Next buttons
│       │   └── footer.html   # Site footer
│       └── scripts/          # JavaScript components
│           └── scripts.html  # All JavaScript functionality
├── static/
│   ├── main.css              # Main CSS entry point
│   ├── style.css             # Legacy stylesheet (backup)
│   ├── default_theme/        # Modular CSS files for default theme
│   │   ├── base.css          # Reset & typography
│   │   ├── header.css        # Header component styles
│   │   ├── hero.css          # Hero section styles
│   │   ├── sidebar.css       # Sidebar styles
│   │   ├── toc.css           # Table of contents styles
│   │   ├── content.css       # Main content & markdown
│   │   ├── code.css          # Code blocks & syntax highlighting
│   │   ├── navigation.css    # Navigation & footer
│   │   ├── responsive.css    # Media queries
│   │   └── utilities.css     # Utility classes
│   └── images/               # Static images
├── images/                    # Project images
├── ncmds.py                   # Main application
├── requirements.txt          # Python dependencies
├── config.yaml               # Alternative config location
└── tests.txt                 # Testing documentation
```

### Template Components

The layout system is now modular and organized by file type. Components in `templates/components/` are separated into:

**HTML Components (`html/`):**
- **head.html**: Document head with meta tags, CSS links, and theme CSS variables
- **header.html**: Site header with logo, theme toggle, sidebar/TOC toggles
- **sidebar.html**: Documentation navigation with auto-generated links
- **toc.html**: Table of contents for the current document
- **doc_navigation.html**: Previous/Next navigation buttons
- **footer.html**: Site footer with author information

**JavaScript Components (`scripts/`):**
- **scripts.html**: All JavaScript functionality (theme switching, toggles, copy buttons, etc.)

## 🔧 Next Steps

- Learn about [Configuration](03-configuration.md)
- Explore [Markdown Features](04-markdown-guide.md)
- Customize [Themes](05-themes.md)
- Understand [Template Components](07-components.md)
- Learn about [Deployment](06-deployment.md)
- Learn about [Deployment](06-deployment.md)
