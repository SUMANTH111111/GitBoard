import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import type { Task } from "../types/task";
import { getActivities } from "../api";

interface Props {
  tasks: Task[];
}

interface Activity {
  id: number;
  action: string;
  created_at: string;
}

const COLORS = ["#3B82F6", "#F59E0B", "#22C55E"];

export default function Analytics({ tasks }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    loadActivities();

    // Refresh activities every 30 sec
    const refresh = setInterval(() => {
      loadActivities();
    }, 30000);

    // Update "Just now" / "1 min ago"
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => {
      clearInterval(refresh);
      clearInterval(timer);
    };
  }, []);

  async function loadActivities() {
    const data = await getActivities();
    setActivities(data);
  }

  // ---------- STATS ----------

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
    { name: "TODO", value: todo },
    { name: "IN PROGRESS", value: progress },
    { name: "DONE", value: done },
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

  // ---------- TIME AGO (FIXED) ----------

  function timeAgo(date: string) {
    const parsed = new Date(date.replace("T", " "));

    const diff = Math.floor((now - parsed.getTime()) / 1000);

    if (diff < 60) return "Just now";

    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return `${mins} min ago`;
    }

    if (diff < 86400) {
      const hrs = Math.floor(diff / 3600);
      return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Sprint Analytics</h1>
        <p>Live project insights & activity timeline</p>
      </div>

      {/* ---------- CARDS ---------- */}

      <div className="analytics-grid">
        <div className="stat-card">
          <span>Completion</span>
          <h2>{completion}%</h2>
        </div>

        <div className="stat-card">
          <span>Overdue</span>
          <h2>{overdue}</h2>
        </div>

        <div className="stat-card">
          <span>Due This Week</span>
          <h2>{dueThisWeek}</h2>
        </div>

        <div className="stat-card">
          <span>Total Tasks</span>
          <h2>{total}</h2>
        </div>
      </div>

      {/* ---------- CHARTS ---------- */}

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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Priority Breakdown</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priorityData}>
              <CartesianGrid
                stroke="#22314d"
                vertical={false}
              />

              <XAxis
                dataKey="priority"
                stroke="#94A3B8"
              />

              <YAxis stroke="#94A3B8" />

              <Tooltip />

              <Bar
                dataKey="tasks"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- ACTIVITY ---------- */}

      <div className="activity-card">
        <h3>Recent Activity</h3>

        {activities.length === 0 ? (
          <p className="empty">No activity yet.</p>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="activity-row"
            >
              <div className="activity-dot" />

              <div className="activity-text">
                <strong>{item.action}</strong>
                <span>{timeAgo(item.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}