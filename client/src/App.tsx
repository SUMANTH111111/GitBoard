import { useMemo, useState } from "react";
import {
  DndContext,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DroppableColumn from "./components/DroppableColumn";
import CreateIssueModal from "./components/CreateIssueModal";

import type { Task, Status } from "./types/task";

const initialTasks: Task[] = [
  {
    id: "GB-101",
    title: "Design Login Page",
    priority: "High",
    status: "TODO",
  },
  {
    id: "GB-102",
    title: "Create Sidebar",
    priority: "Medium",
    status: "TODO",
  },
  {
    id: "GB-103",
    title: "JWT Authentication",
    priority: "High",
    status: "IN PROGRESS",
  },
  {
    id: "GB-100",
    title: "Initialize Git Repository",
    priority: "Low",
    status: "DONE",
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);

  const todo = useMemo(
    () => tasks.filter((t) => t.status === "TODO"),
    [tasks]
  );

  const doing = useMemo(
    () => tasks.filter((t) => t.status === "IN PROGRESS"),
    [tasks]
  );

  const done = useMemo(
    () => tasks.filter((t) => t.status === "DONE"),
    [tasks]
  );

  function addTask(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  const nextId = `GB-${100 + tasks.length + 1}`;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    let newStatus: Status;

    if (
      overId === "TODO" ||
      overId === "IN PROGRESS" ||
      overId === "DONE"
    ) {
      newStatus = overId;
    } else {
      const targetTask = tasks.find((t) => t.id === overId);
      if (!targetTask) return;
      newStatus = targetTask.status;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === activeId
          ? { ...task, status: newStatus }
          : task
      )
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header onNewIssue={() => setShowModal(true)} />

        <section className="stats">
          <div className="stat-card">
            <h2>{tasks.length}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h2>{doing.length}</h2>
            <p>In Progress</p>
          </div>

          <div className="stat-card">
            <h2>86%</h2>
            <p>Sprint Health</p>
          </div>
        </section>

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <section className="board">
            <DroppableColumn title="TODO" tasks={todo} />
            <DroppableColumn
              title="IN PROGRESS"
              tasks={doing}
            />
            <DroppableColumn title="DONE" tasks={done} />
          </section>
        </DndContext>
      </main>

      {showModal && (
        <CreateIssueModal
          nextId={nextId}
          onClose={() => setShowModal(false)}
          onCreate={addTask}
        />
      )}
    </div>
  );
}