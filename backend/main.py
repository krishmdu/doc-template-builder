from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import re

app = FastAPI()

# =========================
# CORS (frontend access)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STORAGE
# =========================
TEMPLATE_DIR = "templates"
os.makedirs(TEMPLATE_DIR, exist_ok=True)


# =========================
# MODELS
# =========================
class Template(BaseModel):
    name: str
    elements: list
    variableStyles: dict = {}


class RenderRequest(BaseModel):
    name: str
    payload: dict


# =========================
# SAVE TEMPLATE
# =========================
@app.post("/save-template")
def save_template(template: Template):
    file_path = os.path.join(TEMPLATE_DIR, f"{template.name}.json")

    data = {
        "name": template.name,
        "elements": template.elements,
        "variableStyles": template.variableStyles or {},
    }

    # 🔥 Extract variables + types
    variables = {}

    for el in template.elements:
        content = el.get("content", "")
        matches = re.findall(r"\{\{(.*?)\}\}", content)

        for m in matches:
            raw = m.strip()

            if "::" in raw:
                name, dtype = raw.split("::")
            else:
                name, dtype = raw, "string"

            variables[name] = dtype

    # 🔥 Build schema
    schema = {}
    for k, t in variables.items():
        schema[k] = {
            "type": t,
            "label": k.replace("_", " ").title(),
        }

    data["schema"] = schema

    # 💾 Save to file
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return {"status": "saved", "template": template.name}


# =========================
# GET TEMPLATE
# =========================
@app.get("/get-template/{name}")
def get_template(name: str):
    file_path = os.path.join(TEMPLATE_DIR, f"{name}.json")

    if not os.path.exists(file_path):
        return {}

    with open(file_path, "r") as f:
        return json.load(f)


# =========================
# LIST TEMPLATES
# =========================
@app.get("/templates")
def list_templates():
    files = os.listdir(TEMPLATE_DIR)
    return [f.replace(".json", "") for f in files]


# =========================
# DELETE TEMPLATE
# =========================
@app.delete("/delete-template/{name}")
def delete_template(name: str):
    file_path = os.path.join(TEMPLATE_DIR, f"{name}.json")

    if os.path.exists(file_path):
        os.remove(file_path)
        return {"status": "deleted"}

    return {"status": "not found"}


# =========================
# RENDER TEMPLATE (WITH STYLES)
# =========================
from datetime import datetime

def render_template(elements, data, variable_styles):

    def format_date(value: str):
        try:
            dt = datetime.strptime(value, "%Y-%m-%d")

            day = dt.day

            # ordinal suffix
            if 11 <= day <= 13:
                suffix = "th"
            else:
                suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")

            month = dt.strftime("%B")
            year = dt.year

            # superscript HTML
            return f"{month} {day}<sup>{suffix}</sup> {year}"

        except:
            return value

    def style_wrap(var_name, value):
        style = variable_styles.get(var_name, {})

        styles = []

        if "color" in style:
            styles.append(f"color:{style['color']}")

        if "fontSize" in style:
            styles.append(f"font-size:{style['fontSize']}px")

        if style.get("bold"):
            styles.append("font-weight:bold")

        style_str = "; ".join(styles)

        return f"<span style='{style_str}'>{value}</span>"

    def replace_vars(text: str):
        matches = re.findall(r"\{\{(.*?)\}\}", text)

        for m in matches:
            raw = m.strip()

            # detect type
            if "::" in raw:
                var_name, dtype = raw.split("::")
            else:
                var_name, dtype = raw, "string"

            value = data.get(var_name, "")

            # 🔥 DATE FORMAT APPLY
            if dtype == "date" and value:
                value = format_date(value)

            styled_value = style_wrap(var_name, value)

            text = text.replace(f"{{{{{m}}}}}", str(styled_value))

        return text

    output_lines = []

    for el in elements:
        content = el.get("content", "")
        output_lines.append(replace_vars(content))

    return "<br>".join(output_lines)

# =========================
# RENDER API
# =========================
@app.post("/render-template")
def render(req: RenderRequest):
    file_path = os.path.join(TEMPLATE_DIR, f"{req.name}.json")

    if not os.path.exists(file_path):
        return {"output": ""}

    with open(file_path, "r") as f:
        template = json.load(f)

    output = render_template(
        template.get("elements", []),
        req.payload,
        template.get("variableStyles", {}),
    )

    return {"output": output}