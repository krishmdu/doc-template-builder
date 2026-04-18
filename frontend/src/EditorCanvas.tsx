import { useDrop } from "react-dnd";
import { useStore } from "./store";
import { v4 as uuidv4 } from "uuid";
import RichTextEditor from "./RichTextEditor";

export default function EditorCanvas() {
  const addElement = useStore((s: any) => s.addElement);
  const elements = useStore((s: any) => s.elements);
  const select = useStore((s: any) => s.selectElement);
  const update = useStore((s: any) => s.updateElement);

  const [, drop] = useDrop(() => ({
    accept: "ELEMENT",
    drop: (item: any) => {
      addElement({
        id: uuidv4(),
        type: item.type,
        content: [
          {
            type: "paragraph",
            children: [{ text: "Edit me" }],
          },
        ],
        rows: 2,
        cols: 2,
        data: [["A", "B"], ["C", "D"]],
        rules: [],
      });
    },
  }));

  return (
    <div
      ref={(node) => {
        if (node) drop(node);
      }}
      style={{
        height: 500,
        border: "2px dashed gray",
        padding: 10,
      }}
    >
      {elements.map((el: any) => (
        <div
          key={el.id}
          onClick={() => select(el)}
          style={{
            border: "1px solid black",
            margin: 5,
            padding: 5,
          }}
        >
          {renderElement(el, update)}
        </div>
      ))}
    </div>
  );
}

function renderElement(el: any, update: any) {
  if (el.type === "text") {
    return (
      <RichTextEditor
        value={el.content}
        onChange={(val: any) =>
          update(el.id, { content: val })
        }
      />
    );
  }

  if (el.type === "dynamic-text") return <p>{JSON.stringify(el.content)}</p>;

  if (el.type === "text-switch") return <p>[Conditional Text]</p>;

  if (el.type === "table") {
    return (
      <table border={1}>
        <tbody>
          {el.data.map((row: any, i: number) => (
            <tr key={i}>
              {row.map((cell: any, j: number) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
}