import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import type { TaskType } from "../types/tasks";
import { TrashIcon } from "../icons/trash/trash";

type TaskProps = Omit<TaskType, "status"> & {
  colId?: string;
  onDelete: (id: string, col: string) => void;
};

export const Task = ({ id, name, colId = "", onDelete }: TaskProps) => {
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
    justifyContent: "space-between",
    gap: "1.25rem",
    color: "black",
    maxHeight: "3.5rem",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex gap-2">
        <div {...listeners} className="handle hover:cursor-grab">
          ☰
        </div>
        {name}
      </div>
      <a
        className="text-red-600 hover:text-red-800 cursor-pointer z-999"
        onClick={() => {
          onDelete(id, colId);
        }}
      >
        <TrashIcon />
      </a>
    </div>
  );
};
