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

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
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
  }

  async function handleUpdate(task: Task) {
    await updateTask(task.id, task);
    await loadTasks();
    setEditingTask(null);
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    await deleteTask(id);
    await loadTasks();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as Status;

    const currentTask = tasks.find((t) => t.id === taskId);

    if (!currentTask || currentTask.status === newStatus) return;

    const updated: Task = {
      ...currentTask,
      status: newStatus,
    };

    await updateTask(taskId, updated);
    await loadTasks();
  }

  const todo = tasks.filter((t) => t.status === "TODO");
  const progress = tasks.filter(
    (t) => t.status === "IN PROGRESS"
  );
  const done = tasks.filter((t) => t.status === "DONE");

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
            setEditingTask(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}