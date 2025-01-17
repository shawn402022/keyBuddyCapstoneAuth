from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user, login_user, logout_user
from app.models import (
    User,
    Scale,
    Chord,
    Progression,
    Key,
    Song,
    Course,
    Review,
    Progression,
    db,
    environment,
    SCHEMA,
)
from app.models import (
    user_courses,
    song_keys,
    song_chords,
    song_progressions,
    user_courses,
)
from app.forms import LoginForm, SignUpForm


user_routes = Blueprint("user", __name__, url_prefix="/user")
song_routes = Blueprint("song", __name__, url_prefix="/song")
scale_routes = Blueprint("scale", __name__, url_prefix="/scale")
review_routes = Blueprint("review", __name__, url_prefix="/review")
course_routes = Blueprint("course", __name__, url_prefix="/course")
chord_routes = Blueprint("chord", __name__, url_prefix="/chord")
progression_routes = Blueprint("progression", __name__, url_prefix="/progression")
key_routes = Blueprint("key", __name__, url_prefix="/key")


## USERS ENDPOINT


# Read User
@user_routes.route("/")
def users():
    # USE THE DB TO QUERY ALL USERS
    all_users = db.session.query(User)
    result_list = []

    # iterate through the users and add their names to the string
    for user in all_users:
        new_user = user.to_dict()
        result_list.append(new_user)

    return jsonify(result_list)


# Create User


@user_routes.route("/", methods=["POST"])
def create_user():
    user_data = request.json

    # use the user model to create a new user
    new_user = User(**user_data)  # <--spread the user object in the the user model
    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # return the newly created user in a json format
    return jsonify(new_user.to_dict()), 201
    print(user_data)
    return jsonify(user_data.to_dict())


# Update User


@user_routes.route("/<user_id>", methods=["PATCH"])
def update_user(user_id):
    # query the db to find the user we want to update
    # .get(user_id) is looking for primary key
    user = db.session.query(User).get(user_id)

    if user:
        if "full_name" in request.json:
            user.full_name = request.json["full_name"]
        if "email" in request.json:
            user.email = request.json["email"]
        if "password" in request.json:
            user.password = request.json["password"]
        if "username" in request.json:
            user.username = request.json["username"]

        # save user into the database
        db.session.commit()

        # send back th updated user
        return jsonify(user.to_dict())
    return jsonify({"msg": "User not found"})


# Delete Users


@user_routes.route("/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    # query the db to find the user we want to delete
    user = db.session.query(User).get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"})

    return jsonify({"msg": "User not found"})


## SONG ENDPOINT


@song_routes.route("/")
def songs():
    return "This is the song endpoint"


## REVIEW ENDPOINT


@review_routes.route("/")
def reviews():
    return "This is the review endpoint"


## COURSE ENDPOINT


@course_routes.route("/<user_id>")
def courses(user_id):
    user = User.query.get(user_id)
    user_courses = user.courses
    course_name = [course.course_name for course in user_courses]

    return jsonify(course_name)


## LESSON ENDPOINT


@scale_routes.route("/")
def scales():

    all_scales = db.session.query(Scale)
    result_list = []

    for scale in all_scales:
        new_scale = scale.to_dict()
        result_list.append(new_scale)

    return jsonify(result_list)


## CHORD ENDPOINT


@chord_routes.route("/")
def chords():
    return "This is the chord endpoint"


## PROGRESSION ENDPOINT


@progression_routes.route("/")
def progressions():
    return "This is the progression endpoint"


## KEY ENDPOINT


@key_routes.route("/")
def keys():
    return "This is the key endpoint"
