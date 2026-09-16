const API = "http://127.0.0.1:5000/api";

// TASKS

export async function getTasks() {
  const res = await fetch(`${API}/tasks`);
  return res.json();
}

export async function createTask(task: any) {
  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export async function updateTask(id: string, task: any) {
  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export async function deleteTask(id: string) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
  });
}

// SPRINTS

export async function getSprints() {
  const res = await fetch(`${API}/sprints`);
  return res.json();
}

export async function createSprint(data: any) {
  await fetch(`${API}/sprints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// ASSIGN TASK TO SPRINT

export async function assignSprint(
  task: any,
  sprintId: number | null
) {
  return updateTask(task.id, {
    ...task,
    sprint_id: sprintId,
  });
}