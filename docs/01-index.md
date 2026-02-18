# Welcome to NCMDS

**NCMDS** (No Code Markdown Documentation Sites) is a documentation site builder designed for creating technical documentation with minimal configuration. The system converts standard Markdown files into a fully functional documentation website with customizable themes and automatic navigation generation.

**Author:** Eduardo J. Barrios ([edujbarrios](https://github.com/edujbarrios))

## ✨ Key Features

- **Hero Landing Page** with customizable branding
- **Modular configuration system** with parametrized settings
- **Modular template components** for clean architecture
- **Seven pre-built dark mode themes**
- **Custom theme creation** support
- **Standard Markdown (.md)** file support
- **Automatic document ordering** and navigation
- **Syntax highlighting** for code blocks
- **Responsive design** for all devices
- **Table of contents** generation
- **Zero build process** requirement

## 🎨 Available Themes

The system includes seven predefined themes:

- **Ocean**: Blue oceanic tones (default)
- **Forest**: Green natural tones
- **Sunset**: Warm orange and red tones
- **Purple Dream**: Deep violet tones
- **Cyberpunk**: Futuristic neon colors
- **Monochrome**: Black and white grayscale
- **Turquoise**: Professional turquoise with vibrant cyan accents

## 🚀 Quick Start

1. Create `.md` files in the `docs/` folder
2. Use numeric prefixes for ordering: `01-index.md`, `02-getting-started.md`
3. Write your documentation in Markdown
4. Reload your browser to see changes

## 📝 Document Example

```markdown
# Document Title

Document content here.

## Section

Content...

### Code Block

```python
def example():
    print("NCMDS example")
```

### Table

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

## 📚 Documentation

- [Getting Started Guide](02-getting-started.md)
- [Configuration Guide](03-configuration.md)
- [Markdown Features Guide](04-markdown-guide.md)
- [Theme Creation Guide](05-themes.md)
- [Deployment Guide](06-deployment.md)
- [Template Components Guide](07-components.md)

## 🛠️ Technical Stack

- **Flask** - Web framework
- **Python-Markdown** - Markdown processing
- **PyYAML** - Configuration parsing
- **Highlight.js** - Syntax highlighting
- **CSS Variables** - Theme customization

## 🎯 Use Cases

- Project documentation
- Personal wikis
- Educational materials
- Technical documentation
- API documentation
- User guides and tutorials

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Inspired by: Docusaurus, Quarto, MkDocs, Read the Docs

---

**Created by:** [edujbarrios](https://github.com/edujbarrios)
