import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CreateIssueModal from "./components/CreateIssueModal";
import DroppableColumn from "./components/DroppableColumn";

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
  const [activePage, setActivePage] = useState("Board");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  function generateNextId(): string {
    const max = tasks.reduce((highest, task) => {
      const num = Number(task.id.replace("TASK-", ""));
      return num > highest ? num : highest;
    }, 0);

    return `TASK-${String(max + 1).padStart(3, "0")}`;
  }

  /* ---------- CREATE ---------- */

  async function handleCreate(task: Task): Promise<void> {
    try {
      await createTask(task);
      await loadTasks();

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------- UPDATE ---------- */

  async function handleUpdate(task: Task): Promise<void> {
    try {
      await updateTask(task.id, task);
      await loadTasks();

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------- DELETE ---------- */

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    await deleteTask(id);
    await loadTasks();
  }

  /* ---------- DRAG ---------- */

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as Status;

    const current = tasks.find((t) => t.id === taskId);

    if (!current || current.status === newStatus) return;

    const updated: Task = {
      ...current,
      status: newStatus,
    };

    await updateTask(taskId, updated);
    await loadTasks();
  }

  /* ---------- SEARCH + FILTER ---------- */

  const filtered = tasks.filter((task) => {
    const searchMatch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const priorityMatch =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return searchMatch && priorityMatch;
  });

  const todo = filtered.filter((t) => t.status === "TODO");
  const progress = filtered.filter(
    (t) => t.status === "IN PROGRESS"
  );
  const done = filtered.filter((t) => t.status === "DONE");

  return (
    <div className="app">
      <Sidebar
        active={activePage}
        onSelect={setActivePage}
      />

      <main className="main-content">
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