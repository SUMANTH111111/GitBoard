from flask import Blueprint, jsonify, request

from database import db
from models import Task, Activity

task_routes = Blueprint("task_routes", __name__)

# ---------------- GET ----------------

@task_routes.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks])


# ---------------- CREATE ----------------

@task_routes.route("/tasks", methods=["POST"])
def create_task():

    data = request.get_json()

    task = Task(
        id=data["id"],
        title=data["title"],
        priority=data["priority"],
        status=data["status"],
        due_date=data.get("due_date"),
        sprint_id=data.get("sprint_id")
    )

    db.session.add(task)

    db.session.add(
        Activity(action=f'Created task "{task.title}"')
    )

    db.session.commit()

    return jsonify(task.to_dict()), 201


# ---------------- UPDATE ----------------

@task_routes.route("/tasks/<string:task_id>", methods=["PUT"])
def update_task(task_id):

    task = Task.query.get_or_404(task_id)

    old_status = task.status

    data = request.get_json()

    task.title = data.get("title", task.title)
    task.priority = data.get("priority", task.priority)
    task.status = data.get("status", task.status)
    task.due_date = data.get("due_date", task.due_date)
    task.sprint_id = data.get("sprint_id", task.sprint_id)

    if old_status != task.status:
        action = f'{task.id} moved to {task.status}'
    else:
        action = f'Updated "{task.title}"'

    db.session.add(Activity(action=action))

    db.session.commit()

    return jsonify(task.to_dict())


# ---------------- DELETE ----------------

@task_routes.route("/tasks/<string:task_id>", methods=["DELETE"])
def delete_task(task_id):

    task = Task.query.get_or_404(task_id)

    db.session.add(
        Activity(action=f'Deleted "{task.title}"')
    )

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Deleted"})