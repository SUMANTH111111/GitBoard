const API = "http://127.0.0.1:5000/api";

export async function getTasks() {
  const res = await fetch(`${API}/tasks`);
  return res.json();
}

export async function createTask(task: any) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return res.json();
}

export async function updateTask(id: string, task: any) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return res.json();
}

export async function deleteTask(id: string) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
  });
}