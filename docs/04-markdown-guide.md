# Markdown Features Guide

NCMDS supports standard Markdown plus extended features for richer documentation.

## 📝 Basic Syntax

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

**Result:**
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`

### Lists

**Unordered Lists:**
```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3
```

**Ordered Lists:**
```markdown
1. First item
2. Second item
3. Third item
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")
```

### Images

```markdown
![Alt text](image.jpg)
![Alt text with title](image.jpg "Image title")
```

## 💻 Code Blocks

### Inline Code

Use backticks for inline code: \`code here\`

### Fenced Code Blocks

Use triple backticks with optional language specification:

**Python:**
\```python
def hello_world():
    print("Hello, NCMDS!")
    return True

hello_world()
\```

**JavaScript:**
\```javascript
const greet = (name) => {
    console.log(`Hello, ${name}!`);
};

greet("World");
\```

**Bash:**
\```bash
#!/bin/bash
echo "Hello, NCMDS!"
cd /path/to/project
python app.py
\```

## 📊 Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

**Result:**

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

**Alignment:**

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| L2   | C2     | R2    |
```

## 📌 Blockquotes

```markdown
> This is a blockquote
> 
> It can span multiple lines

> Nested quotes
>> Level 2
>>> Level 3
```

**Result:**
> This is a blockquote
> 
> It can span multiple lines

## 🔗 Horizontal Rules

```markdown
---
```

---

## ✅ Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

**Result:**
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## 🎯 Admonitions

NCMDS supports admonitions for highlighting important information:

```markdown
!!! note
    This is a note admonition

!!! warning
    This is a warning admonition

!!! danger
    This is a danger admonition

!!! tip
    This is a tip admonition
```

## 📋 Document Metadata

Add metadata at the beginning of your document:

```markdown
---
order: 10
title: "My Custom Title"
author: "Your Name"
date: "2026-02-16"
---

# Document content starts here
```

## 🎨 HTML Support

You can use HTML within Markdown for advanced formatting:

```html
<div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
    <h3>Custom HTML Block</h3>
    <p>You can use HTML for special formatting.</p>
</div>
```

## 🔤 Escaping Characters

Use backslash to escape special characters:

```markdown
\* Not italic \*
\` Not code \`
\# Not a heading
```

## 💡 Best Practices

1. **Use descriptive headings** - Clear hierarchy improves navigation
2. **Add code language** - Syntax highlighting improves readability
3. **Keep paragraphs short** - Easier to read and scan
4. **Use lists** - Break down complex information
5. **Include examples** - Show, don't just tell
6. **Add alt text to images** - Improves accessibility
7. **Use tables wisely** - Great for structured data
8. **Test your markdown** - Preview before publishing

## 📚 Supported Extensions

NCMDS supports these Markdown extensions:

- `fenced_code` - Code blocks with syntax highlighting
- `tables` - Table support
- `toc` - Table of contents generation
- `codehilite` - Code highlighting
- `attr_list` - Add attributes to elements
- `md_in_html` - Markdown inside HTML
- `admonition` - Admonition blocks
- `meta` - Document metadata

## 🔧 Tips and Tricks

### Linking to Other Docs

```markdown
See the [Configuration Guide](03-configuration.md)
```

### Table of Contents

TOC is automatically generated from headings.

### Code Block Titles

Some code blocks can have titles:

```python title="example.py"
def main():
    print("Hello!")
```

### Nested Lists

```markdown
1. First level
   - Second level
     - Third level
       - Fourth level
```

## 🎓 Learning Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [CommonMark Spec](https://commonmark.org/)

## 📖 Next Steps

- Explore [Theme Customization](05-themes.md)
- Learn about [Deployment](06-deployment.md)
- Check out [Configuration Options](03-configuration.md)
