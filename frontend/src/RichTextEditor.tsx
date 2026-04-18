import { createEditor, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { useMemo } from "react";

// ---- Toggle Bold ----
const toggleBold = (editor: any) => {
  Transforms.setNodes(
    editor,
    { bold: true } as any,
    { match: (n: any) => Text.isText(n), split: true }
  );
};

// ---- Toggle Italic ----
const toggleItalic = (editor: any) => {
  Transforms.setNodes(
    editor,
    { italic: true } as any,
    { match: (n: any) => Text.isText(n), split: true }
  );
};

// ---- Insert Variable ----
const insertVariable = (editor: any) => {
  Transforms.insertText(editor, "{{employee_name}}");
};

// ---- Toolbar Buttons ----
const BoldButton = () => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBold(editor);
      }}
    >
      B
    </button>
  );
};

const ItalicButton = () => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        toggleItalic(editor);
      }}
    >
      I
    </button>
  );
};

const VariableButton = () => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        insertVariable(editor);
      }}
    >
      +Var
    </button>
  );
};

// ---- Render Leaf ----
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  return <span {...attributes}>{children}</span>;
};

// ---- Main Editor ----
export default function RichTextEditor({ value, onChange }: any) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      initialValue={value}   // ✅ FIXED (NOT value=)
      onChange={(val) => onChange(val)}
    >
      {/* Toolbar */}
      <div style={{ marginBottom: 5 }}>
        <BoldButton />
        <ItalicButton />
        <VariableButton />
      </div>

      {/* Editor */}
      <Editable
        renderLeaf={(props) => <Leaf {...props} />}
        placeholder="Start typing..."
      />
    </Slate>
  );
}