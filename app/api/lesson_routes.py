from flask import Blueprint

bp = Blueprint("lesson", __name__, url_prefix="/lesson")

@bp.route("/")
def lessons():
    return "This is the lesson endpoint"
