import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Column } from "../../components/columns/columns";
import { Task } from "../../components/task/task";
import { Input } from "../../components/input/input";

type TaskType = {
  id: UniqueIdentifier;
  name: string;
  status: "todo" | "inProgress" | "done";
};

type ColumnName = "todo" | "inProgress" | "done";

type Columns = Record<ColumnName, TaskType[]>;

export const TaskList = () => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [columns, setColumns] = useState<Columns>({
    todo: [
      { id: 1, name: "Task 1", status: "todo" },
      { id: 2, name: "Task 2", status: "todo" },
      { id: 3, name: "Task 3", status: "todo" },
    ],
    inProgress: [],
    done: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // helper: retorna coluna onde está o id (ids são comparados como string)
  const findColumnOfId = (id: string): ColumnName | undefined => {
    const keys = Object.keys(columns) as ColumnName[];
    return keys.find((k) => columns[k].some((t) => String(t.id) === id));
  };

  const addTask = (name: string) => {
    setColumns((columns) => {
      return {
        todo: [...columns.todo, { id: Date.now(), name, status: "todo" }],
        inProgress: [...columns.inProgress],
        done: [...columns.done],
      };
    });
  };

  function handleDragEnd(event: DragEndEvent) {
    setCursor(undefined);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumnOfId(activeId);
    const targetCol =
      findColumnOfId(overId) ??
      ((Object.keys(columns) as ColumnName[]).find((k) => k === overId) as
        | ColumnName
        | undefined);

    // If we couldn't find the source or target as columns/items, bail
    if (!sourceCol) return;
    if (!targetCol) return;

    // If same column -> reorder
    if (sourceCol === targetCol) {
      setColumns((prev) => {
        const list = prev[sourceCol];
        const idList = list.map((t) => String(t.id));
        const from = idList.indexOf(activeId);
        let to = idList.indexOf(overId);

        // If overId isn't an item (sometimes), put at end
        if (to === -1) to = list.length - 1;

        if (from === -1 || from === to) return prev;

        return {
          ...prev,
          [sourceCol]: arrayMove(prev[sourceCol], from, to),
        };
      });
      return;
    }

    // Moving between columns
    setColumns((prev) => {
      const prevSource = prev[sourceCol];
      const prevTarget = prev[targetCol];

      const activeIndex = prevSource.findIndex(
        (t) => String(t.id) === activeId
      );
      if (activeIndex === -1) return prev;

      const dragged = prevSource[activeIndex];

      // remove from source
      const newSource = prevSource.filter((t) => String(t.id) !== activeId);

      // determine insert index in target
      const targetIdList = prevTarget.map((t) => String(t.id));
      let insertIndex = targetIdList.indexOf(overId);
      if (insertIndex === -1) insertIndex = prevTarget.length; // if dropping on column area

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

  return (
    <div className="w-full h-full flex flex-col items-center gap-12 mt-2.5">
      <h1>My Tasks ✅</h1>
      <Input onSubmit={addTask} />
      <div
        className={`w-full flex flex-row items-center justify-center gap-12 mt-2.5 h-full`}
        style={{ cursor: cursor }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={() => setCursor("grab")}
        >
          {(Object.entries(columns) as [ColumnName, TaskType[]][]).map(
            ([colId, items]) => (
              <Column id={colId} key={colId}>
                <SortableContext
                  items={items.map((t) => String(t.id))}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((t) => (
                    <Task key={t.id} id={String(t.id)} name={t.name} />
                  ))}
                </SortableContext>
              </Column>
            )
          )}
        </DndContext>
      </div>
    </div>
  );
};
