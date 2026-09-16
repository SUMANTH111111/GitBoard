import type { Task } from "./types/task";

const API = "http://127.0.0.1:5000/api";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API}/tasks`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTask(task: Task): Promise<void> {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("CREATE ERROR:", error);
    throw new Error(error);
  }
}

export async function updateTask(id: string, task: Task): Promise<void> {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error(await res.text());
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(await res.text());
}