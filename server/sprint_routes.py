from flask import Blueprint, jsonify, request

from database import db
from models import Sprint, Activity

sprint_routes = Blueprint("sprint_routes", __name__)

@ sprint_routes.route("/sprints", methods=["GET"])
def get_sprints():

    data = Sprint.query.all()

    return jsonify([s.to_dict() for s in data])


@ sprint_routes.route("/sprints", methods=["POST"])
def create_sprint():

    data = request.get_json()

    Sprint.query.update({"active": False})

    sprint = Sprint(
        name=data["name"],
        start_date=data["start_date"],
        end_date=data["end_date"],
        active=True
    )

    db.session.add(sprint)

    db.session.add(
        Activity(action=f'Created sprint "{sprint.name}"')
    )

    db.session.commit()

    return jsonify(sprint.to_dict()), 201