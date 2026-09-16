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

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }

  function generateNextId(): string {
    const max = tasks.reduce((highest, task) => {
      const num = Number(task.id.replace("TASK-", ""));
      return num > highest ? num : highest;
    }, 0);

    return `TASK-${String(max + 1).padStart(3, "0")}`;
  }

  async function handleCreate(task: Task) {
    try {
      await createTask(task);
      await loadTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Create failed:", error);
    }
  }

  async function handleDelete(taskId: string) {
    const confirmDelete = window.confirm(
      "Delete this task permanently?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as Status;

    const currentTask = tasks.find((t) => t.id === taskId);

    if (!currentTask || currentTask.status === newStatus) return;

    const updatedTask: Task = {
      ...currentTask,
      status: newStatus,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? updatedTask : t
      )
    );

    try {
      await updateTask(taskId, updatedTask);
    } catch {
      await loadTasks();
    }
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
        <Header onCreate={() => setIsModalOpen(true)} />

        <DndContext onDragEnd={handleDragEnd}>
          <div className="board">
            <DroppableColumn
              title="TODO"
              tasks={todo}
              onDelete={handleDelete}
            />

            <DroppableColumn
              title="IN PROGRESS"
              tasks={progress}
              onDelete={handleDelete}
            />

            <DroppableColumn
              title="DONE"
              tasks={done}
              onDelete={handleDelete}
            />
          </div>
        </DndContext>
      </main>

      {isModalOpen && (
        <CreateIssueModal
          nextId={generateNextId()}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}