import { useState } from "react";
import { createSprint } from "../api";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateSprintModal({
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  async function handleCreate() {
    if (!name || !start || !end) return;

    await createSprint({
      name,
      start_date: start,
      end_date: end,
    });

    onCreated();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Sprint</h2>

        <label>Sprint Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Start Date</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>End Date</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <div className="modal-buttons">
          <button
            className="cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="create"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}