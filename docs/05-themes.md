# Theme Creation Guide

NCMDS comes with seven beautiful pre-built themes, but you can also create your own custom themes.

## 🎨 Available Themes

- **Ocean**: Blue oceanic tones (default)
- **Forest**: Green natural tones
- **Sunset**: Warm orange and red tones
- **Purple Dream**: Deep violet tones
- **Cyberpunk**: Futuristic neon colors
- **Monochrome**: Black and white grayscale
- **Turquoise**: Professional turquoise with vibrant cyan accents

## Changing Themes

Edit `config/config.yaml` to change the active theme:

```yaml
theme_name: "ocean"  # Available: ocean, forest, sunset, purple, cyberpunk, monochrome, turquoise
```

## Creating Custom Themes

### Step 1: Create Theme File

Create a new YAML file in `config/themes/` directory, for example `custom-theme.yaml`:

```yaml
name: "Custom Theme"
description: "My custom theme description"
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

### Step 2: Activate Theme

Update `config/config.yaml`:

```yaml
theme_name: "custom-theme"
```

### Step 3: Reload Server

Restart the application to see your custom theme in action!

## Color Variables

### Primary Colors
- **primary_color**: Main brand color, used for primary buttons and accents
- **secondary_color**: Secondary brand color, used in gradients
- **accent_color**: Highlight color for interactive elements

### Background Colors
- **background_color**: Main page background
- **surface_color**: Card and panel backgrounds
- **code_background**: Code block backgrounds

### Text Colors
- **text_color**: Primary text color
- **text_secondary**: Secondary text and captions

### Other Colors
- **border_color**: Borders and dividers
- **link_color**: Hyperlink colors
- **link_hover**: Hyperlink hover state

## Tips for Great Themes

1. **Contrast**: Ensure sufficient contrast between text and backgrounds
2. **Consistency**: Use colors that work well together
3. **Accessibility**: Test your theme for readability
4. **Hero Effect**: Primary and accent colors create the hero gradient
5. **Test**: Try your theme with different types of content

## Example Themes

### Dark Blue Theme
```yaml
colors:
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

### Warm Sunset Theme
```yaml
colors:
  primary_color: "#f97316"
  secondary_color: "#dc2626"
  background_color: "#1a0b0b"
  surface_color: "#2d1414"
  text_color: "#fef2f2"
  text_secondary: "#fca5a5"
  accent_color: "#fbbf24"
  border_color: "#422006"
  code_background: "#1c0a00"
  link_color: "#fb923c"
  link_hover: "#fdba74"
```

## Need Help?

- Check existing themes in `config/themes/` for inspiration
- Use a color palette generator like [Coolors](https://coolors.co/)
- Test on different screen sizes
