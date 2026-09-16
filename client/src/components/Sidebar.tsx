export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h1 className="logo">GitBoard</h1>
        <p className="logo-sub">Sprint Workspace</p>
      </div>

      <nav className="nav">
        <button className="active">📋 Board</button>
        <button>🚀 Sprint</button>
        <button>🐞 Issues</button>
        <button>📊 Analytics</button>
      </nav>

      <div className="workspace">
        <p>WORKSPACE</p>
        <strong>Software Engineering</strong>
      </div>
    </aside>
  );
}