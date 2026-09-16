import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../types/task";

interface Props {
  task: Task;
  onDelete: (id: string) => void;
}

export default function DraggableTaskCard({
  task,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <small style={{ color: "#64748b" }}>{task.id}</small>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          🗑
        </button>
      </div>

      <h4>{task.title}</h4>

      <span className={`priority ${task.priority}`}>
        {task.priority}
      </span>
    </div>
  );
}