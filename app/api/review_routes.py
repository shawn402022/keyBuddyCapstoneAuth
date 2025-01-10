from flask import Blueprint

bp = Blueprint("review", __name__, url_prefix="/review")

@bp.route("/")
def reviews():
    return "This is the review endpoint"
