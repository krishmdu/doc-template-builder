import { useStore } from "./store";

export default function PropertiesPanel() {
  const selected = useStore((s: any) => s.selected);
  const update = useStore((s: any) => s.updateElement);

  if (!selected) return <div>Select element</div>;

  return (
    <div>
      <h3>Properties</h3>

      {(selected.type === "text" ||
        selected.type === "dynamic-text") && (
        <input
          value={selected.content}
          onChange={(e) =>
            update(selected.id, { content: e.target.value })
          }
        />
      )}

      {selected.type === "text-switch" && (
        <textarea
          placeholder='[{ "condition": "location == \"India\"", "value": "PF" }]'
          onChange={(e) =>
            update(selected.id, {
              rules: JSON.parse(e.target.value || "[]"),
            })
          }
        />
      )}
    </div>
  );
}