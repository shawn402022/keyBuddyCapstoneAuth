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


## USERS ENDPOINT___________________________________


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
@login_required
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
@login_required
def delete_user(user_id):
    # query the db to find the user we want to delete
    user = db.session.query(User).get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"})

    return jsonify({"msg": "User not found"})


## SONG ENDPOINT_________________________________________________


# get all songs
@song_routes.route("/")
def songs():
    all_songs = db.session.query(Song)

    result_list = []

    for song in all_songs:
        new_song = song.to_dict()
        result_list.append(new_song)

    return jsonify(result_list)


# get songs by key
@song_routes.route("/<song_key>")
def songs_by_key(song_key):
    if song_key:
        all_songs = db.session.query(Song).filter_by(song_key=song_key)
        result_list = []

        for song in all_songs:
            new_song = song.to_dict()
            result_list.append(new_song)

        return jsonify(result_list)
    return jsonify({"msg": "No songs in this key"})


# ADMIN create a song
@song_routes.route("/", methods=["POST"])
@login_required
def create_song():
    # Check if the current user is authorized
    if current_user.full_name != "Shawn Norbert":
        return jsonify({"msg": "Unauthorized - Only Shawn Norbert can add songs"}), 403

    song_data = request.json
    new_song = Song(**song_data)
    db.session.add(new_song)
    db.session.commit()
    return jsonify(new_song.to_dict())


# ADMIN update a song
@song_routes.route("/<song_id>", methods=["PATCH"])
@login_required
def update_song(song_id):

    if current_user.full_name != "Shawn Norbert":
        return jsonify({"msg": "Unauthorized - Only Shawn Norbert can add songs"}), 403

    song = db.session.query(Song).get(song_id)

    if song:
        if "song_key" in request.json:
            song.song_key = request.json["song_key"]
        if "song" in request.json:
            song.song = request.json["song"]
        if "artist" in request.json:
            song.artist = request.json["artist"]
        if "chords_used" in request.json:
            song.chords_used = request.json["chords_used"]
        if "progression_used" in request.json:
            song.progression_used = request.json["progression_used"]

        print(song)
        db.session.commit()
        return jsonify(song.to_dict())

    return jsonify({"msg": "Song not found"})


# ADMIN delete a song
@song_routes.route("/<song_id>", methods=["DELETE"])
@login_required
def delete_song(song_id):

    if current_user.full_name != "Shawn Norbert":
        return jsonify({"msg": "Unauthorized - Only Shawn Norbert can add songs"}), 403

    song = db.session.query(Song).get(song_id)

    if song:
        db.session.delete(song)
        db.session.commit()
        return jsonify({"msg": "Song deleted"})

    return jsonify({"msg": "Song not found"})


## REVIEW ENDPOINT________________________________


# Get all reviews
@review_routes.route("/")
def reviews():
    all_reviews = db.session.query(Review)
    results_list = []

    for review in all_reviews:
        new_review = review.to_dict()
        results_list.append(new_review)

    return jsonify(results_list)


# create a review
@review_routes.route("/", methods=["POST"])
@login_required
def create_review():
    review_data = request.json

    # Get the current logged in user
    current_user_name = current_user.full_name

    # Create new review data with the user's name
    new_review_data = {
        "reviewer_name": current_user_name,
        "review_content": review_data.get("review_content"),
    }

    new_review = Review(**new_review_data)
    db.session.add(new_review)
    db.session.commit()

    return jsonify(new_review.to_dict())


# update a review
@review_routes.route("/<review_id>", methods=["PATCH"])
@login_required
def update_review(review_id):
    review = Review.query.get(review_id)

    if review:
        # Check if the current user is the review owner
        if review.reviewer_name == current_user.full_name:
            if "review_content" in request.json:
                review.review_content = request.json["review_content"]

            db.session.commit()
            return jsonify(review.to_dict())
        return (
            jsonify({"msg": "Unauthorized - You can only update your own reviews"}),
            403,
        )

    return jsonify({"msg": "Review not found"}), 404


# delete a review
@review_routes.route("/<review_id>", methods=["DELETE"])
@login_required
def delete_review(review_id):
    review = Review.query.get(review_id)

    if review:
        # Check if the current user is Shawn Norbert
        if current_user.full_name == "Shawn Norbert":
            db.session.delete(review)
            db.session.commit()
            return jsonify({"msg": "Review successfully deleted"})
        return (
            jsonify({"msg": "Unauthorized - Only Shawn Norbert can delete reviews"}),
            403,
        )

    return jsonify({"msg": "Review not found"}), 404


## COURSE ENDPOINT
# get all courses
@course_routes.route("/")
@login_required
def get_all_courses():
    all_courses = db.session.query(Course)
    result_list = []

    for course in all_courses:
        new_course = course.to_dict()
        result_list.append(new_course)

    return jsonify(result_list)


# get user courses
@course_routes.route("/<user_id>")
@login_required
def get_user_courses(user_id):
    # Verify the logged-in user matches the requested user_id
    if str(current_user.id) != str(user_id):
        return (
            jsonify({"msg": "Unauthorized - You can only view your own courses"}),
            403,
        )

    user = User.query.get(user_id)
    user_courses = user.courses
    return jsonify([course.to_dict() for course in user_courses])


# ADMIN add a course to database
@course_routes.route("/admin", methods=["POST"])
@login_required
def add_course_to_database(user_id):
    # Check if the current user is the admin
    if current_user.full_name != "Shawn Norbert":
        return jsonify({"msg": "Unauthorized - Only admin can add courses"}), 403

    course_name = request.json.get("course_name")
    course = Course.query.filter_by(course_name=course_name).first()

    if course:
        user = User.query.get(user_id)
        user.courses.append(course)
        db.session.commit()
        return jsonify(course.to_dict())

    return jsonify({"msg": "Course not found"}), 404


# user add course to user
@course_routes.route("/<user_id>", methods=["POST"])
@login_required
def add_course_to_user(user_id):
    # Verify the logged-in user matches the requested user_id
    if str(current_user.id) != str(user_id):
        return (
            jsonify(
                {"msg": "Unauthorized - You can only add courses to your own account"}
            ),
            403,
        )

    user = User.query.get(user_id)
    course_name = request.json.get("course_name")

    course = Course.query.filter_by(course_name=course_name).first()

    if course:
        user.courses.append(course)
        db.session.commit()
        return jsonify(course.to_dict())

    return jsonify({"msg": "Course not found"}), 404


# delete a course from user
@course_routes.route("/<user_id>/<course_id>", methods=["DELETE"])
@login_required
def delete_course_from_user(user_id, course_id):
    # Verify the logged-in user matches the requested user_id
    if str(current_user.id) != str(user_id):
        return (
            jsonify({"msg": "Unauthorized - You can only delete your own courses"}),
            403,
        )

    user = User.query.get(user_id)
    course = Course.query.get(course_id)

    if course and course in user.courses:
        user.courses.remove(course)
        db.session.commit()
        return jsonify({"msg": "Course successfully deleted"})

    return (
        jsonify({"msg": "Course not found or user does not have this course"}),
        404,
    )  ## SCALE ENDPOINT


## SCALE ENDPOINT


# get all scales
@scale_routes.route("/")
@login_required
def scales():

    all_scales = db.session.query(Scale)
    result_list = []

    for scale in all_scales:
        new_scale = scale.to_dict()
        result_list.append(new_scale)

    return jsonify(result_list)


# get scale by signature
@scale_routes.route("/<signature>")
@login_required
def get_scale_by_signature(signature):
    # Query all scales with matching signature instead of just first one
    scales = db.session.query(Scale).filter_by(signature=signature).all()

    if scales:
        return jsonify([scale.to_dict() for scale in scales])

    return jsonify({"msg": "No scales found with that signature"}), 404


# get scale by root
@scale_routes.route("/root/<root>")
@login_required
def get_scale_by_root(root):
    scales = db.session.query(Scale).filter_by(root=root).all()

    if scales:
        return jsonify([scale.to_dict() for scale in scales])

    return jsonify({"msg": "No scales found with that root"}), 404


# get scale by type
@scale_routes.route("/type/<type>")
@login_required
def get_scale_by_type(type):
    scales = db.session.query(Scale).filter_by(type=type).all()

    if scales:
        return jsonify([scale.to_dict() for scale in scales])

    return jsonify({"msg": "No scales found with that type"}), 404


## CHORD ENDPOINT
# get all chords
@chord_routes.route("/")
@login_required
def get_all_chords():
    all_chords = db.session.query(Chord)
    result_list = []

    for chord in all_chords:
        new_chord = chord.to_dict()
        result_list.append(new_chord)

    return jsonify(result_list)


# get chord by root
@chord_routes.route("/root/<chord_family>")
@login_required
def get_chord_by_name(chord_family):
    chords = db.session.query(Chord).filter_by(chord_family=chord_family).all()
    if chords:
        return jsonify([chord.to_dict() for chord in chords])
    return jsonify({"msg": "No chords found with that name"}), 404


# ADMIN add a chord to database
@chord_routes.route("/admin", methods=["POST"])
@login_required
def add_chord_to_database():
    if current_user.full_name != "Shawn Norbert":
        return jsonify({"msg": "Unauthorized - Only admin can add chords"}), 403

    chord_data = request.json
    new_chord = Chord(**chord_data)
    db.session.add(new_chord)
    db.session.commit()
    print('new Chord added:', new_chord.chord_family)
    return jsonify(new_chord.to_dict())


## PROGRESSION ENDPOINT


@progression_routes.route("/")
def progressions():
    return "This is the progression endpoint"


## KEY ENDPOINT


@key_routes.route("/")
def keys():
    return "This is the key endpoint"
