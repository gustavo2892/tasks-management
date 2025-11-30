import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
  id: string;
  children?: React.ReactNode;
};

export const Column = ({ id, children }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    padding: "30px 16px",
    width: "80%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    minHeight: "500px",
    background: isOver ? "#e2f7e2" : "#f2f2f3",
    borderRadius: "5px",
  };

  return (
    <div style={style} ref={setNodeRef}>
      {children}
    </div>
  );
};
