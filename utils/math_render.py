from html import escape
from urllib.parse import quote


def render_math_formula(formula: str) -> str:
    """
    Render a LaTeX math formula as an image using an online service.
    Returns HTML <img> tag for embedding in markdown/html.
    """
    # Percent-encode the formula for safe inclusion in a URL path.
    formula_url = quote(formula, safe='')
    url = rf"https://latex.codecogs.com/png.image?\dpi{{110}}{formula_url}"
    # HTML-escape the formula for safe use in the alt attribute.
    alt_text = escape(formula, quote=True)
    return f'<img src="{url}" alt="{alt_text}" style="vertical-align:middle;" />'

# Example usage:
if __name__ == "__main__":
    latex = r"a^2 + b^2 = c^2"
    html_img = render_math_formula(latex)
    print(html_img)
