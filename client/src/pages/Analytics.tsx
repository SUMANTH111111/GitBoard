import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { Task } from "../types/task";

interface Props {
  tasks: Task[];
}

const COLORS = ["#3B82F6", "#F59E0B", "#22C55E"];

export default function Analytics({ tasks }: Props) {
  const total = tasks.length;

  const todo = tasks.filter((t) => t.status === "TODO").length;
  const progress = tasks.filter((t) => t.status === "IN PROGRESS").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  const completion =
    total === 0 ? 0 : Math.round((done / total) * 100);

  const today = new Date();

  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.status === "DONE") return false;
    return new Date(t.due_date) < today;
  }).length;

  const week = new Date();
  week.setDate(today.getDate() + 7);

  const dueThisWeek = tasks.filter((t) => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d >= today && d <= week;
  }).length;

  const pieData = [
    { name: "Todo", value: todo },
    { name: "Progress", value: progress },
    { name: "Done", value: done },
  ];

  const priorityData = [
    {
      priority: "High",
      tasks: tasks.filter((t) => t.priority === "High").length,
    },
    {
      priority: "Medium",
      tasks: tasks.filter((t) => t.priority === "Medium").length,
    },
    {
      priority: "Low",
      tasks: tasks.filter((t) => t.priority === "Low").length,
    },
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-grid">
        <div className="stat-card">
          <h4>Completion</h4>
          <h2>{completion}%</h2>
        </div>

        <div className="stat-card">
          <h4>Overdue</h4>
          <h2>{overdue}</h2>
        </div>

        <div className="stat-card">
          <h4>Due This Week</h4>
          <h2>{dueThisWeek}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Tasks</h4>
          <h2>{total}</h2>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Status Distribution</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                innerRadius={55}
                paddingAngle={4}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Priority Breakdown</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priorityData}>
              <CartesianGrid stroke="#22314d" vertical={false} />
              <XAxis dataKey="priority" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}