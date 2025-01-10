from flask import Blueprint

bp = Blueprint("course", __name__, url_prefix="/course")

@bp.route("/")
def courses():
    return "This is the courses endpoint"
