import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../types/task";

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function DraggableTaskCard({
  task,
  onDelete,
  onEdit,
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
      {/* Top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <small style={{ color: "#94a3b8" }}>{task.id}</small>
      </div>

      {/* Title */}
      <h4>{task.title}</h4>

      {/* Bottom */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
        }}
      >
        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>

        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
            title="Edit Task"
          >
            ✏️
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}