import { useEffect, useState } from "react";
import type { Priority, Task } from "../types/task";

interface Props {
  onClose: () => void;
  onCreate: (task: Task) => Promise<void>;
  onUpdate?: (task: Task) => Promise<void>;
  nextId: string;
  editingTask?: Task | null;
}

export default function CreateIssueModal({
  onClose,
  onCreate,
  onUpdate,
  nextId,
  editingTask,
}: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setPriority(editingTask.priority);
      setDueDate(editingTask.due_date || "");
    } else {
      setTitle("");
      setPriority("Medium");
      setDueDate("");
    }
  }, [editingTask]);

  async function handleSave() {
    if (!title.trim()) return;

    setLoading(true);

    const task: Task = {
      id: editingTask ? editingTask.id : nextId,
      title: title.trim(),
      priority,
      status: editingTask ? editingTask.status : "TODO",
      due_date: dueDate,
      created_at: editingTask?.created_at,
    };

    try {
      if (editingTask && onUpdate) {
        await onUpdate(task);
      } else {
        await onCreate(task);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editingTask ? "Edit Issue" : "Create Issue"}</h2>

        <label>Task Title</label>
        <input
          type="text"
          value={title}
          placeholder="Enter task title..."
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

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button className="create" onClick={handleSave} disabled={loading}>
            {loading
              ? "Saving..."
              : editingTask
              ? "Save Changes"
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}