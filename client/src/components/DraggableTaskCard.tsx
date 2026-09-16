import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../types/task";

const priorityColor = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

interface Props {
  task: Task;
}

export default function DraggableTaskCard({ task }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <p className="task-id">{task.id}</p>

      <h4>{task.title}</h4>

      <span
        className="badge"
        style={
          {
            "--badge": priorityColor[task.priority],
          } as CSSProperties & Record<"--badge", string>
        }
      >
        {task.priority}
      </span>
    </article>
  );
}