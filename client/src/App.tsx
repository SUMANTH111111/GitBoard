import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Priority = "High" | "Medium" | "Low";
type Status = "TODO" | "IN PROGRESS" | "DONE";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
}

const initialTasks: Task[] = [
  { id: "GB-101", title: "Design Login Page", priority: "High", status: "TODO" },
  { id: "GB-102", title: "Create Sidebar", priority: "Medium", status: "TODO" },
  { id: "GB-103", title: "JWT Authentication", priority: "High", status: "IN PROGRESS" },
  { id: "GB-100", title: "Initialize Git Repository", priority: "Low", status: "DONE" },
];

const priorityColor: Record<Priority, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

function Column({
  title,
  tasks,
}: {
  title: Status;
  tasks: Task[];
}) {
  return (
    <section className="column">
      <div className="column-top">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      {tasks.map((task) => (
        <article key={task.id} className="task-card">
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
      ))}
    </section>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const todo = useMemo(() => tasks.filter((t) => t.status === "TODO"), [tasks]);
  const doing = useMemo(() => tasks.filter((t) => t.status === "IN PROGRESS"), [tasks]);
  const done = useMemo(() => tasks.filter((t) => t.status === "DONE"), [tasks]);

  function createTask() {
    if (!title.trim()) return;

    const nextId = `GB-${100 + tasks.length + 1}`;

    const newTask: Task = {
      id: nextId,
      title: title.trim(),
      priority,
      status: "TODO",
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setPriority("Medium");
    setShowModal(false);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <h1 className="logo">GitBoard</h1>
          <p className="logo-sub">Sprint Workspace</p>
        </div>

        <nav className="nav">
          <button className="active">📋 Board</button>
          <button>🚀 Sprint</button>
          <button>🐞 Issues</button>
          <button>📊 Analytics</button>
        </nav>

        <div className="workspace">
          <p>WORKSPACE</p>
          <strong>Software Engineering</strong>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <p className="small">CURRENT PROJECT</p>
            <h1>Project Board</h1>
            <span>Jira-inspired Project Management Platform</span>
          </div>

          <button className="new-btn" onClick={() => setShowModal(true)}>
            + New Issue
          </button>
        </header>

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
          <Column title="TODO" tasks={todo} />
          <Column title="IN PROGRESS" tasks={doing} />
          <Column title="DONE" tasks={done} />
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Issue</h2>

            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button className="create" onClick={createTask}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}