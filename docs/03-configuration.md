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

NCMDS supports both dark and light themes with full color customization:

```yaml
theme:
  # Default theme on load (dark or light)
  default: "dark"
  
  # Enable theme toggle button in header
  toggle_enabled: true
  
  # Dark theme colors
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
  
  # Light theme colors
  light:
    primary_color: "#0f766e"
    secondary_color: "#14b8a6"
    background_color: "#f6fbfb"
    surface_color: "#ffffff"
    text_color: "#0f2329"
    text_secondary: "#43616a"
    accent_color: "#0891b2"
    border_color: "#cfe4e2"
    code_background: "#ecf7f6"
    link_color: "#0f766e"
    link_hover: "#0b5f59"
```

**Theme Options:**
- `default`: Initial theme shown to users (`"dark"` or `"light"`)
- `toggle_enabled`: Show/hide the theme toggle button in the header
- `dark` / `light`: Color definitions for each theme mode

**Color Properties:**

| Property | Description |
|----------|-------------|
| `primary_color` | Main brand/accent color |
| `secondary_color` | Secondary accent for hover states |
| `background_color` | Main page background |
| `surface_color` | Cards, sidebar, elevated surfaces |
| `text_color` | Primary text color |
| `text_secondary` | Muted text for descriptions |
| `accent_color` | Additional accent for UI elements |
| `border_color` | Borders and dividers |
| `code_background` | Background for code blocks |
| `link_color` | Hyperlink color |
| `link_hover` | Hyperlink hover color |

**Color Tips:**
- Use hex color codes (`#RRGGBB`)
- Keep good contrast ratios (text vs background)
- Test your theme in both dark and light modes
- Use online tools like [Coolors](https://coolors.co) for palette generation

### AI Chat Assistant

Enable AI-powered documentation assistance using LLM7.io or compatible APIs:

```yaml
ai_chat:
  # Enable/disable the AI chat feature
  enabled: true
  
  # LLM7.io API Configuration
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "Unused"  # Add your LLM7.io API key (use "Unused" for free tier)
  model: "gpt-4o-mini"  # Model to use
  provider: "LLM7.io"  # Provider name to display in chat
  
  # UI Configuration
  ui:
    button_text: "Ask AI"
    window_title: "Explain with AI"
    placeholder: "Ask a question about this page..."
    position: "bottom-right"  # bottom-right, bottom-left, top-right, top-left
    welcome_message: "Hi! I can help you understand this page. Ask me anything about the content."
    
  # Behavior Configuration
  behavior:
    max_tokens: 1000
    temperature: 0.7
    context_max_length: 8000  # Maximum characters from page content to send as context
    system_prompt: "You are a helpful documentation assistant. Answer questions based on the provided documentation content."
```

**AI Chat Options Explained:**

- `enabled`: Turn AI chat on/off without removing configuration
- `api_url`: API endpoint URL (LLM7.io uses OpenAI-compatible format)
- `api_key`: Your LLM7.io API key (use "Unused" for free tier access)
- `model`: The AI model to use (e.g., "gpt-4o-mini")
- `provider`: Display name for the AI service shown in the chat UI

**UI Options:**
- `button_text`: Text shown on the AI chat button
- `window_title`: Title of the chat window
- `placeholder`: Placeholder text in the input field
- `position`: Where chat widget appears (`bottom-right`, `bottom-left`, `top-right`, `top-left`)
- `welcome_message`: Initial greeting shown to users

**Behavior Options:**
- `max_tokens`: Maximum response length
- `temperature`: Creativity level (0.0 = factual, 1.0 = creative)
- `context_max_length`: Characters of page content sent with each question
- `system_prompt`: Instructions for the AI assistant

**Getting an API Key:**

1. Go to [LLM7.io](https://llm7.io)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new key
5. Copy and paste into `config.yaml`

**Note:** LLM7.io offers a free tier - use `api_key: "Unused"` to access it.

**Security Note:** Never commit your API key to public repositories! Use environment variables for production:

```yaml
api_key: "${NCMDS_AI_API_KEY}"  # Reads from environment variable
```

### Export Settings

Configure QMD (Quarto Markdown) export functionality:

```yaml
export:
  # Show export button on all documentation pages
  show_on_all_pages: true
  
  # QMD (Quarto Markdown) Export Settings
  qmd:
    enabled: true
    button_text: "Export Documentation"
    # Override project name for QMD exports (optional - uses site_name if not set)
    project_name: ""  # Leave empty to use site_name
    # Quarto output format
    default_format: "pdf"  # Options: pdf, html, docx
```

**Export Options Explained:**

- `show_on_all_pages`: Show export buttons on every documentation page
- `qmd.enabled`: Enable/disable the QMD export feature
- `qmd.button_text`: Text displayed on the export button
- `qmd.project_name`: Custom project name for exports (falls back to `site_name`)
- `qmd.default_format`: Default Quarto render format (`pdf`, `html`, or `docx`)

**Using Exported QMD Files:**

After exporting, render with Quarto:
```bash
quarto render document.qmd --to pdf
quarto render document.qmd --to html
quarto render document.qmd --to docx
```

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

theme:
  default: "dark"

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
  badge:
    enabled: true
    text: "TechCorp"
    show_icon: true
  tagline: "Enterprise Documentation Portal"
  description: "Comprehensive guides, tutorials, and API references"
  buttons:
    - text: "Quick Start Guide"
      url: "/docs/02-quickstart"
      icon: "book"
      style: "primary"
    - text: "API Reference"
      url: "/docs/10-api-reference"
      icon: "code"
      style: "secondary"

# Theme
theme:
  default: "dark"
  toggle_enabled: true
  dark:
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
  light:
    primary_color: "#0066cc"
    secondary_color: "#0052a3"
    background_color: "#f8fafc"
    surface_color: "#ffffff"
    text_color: "#1a202c"
    text_secondary: "#4a5568"
    accent_color: "#00b8d4"
    border_color: "#e2e8f0"
    code_background: "#f1f5f9"
    link_color: "#0066cc"
    link_hover: "#004499"

# AI Chat
ai_chat:
  enabled: true
  api_url: "https://api.llm7.io/v1/chat/completions"
  api_key: "${TECHCORP_AI_KEY}"
  model: "gpt-4o-mini"
  provider: "LLM7.io"
  ui:
    button_text: "Ask AI"
    window_title: "Documentation Assistant"
    placeholder: "Ask a question about this page..."
    position: "bottom-right"
    welcome_message: "Hello! I'm your TechCorp documentation assistant. How can I help?"
  behavior:
    max_tokens: 1000
    temperature: 0.7
    context_max_length: 8000

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
