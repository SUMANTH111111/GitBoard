from flask import Flask
from flask_cors import CORS

from config import Config
from database import db
from routes import task_routes

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(task_routes, url_prefix="/api")


@app.route("/")
def home():
    return {"message": "GitBoard Backend Running"}


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)