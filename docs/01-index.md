---
tags:
	- overview
	- introduction
	- home
---

# Welcome to NCMDS

**NCMDS** (No Code Markdown Documentation Sites) is a powerful yet simple documentation site builder that transforms your Markdown files into beautiful, professional documentation websites. No compilation, no complex build processes—just write Markdown and see your documentation come to life instantly.

**Author:** Eduardo J. Barrios ([edujbarrios](https://github.com/edujbarrios))

![Status](https://img.shields.io/badge/Status-Active%20Development-0D8B8B?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Documentation%20Engine-000000?style=flat-square&logo=flask&logoColor=white)
![Export](https://img.shields.io/badge/Export-QMD-0D8B8B?style=flat-square)

> [!NOTE]
> NCMDS is local-first. You can run it instantly with `python ncmds.py` and start writing docs right away.

## 🎯 What is NCMDS?

NCMDS is a Flask-based documentation system that:

- **Reads** your `.md` files from the `docs/` directory
- **Converts** them to HTML with enhanced styling and features
- **Serves** them as a navigable website with automatic menus and TOC
- **Exports** documentation to PDF or Quarto Markdown (QMD) formats
- **Assists** you with an AI-powered chat that answers questions about your docs

### Perfect For

- Technical documentation
- Project wikis
- API documentation
- User manuals
- Knowledge bases
- Tutorial sites
- Personal notes

## ✨ Key Features

### 📝 Markdown-Powered
- Write in standard Markdown—no special syntax required
- Full GitHub-Flavored Markdown (GFM) support
- Code blocks with syntax highlighting (Python, JavaScript, YAML, etc.)
- Tables, lists, images, links—everything you expect

### 🎨 Beautiful Theme
- **Seven pre-built themes**: Ocean, Forest, Sunset, Purple Dream, Cyberpunk, Monochrome, and Turquoise
- **Custom theme creation**: Define your own color palette
- **Dark mode optimized** for comfortable reading
- **Responsive design** that works on all devices

### 🤖 AI Chat Assistant
- **Ask questions** about your documentation in natural language
- **Switch between AI models** (GPT-4, Claude, etc.) on the fly
- **Context-aware**: The AI reads your current page for relevant answers
- **Fullscreen mode** for extended conversations

### 📤 Export Anywhere
- **PDF Export**: Generate professional PDFs with cover pages and TOC
- **QMD Export**: Export to Quarto Markdown for advanced rendering
- **Single page or entire site**: Export what you need
- **One-click download**: Floating buttons on every page

### 🚀 Zero Build Process
- No compilation step required
- No npm install or webpack
- Just start the server and edit files
- Changes appear instantly on refresh

### 📋 Automatic Navigation
- Sidebar navigation generated from your files
- Table of contents for each page
- Order pages with numeric prefixes (`01-`, `02-`, etc.)
- Collapsible sections for better organization

## 🚀 Quick Start

Get started in 3 simple steps:

### 1. Install and Run

```bash
# Clone the repository
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds

# Install dependencies
pip install -r requirements.txt

# Start the server
python ncmds.py
```

### 2. Create Your First Document

Create a file `docs/08-my-page.md`:

```markdown
# My First Page

This is my documentation!

## Features

- Easy to write
- Beautiful output
- No configuration needed

Create `code  content as well`
```

### 3. View Your Site

Open your browser to `http://localhost:5000` and see your documentation live!

## 📚 What's Next?

Now that you've seen the basics, explore these guides:

- **[Getting Started →](02-getting-started.md)** - Complete installation and first steps
- **[Configuration →](03-configuration.md)** - Customize your site (themes, AI chat, export)
- **[Markdown Guide →](04-markdown-guide.md)** - Learn all supported Markdown features
- **[Deployment →](06-deployment.md)** - Deploy to production (Docker, Heroku, Railway)
- **[Export Documentation →](03-configuration.md#export-settings)** - Generate PDFs and QMD files

## 🎨 Theme Customization

NCMDS features a dark/light theme system with full color customization:

| Mode | Description | Default Primary Color |
|------|-------------|----------------------|
| **Dark** | Professional dark theme optimized for comfortable reading | `#40E0D0` (Turquoise) |
| **Light** | Clean light theme for bright environments | `#0f766e` (Teal) |

Customize colors in `config/config.yaml`:

```yaml
theme:
  default: "dark"
  toggle_enabled: true
  dark:
    primary_color: "#40E0D0"
    background_color: "#1b1b1d"
    # ... more color options
```

See the [Theme Guide](05-themes.md) for full customization options.

## How NCMDS Works

Understanding the system will help you use it effectively:

### 1. File Discovery
- NCMDS scans the `docs/` folder for `.md` files
- Files are ordered by numeric prefix (`01-`, `02-`) or alphabetically
- Nested folders are supported for organization

### 2. Markdown Processing
- Each `.md` file is parsed using Python-Markdown
- Extensions add support for tables, code highlighting, and more
- Metadata (YAML frontmatter) can control page-specific settings

### 3. Template Rendering
- HTML is generated using Flask and Jinja2 templates
- Navigation and TOC are built automatically
- Themes apply your chosen colors via CSS variables

### 4. Live Serving
- Flask serves the site on `localhost:5000` by default
- Each page request renders the Markdown fresh
- Changes to `.md` files appear on page refresh (no restart needed)

### 5. Export & AI
- Export buttons generate PDFs (via WeasyPrint) or QMD files on-demand
- AI chat sends your question + current page content to the LLM API
- Responses stream back in real-time

## 🛠️ Technical Stack

Built with modern, reliable technologies:

- **Backend**: Flask (Python web framework)
- **Markdown**: Python-Markdown with extensions
- **Templating**: Jinja2
- **Styling**: CSS with variables for theming
- **Syntax Highlighting**: Highlight.js
- **PDF Generation**: WeasyPrint
- **AI Integration**: LLM7.io API (supports multiple providers)
- **Configuration**: YAML

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Inspired by: Docusaurus, Quarto, MkDocs, Read the Docs

---

**Created by:** [edujbarrios](https://github.com/edujbarrios)
