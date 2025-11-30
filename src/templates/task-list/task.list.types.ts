import type { UniqueIdentifier } from "@dnd-kit/core";

export type TaskType = {
  id: UniqueIdentifier;
  name: string;
};

export type Columns = Record<string, TaskType[]>;
