import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CreateIssueModal from "./components/CreateIssueModal";
import DroppableColumn from "./components/DroppableColumn";
import Analytics from "./pages/Analytics";

import type { Task, Status } from "./types/task";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [activePage, setActivePage] = useState("Board");

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }

  function generateNextId() {
    const max = tasks.reduce((highest, task) => {
      const num = Number(task.id.replace("TASK-", ""));
      return num > highest ? num : highest;
    }, 0);

    return `TASK-${String(max + 1).padStart(3, "0")}`;
  }

  async function handleCreate(task: Task) {
    await createTask(task);
    await loadTasks();

    setIsModalOpen(false);
    setEditingTask(null);
  }

  async function handleUpdate(task: Task) {
    await updateTask(task.id, task);
    await loadTasks();

    setIsModalOpen(false);
    setEditingTask(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this task?")) return;

    await deleteTask(id);
    await loadTasks();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as Status;

    const current = tasks.find((t) => t.id === taskId);

    if (!current || current.status === newStatus) return;

    await updateTask(taskId, {
      ...current,
      status: newStatus,
    });

    await loadTasks();
  }

  const filteredTasks = tasks.filter((task) => {
    const searchMatch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const priorityMatch =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return searchMatch && priorityMatch;
  });

  const todo = filteredTasks.filter((t) => t.status === "TODO");
  const progress = filteredTasks.filter(
    (t) => t.status === "IN PROGRESS"
  );
  const done = filteredTasks.filter((t) => t.status === "DONE");

  return (
    <div className="app">
      <Sidebar
        active={activePage}
        onSelect={setActivePage}
      />

      <main className="main-content">
        {activePage === "Board" && (
          <>
            <Header
              onCreate={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              search={search}
              setSearch={setSearch}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />

            <DndContext onDragEnd={handleDragEnd}>
              <div className="board">
                <DroppableColumn
                  title="TODO"
                  tasks={todo}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                />

                <DroppableColumn
                  title="IN PROGRESS"
                  tasks={progress}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                />

                <DroppableColumn
                  title="DONE"
                  tasks={done}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            </DndContext>
          </>
        )}

        {activePage === "Analytics" && (
          <Analytics tasks={tasks} />
        )}

        {activePage === "Sprint" && (
          <div className="coming-page">
            <h1>🚀 Sprint Planner</h1>
            <p>Coming in the next milestone.</p>
          </div>
        )}

        {activePage === "Issues" && (
          <div className="coming-page">
            <h1>🐞 Issues</h1>
            <p>Advanced issue management coming next.</p>
          </div>
        )}
      </main>

      {isModalOpen && (
        <CreateIssueModal
          nextId={generateNextId()}
          editingTask={editingTask}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}