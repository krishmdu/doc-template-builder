import { useEffect, useState } from "react";
import axios from "axios";

export default function PreviewPanel({ templateName }: any) {
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

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderPreview = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/render-template",
      {
        name: templateName,
        payload: { Global: formData },
      }
    );

    setOutput(res.data.output);
  };

  if (!template) return null;

  return (
    <div>
      <h3>Preview</h3>

      {Object.entries(template.schema || {}).map(([key, meta]: any) => (
        <div key={key}>
          <label>{meta.label}</label>
          <input
            value={formData[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      ))}

      <button onClick={renderPreview}>Preview</button>

      <pre>{output}</pre>
    </div>
  );
}