interface Props {
  onNewIssue: () => void;
}

export default function Header({ onNewIssue }: Props) {
  return (
    <header className="header">
      <div>
        <p className="small">CURRENT PROJECT</p>
        <h1>Project Board</h1>
        <span>Jira-inspired Project Management Platform</span>
      </div>

      <button className="new-btn" onClick={onNewIssue}>
        + New Issue
      </button>
    </header>
  );
}