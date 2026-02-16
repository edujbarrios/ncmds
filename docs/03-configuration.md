# Configuration Guide

NCMDS (No Code Markdown Sites) is designed to be simple, but also customizable. This guide explains all configuration options.

## Configuration File

All configuration is done in `config.yaml`. Here's the complete structure:

```yaml
# Basic Site Information
site_name: "Your Documentation Site"
author: "Your Name"
description: "Site description"

# Theme Colors
theme:
  primary_color: "#2563eb"
  secondary_color: "#7c3aed"
  background_color: "#0f172a"
  surface_color: "#1e293b"
  text_color: "#e2e8f0"
  text_secondary: "#94a3b8"
  accent_color: "#22d3ee"
  border_color: "#334155"
  code_background: "#1e293b"
  link_color: "#60a5fa"
  link_hover: "#93c5fd"
```

## Theme Customization

### Color Palette

NoCodeMDX uses a carefully designed dark mode color palette. You can customize every color:

| Color Variable | Description | Default |
|---------------|-------------|---------|
| `primary_color` | Main brand color, buttons | `#2563eb` (Blue) |
| `secondary_color` | Secondary accents | `#7c3aed` (Purple) |
| `background_color` | Page background | `#0f172a` (Dark blue) |
| `surface_color` | Sidebar, header, cards | `#1e293b` (Lighter blue) |
| `text_color` | Main body text | `#e2e8f0` (Light gray) |
| `text_secondary` | Secondary text, captions | `#94a3b8` (Gray) |
| `accent_color` | Highlights, badges | `#22d3ee` (Cyan) |
| `border_color` | Borders, dividers | `#334155` (Dark gray) |
| `code_background` | Code block background | `#1e293b` (Dark) |
| `link_color` | Link color | `#60a5fa` (Light blue) |
| `link_hover` | Link hover state | `#93c5fd` (Lighter blue) |

### Predefined Color Schemes

#### Ocean Theme (Default)
```yaml
theme:
  primary_color: "#2563eb"
  secondary_color: "#7c3aed"
  background_color: "#0f172a"
  surface_color: "#1e293b"
  accent_color: "#22d3ee"
```

#### Forest Theme
```yaml
theme:
  primary_color: "#059669"
  secondary_color: "#10b981"
  background_color: "#064e3b"
  surface_color: "#065f46"
  accent_color: "#34d399"
```

#### Sunset Theme
```yaml
theme:
  primary_color: "#dc2626"
  secondary_color: "#f59e0b"
  background_color: "#1c1917"
  surface_color: "#292524"
  accent_color: "#fb923c"
```

#### Purple Dream Theme
```yaml
theme:
  primary_color: "#7c3aed"
  secondary_color: "#a78bfa"
  background_color: "#1e1b4b"
  surface_color: "#312e81"
  accent_color: "#c4b5fd"
```

## Site Information

### Basic Settings

```yaml
# Your site name appears in the header and page titles
site_name: "My Documentation"

# Author name shown in the footer
author: "edujbarrios"

# Site description for SEO
description: "Comprehensive project documentation"
```

## Navigation

Navigation is auto-generated from your `docs/` folder. Files are automatically discovered and added to the sidebar.

### Document Ordering

Documents are ordered in two ways:

1. **Numeric Prefix Method** (Recommended):
   - Name files with numeric prefixes: `01-index.md`, `02-getting-started.md`, etc.
   - The system automatically sorts by these numbers
   - The prefix is removed from the displayed title

2. **Metadata Method**:
   - Add an `order` field in your document's front matter:
   ```markdown
   ---
   order: 10
   ---
   # Your Document Title
   ```

3. **Alphabetical** (Default):
   - Without prefixes or metadata, files are sorted alphabetically

### File Organization

Organize your docs folder logically:

```
docs/
├── 01-index.md           # Home page (required)
├── 02-getting-started.md # Getting started guide
├── 03-configuration.md   # Configuration guide
├── 04-markdown-guide.md  # Markdown features
├── advanced/             # Folder creates sections
│   ├── 01-deployment.md
│   └── 02-optimization.md
└── api/
    ├── 01-reference.md
    └── 02-examples.md
```

### Document Titles

The first heading (`# Title`) in each Markdown file becomes the navigation label. For example:

```markdown
# Getting Started Guide

Content goes here...
```

This document will appear as "Getting Started Guide" in the sidebar.

## Advanced Features

### Metadata

Add metadata to your Markdown files using front matter:

```markdown
---
title: Custom Page Title
description: Page description for SEO
author: John Doe
date: 2026-02-12
---

# Your Content Here
```

### Custom Styling

To add custom CSS, edit `static/style.css` or create additional stylesheets.

## Environment Variables

You can also configure some settings via environment variables:

```bash
# Change the port (default: 5000)
export FLASK_PORT=8080

# Enable debug mode
export FLASK_DEBUG=1

# Set docs directory
export DOCS_DIR=my-docs
```

## Best Practices

1. **Keep config simple** - Only customize colors you need
2. **Test color contrast** - Ensure text is readable
3. **Use semantic names** - Name your files descriptively
4. **Organize hierarchically** - Use folders for related docs
5. **Start with defaults** - Customize gradually as needed

## Troubleshooting

### Colors not updating?

1. Clear your browser cache
2. Restart the server
3. Check for YAML syntax errors in config.yaml

### Navigation not showing?

1. Ensure files have `.md` extension
2. Check file permissions
3. Verify files are in `docs/` folder

---

Need more help? Check the [Getting Started](getting-started) guide or review the example files.
