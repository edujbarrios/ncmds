---
tags:
  - configuration
  - settings
  - yaml
---

# Configuration Guide

NCMDS uses a YAML-based configuration system for easy customization. This guide covers all configuration options in detail.

## 📋 Configuration File Location

The main configuration file is: **`config/config.yaml`**

All settings are centralized in this single file, making it easy to manage your documentation site.

## 🎯 Complete Configuration Reference

### Site Information

Basic information about your documentation site:

```yaml
# Site metadata
site_name: "NCMDS Documentation"
author: "edujbarrios"
description: "Easy documentation site builder with Markdown - no code required"
version: "1.0.0"  # Optional: your project version
```

**Options:**
- `site_name`: Appears in page titles and navigation header
- `author`: Creator name (appears in footer and meta tags)
- `description`: Site description for SEO
- `version`: Optional version number displayed in UI

### Hero Section Configuration

The hero section is the large banner on your homepage:

```yaml
hero:
  enabled: true
  project_name: "NCMDS"
  company: "edujbarrios"
  tagline: "No Code Markdown Documentation Sites"
  description: "Create beautiful documentation sites with just Markdown - no coding required"
  show_buttons: true
  buttons:
    - text: "Get Started"
      url: "02-getting-started.md"
      primary: true
    - text: "View on GitHub"
      url: "https://github.com/edujbarrios/ncmds"
      primary: false
```

**Hero Options:**
- `enabled`: `true` or `false` - Show/hide entire hero section
- `project_name`: Large title displayed in hero
- `company`: Company badge/label
- `tagline`: Subtitle under project name
- `description`: Paragraph text below tagline
- `show_buttons`: Enable action buttons in hero
- `buttons`: List of button objects (text, url, primary style)

**To disable hero:** Set `enabled: false` and the page shows normal documentation immediately.

### Theme Configuration

Choose from seven predefined themes or create your own custom color scheme:

```yaml
# Theme selection
theme_name: "turquoise"  
# Options: turquoise, ocean, forest, sunset, purple, cyberpunk, monochrome
```

**Available Themes:**

| Theme | Primary Color | Best For |
|-------|--------------|----------|
| `turquoise` | #40E0D0 | Professional tech docs (default) |
| `ocean` | #2563eb | Calm, corporate documentation |
| `forest` | #10b981 | Natural, environmental projects |
| `sunset` | #f59e0b | Creative, warm tone docs |
| `purple` | #7c3aed | Modern, sleek documentation |
| `cyberpunk` | #ec4899 | Futuristic, gaming projects |
| `monochrome` | #ffffff | Classic, timeless look |

### Custom Theme Colors

Create your own color scheme by setting `theme_name: "custom"`:

```yaml
theme_name: "custom"

custom_theme:
  # Primary brand colors
  primary_color: "#2563eb"      # Main accent color
  secondary_color: "#7c3aed"    # Secondary accent
  accent_color: "#22d3ee"       # Highlights and CTAs
  
  # Background colors
  background_color: "#0f172a"   # Page background
  surface_color: "#1e293b"      # Cards, modals, panels
  
  # Text colors
  text_color: "#e2e8f0"         # Primary text
  text_secondary: "#94a3b8"     # Secondary text
  
  # UI element colors
  border_color: "#334155"       # Borders and dividers
  code_background: "#1e293b"    # Code block background
  
  # Link colors
  link_color: "#60a5fa"         # Unvisited links
  link_hover: "#93c5fd"         # Link hover state
```

**Color Tips:**
- Use hex color codes (`#RRGGBB`)
- Keep good contrast ratios (text vs background)
- Test your theme in different lighting conditions
- Use online tools like [Coolors](https://coolors.co) for palette generation

### AI Chat Assistant

Enable AI-powered documentation assistance using LLM7.io or compatible APIs:

```yaml
ai_chat:
  enabled: true
  provider: "LLM7.io"
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "your-api-key-here"  # Get from LLM7.io
  default_model: "gpt-4o-mini"
  
  # UI Configuration
  position: "bottom-right"  # bottom-right, bottom-left, top-right, top-left
  greeting: "Hi! I can help you understand this documentation. Ask me anything!"
  
  # Available models (user can switch between these)
  available_models:
    - id: "gpt-4o-mini"
      name: "GPT-4o Mini"
      provider: "OpenAI"
    - id: "gpt-4o"
      name: "GPT-4o"
      provider: "OpenAI"
    - id: "claude-3-5-sonnet-20241022"
      name: "Claude 3.5 Sonnet"
      provider: "Anthropic"
    - id: "claude-3-5-haiku-20241022"
      name: "Claude 3.5 Haiku"
      provider: "Anthropic"
  
  # Advanced options
  max_tokens: 2000
  temperature: 0.7
  context_size: 8000  # How much page content to send
```

**AI Chat Options Explained:**

- `enabled`: Turn AI chat on/off without removing configuration
- `provider`: Display name for the AI service
- `api_url`: API endpoint URL (LLM7.io uses OpenAI-compatible format)
- `api_key`: **Important!** Get your API key from [LLM7.io](https://llm7.io)
- `default_model`: Model used on first load (user can switch)
- `position`: Where chat widget appears on screen
- `greeting`: Initial message shown to users
- `available_models`: List of models users can switch between
- `max_tokens`: Maximum response length
- `temperature`: Creativity (0.0 = factual, 1.0 = creative)
- `context_size`: Characters of page content sent with each question

**Getting an API Key:**

1. Go to [LLM7.io](https://llm7.io)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new key
5. Copy and paste into `config.yaml`

**Security Note:** Never commit your API key to public repositories! Use environment variables for production:

```yaml
api_key: "${NCMDS_AI_API_KEY}"  # Reads from environment variable
```

### Export Settings

Configure PDF and QMD export functionality:

```yaml
export:
  # Global export settings
  show_on_all_pages: true  # Show export buttons on every page
  
  # PDF Export Configuration
  pdf:
    enabled: true
    button_text: "Export to PDF"
    project_name: ""  # Leave empty to use site_name
    show_all_option: true  # Enable "Export All Docs" button
    
    # PDF styling
    paper_size: "A4"  # Options: A4, Letter, Legal
    margins: "2cm"    # CSS margin value
    
    # Cover page
    cover_enabled: true
    cover_background: "#1e293b"
    cover_text_color: "#e2e8f0"
    
    # Headers and footers
    header_enabled: true
    footer_enabled: true
    show_page_numbers: true
  
  # QMD Export Configuration
  qmd:
    enabled: true
    button_text: "Export to QMD"
    project_name: ""  # Leave empty to use site_name
    show_all_option: true  # Enable "Export All Docs" button
    
    # Quarto render settings
    default_format: "pdf"  # Options: pdf, html, docx
    number_sections: true
    highlight_style: "pygments"
    toc_enabled: true
    toc_depth: 3
```

**Export Options Explained:**

**PDF Settings:**
- `paper_size`: Standard paper sizes for printing
- `margins`: Space around content (use CSS units: cm, in, px)
- `cover_enabled`: Add a professional cover page
- `show_page_numbers`: Add page numbers to footer

**QMD Settings:**
- `default_format`: What Quarto renders to by default
- `number_sections`: Auto-number headings (1.1, 1.2, etc.)
- `highlight_style`: Code syntax highlighting theme
- `toc_enabled`: Include table of contents in render
- `toc_depth`: How many heading levels in TOC (1-6)

### Server Configuration

Configure how NCMDS runs:

```yaml
server:
  host: "0.0.0.0"  # Listen on all network interfaces
  port: 5000        # Port number
  debug: true       # Enable debug mode
```

**Server Options:**

- `host`: 
  - `"127.0.0.1"` or `"localhost"` - Only accessible from your computer
  - `"0.0.0.0"` - Accessible from network (required for Docker, Railway, etc.)
- `port`: Any unused port (5000 is default, change if in use)
- `debug`: 
  - `true` - Development mode (auto-reload, error details)
  - `false` - Production mode (better performance, hide errors)

**Important:** Set `debug: false` in production for security and performance!

### Directories

Customize where NCMDS looks for files:

```yaml
directories:
  docs: "docs"          # Markdown documentation files
  static: "static"      # CSS, JS, images
  templates: "templates" # Jinja2 HTML templates
```

**When to change:**
- If integrating into existing project with different structure
- If you prefer different naming conventions
- Rarely needed for typical usage

### Features Configuration

Enable/disable specific features:

```yaml
features:
  table_of_contents: true      # Right sidebar TOC
  syntax_highlighting: true    # Code block highlighting
  auto_reload: true            # Auto-reload in development
  search: false                # Full-text search (coming soon)
  mobile_optimization: true    # Mobile-responsive design
```

**Feature Details:**

- `table_of_contents`: Shows clickable TOC for current page (H2, H3 headings)
- `syntax_highlighting`: Uses Highlight.js for code blocks
- `auto_reload`: Browser auto-refreshes when files change (dev only)
- `search`: Coming in future version
- `mobile_optimization`: Responsive nav, touch-friendly UI

### UI Text Customization

Customize user-facing text for internationalization or branding:

```yaml
ui_text:
  # Navigation
  home: "Home"
  previous: "Previous"
  next: "Next"
  
  # Export buttons
  copy_button: "Copy"
  copy_button_copied: "Copied!"
  export_pdf: "Export to PDF"
  export_qmd: "Export to QMD"
  export_all: "All Docs"
  
  # AI Chat
  ai_chat_title: "AI Assistant"
  ai_chat_placeholder: "Ask a question about this page..."
  ai_chat_send: "Send"
  
  # Errors
  page_not_found: "Page not found"
  error_occurred: "An error occurred"
```

**Use cases:**
- Translate UI to other languages
- Match company terminology
- Customize button labels

## 📝 Complete Configuration Examples

### Minimal Configuration

For simple documentation with defaults:

```yaml
site_name: "My Docs"
author: "Your Name"
theme_name: "ocean"

server:
  port: 5000
  debug: true

features:
  table_of_contents: true
  syntax_highlighting: true
```

### Full-Featured Configuration

With AI chat, export, and custom theme:

```yaml
# Site Information
site_name: "TechCorp Documentation"
author: "TechCorp Engineering"
description: "Complete technical documentation for TechCorp products"
version: "2.1.0"

# Hero Section
hero:
  enabled: true
  project_name: "TechCorp Platform"
  company: "TechCorp"
  tagline: "Enterprise Documentation Portal"
  description: "Comprehensive guides, tutorials, and API references"
  show_buttons: true
  buttons:
    - text: "Quick Start Guide"
      url: "02-quickstart.md"
      primary: true
    - text: "API Reference"
      url: "10-api-reference.md"
      primary: false

# Theme
theme_name: "custom"
custom_theme:
  primary_color: "#0066cc"
  secondary_color: "#0052a3"
  background_color: "#0a0e27"
  surface_color: "#151935"
  text_color: "#e6e9f0"
  text_secondary: "#9ca3af"
  accent_color: "#00d4ff"
  border_color: "#2d3748"
  code_background: "#1a1f3a"
  link_color: "#00b8d4"
  link_hover: "#00e5ff"

# AI Chat
ai_chat:
  enabled: true
  provider: "LLM7.io"
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "${TECHCORP_AI_KEY}"
  default_model: "claude-3-5-sonnet-20241022"
  position: "bottom-right"
  greeting: "Hello! I'm your TechCorp documentation assistant. How can I help?"
  available_models:
    - id: "claude-3-5-sonnet-20241022"
      name: "Claude 3.5 Sonnet"
      provider: "Anthropic"
    - id: "gpt-4o"
      name: "GPT-4o"
      provider: "OpenAI"

# Export
export:
  show_on_all_pages: true
  pdf:
    enabled: true
    project_name: "TechCorp Platform Documentation"
    paper_size: "Letter"
    margins: "1in"
    cover_enabled: true
  qmd:
    enabled: true
    project_name: "TechCorp Platform Documentation"
    default_format: "pdf"
    number_sections: true

# Server
server:
  host: "0.0.0.0"
  port: 8080
  debug: false

# Directories
directories:
  docs: "docs"
  static: "static"
  templates: "templates"

# Features
features:
  table_of_contents: true
  syntax_highlighting: true
  auto_reload: false
  mobile_optimization: true
```

## 🔄 Applying Configuration Changes

After editing `config/config.yaml`:

### Development Mode

If `debug: true`:
1. Save the file
2. NCMDS auto-reloads configuration
3. Refresh your browser to see changes

### Production Mode

If `debug: false`:
1. Save the file
2. Restart the server:
   ```bash
   # Stop server (Ctrl+C)
   python ncmds.py
   ```
3. Configuration loads on startup

## 💡 Configuration Tips

**1. Use Environment Variables for Secrets**

Don't hardcode API keys in config.yaml:

```yaml
# Good
api_key: "${NCMDS_AI_KEY}"

# Bad
api_key: "sk-proj-abc123xyz..."
```

Set environment variable:
```bash
# Linux/Mac
export NCMDS_AI_KEY="your-key-here"

# Windows PowerShell
$env:NCMDS_AI_KEY = "your-key-here"
```

**2. Version Control Your Config**

Do commit:
- config.yaml structure
- Default values  
- Comments explaining options

Don't commit:
- API keys
- Sensitive information
- Production-specific values

Use `.gitignore`:
```
config/config.yaml.local
*.secret.yaml
```

**3. Test Configuration Changes**

After major config changes:
1. Stop the server
2. Start with `python ncmds.py`
3. Check terminal for errors
4. Test in browser
5. Review browser console (F12) for JavaScript errors

**4. Keep Backups**

Before major changes:
```bash
cp config/config.yaml config/config.yaml.backup
```

**5. Use Comments**

Add comments explaining your choices:
```yaml
# Using forest theme to match brand colors
theme_name: "forest"

# Port 8080 because 5000 conflicts with MacOS AirPlay
server:
  port: 8080
```

## 🆘 Troubleshooting Configuration

**Server won't start after config change:**
- Check YAML syntax (indentation must be spaces, not tabs)
- Validate YAML at [yamllint.com](http://www.yamllint.com/)
- Look for typos in setting names
- Check terminal error messages

**AI Chat not working:**
- Verify `ai_chat.enabled: true`
- Check API key is valid
- Test API URL is accessible
- Check browser console (F12) for errors

**Export buttons missing:**
- Confirm `export.show_on_all_pages: true`
- Check `export.pdf.enabled` and/or `export.qmd.enabled`
- Verify WeasyPrint installed for PDF export
- Clear browser cache

**Theme not applying:**
- Ensure `theme_name` matches available theme
- For custom theme, verify all colors are hex codes
- Check for typos in color keys
- Refresh browser with hard reload (Ctrl+Shift+R)

## 📚 Next Steps

- **[Markdown Guide](04-markdown-guide.md)** - Learn all Markdown features
- **[Theme Creation](05-themes.md)** - Design custom themes in depth
- **[Deployment](06-deployment.md)** - Deploy with your configuration

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
