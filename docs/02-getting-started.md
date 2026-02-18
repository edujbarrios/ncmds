# Getting Started with NCMDS

NCMDS is designed to be simple and intuitive. This guide will help you create your first documentation site.

## 📦 Installation

### Prerequisites

- Python 3.7 or higher
- pip package manager

### Installation Steps

1. **Clone the repository:**

```bash
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Start the server:**

```bash
python ncmds.py
```

4. **Access the application:**

Open your browser and navigate to `http://localhost:5000`

## 📝 Creating Your First Document

1. Navigate to the `docs/` folder
2. Create a new file: `07-my-first-doc.md`
3. Add content:

```markdown
# My First Document

This is my first documentation page!

## Features

- Easy to use
- Beautiful design
- Fast and responsive
```

4. Save the file
5. Reload your browser to see changes

## 📋 Document Ordering

Documents can be ordered using three methods:

### Method 1: Numeric Prefix (Recommended)
```
01-index.md
02-getting-started.md
03-configuration.md
```

### Method 2: Metadata
```markdown
---
order: 10
---
# Document Title
```

### Method 3: Alphabetical (Default)

If no numeric prefix or order metadata is provided, documents are sorted alphabetically.

## 💡 Best Practices

- Use descriptive file names
- Keep documents focused on one topic
- Use headings to organize content hierarchically
- Add code examples when relevant
- Include images and diagrams for clarity
- Test your documentation with fresh eyes

## 📂 Project Structure

```
ncmds/
├── config/
│   ├── __init__.py
│   ├── config.yaml           # Main configuration file
│   ├── settings.py           # Configuration manager
│   └── themes/               # Theme definitions
│       ├── ncmds_default.yaml
│       └── TEMPLATE.md
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
