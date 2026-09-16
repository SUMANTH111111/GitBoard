import { useEffect, useMemo, useState } from "react";
import type { Task } from "../types/task";
import { getSprints } from "../api";
import CreateSprintModal from "../components/CreateSprintModal";

interface Sprint {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

interface Props {
  tasks: Task[];
}

export default function Sprint({ tasks }: Props) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [open, setOpen] = useState(false);

  async function loadSprints() {
    const data = await getSprints();
    setSprints(data);
  }

  useEffect(() => {
    loadSprints();
  }, []);

  const activeSprint = useMemo(
    () => sprints.find((s) => s.active),
    [sprints]
  );

  const sprintTasks = tasks.filter(
    (t) => t.sprint_id === activeSprint?.id
  );

  const completed = sprintTasks.filter(
    (t) => t.status === "DONE"
  ).length;

  const progress =
    sprintTasks.length === 0
      ? 0
      : Math.round((completed / sprintTasks.length) * 100);

  const daysRemaining = activeSprint
    ? Math.max(
        0,
        Math.ceil(
          (new Date(activeSprint.end_date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <div className="sprint-page">
      <div className="sprint-header">
        <div>
          <h1>Sprint Planner</h1>
          <p>Manage your development sprint</p>
        </div>

        <button
          className="new-task-btn"
          onClick={() => setOpen(true)}
        >
          + Create Sprint
        </button>
      </div>

      {activeSprint ? (
        <>
          <div className="sprint-card">
            <span className="active-badge">ACTIVE SPRINT</span>

            <h2>{activeSprint.name}</h2>

            <p>
              {activeSprint.start_date} → {activeSprint.end_date}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="progress-row">
              <span>{progress}% Completed</span>
              <span>{daysRemaining} days left</span>
            </div>
          </div>

          <div className="task-table">
            <h3>Sprint Tasks</h3>

            {sprintTasks.length === 0 ? (
              <p className="empty">
                No tasks assigned yet.
              </p>
            ) : (
              sprintTasks.map((task) => (
                <div
                  key={task.id}
                  className="table-row"
                >
                  <div>
                    <strong>{task.id}</strong>
                    <p>{task.title}</p>
                  </div>

                  <span className={`status ${task.status}`}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="empty-sprint">
          <h2>No Sprint Created</h2>
          <p>Create your first sprint to start planning.</p>
        </div>
      )}

      {open && (
        <CreateSprintModal
          onClose={() => setOpen(false)}
          onCreated={() => {
            setOpen(false);
            loadSprints();
          }}
        />
      )}
    </div>
  );
}