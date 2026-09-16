interface Props {
  onCreate: () => void;
  search: string;
  setSearch: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

export default function Header({
  onCreate,
  search,
  setSearch,
  priorityFilter,
  setPriorityFilter,
}: Props) {
  return (
    <header className="header">
      <div>
        <h1>Kanban Board</h1>
        <p>Manage your sprint tasks efficiently</p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "220px",
            padding: "11px 14px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            outline: "none",
          }}
        />

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            padding: "11px 14px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            outline: "none",
          }}
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button className="new-task-btn" onClick={onCreate}>
          + Create Issue
        </button>
      </div>
    </header>
  );
}