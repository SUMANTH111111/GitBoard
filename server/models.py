from database import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.String(20), primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(30), nullable=False)

    due_date = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "priority": self.priority,
            "status": self.status,
            "due_date": self.due_date,
            "created_at": self.created_at.isoformat()
        }