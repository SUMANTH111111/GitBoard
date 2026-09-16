import TaskCard from "./TaskCard";
import type { Status, Task } from "../types/task";

interface Props {
  title: Status;
  tasks: Task[];
}

export default function KanbanColumn({ title, tasks }: Props) {
  return (
    <section className="column">
      <div className="column-top">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </section>
  );
}