# Markdown Features Guide

This document demonstrates all the Markdown features supported by NCMDS (No Code Markdown Sites).

## Text Formatting

**Bold text** using double asterisks or double underscores.

*Italic text* using single asterisks or single underscores.

***Bold and italic*** using triple asterisks.

~~Strikethrough~~ using double tildes.

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Lists

### Unordered Lists

- Item 1
- Item 2
- Item 3
  - Nested item 3.1
  - Nested item 3.2
    - Deep nested item
- Item 4

### Ordered Lists

1. First item
2. Second item
3. Third item
   1. Nested ordered item
   2. Another nested item
4. Fourth item

### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Pending task
- [ ] Another pending task

## Links and Images

[Visit NoCodeMDX](/)

[Internal link to Getting Started](getting-started)

[Link with title](configuration "Configuration Guide")

## Code

### Inline Code

Use `inline code` with single backticks.

Variables like `x = 5` and functions like `print()` can be highlighted inline.

### Code Blocks

#### Python

```python
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    a, b = 0, 1
    result = []
    
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    
    return result

# Example usage
fib_sequence = fibonacci(10)
print(f"Fibonacci sequence: {fib_sequence}")
```

#### JavaScript

```javascript
// Async function example
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Usage
fetchData('https://api.example.com/data')
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

#### Bash/Shell

```bash
#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py

# Check if service is running
if systemctl is-active --quiet nocodemdx; then
    echo "Service is running"
else
    echo "Service is not running"
fi
```

#### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCMDS Example</title>
</head>
<body>
    <h1>Welcome to NCMDS</h1>
    <p>No Code Markdown Sites - Build beautiful documentation with ease.</p>
</body>
</html>
```

#### CSS

```css
/* Custom theme variables */
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --background: #0f172a;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--background);
}

.button {
    background-color: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.button:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
}
```

#### SQL

```sql
-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) VALUES 
    ('edujbarrios', 'edu@example.com'),
    ('johndoe', 'john@example.com');

-- Query with JOIN
SELECT u.username, p.title, p.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id
WHERE p.published = 1
ORDER BY p.created_at DESC
LIMIT 10;
```

## Tables

### Basic Table

| Feature | Status | Description |
|---------|--------|-------------|
| Markdown Support | ✅ | Full support |
| Dark Mode | ✅ | Customizable |
| Themes | ✅ | 6 predefined themes |
| Responsive | ✅ | Mobile-friendly |
| Search | 🚧 | Coming soon |

### Aligned Columns

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text         | Text           | Text          |
| More text    | More text      | More text     |
| Even more    | Even more      | Even more     |

### Complex Table

| Language | Syntax Highlighting | Code Examples | Performance |
|----------|:------------------:|:-------------:|:-----------:|
| Python   | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| JavaScript | ✅ | ✅ | ⭐⭐⭐⭐ |
| Go       | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Rust     | ✅ | ✅ | ⭐⭐⭐⭐⭐ |

## Blockquotes

> This is a simple blockquote.

> This is a multi-line blockquote.
> It can span multiple lines and paragraphs.
>
> Just like this!

> **Note:** You can use other Markdown inside blockquotes.
>
> - Including lists
> - And other elements

> ### Nested Quote
>
> > This is a nested blockquote
> > 
> > It's quoted within another quote

## Horizontal Rules

Use three or more hyphens, asterisks, or underscores:

---

***

___

## Escaping Characters

Use backslash to escape special characters:

\*Not italic\*

\**Not bold\**

\# Not a heading

## Special Characters and Symbols

- Arrows: → ← ↑ ↓ ⇒ ⇐ ⇑ ⇓
- Math: ≤ ≥ ≠ ≈ ∞ ∑ ∏ √
- Symbols: © ® ™ § ¶ † ‡
- Emoji: 🚀 🎨 📝 ✅ ❌ ⚠️ 💡 🔧

## Combinations

You can combine multiple Markdown features:

### Code in Lists

1. **Install Python packages:**
   
   ```bash
   pip install flask markdown pyyaml
   ```

2. **Create your configuration:**
   
   Edit `config/config.yaml`:
   
   ```yaml
   site_name: "My Docs"
   theme_name: "ocean"
   ```

3. **Start the server:**
   
   ```bash
   python app.py
   ```

### Tables with Code

| Command | Description | Example |
|---------|-------------|---------|
| `pip install` | Install packages | `pip install flask` |
| `python app.py` | Run application | `python app.py` |
| `git clone` | Clone repository | `git clone https://...` |

### Blockquotes with Code

> **Important Configuration Note**
>
> Always backup your `config.yaml` before making changes:
>
> ```bash
> cp config/config.yaml config/config.yaml.backup
> ```

## Best Practices

1. **Use descriptive headings** - They become the table of contents
2. **Keep paragraphs short** - Easier to read online
3. **Use code blocks** - Always specify the language for syntax highlighting
4. **Add examples** - Show, don't just tell
5. **Use tables** - Great for comparing features or options
6. **Break up text** - Use lists, headings, and horizontal rules
7. **Link between pages** - Help readers navigate your docs

---

**Pro Tip:** Preview your Markdown as you write to ensure proper formatting!
