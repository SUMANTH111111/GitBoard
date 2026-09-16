interface Props {
  active: string;
  onSelect: (page: string) => void;
}

export default function Sidebar({ active, onSelect }: Props) {
  const items = [
    { icon: "📋", name: "Board" },
    { icon: "🚀", name: "Sprint" },
    { icon: "🐞", name: "Issues" },
    { icon: "📊", name: "Analytics" },
  ];

  return (
    <aside className="sidebar">
      <div>
        <h1 className="logo">GitBoard</h1>
        <p className="subtitle">Sprint Workspace</p>
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.name}
            className={active === item.name ? "nav active" : "nav"}
            onClick={() => onSelect(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="workspace">
        <p>WORKSPACE</p>
        <h3>Software Engineering</h3>
      </div>
    </aside>
  );
}