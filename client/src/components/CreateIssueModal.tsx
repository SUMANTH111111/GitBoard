import { useEffect, useState } from "react";
import type { Priority, Task } from "../types/task";

interface Props {
  onClose: () => void;
  onCreate: (task: Task) => void;
  nextId: string;

  editingTask?: Task | null;
  onUpdate?: (task: Task) => void;
}

export default function CreateIssueModal({
  onClose,
  onCreate,
  nextId,
  editingTask,
  onUpdate,
}: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setPriority(editingTask.priority);
    } else {
      setTitle("");
      setPriority("Medium");
    }
  }, [editingTask]);

  function handleSave() {
    if (!title.trim()) return;

    if (editingTask && onUpdate) {
      onUpdate({
        ...editingTask,
        title: title.trim(),
        priority,
      });
    } else {
      onCreate({
        id: nextId,
        title: title.trim(),
        priority,
        status: "TODO",
      });
    }

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {editingTask ? "Edit Issue" : "Create New Issue"}
        </h2>

        <label>Task Title</label>

        <input
          type="text"
          placeholder="Enter task..."
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
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="create" onClick={handleSave}>
            {editingTask ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}