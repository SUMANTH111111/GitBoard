from flask import Blueprint, jsonify, request
from database import db
from models import Task

task_routes = Blueprint("task_routes", __name__)

# GET all tasks
@task_routes.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# CREATE task
@task_routes.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    task = Task(
        id=data["id"],
        title=data["title"],
        priority=data["priority"],
        status=data["status"],
        due_date=data.get("due_date")
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201

# UPDATE task
@task_routes.route("/tasks/<string:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)

    data = request.get_json()

    task.title = data.get("title", task.title)
    task.priority = data.get("priority", task.priority)
    task.status = data.get("status", task.status)
    task.due_date = data.get("due_date", task.due_date)

    db.session.commit()

    return jsonify(task.to_dict())

# DELETE task
@task_routes.route("/tasks/<string:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"})