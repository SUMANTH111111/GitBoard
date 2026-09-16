import { useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KanbanColumn from "./components/KanbanColumn";
import CreateIssueModal from "./components/CreateIssueModal";

import type { Task } from "./types/task";

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
    () => tasks.filter((task) => task.status === "TODO"),
    [tasks]
  );

  const doing = useMemo(
    () => tasks.filter((task) => task.status === "IN PROGRESS"),
    [tasks]
  );

  const done = useMemo(
    () => tasks.filter((task) => task.status === "DONE"),
    [tasks]
  );

  function addTask(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  const nextId = `GB-${100 + tasks.length + 1}`;

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

        <section className="board">
          <KanbanColumn title="TODO" tasks={todo} />
          <KanbanColumn title="IN PROGRESS" tasks={doing} />
          <KanbanColumn title="DONE" tasks={done} />
        </section>
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