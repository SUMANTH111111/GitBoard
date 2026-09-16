import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DraggableTaskCard from "./DraggableTaskCard";
import type { Status, Task } from "../types/task";

interface Props {
  title: Status;
  tasks: Task[];
}

export default function DroppableColumn({ title, tasks }: Props) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  return (
    <section ref={setNodeRef} className="column">
      <div className="column-top">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </section>
  );
}