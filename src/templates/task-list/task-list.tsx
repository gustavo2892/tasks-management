import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "../../components/columns/columns";
import { Task } from "../../components/task/task";
import { Input } from "../../components/input/input";
import { useTaskList } from "./task-list.hook";
import type { TaskType } from "./task.list.types";

export const TaskList = () => {
  const { cursor, columns, task, addTask, handleDragEnd, handleDragStart, deleteTaskById } =
    useTaskList();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div className="w-full h-full flex flex-col items-center gap-12 mt-2.5 pt-8">
      <Input onSubmit={addTask} />
      <div
        className={`w-full flex flex-row items-center justify-center gap-12 mt-2.5 h-full`}
        style={{ cursor: cursor }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          {(Object.entries(columns) as [string, TaskType[]][]).map(
            ([colId, items]) => (
              <Column id={colId} key={colId} title={colId}>
                <SortableContext
                  items={items.map((t) => String(t.id))}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((t) => (
                    <Task key={t.id} id={String(t.id)} name={t.name} colId={colId} onDelete={deleteTaskById}/>
                  ))}
                </SortableContext>
              </Column>
            )
          )}
          <DragOverlay>
            {task ? <Task id={String(task.id)} name={task.name} onDelete={deleteTaskById}/> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
