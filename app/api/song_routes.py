from flask import Blueprint

bp = Blueprint("song", __name__, url_prefix="/song")

@bp.route("/")
def songs():
    return "This is the song endpoint"
