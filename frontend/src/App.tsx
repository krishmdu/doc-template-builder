import Panel from "./ComponentPanel";
import EditorCanvas from "./EditorCanvas";
import PropertiesPanel from "./PropertiesPanel";
import { useStore } from "./store";
import axios from "axios";

function App() {
  const elements = useStore((s: any) => s.elements);

  const saveTemplate = async () => {
  console.log("SAVE CLICKED");

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/save-template",
      {
        name: "ui_template",
        elements,
      }
    );

    console.log("SUCCESS:", res.data);
    alert("Template saved");

  } catch (err) {
    console.error("ERROR:", err);
  }
};


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "20%", borderRight: "1px solid gray" }}>
        <Panel />
      </div>

      <div style={{ width: "60%", padding: 10 }}>
        <EditorCanvas />
        <button onClick={saveTemplate}>Save Template</button>
      </div>

      <div style={{ width: "20%", borderLeft: "1px solid gray" }}>
        <PropertiesPanel />
      </div>
    </div>
  );
}

export default App;