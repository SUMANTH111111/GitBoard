import type { CSSProperties } from "react";
import type { Task } from "../types/task";

const priorityColor = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  return (
    <article className="task-card">
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