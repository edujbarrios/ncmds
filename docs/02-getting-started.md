# Getting Started with NCMDS

NCMDS is designed to be simple and intuitive. This guide will help you create your first documentation site.

## 📦 Installation

### Prerequisites

- Python 3.7 or higher
- pip package manager

### Installation Steps

1. **Clone the repository:**

```bash
git clone https://github.com/edujbarrios/ncmds.git
cd ncmds
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Start the server:**

```bash
python app.py
```

4. **Access the application:**

Open your browser and navigate to `http://localhost:5000`

## 📝 Creating Your First Document

1. Navigate to the `docs/` folder
2. Create a new file: `07-my-first-doc.md`
3. Add content:

```markdown
# My First Document

This is my first documentation page!

## Features

- Easy to use
- Beautiful design
- Fast and responsive
```

4. Save the file
5. Reload your browser to see changes

## 📋 Document Ordering

Documents can be ordered using three methods:

### Method 1: Numeric Prefix (Recommended)
```
01-index.md
02-getting-started.md
03-configuration.md
```

### Method 2: Metadata
```markdown
---
order: 10
---
# Document Title
```

### Method 3: Alphabetical (Default)

If no numeric prefix or order metadata is provided, documents are sorted alphabetically.

## 💡 Best Practices

- Use descriptive file names
- Keep documents focused on one topic
- Use headings to organize content hierarchically
- Add code examples when relevant
- Include images and diagrams for clarity
- Test your documentation with fresh eyes

## 📂 Project Structure

```
ncmds/
├── config/
│   ├── config.yaml           # Main configuration file
│   ├── settings.py           # Configuration manager
│   └── themes/               # Theme definitions
│       ├── ocean.yaml
│       ├── forest.yaml
│       ├── sunset.yaml
│       ├── purple.yaml
│       ├── cyberpunk.yaml
│       ├── monochrome.yaml
│       └── turquoise.yaml
├── docs/                      # Documentation source files
├── templates/
│   ├── home.html             # Hero landing page
│   └── layout.html           # Documentation layout
├── static/
│   └── style.css             # CSS styles
├── app.py                     # Main application
└── requirements.txt          # Python dependencies
```

## 🔧 Next Steps

- Learn about [Configuration](03-configuration.md)
- Explore [Markdown Features](04-markdown-guide.md)
- Customize [Themes](05-themes.md)
- Learn about [Deployment](06-deployment.md)
