# Configuration Guide

NCMDS uses a YAML-based configuration system for easy customization.

## 📋 Configuration File

The main configuration file is located at `config/config.yaml`.

## ⚙️ Configuration Options

### Site Information

```yaml
# Basic site information
site_name: "NCMDS Documentation"
author: "edujbarrios"
description: "Easy documentation site builder with Markdown - no code required"
```

### Hero Section

```yaml
# Hero section configuration
hero:
  enabled: true
  project_name: "NCMDS"
  company: "edujbarrios"
  tagline: "No Code Markdown Documentation Sites"
  description: "Create beautiful documentation sites with just Markdown - no coding required"
```

**Hero Options:**
- `enabled`: Show/hide hero on homepage
- `project_name`: Main title displayed on hero
- `company`: Company/author badge
- `tagline`: Subtitle text
- `description`: Hero description

### Theme Selection

```yaml
# Theme selection
theme_name: "ocean"  # Available: ocean, forest, sunset, purple, cyberpunk, monochrome, turquoise
```

### Custom Theme

If you want to use a custom theme, set `theme_name: "custom"` and define colors:

```yaml
custom_theme:
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

### Server Configuration

```yaml
server:
  host: "0.0.0.0"
  port: 5000
  debug: true
```

**Server Options:**
- `host`: Server host address
- `port`: Server port number
- `debug`: Enable/disable debug mode (set to `false` in production)

### Directories

```yaml
directories:
  docs: "docs"
  static: "static"
  templates: "templates"
```

### Features

```yaml
features:
  table_of_contents: true
  syntax_highlighting: true
  auto_reload: true
  search: false  # Coming soon
```

**Feature Options:**
- `table_of_contents`: Show/hide table of contents
- `syntax_highlighting`: Enable syntax highlighting for code blocks
- `auto_reload`: Auto-reload on file changes (development)
- `search`: Enable search functionality (coming soon)

## 📝 Complete Example

```yaml
# NCMDS Site Configuration
site_name: "My Documentation"
author: "Your Name"
description: "My amazing documentation site"

hero:
  enabled: true
  project_name: "My Project"
  company: "Your Company"
  tagline: "Making documentation simple"
  description: "Beautiful documentation with zero configuration"

theme_name: "forest"

server:
  host: "0.0.0.0"
  port: 5000
  debug: false

directories:
  docs: "docs"
  static: "static"
  templates: "templates"

features:
  table_of_contents: true
  syntax_highlighting: true
  auto_reload: false
  search: false
```

## 🔄 Applying Changes

After modifying `config.yaml`:

1. Save the file
2. Restart the server:
   ```bash
   # Stop server (Ctrl+C)
   python app.py
   ```

## 💡 Tips

- Use descriptive site names
- Keep debug mode off in production
- Test theme changes with different content
- Backup your config before major changes
- Use environment variables for sensitive data

## 🔧 Advanced Configuration

### Environment Variables

You can override config values with environment variables:

```bash
export NCMDS_PORT=8000
export NCMDS_DEBUG=false
```

### Dynamic Configuration

The configuration is loaded through `ConfigManager` which supports:
- Hot reloading (in development mode)
- Theme switching without restart
- Validation of configuration values

## 📚 Next Steps

- Customize your [Theme](05-themes.md)
- Explore [Markdown Features](04-markdown-guide.md)
- Learn about [Deployment](06-deployment.md)
