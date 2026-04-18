import { useEffect, useState } from "react";
import axios from "axios";

export default function UserMode({ templateName }: any) {
  const [template, setTemplate] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!templateName) return;

    axios
      .get(`http://127.0.0.1:8000/get-template/${templateName}`)
      .then((res) => {
        setTemplate(res.data);

        const init: any = {};
        Object.keys(res.data.schema || {}).forEach((k) => {
          init[k] = "";
        });
        setFormData(init);
      });
  }, [templateName]);

  const handleChange = (k: string, v: string) => {
    setFormData({ ...formData, [k]: v });
  };

  const generate = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/render-template",
      {
        name: templateName,
        payload: formData,
      }
    );

    setOutput(res.data.output);
  };

  if (!template) return null;

  return (
    <div>
      <h3>User Mode</h3>

      {Object.entries(template.schema || {}).map(([k, v]: any) => (
        <div key={k}>
          <label>{v.label}</label>

          {/* 🔥 dynamic input */}
          {v.type === "date" ? (
            <input
              type="date"
              value={formData[k]}
              onChange={(e) => handleChange(k, e.target.value)}
            />
          ) : (
            <input
              value={formData[k]}
              onChange={(e) => handleChange(k, e.target.value)}
            />
          )}
        </div>
      ))}

      <button onClick={generate}>Generate</button>

      <div
        dangerouslySetInnerHTML={{ __html: output }}
        style={{ border: "1px solid gray", padding: 10 }}
      />
    </div>
  );
}