# Hero Customization Guide

This guide shows you how to customize every aspect of the hero section through `config/config.yaml`.

## Available Icon Options

### Button Icons
- `arrow` - Right arrow (→)
- `zap` - Lightning bolt (⚡)
- `rocket` - Rocket ship (🚀)
- `book` - Open book (📖)
- `github` - GitHub logo
- `download` - Download arrow (⬇)

### Feature Icons
- `zap` - Lightning bolt (⚡) - Great for "Fast" or "Zero Config"
- `layers` - Stacked layers (📚) - Perfect for "Multiple Themes" or "Modular"
- `file` - Document lines (📄) - Ideal for "Markdown" or "Documentation"
- `grid` - Grid pattern (⊞) - Good for "Responsive" or "Layout"
- `palette` - Color palette (🎨) - Best for "Themes" or "Customizable"
- `code` - Code brackets (<>) - Perfect for "Developer-Friendly"
- `monitor` - Computer screen (🖥) - Great for "Cross-Platform"
- `check` - Checkmark (✓) - Ideal for "Simple" or "Easy"

## Configuration Examples

### Example 1: Product Launch Hero
```yaml
hero:
  enabled: true
  project_name: "FastAPI Pro"
  company: "DevTools Inc"
  tagline: "⚡ Build APIs at Lightning Speed"
  description: "A modern framework for building production-ready APIs in minutes, not hours."
  
  buttons:
    primary:
      text: "Start Building"
      url: "/docs/01-index"
      icon: "rocket"
    secondary:
      text: "View on GitHub"
      url: "https://github.com/yourorg/fastapi-pro"
      icon: "github"
  
  features:
    - icon: "zap"
      text: "Zero Config"
    - icon: "code"
      text: "Type Safe"
    - icon: "monitor"
      text: "Auto Docs"
    - icon: "check"
      text: "Production Ready"
  
  effects:
    particles: true
    grid_animation: true
    glow_effect: true
    scroll_indicator: true
```

### Example 2: Documentation Site Hero
```yaml
hero:
  enabled: true
  project_name: "DocuMate"
  company: "OpenDocs"
  tagline: "📚 Documentation Made Beautiful"
  description: "Create stunning documentation sites from Markdown files with zero configuration required."
  
  buttons:
    primary:
      text: "Get Started"
      url: "/docs/01-index"
      icon: "arrow"
    secondary:
      text: "Read the Docs"
      url: "/docs/04-markdown-guide"
      icon: "book"
  
  features:
    - icon: "file"
      text: "Markdown First"
    - icon: "palette"
      text: "7 Beautiful Themes"
    - icon: "layers"
      text: "Multi-Level Nav"
    - icon: "grid"
      text: "Fully Responsive"
  
  effects:
    particles: true
    grid_animation: true
    glow_effect: true
    scroll_indicator: true
```

### Example 3: Minimal Hero (No Effects)
```yaml
hero:
  enabled: true
  project_name: "MinimalDocs"
  company: "SimpleStack"
  tagline: "Clean. Fast. Simple."
  description: "Documentation without the bloat. Just you and your content."
  
  buttons:
    primary:
      text: "Start Reading"
      url: "/docs/01-index"
      icon: "arrow"
    secondary:
      text: "Quick Start"
      url: "/docs/02-getting-started"
      icon: "zap"
  
  features:
    - icon: "check"
      text: "Simple Setup"
    - icon: "zap"
      text: "Fast Loading"
    - icon: "file"
      text: "Pure Markdown"
    - icon: "monitor"
      text: "Works Everywhere"
  
  effects:
    particles: false
    grid_animation: false
    glow_effect: false
    scroll_indicator: true
```

### Example 4: Creative/Design-Focused Hero
```yaml
hero:
  enabled: true
  project_name: "DesignKit"
  company: "Creative Labs"
  tagline: "🎨 Where Design Meets Code"
  description: "A comprehensive design system and component library for modern web applications."
  
  buttons:
    primary:
      text: "Explore Components"
      url: "/docs/01-index"
      icon: "rocket"
    secondary:
      text: "Download Kit"
      url: "#"
      icon: "download"
  
  features:
    - icon: "palette"
      text: "50+ Components"
    - icon: "layers"
      text: "Design Tokens"
    - icon: "grid"
      text: "Responsive Grid"
    - icon: "code"
      text: "Developer Tools"
  
  effects:
    particles: true
    grid_animation: true
    glow_effect: true
    scroll_indicator: true
```

## Effect Descriptions

### `particles: true/false`
Floating animated particles that move across the hero background. Creates a dynamic, modern feel.

### `grid_animation: true/false`
Animated grid pattern in the background that slowly moves. Adds depth and motion.

### `glow_effect: true/false`
Glowing orbs that float around the hero content. Creates an ethereal, futuristic atmosphere.

### `scroll_indicator: true/false`
Animated down arrow at the bottom of the hero that bounces to encourage scrolling.

## Tips for Best Results

1. **Keep taglines short** (5-8 words) for maximum impact
2. **Descriptions should be 1-2 sentences** explaining the core value
3. **Choose 4 features** for optimal layout and visual balance
4. **Match icons to your message** - use the guide above
5. **Button text should be action-oriented** - "Get Started", "Start Building", etc.
6. **Primary button** should be your main CTA (call-to-action)
7. **Secondary button** can be documentation, GitHub, or alternative action
8. **For minimal/clean designs**, disable effects
9. **For tech/modern brands**, enable all effects
10. **Test on mobile** - the hero is fully responsive!

## Color Customization

The hero automatically adapts to your selected theme! All colors, gradients, and effects use the theme's color palette defined in `config/themes/`.

To customize colors further, edit your theme file in `config/themes/` and the hero will automatically update.
