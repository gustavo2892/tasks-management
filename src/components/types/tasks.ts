export type TaskType = {
  id: string;
  name: string;
  status: "todo" | "in-progress" | "done";
};

export type TasksType = Array<TaskType>;
