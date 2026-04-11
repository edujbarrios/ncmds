---
tags:
  - themes
  - styling
  - customization
---

# Theme Configuration Guide

NCMDS features a dark/light theme system with full color customization. The default theme uses a professional turquoise accent color optimized for comfortable reading and coding. All colors are defined inline in `config/config.yaml` — no separate theme files needed.

## 🎨 Theme Configuration

Themes are configured in `config/config.yaml` under the `theme` section:

```yaml
theme:
  # Default theme on load (dark or light)
  default: "dark"
  
  # Enable theme toggle button in the header
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

## 🌈 Color Properties Explained

| Property | Description |
|----------|-------------|
| `primary_color` | Main brand/accent color used for highlights |
| `secondary_color` | Secondary accent for hover states and subtle elements |
| `background_color` | Main page background color |
| `surface_color` | Cards, sidebar, and elevated surfaces |
| `text_color` | Primary text color |
| `text_secondary` | Muted text for descriptions and metadata |
| `accent_color` | Additional accent for UI elements |
| `border_color` | Borders and dividers |
| `code_background` | Background color for code blocks |
| `link_color` | Hyperlink color |
| `link_hover` | Hyperlink color on hover |

## 🔄 Switching Themes

Users can toggle between dark and light themes using the theme toggle button in the header. Theme preference is saved in localStorage for persistence.

To enable/disable the theme toggle button:

```yaml
theme:
  toggle_enabled: true  # Set to false to disable user switching
```

## 💡 Customization Tips

1. **Use hex color codes** - All colors should be in `#RRGGBB` format
2. **Maintain contrast ratios** - Ensure text is readable against backgrounds
3. **Test both themes** - Preview your changes in both dark and light modes
4. **Use online tools** - Try [Coolors](https://coolors.co) or [Adobe Color](https://color.adobe.com) for palette generation

## 📚 Related Documentation

- [Configuration Guide](03-configuration.md) - Full configuration reference
- [Template Components](07-components.md) - Customize HTML/CSS structure

## 🎨 CSS Architecture

Theme colors are applied as CSS custom properties (variables) in the document head. The CSS is organized in a modular architecture under `static/default_theme/`:

- `base.css` - Reset & typography
- `header.css` - Header component styles
- `hero.css` - Hero section styles
- `sidebar.css` - Sidebar styles
- `toc.css` - Table of contents styles
- `content.css` - Main content & markdown
- `code.css` - Code blocks & syntax highlighting
- `navigation.css` - Navigation & footer
- `search.css` - Search functionality styles
- `responsive.css` - Media queries for mobile
- `utilities.css` - Utility classes

All modules are imported via `static/main.css`. To customize styles, edit the relevant module file.
