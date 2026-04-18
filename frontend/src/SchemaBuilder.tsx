import { useState } from "react";
import axios from "axios";

export default function SchemaBuilder() {
  const [entity, setEntity] = useState("");
  const [field, setField] = useState("");
  const [type, setType] = useState("string");
  const [schema, setSchema] = useState<any>({});

  const addField = () => {
    setSchema((prev: any) => {
      const updated = { ...prev };

      if (!updated[entity]) {
        updated[entity] = {};
      }

      updated[entity][field] = type;

      return updated;
    });

    setField("");
  };

  const saveSchema = async () => {
    await axios.post("http://127.0.0.1:8000/save-schema", schema);
    alert("Schema saved");
  };

  return (
    <div style={{ padding: 10 }}>
      <h3>Schema Builder</h3>

      <input
        placeholder="Entity (Employee)"
        value={entity}
        onChange={(e) => setEntity(e.target.value)}
      />

      <input
        placeholder="Field (first_name)"
        value={field}
        onChange={(e) => setField(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="string">String</option>
        <option value="date">Date</option>
        <option value="number">Number</option>
      </select>

      <button onClick={addField}>Add Field</button>

      <pre>{JSON.stringify(schema, null, 2)}</pre>

      <button onClick={saveSchema}>Save Schema</button>
    </div>
  );
}