<div align="center">

# No Code Markdown Documentation Sites

<img src="images/logo.png" alt="NCMDS Logo" width="400"/>

**Create beautiful documentation sites with just Markdown**

![On Active Development](https://img.shields.io/badge/Status-On%20Active%20Development-3b82f6?style=for-the-badge&logo=github&logoColor=white)
![Unstable Versions](https://img.shields.io/badge/Versions-Unstable-f59e0b?style=for-the-badge&logo=exclamation&logoColor=white)

</div>

## Overview

NCMDS is a zero-configuration documentation site builder that converts Markdown files into beautiful, dark-themed documentation websites with automatic navigation and an optimized reading experience.

**Author:** Eduardo J. Barrios ([edujbarrios](https://github.com/edujbarrios))

## ✨ Key Features

- 🎨 **Optimized Dark Theme** - Beautiful dark mode designed for comfortable reading
- 🚀 **Zero Build Process** - Write Markdown, see results instantly
- 📱 **Fully Responsive** - Perfect on all devices
- 🎯 **Hero Landing Page** - Customizable branding with gradient effects
- 💻 **Syntax Highlighting** - Beautiful code blocks with copy button
- 📋 **Auto Navigation** - Automatic sidebar generation with prev/next buttons
- 🧩 **Modular Components** - Clean component-based template architecture
- ⚙️ **Easy Configuration** - Simple YAML-based settings
- 📄 **Export Functionality** - Export documentation to PDF and QMD (Quarto Markdown) formats

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds

# Install dependencies
pip install -r requirements.txt

# Run
python ncmds.py
```

Open `http://localhost:5000` in your browser.

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
```

The site uses a single, optimized dark theme designed for comfortable reading and coding.

More themes will be added in the future.

## 📤 Export Documentation

NCMDS includes a powerful export module that allows you to export your documentation to different formats:

- **QMD Export** - Export to Quarto Markdown format for rendering with Quarto
- **Customizable Settings** - Configure project name, paper size, and more
- **Easy to Use** - Click floating export buttons on any documentation page

### Export Options

- Automatic table of contents generation
- Professional cover page with project branding
- Optimized for print and digital reading

See the [Export Documentation](docs/08-export.md) for detailed usage instructions.

## 📚 Documentation

Full documentation available at `/docs` when running the server, or view:

- [Getting Started](docs/02-getting-started.md)
- [Configuration Guide](docs/03-configuration.md)
- [Markdown Features](docs/04-markdown-guide.md)
- [Theme Creation](docs/05-themes.md)
- [Deployment Guide](docs/06-deployment.md)
- [Template Components](docs/07-components.md)
- [Export Documentation](docs/08-export.md)

## 🛠️ Tech Stack

- **Flask** - Web framework
- **Python-Markdown** - Markdown processing
- **PyYAML** - Configuration
- **Highlight.js** - Syntax highlighting
- **WeasyPrint** - PDF generation (optional)
- **Quarto** - QMD rendering support (optional)

## 🎯 Use Cases

- Project documentation
- Technical documentation
- API documentation
- Personal wikis
- Educational materials
- User guides

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

Inspired by Docusaurus, MkDocs, Read the Docs, and Quarto

## 📞 Contact

- **Author:** [edujbarrios](https://github.com/edujbarrios) - eduardojbarriosgarcia@gmail.com

---

<div align="center">
Made with ❤️ by edujbarrios
</div>

