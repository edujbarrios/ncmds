---
tags:
  - themes
  - styling
  - customization
---

# Theme Guide

NCMDS ships with a dark turquoise palette inspired by [edujbarrios.com](https://edujbarrios.com). Both dark and light colour sets are defined in `config/config.yaml` under the `theme` key.

## Customising Colours

Edit the `theme.dark` and `theme.light` sections in `config/config.yaml`:

```yaml
theme:
  default: "dark"       # Starting mode: "dark" or "light"
  toggle_enabled: false # Set true to show a mode-toggle button in the header

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

All colour values are standard hex codes (`#RRGGBB`). After saving the file, restart the server (or use the browser refresh in debug mode) to see your changes.

## Syntax Highlighting Theme

Code block highlighting is powered by [Highlight.js](https://highlightjs.org). Choose a theme in `config/config.yaml`:

```yaml
highlighting:
  theme_dark: "atom-one-dark"    # Used in dark mode
  theme_light: "atom-one-light"  # Used in light mode
  cdn_version: "11.9.0"
```

Browse available themes at [cdnjs.com/libraries/highlight.js](https://cdnjs.com/libraries/highlight.js).
