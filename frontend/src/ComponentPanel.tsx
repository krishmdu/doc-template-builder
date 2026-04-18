import { useDrag } from "react-dnd";

const Item = ({ type }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) drag(node);
      }}
      style={{
        padding: 10,
        border: "1px solid",
        marginBottom: 5,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {type}
    </div>
  );
};

export default function Panel() {
  return (
    <div>
      <h3>Components</h3>
      <Item type="text" />
      <Item type="dynamic-text" />
      <Item type="text-switch" />
      <Item type="table" />
    </div>
  );
}