import { useState } from "react";
import type { Priority, Task } from "../types/task";

interface Props {
  onClose: () => void;
  onCreate: (task: Task) => void;
  nextId: string;
}

export default function CreateIssueModal({
  onClose,
  onCreate,
  nextId,
}: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  function handleCreate() {
    if (!title.trim()) return;

    onCreate({
      id: nextId,
      title: title.trim(),
      priority,
      status: "TODO",
    });

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Issue</h2>

        <label>Task Title</label>
        <input
          type="text"
          placeholder="Enter task name..."
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

          <button className="create" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}