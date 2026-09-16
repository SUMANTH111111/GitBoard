interface HeaderProps {
  onCreate: () => void;
}

export default function Header({ onCreate }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>GitBoard</h1>
        <p>Agile Sprint Management Board</p>
      </div>

      <button className="new-task-btn" onClick={onCreate}>
        + Create Issue
      </button>
    </header>
  );
}