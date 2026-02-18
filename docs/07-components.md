# Template Components Architecture

NCMDS uses a modular component-based template system that separates concerns and makes the codebase more maintainable. Components are organized by file type for better clarity.

## 📂 Component Structure

All template components are located in `templates/components/`, organized by type:

```
templates/
├── layout.html              # Main layout (30 lines)
├── home.html                # Hero landing page
└── components/
    ├── html/                # HTML template components
    │   ├── head.html        # Meta tags, CSS, theme variables
    │   ├── header.html      # Site header with toggles
    │   ├── sidebar.html     # Navigation sidebar
    │   ├── toc.html         # Table of contents
    │   ├── doc_navigation.html  # Prev/Next buttons
    │   └── footer.html      # Site footer
    └── scripts/             # JavaScript components
        └── scripts.html     # JavaScript functionality
```

## 🧩 Component Details

### HTML Components (`components/html/`)

#### head.html
**Purpose:** Document head configuration
**Includes:**
- Meta tags (charset, viewport, description, author)
- Title tag
- CSS links (main stylesheet, highlight.js)
- Theme CSS variables (dark and light modes)

#### header.html
**Purpose:** Site header with navigation controls
**Includes:**
- Logo (SVG or image)
- Site name
- Theme toggle button (dark/light mode)
- Sidebar toggle button (conditional)
- TOC toggle button (conditional)
- Mobile menu toggle

#### sidebar.html
**Purpose:** Documentation navigation
**Includes:**
- Sidebar title
- Auto-generated navigation list
- Empty state message
- Active link highlighting

#### toc.html
**Purpose:** Table of contents for current document
**Includes:**
- TOC title
- Generated TOC content (from Markdown headers)
- Conditional rendering (only shows if TOC exists)

#### doc_navigation.html
**Purpose:** Previous/Next document navigation
**Includes:**
- Previous document button with title
- Next document button with title
- Spacers for missing prev/next
- SVG icons for navigation

#### footer.html
**Purpose:** Site footer
**Includes:**
- Footer text (configurable)
- Author link
- Copyright information

### JavaScript Components (`components/scripts/`)

#### scripts.html
**Purpose:** All JavaScript functionality
**Includes:**
- Syntax highlighting initialization
- Mobile menu toggle
- Sidebar toggle with localStorage
- TOC toggle with localStorage
- Theme toggle with localStorage
- Smooth scroll for anchor links
- Active link highlighting
- Copy button functionality for code blocks

## 🎯 Main Layout

The main `layout.html` file is extremely simple and clean:

```jinja2
<!DOCTYPE html>
<html lang="{{ config.html.language }}">
{% include 'components/html/head.html' %}
<body>
    {% include 'components/html/header.html' %}

    <div class="site-container">
        {% include 'components/html/sidebar.html' %}

        <main class="main-content">
            <div class="content-wrapper">
                <article class="markdown-body">
                    {{ content|safe }}
                </article>
                
                {% include 'components/html/doc_navigation.html' %}
            </div>
        </main>

        {% include 'components/html/toc.html' %}
    </div>

    {% include 'components/html/footer.html' %}
    {% include 'components/scripts/scripts.html' %}
</body>
</html>
```

## ✅ Benefits

### Maintainability
- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Reduced file complexity

### Reusability
- Components can be included in multiple templates
- Consistent UI across different pages
- DRY (Don't Repeat Yourself) principle

### Clarity
- Clear separation of concerns
- Self-documenting structure
- Easy to understand for new contributors

### Testing
- Individual components can be tested in isolation
- Easier to debug issues
- Better error localization

## 🔧 Customization

### Modifying a Component

To customize a specific part of the UI, simply edit the corresponding component file:

```bash
# Example: Customize the header
templates/components/html/header.html
```

### Creating New Components

1. Create a new `.html` file in the appropriate `templates/components/` subdirectory:
   - `html/` for HTML template components
   - `scripts/` for JavaScript components
2. Add your component code (HTML, Jinja2 templates)
3. Include it in `layout.html` where needed:

```jinja2
{% include 'components/html/your_component.html' %}
```

### Component Dependencies

Some components depend on:
- **Config variables**: Passed from `ncmds.py` via Jinja2 context
- **CSS classes**: Defined in `static/style.css`
- **JavaScript**: Often in `scripts.html` for interactive components

## 🎨 Styling Components

All component styles are in `static/style.css`. Each component typically has its own CSS section:

```css
/* Header Component */
.site-header { ... }
.header-container { ... }
.logo { ... }

/* Sidebar Component */
.sidebar { ... }
.sidebar-nav { ... }
.nav-list { ... }
```

## 📚 Related Documentation

- [Configuration Guide](03-configuration.md) - Configure component behavior
- [Theme Creation](05-themes.md) - Customize component appearance
- [Getting Started](02-getting-started.md) - Project structure overview
