import { useEffect } from "react";
import { useDrop } from "react-dnd";
import { useStore } from "./store";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function EditorCanvas({ templateName }: any) {
  const addElement = useStore((s: any) => s.addElement);
  const elements = useStore((s: any) => s.elements);
  const setElements = useStore((s: any) => s.setElements);
  const setVariableStyles = useStore((s: any) => s.setVariableStyles);
  const select = useStore((s: any) => s.selectElement);
  const update = useStore((s: any) => s.updateElement);

  // normalize content
  const normalizeContent = (content: any) => {
    if (!content) return "";
    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
      let text = "";
      content.forEach((node: any) => {
        if (node.children) {
          node.children.forEach((c: any) => {
            text += c.text || "";
          });
        }
      });
      return text;
    }
    return "";
  };

  useEffect(() => {
    if (!templateName) {
      setElements([]);
      setVariableStyles({});
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/get-template/${templateName}`)
      .then((res) => {
        const els = (res.data.elements || []).map((el: any) => ({
          ...el,
          content: normalizeContent(el.content),
        }));

        setElements(els);
        setVariableStyles(res.data.variableStyles || {});
      });
  }, [templateName]);

  const [, drop] = useDrop(() => ({
    accept: "ELEMENT",
    drop: () => {
      addElement({
        id: uuidv4(),
        type: "text",
        content: "",
      });
    },
  }));

  // 🔥 dynamic text
  const addDynamicText = (el: any) => {
    const name = prompt("Enter variable name (e.g. employee_name)");
    if (!name) return;

    update(el.id, {
      content: el.content + ` {{${name}}}`,
    });
  };

  // 🔥 dynamic date
  const addDynamicDate = (el: any) => {
    const name = prompt("Enter date field (e.g. employee_DOJ)");
    if (!name) return;

    update(el.id, {
      content: el.content + ` {{${name}::date}}`,
    });
  };

  return (
    <div
      ref={(node) => {
  if (node) drop(node);
}}
      style={{ height: 500, border: "2px dashed gray", padding: 10 }}
    >
      {elements.map((el: any) => (
        <div
          key={el.id}
          onClick={() => select(el)}
          style={{ border: "1px solid black", margin: 5, padding: 5 }}
        >
          <textarea
            value={el.content}
            onChange={(e) =>
              update(el.id, { content: e.target.value })
            }
            style={{ width: "100%", minHeight: 60 }}
          />

          <button onClick={() => addDynamicText(el)}>
            + Dynamic Text
          </button>

          <button onClick={() => addDynamicDate(el)}>
            + Dynamic Date
          </button>
        </div>
      ))}
    </div>
  );
}