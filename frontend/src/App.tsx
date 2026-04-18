import { useState, useEffect } from "react";
import EditorCanvas from "./EditorCanvas";
import PropertiesPanel from "./PropertiesPanel";
import { useStore } from "./store";
import axios from "axios";
import UserMode from "./UserMode";

function App() {
  const elements = useStore((s: any) => s.elements);
  const variableStyles = useStore((s: any) => s.variableStyles);
  const setElements = useStore((s: any) => s.setElements);
  const setVariableStyles = useStore((s: any) => s.setVariableStyles);
  const addElement = useStore((s: any) => s.addElement);

  const [step, setStep] = useState<"landing" | "app">("landing");
  const [mode, setMode] = useState<"designer" | "user">("designer");

  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState<string[]>([]);

  // =========================
  // LOAD TEMPLATE LIST
  // =========================
  const loadTemplates = () => {
    axios
      .get("http://127.0.0.1:8000/templates")
      .then((res) => setTemplates(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // =========================
  // CREATE
  // =========================
  const handleCreate = () => {
    const name = prompt("Enter new template name");
    if (!name) return;

    setTemplateName(name);
    setElements([]);
    setVariableStyles({});
  };

  // =========================
  // LOAD (UPDATE)
  // =========================
  const handleLoad = (name: string) => {
    if (!name) return;
    setTemplateName(name);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (name: string) => {
    if (!name) return;
    if (!window.confirm(`Delete template ${name}?`)) return;

    await axios.delete(`http://127.0.0.1:8000/delete-template/${name}`);

    if (templateName === name) {
      setTemplateName("");
      setElements([]);
      setVariableStyles({});
    }

    loadTemplates();
  };

  // =========================
  // SAVE
  // =========================
  const saveTemplate = async () => {
    if (!templateName) {
      alert("No template selected");
      return;
    }

    await axios.post("http://127.0.0.1:8000/save-template", {
      name: templateName,
      elements,
      variableStyles,
    });

    alert("Saved");
    loadTemplates();
  };

  // =========================
  // LANDING SCREEN
  // =========================
  if (step === "landing") {
    return (
      <div style={{ padding: 50 }}>
        <h2>Select Mode</h2>

        <label>
          <input
            type="radio"
            checked={mode === "designer"}
            onChange={() => setMode("designer")}
          />
          Designer
        </label>

        <br />

        <label>
          <input
            type="radio"
            checked={mode === "user"}
            onChange={() => setMode("user")}
          />
          User
        </label>

        <br /><br />

        <button onClick={() => setStep("app")}>Continue</button>
      </div>
    );
  }

  // =========================
  // DESIGNER MODE
  // =========================
  if (mode === "designer") {
    const isEditable = !!templateName;

    return (
      <div style={{ height: "100vh" }}>
        
        {/* TOP BAR */}
        <div style={{ padding: 10, borderBottom: "1px solid gray" }}>
          
          <button onClick={handleCreate}>Create</button>

          <select
            onChange={(e) => handleLoad(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">Update Template</option>
            {templates.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            onChange={(e) => handleDelete(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">Delete Template</option>
            {templates.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <button onClick={saveTemplate} style={{ marginLeft: 10 }}>
            Save
          </button>

          <span style={{ marginLeft: 20 }}>
            {templateName
              ? `Editing: ${templateName}`
              : "No template selected"}
          </span>
        </div>

        {/* BODY */}
        <div style={{ display: "flex", height: "calc(100% - 50px)" }}>
          
          {/* MAIN EDITOR */}
          <div style={{ width: "75%", padding: 10 }}>
            
            {/* DISABLED STATE */}
            {!isEditable && (
              <div style={{ color: "gray", marginBottom: 10 }}>
                👉 Click "Create" or select a template to start editing
              </div>
            )}

            {/* ADD TEXT BUTTON */}
            <button
              disabled={!isEditable}
              onClick={() =>
                addElement({
                  id: Date.now().toString(),
                  type: "text",
                  content: "",
                })
              }
            >
              + Add Text
            </button>

            {/* EDITOR */}
            {isEditable && (
              <EditorCanvas templateName={templateName} />
            )}
          </div>

          {/* PROPERTIES */}
          <div style={{ width: "25%", borderLeft: "1px solid gray" }}>
            {isEditable ? (
              <PropertiesPanel />
            ) : (
              <div style={{ padding: 10, color: "gray" }}>
                Select a template to edit properties
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // USER MODE
  // =========================
  return (
    <div style={{ padding: 20 }}>
      <h3>User Mode</h3>

      <select
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
      >
        <option value="">Select Template</option>
        {templates.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      {templateName && <UserMode templateName={templateName} />}
    </div>
  );
}

export default App;