import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import type { TaskType, Columns } from "./task.list.types";

export const useTaskList = () => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [task, setTask] = useState<TaskType | undefined>(undefined);
  const [columns, setColumns] = useState<Columns>({
    todo: [
      { id: "1", name: "Task 1" },
      { id: "2", name: "Task 2" },
      { id: "3", name: "Task 3" },
    ],
    current: [],
    done: [],
  });

  const findColumnOfId = (id: string): string | undefined => {
    const keys = Object.keys(columns) as string[];
    return keys.find((k) => columns[k].some((t) => String(t.id) === id));
  };

  const findTaskById = (id: string): TaskType | undefined => {
    const col = findColumnOfId(id);
    if (!col) return undefined;
    return columns[col].find((t) => String(t.id) === id);
  };

  const deleteTaskById = (id: string, col: string) => {
    if (!col) return;
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col].filter((t) => String(t.id) !== id),
    }));
  }

  const addTask = (name: string) => {
    setColumns((prev) => {
      const columnNames = Object.keys(prev) as (keyof Columns)[];
      const firstColumn = columnNames[0];

      return {
        ...prev,
        [firstColumn]: [
          ...prev[firstColumn],
          { id: Date.now(), name, status: String(firstColumn) },
        ],
      };
    });
  };

  function handleDragStart(event: DragEndEvent) {
    if (!cursor) {
      setCursor("grabbing");
    }

    const { active } = event;
    const activeId = String(active.id);
    const item = findTaskById(activeId);
    setTask(item);
  }

  function handleDragEnd(event: DragEndEvent) {
    setCursor(undefined);
    setTask(undefined);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumnOfId(activeId);
    const targetCol =
      findColumnOfId(overId) ??
      ((Object.keys(columns) as string[]).find((k) => k === overId) as
        | string
        | undefined);

    if (!sourceCol) return;
    if (!targetCol) return;

    if (sourceCol === targetCol) {
      setColumns((prev) => {
        const list = prev[sourceCol];
        const idList = list.map((t) => String(t.id));
        const from = idList.indexOf(activeId);
        let to = idList.indexOf(overId);

        if (to === -1) to = list.length - 1;

        if (from === -1 || from === to) return prev;

        return {
          ...prev,
          [sourceCol]: arrayMove(prev[sourceCol], from, to),
        };
      });
      return;
    }

    setColumns((prev) => {
      const prevSource = prev[sourceCol];
      const prevTarget = prev[targetCol];

      const activeIndex = prevSource.findIndex(
        (t) => String(t.id) === activeId
      );
      if (activeIndex === -1) return prev;

      const dragged = prevSource[activeIndex];

      const newSource = prevSource.filter((t) => String(t.id) !== activeId);

      const targetIdList = prevTarget.map((t) => String(t.id));
      let insertIndex = targetIdList.indexOf(overId);
      if (insertIndex === -1) insertIndex = prevTarget.length;

      const newTarget = [
        ...prevTarget.slice(0, insertIndex),
        { ...dragged, status: targetCol },
        ...prevTarget.slice(insertIndex),
      ];

      return {
        ...prev,
        [sourceCol]: newSource,
        [targetCol]: newTarget,
      };
    });
  }

  return {
    cursor,
    columns,
    task,
    addTask,
    deleteTaskById,
    handleDragEnd,
    handleDragStart,
  };
};
