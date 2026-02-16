# Getting Started with NCMDS

Welcome to NCMDS (No Code Markdown Sites)! This guide will help you get up and running in minutes.

## Prerequisites

Before you begin, make sure you have:

- Python 3.7 or higher installed
- pip (Python package manager)
- A text editor (VS Code, Sublime, or any editor you prefer)

## Installation

1. **Install Required Packages**

```bash
pip install -r requirements.txt
```

2. **Start the Server**

```bash
python app.py
```

3. **Open Your Browser**

Navigate to `http://localhost:5000` and you should see your documentation site!

## Project Structure

```
ncmds/
├── app.py              # Main application
├── config.yaml         # Site configuration
├── docs/               # Your documentation files
│   ├── index.md       # Home page
│   └── *.md           # Other docs
├── templates/          # HTML templates
│   └── layout.html    # Main layout
└── static/            # CSS and assets
    └── style.css      # Styling
```

## Creating Your First Document

1. Create a new file in the `docs/` folder, for example: `05-my-first-doc.md`

   **Tip:** Use numeric prefixes (01-, 02-, etc.) to control the order documents appear in navigation.

2. Add some content:

```markdown
# My First Document

This is my first documentation page!

## Section 1

Write whatever you want here.
```

3. Save the file and refresh your browser

4. Your new document will appear in the sidebar navigation!

## Tips for Great Documentation

### Use Descriptive Headings

Good heading structure helps readers navigate your content:

```markdown
# Main Title
## Major Section
### Subsection
#### Details
```

### Include Code Examples

Code blocks with syntax highlighting make technical docs easier to follow:

```python
# Python example for NCMDS
def calculate_sum(a, b):
    """Add two numbers together."""
    return a + b

result = calculate_sum(5, 3)
print(f"Result: {result}")
```

### Add Visual Elements

Use tables, lists, and blockquotes to break up text:

> **Pro Tip:** Keep paragraphs short and scannable. Use bullet points when listing items.

### Link Between Pages

Create connections between your documentation:

```markdown
See [Configuration Guide](configuration) for more details.
```

## Next Steps

- Customize your colors in `config.yaml`
- Add more documentation files
- Explore advanced Markdown features
- Share your documentation site!

Need help? Create an issue or check the documentation examples.
