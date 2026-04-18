import { useStore } from "./store";
import { useState } from "react";

export default function PropertiesPanel() {
  const elements = useStore((s: any) => s.elements);
  const variableStyles = useStore((s: any) => s.variableStyles);
  const updateVar = useStore((s: any) => s.updateVariableStyle);

  const [selectedVar, setSelectedVar] = useState("");

  // 🔥 SAFE variable extraction
  const extractVariables = () => {
    const vars = new Set<string>();

    elements.forEach((el: any) => {
      let text = "";

      // ✅ CASE 1: string
      if (typeof el.content === "string") {
        text = el.content;
      }

      // ✅ CASE 2: Slate-like array
      else if (Array.isArray(el.content)) {
        el.content.forEach((node: any) => {
          if (node.children) {
            node.children.forEach((child: any) => {
              text += child.text || "";
            });
          }
        });
      }

      // 🔍 Extract variables
      const matches = text.match(/\{\{(.*?)\}\}/g);
      if (matches) {
        matches.forEach((m: string) => {
          vars.add(m.replace("{{", "").replace("}}", "").trim());
        });
      }
    });

    return Array.from(vars);
  };

  const variables = extractVariables();
  const style = variableStyles[selectedVar] || {};

  return (
    <div style={{ padding: 10 }}>
      <h3>Variable Properties</h3>

      <select
        value={selectedVar}
        onChange={(e) => setSelectedVar(e.target.value)}
      >
        <option value="">Select Variable</option>
        {variables.map((v) => (
          <option key={v} value={v}>
            {`{{${v}}}`}
          </option>
        ))}
      </select>

      {selectedVar && (
        <>
          <div>
            <label>Font Size</label>
            <input
              type="number"
              value={style.fontSize || ""}
              onChange={(e) =>
                updateVar(selectedVar, {
                  fontSize: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Color</label>
            <input
              type="color"
              value={style.color || "#000000"}
              onChange={(e) =>
                updateVar(selectedVar, {
                  color: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Bold</label>
            <input
              type="checkbox"
              checked={style.bold || false}
              onChange={(e) =>
                updateVar(selectedVar, {
                  bold: e.target.checked,
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}