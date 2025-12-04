import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
  id: string;
  title: string;
  children?: React.ReactNode;
};

export const Column = ({ id, children, title }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    padding: "20px 16px",
    width: "80%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    minHeight: "500px",
    background: isOver ? "#cbcbcb" : "#f2f2f3",
    borderRadius: "5px",
  };

  return (
    <div style={style} ref={setNodeRef}>
      <h2 className="text-black font-bold">{title?.toLocaleUpperCase()}</h2>
      {children}
    </div>
  );
};
