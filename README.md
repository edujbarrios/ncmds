# NCMDS - No Code Markdown Sites

## Overview

NCMDS (No Code Markdown Sites) is a documentation site builder designed for creating technical documentation with minimal configuration. The system converts standard Markdown files into a fully functional documentation website with customizable themes and automatic navigation generation.

**Author:** Eduardo J. Barrios ([edujbarrios](https://github.com/edujbarrios))


## Key Features

- Modular configuration system with parametrized settings
- Six pre-built dark mode themes
- Custom theme creation support
- Standard Markdown (.md) file support
- Automatic document ordering and navigation
- Syntax highlighting for code blocks
- Responsive design for all devices
- Table of contents generation
- Zero build process requirement

## Available Themes

The system includes seven predefined themes:

- **Ocean**: Blue oceanic tones (default)
- **Forest**: Green natural tones
- **Sunset**: Warm orange and red tones
- **Purple Dream**: Deep violet tones
- **Cyberpunk**: Futuristic neon colors
- **Monochrome**: Black and white grayscale
- **Turquoise**: Professional turquoise with vibrant cyan accents

## Installation

### Prerequisites

- Python 3.7 or higher
- pip package manager

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the server:

```bash
python app.py
```

4. Access the application:

Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
ncmds/
├── config/
│   ├── config.yaml           # Main configuration file
│   ├── settings.py           # Configuration manager
│   └── themes/               # Theme definitions
│       ├── ocean.yaml
│       ├── forest.yaml
│       ├── sunset.yaml
│       ├── purple.yaml
│       ├── cyberpunk.yaml
│       ├── monochrome.yaml
│       └── turquoise.yaml
├── docs/                      # Documentation source files
│   ├── 01-index.md
│   ├── 02-getting-started.md
│   ├── 03-configuration.md
│   └── 04-markdown-guide.md
├── templates/
│   └── layout.html           # HTML layout template
├── static/
│   └── style.css             # CSS styles
├── app.py                     # Main application
└── requirements.txt          # Python dependencies
```

## Configuration

### Theme Selection

Edit `config/config.yaml` to change the active theme:

```yaml
theme_name: "ocean"  # Available: ocean, forest, sunset, purple, cyberpunk, monochrome, turquoise
```

### Creating Custom Themes

1. Create a new YAML file in `config/themes/` directory:

```yaml
name: "Custom Theme"
description: "Custom theme description"
author: "Your Name"

colors:
  primary_color: "#FF6B6B"
  secondary_color: "#4ECDC4"
  background_color: "#1A1A2E"
  surface_color: "#16213E"
  text_color: "#EAEAEA"
  text_secondary: "#C4C4C4"
  accent_color: "#FFE66D"
  border_color: "#0F3460"
  code_background: "#0F1419"
  link_color: "#95E1D3"
  link_hover: "#A8E6CF"
```

2. Activate the theme in `config/config.yaml`:

```yaml
theme_name: "custom-theme"
```

### Configuration Options

Complete configuration example in `config/config.yaml`:

```yaml
# Site information
site_name: "My Documentation"
author: "Your Name"
description: "Site description"

# Active theme
theme_name: "ocean"

# Server configuration
server:
  host: "0.0.0.0"
  port: 5000
  debug: true

# Directories
directories:
  docs: "docs"
  static: "static"
  templates: "templates"

# Features
features:
  table_of_contents: true
  syntax_highlighting: true
  auto_reload: true
```

## Writing Documentation

### Creating Documents

1. Create a `.md` file in the `docs/` folder
2. Use numeric prefixes for ordering: `05-document-name.md`
3. Write content in Markdown
4. Reload the browser to see changes

### Document Ordering

Documents can be ordered using three methods:

**Method 1: Numeric Prefix (Recommended)**
```
01-index.md
02-getting-started.md
03-configuration.md
```

**Method 2: Metadata**
```markdown
---
order: 10
---
# Document Title
```

**Method 3: Alphabetical (Default)**

### Document Example

```markdown
# Document Title

Document content here.

## Section

Content...

### Code Block

\```python
def example():
    print("NCMDS example")
\```

### Table

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

## Technical Architecture

### Core Components

- **ConfigManager**: Centralized configuration management
- **ThemeLoader**: Dynamic theme loading system
- **DocumentationSite**: Document processing and navigation generation

### Technology Stack

- Flask (Web framework)
- Python-Markdown (Markdown processing)
- PyYAML (Configuration parsing)
- Highlight.js (Syntax highlighting)
- CSS Variables (Theme customization)

### Supported Markdown Extensions

- Fenced Code Blocks
- Tables
- Table of Contents
- Syntax Highlighting
- Admonitions
- Metadata

## API

### List Available Themes

```
GET /api/themes
```

Response:
```json
{
  "themes": {
    "ocean": {
      "name": "Ocean",
      "description": "Ocean blue theme...",
      "author": "edujbarrios"
    }
  },
  "active_theme": "ocean"
}
```

## Deployment

### Development

```bash
python app.py
```

### Production

Using Gunicorn WSGI server:

```bash
pip install gunicorn
gunicorn app:app --bind 0.0.0.0:8000
```

## Use Cases

- Project documentation
- Personal wikis
- Educational materials
- Technical documentation
- API documentation
- User guides and tutorials

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

Eduardo J. Barrios ([edujbarrios](https://github.com/edujbarrios))

## Acknowledgments

Inspired by: Docusaurus, Quarto, MkDocs, Read the Docs

## Contact

- Issues: [GitHub Issues](https://github.com/edujbarrios/ncmds/issues)
- Discussions: [GitHub Discussions](https://github.com/edujbarrios/ncmds/discussions)
