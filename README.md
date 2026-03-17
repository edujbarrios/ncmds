<div align="center">

# No Code Markdown Documentation Sites

<img src="images/logo.png" alt="NCMDS Logo" width="400"/>

**Create beautiful documentation sites with just Markdown**

![On Active Development](https://img.shields.io/badge/Status-On%20Active%20Development-0D8B8B?style=for-the-badge&logo=github&logoColor=white)
![Unstable Versions](https://img.shields.io/badge/Versions-Unstable-0D8B8B?style=for-the-badge&logo=exclamation&logoColor=white)
![AI Integration](https://img.shields.io/badge/AI%20Integration-LLM7.io-0D8B8B?style=for-the-badge&logo=openai&logoColor=white)

</div>

<img src="images/mainpage_v1.png" alt="Main View"/>

## Overview

NCMDS is a zero-configuration documentation site builder that converts Markdown files into beautiful, dark-themed documentation websites with automatic navigation, AI-powered assistance, and an optimized reading experience.

**Author:** Eduardo J. Barrios ([edujbarrios](https://github.com/edujbarrios))

## ✨ Key Features

- 🏠 **Local-First** - Runs on localhost by default, no cloud required
- 🤖 **AI-Powered Chat** - Ask questions about documentation with built-in AI assistant and switchable models
- 📤 **Export Functionality** - Export documentation to PDF and QMD (Quarto Markdown) formats
- 🎨 **Dark Theme** - Optimized for comfortable reading and coding
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔍 **Auto Navigation** - Automatic table of contents and page navigation

## 🚀 Quick Start (Local Development)

> [!CAUTION]
> **Default Mode:** NCMDS runs locally on your machine. Cloud deployment is completely optional.

```bash
# Clone repository
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds

# Install dependencies
pip install -r requirements.txt

# Run locally (default)
python ncmds.py
```

Open `http://localhost:5000` in your browser.

**That's it!** The tool is designed to run on localhost by default. No additional configuration needed.

## 📝 Usage

1. Add `.md` files to the `docs/` folder
2. Use numeric prefixes for ordering: `01-index.md`, `02-guide.md`
3. Write in Markdown
4. Reload browser to see changes

## ⚙️ Configuration

Edit `config/config.yaml`:

```yaml
site_name: "My Documentation"
author: "Your Name"
description: "Your site description"

hero:
  enabled: true
  project_name: "My Project"
  company: "Your Company"
  tagline: "Your tagline here"
  description: "Your project description"

# AI Chat Assistant
ai_chat:
  enabled: true
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "your-api-key"  # Get your key from LLM7.io
  model: "gpt-4o-mini"  # Default model (switchable in chat UI)
  provider: "LLM7.io"
```
<img src="images/image.png" alt="NCMDS AI chat" width="400"/>

**AI Features:**
- Model selector dropdown to switch between available models in real-time
- Context-aware responses based on current documentation page
- Fullscreen mode for better reading experience

## 📤 Export Documentation

NCMDS includes a powerful export module that allows you to export your documentation to different formats:

- **PDF Export** - Generate professional PDFs with WeasyPrint
- **QMD Export** - Export to Quarto Markdown format for rendering with Quarto
- **Customizable Settings** - Configure project name, paper size, and more
- **Easy to Use** - Click floating export buttons on any documentation page

### Export Options

- Automatic table of contents generation
- Professional cover page with project branding
- Optimized for print and digital reading

## 🆕 Cloud Deployment Support

**NEW:** NCMDS now supports publishing your site via **Vercel** and **Netlify** with auto-detection!

See the [Deployment Guide](docs/06-deployment.md) for complete instructions on deploying to production.

## 🔎 Internal Search

**NEW:** Internal Search is now available to quickly find content across your documentation.

<img src="images/search.png" alt="NCMDS Internal Search" width="400"/>

## 📚 Documentation

Full documentation available at `/docs` when running the server, or view:

- [Getting Started](docs/02-getting-started.md)
- [Configuration Guide](docs/03-configuration.md)
- [Markdown Features](docs/04-markdown-guide.md)
- [Theme Creation](docs/05-themes.md)
- [Deployment Guide](docs/06-deployment.md)
- [Template Components](docs/07-components.md)

## 🛠️ Tech Stack

- **Flask** - Web framework
- **Python-Markdown** - Markdown processing with extensions
- **PyYAML** - Configuration management
- **Highlight.js** - Syntax highlighting
- **LLM7.io** - AI chat integration with model switching
- **WeasyPrint** - PDF generation (optional)
- **Quarto** - QMD rendering support (optional)

## 🎯 Use Cases

- Project documentation
- Technical documentation
- API documentation
- Personal wikis
- Educational materials
- User guides


## 🙏 Acknowledgments

Inspired by Docusaurus, MkDocs, Read the Docs, and Quarto.

## 📞 Contact

- **Author:** [edujbarrios](https://github.com/edujbarrios) - eduardojbarriosgarcia@gmail.com

