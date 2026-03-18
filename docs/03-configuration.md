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
```

**Options:**
- `site_name`: Appears in page titles and the navigation header
- `author`: Creator name (appears in footer and meta tags)
- `description`: Site description for SEO

### Hero Section Configuration

The hero section is the large banner on your homepage:

```yaml
hero:
  enabled: true
  project_name: "NCMDS"
  tagline: "No Code Markdown Documentation Sites"
  description: "Create beautiful documentation sites with just Markdown - no coding required"

  # Badge shown above the title
  badge:
    enabled: true
    text: "edujbarrios"
    show_icon: true

  # Call to action buttons
  buttons:
    - text: "View Documentation"
      url: "/docs/01-index"
      icon: "book"    # book, github, download, etc.
      style: "primary"  # primary, secondary, outline

  # Feature highlights (4 items max for best display)
  features:
    - icon: "zap"
      text: "Zero Config"
    - icon: "code"
      text: "Markdown"

  # Info cards (optional)
  cards:
    enabled: true
    title: "Why Choose NCMDS?"
    list:
      - title: "Fast Setup"
        description: "Get your documentation site running in under 5 minutes"
        icon: "rocket"
        highlight: "5 min"
```

**Hero Options:**
- `enabled`: `true` or `false` – show/hide the entire hero section
- `project_name`: Large title displayed in the hero
- `tagline`: Subtitle under project name
- `description`: Paragraph text below tagline
- `buttons`: List of call-to-action buttons (text, url, icon, style)
- `features`: Short feature chips shown in the hero
- `cards`: Highlighted benefit cards below the hero

**To disable hero:** Set `enabled: false` and the page shows normal documentation immediately.

### Theme Configuration

NCMDS uses an inline dark/light theme configuration. By default it ships with a dark turquoise palette:

```yaml
theme:
  default: "dark"         # Start in dark or light mode
  toggle_enabled: false   # Show theme toggle button

  dark:
    primary_color: "#40E0D0"
    secondary_color: "#66E6DD"
    background_color: "#1b1b1d"
    surface_color: "#242526"
    text_color: "#e3e3e3"
    text_secondary: "#b4b4b4"
    accent_color: "#40E0D0"
    border_color: "#3a3a3c"
    code_background: "#1e1e1e"
    link_color: "#66E6DD"
    link_hover: "#8CF0EB"

  light:
    primary_color: "#2563eb"
    secondary_color: "#7c3aed"
    background_color: "#ffffff"
    surface_color: "#f8fafc"
    text_color: "#0f172a"
    text_secondary: "#475569"
    accent_color: "#0891b2"
    border_color: "#e2e8f0"
    code_background: "#f1f5f9"
    link_color: "#2563eb"
    link_hover: "#1e40af"
```

**Theme Options:**
- `default`: Starting theme – `"dark"` or `"light"`
- `toggle_enabled`: Show/hide the dark-mode toggle button in the header
- `dark` / `light`: Colour sets for each mode – all values are hex codes

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
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "your-api-key-here"  # Get from LLM7.io
  model: "gpt-4o-mini"          # Default model
  provider: "LLM7.io"           # Name shown in chat UI

  # UI settings
  ui:
    button_text: "Ask AI"
    window_title: "Explain with AI"
    placeholder: "Ask a question about this page..."
    position: "bottom-right"  # bottom-right, bottom-left, top-right, top-left
    welcome_message: "Hi! I can help you understand this page. Ask me anything about the content."

  # Behaviour settings
  behavior:
    max_tokens: 1000
    temperature: 0.7
    context_max_length: 8000   # Max characters of page content sent with each question
    system_prompt: "You are a helpful documentation assistant. Answer questions based on the provided documentation content. Be concise and accurate."
```

**AI Chat Options Explained:**

- `enabled`: Turn AI chat on/off without removing configuration
- `api_url`: API endpoint URL (LLM7.io uses an OpenAI-compatible format)
- `api_key`: **Important!** Get your API key from [LLM7.io](https://llm7.io)
- `model`: Model to use for responses
- `provider`: Display name for the AI service shown in the chat UI
- `ui.position`: Where the chat widget appears on screen
- `ui.welcome_message`: Initial message shown to users
- `behavior.max_tokens`: Maximum response length
- `behavior.temperature`: Creativity level (0.0 = factual, 1.0 = creative)
- `behavior.context_max_length`: Characters of page content sent with each question

**Note:** The chat UI lets users switch between models available from the LLM7.io API at runtime.

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

Configure QMD export functionality:

```yaml
export:
  show_on_all_pages: true  # Show export button on every page

  # QMD Export Configuration
  qmd:
    enabled: true
    button_text: "Export Documentation"
    project_name: ""     # Leave empty to use site_name
    default_format: "pdf"  # Options: pdf, html, docx
```

**Export Options Explained:**

- `show_on_all_pages`: Show the export button in the sidebar on every documentation page
- `qmd.enabled`: Enable/disable the QMD export button
- `qmd.button_text`: Label shown on the export button
- `qmd.project_name`: Override the project name used in the exported file (defaults to `site_name`)
- `qmd.default_format`: Quarto output format hint written into the QMD frontmatter

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
  search: false                # Set to true to enable full-text search
```

**Feature Details:**

- `table_of_contents`: Shows a clickable TOC for the current page (H1–H2 headings)
- `syntax_highlighting`: Uses Highlight.js for code blocks
- `auto_reload`: Browser auto-refreshes when files change (development only)
- `search`: Enables the full-text search bar in the header

### UI Text Customization

Customize user-facing text for internationalization or branding:

```yaml
ui_text:
  # Header
  logo_text: "MD"

  # Sidebar
  sidebar_title: "Documentation"
  no_documents_message: "No documents yet. Add .md files to the docs/ folder."

  # Navigation buttons
  nav_previous: "Previous"
  nav_next: "Next"

  # Table of Contents
  toc_title: "On This Page"

  # Footer
  footer_text: "This site was built using <strong>NCMDS</strong> a tool by"

  # Code blocks
  copy_button: "Copy"
  copy_button_copied: "Copied!"

  # Theme toggle
  theme_toggle_dark: "Switch to light mode"
  theme_toggle_light: "Switch to dark mode"

  # Error pages
  error_404_title: "404 - Page Not Found"
  error_404_heading: "404 - Page Not Found"
  error_404_message: "The page you are looking for does not exist."
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

# Hero Section
hero:
  enabled: true
  project_name: "TechCorp Platform"
  tagline: "Enterprise Documentation Portal"
  description: "Comprehensive guides, tutorials, and API references"
  buttons:
    - text: "Quick Start Guide"
      url: "/docs/02-quickstart"
      style: "primary"

# Theme (dark turquoise)
theme:
  default: "dark"
  toggle_enabled: true
  dark:
    primary_color: "#0066cc"
    background_color: "#0a0e27"
    surface_color: "#151935"
    text_color: "#e6e9f0"
    text_secondary: "#9ca3af"
    accent_color: "#00d4ff"
    border_color: "#2d3748"
    code_background: "#1a1f3a"
    link_color: "#00b8d4"
    link_hover: "#00e5ff"
  light:
    primary_color: "#0066cc"
    background_color: "#ffffff"
    surface_color: "#f8fafc"
    text_color: "#0f172a"
    text_secondary: "#475569"
    accent_color: "#0052a3"
    border_color: "#e2e8f0"
    code_background: "#f1f5f9"
    link_color: "#0066cc"
    link_hover: "#003d99"

# AI Chat
ai_chat:
  enabled: true
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "${TECHCORP_AI_KEY}"
  model: "gpt-4o-mini"
  provider: "LLM7.io"
  ui:
    welcome_message: "Hello! I'm your TechCorp documentation assistant. How can I help?"

# Export
export:
  show_on_all_pages: true
  qmd:
    enabled: true
    project_name: "TechCorp Platform Documentation"
    default_format: "pdf"

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
  search: true
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
# Customize theme to match brand colors
theme:
  dark:
    primary_color: "#0066cc"

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
- Check `export.qmd.enabled: true`
- Clear browser cache

**Theme not applying:**
- Ensure colour values use hex codes (`#RRGGBB`)
- Check for indentation errors in `theme.dark` / `theme.light` sections
- Refresh browser with hard reload (Ctrl+Shift+R)

## 📚 Next Steps

- **[Markdown Guide](04-markdown-guide.md)** - Learn all Markdown features
- **[Theme Creation](05-themes.md)** - Customise the colour palette
- **[Deployment](06-deployment.md)** - Deploy with your configuration
