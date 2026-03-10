import re
import base64
import requests

def render_math_formula(formula: str) -> str:
    """
    Render a LaTeX math formula as an image using an online service.
    Returns HTML <img> tag for embedding in markdown/html.
    """
    # Clean formula for URL
    formula_url = formula.replace(' ', '')
    url = rf"https://latex.codecogs.com/png.image?\dpi{{110}}{formula_url}"
    return f'<img src="{url}" alt="{formula}" style="vertical-align:middle;" />'

# Example usage:
if __name__ == "__main__":
    latex = r"a^2 + b^2 = c^2"
    html_img = render_math_formula(latex)
    print(html_img)
