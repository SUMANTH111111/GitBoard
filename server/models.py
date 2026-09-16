from database import db
from datetime import datetime


# ==========================
# Sprint Model
# ==========================

class Sprint(db.Model):
    __tablename__ = "sprints"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)
    active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "active": self.active,
        }


# ==========================
# Task Model
# ==========================

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.String(20), primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(30), nullable=False)

    due_date = db.Column(db.String(20))

    # ✅ Local time (IST)
    created_at = db.Column(db.DateTime, default=datetime.now)

    sprint_id = db.Column(
        db.Integer,
        db.ForeignKey("sprints.id")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "priority": self.priority,
            "status": self.status,
            "due_date": self.due_date,
            "created_at": self.created_at.isoformat(),
            "sprint_id": self.sprint_id,
        }


# ==========================
# Activity Model
# ==========================

class Activity(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(200), nullable=False)

    # ✅ Local time (IST)
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "created_at": self.created_at.isoformat(),
        }