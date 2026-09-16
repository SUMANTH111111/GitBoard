import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

import type { Task } from "../types/task";

import { getSprints, assignSprint } from "../api";

interface Sprint {
  id: number;
  name: string;
}

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

  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getSprints();
      setSprints(data);
    }

    load();
  }, []);

  async function handleSprintChange(value: string) {
    const sprint =
      value === "" ? null : Number(value);

    await assignSprint(task, sprint);

    window.location.reload();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <small>{task.id}</small>

      <h4>{task.title}</h4>

      <span className={`priority ${task.priority}`}>
        {task.priority}
      </span>

      {task.due_date && (
        <p className="task-date">
          📅 {task.due_date}
        </p>
      )}

      <select
        className="sprint-select"
        value={task.sprint_id ?? ""}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onChange={(e) =>
          handleSprintChange(e.target.value)
        }
      >
        <option value="">No Sprint</option>

        {sprints.map((s) => (
          <option
            key={s.id}
            value={s.id}
          >
            {s.name}
          </option>
        ))}
      </select>

      <div className="task-actions">
        <button
          className="edit-btn"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(task)}
        >
          ✏ Edit
        </button>

        <button
          className="delete-btn"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task.id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}