import type { Task } from "./types/task";

const API = "http://127.0.0.1:5000/api";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API}/tasks`);
  return await res.json();
}

export async function createTask(task: Task): Promise<Task> {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  return await res.json();
}

export async function updateTask(id: string, task: Task): Promise<Task> {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  return await res.json();
}

export async function deleteTask(id: string): Promise<void> {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
  });
}