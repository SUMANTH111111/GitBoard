from flask import Blueprint, jsonify
from models import Activity

activity_routes = Blueprint("activity_routes", __name__)

@activity_routes.route("/activities", methods=["GET"])
def get_activity():

    data = (
        Activity.query
        .order_by(Activity.created_at.desc())
        .limit(20)
        .all()
    )

    return jsonify([a.to_dict() for a in data])