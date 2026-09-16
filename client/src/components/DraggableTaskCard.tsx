import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/task";

interface Props{
  task:Task;
  onDelete:(id:string)=>void;
  onEdit:(task:Task)=>void;
}

export default function DraggableTaskCard({
  task,
  onDelete,
  onEdit
}:Props){

  const{
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  }=useSortable({
    id:task.id
  });

  const style={
    transform:CSS.Transform.toString(transform),
    transition
  };

  const today=new Date().toISOString().split("T")[0];

  const overdue=
    task.due_date &&
    task.status!=="DONE" &&
    task.due_date < today;

  return(

    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >

      <small style={{color:"#64748b"}}>
        {task.id}
      </small>

      <h4>{task.title}</h4>

      <div style={{marginBottom:"12px"}}>
        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.due_date &&(

        <div
          style={{
            color:"#cbd5e1",
            fontSize:"13px",
            marginBottom:"10px"
          }}
        >
          📅 {task.due_date}
        </div>

      )}

      {overdue &&(

        <div
          style={{
            color:"#f87171",
            fontSize:"12px",
            fontWeight:700,
            marginBottom:"8px"
          }}
        >
          🔴 Overdue
        </div>

      )}

      <div
        style={{
          display:"flex",
          justifyContent:"space-between"
        }}
      >

        <button
          onPointerDown={(e)=>e.stopPropagation()}
          onClick={(e)=>{
            e.stopPropagation();
            onEdit(task);
          }}
          style={{
            background:"transparent",
            border:"none",
            color:"#60a5fa",
            cursor:"pointer"
          }}
        >
          ✏ Edit
        </button>

        <button
          onPointerDown={(e)=>e.stopPropagation()}
          onClick={(e)=>{
            e.stopPropagation();
            onDelete(task.id);
          }}
          style={{
            background:"transparent",
            border:"none",
            color:"#f87171",
            cursor:"pointer"
          }}
        >
          🗑 Delete
        </button>

      </div>

    </div>

  );
}