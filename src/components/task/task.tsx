import { CSS } from "@dnd-kit/utilities";
import type { TaskType } from "../types/tasks";
import { useSortable } from "@dnd-kit/sortable";

type TaskProps = Omit<TaskType, "status">;

export const Task = ({ id, name }: TaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    borderRadius: "5px",
    backgroundColor: "white",
    width: "100%",
    padding: "1.25rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "1.25rem",
    color: "black",
    maxHeight: "3.5rem",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {name}
    </div>
  );
};
