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


song_routes = Blueprint("song", __name__, url_prefix="/song")
scale_routes = Blueprint("scale", __name__, url_prefix="/scale")
review_routes = Blueprint("review", __name__, url_prefix="/review")
course_routes = Blueprint("course", __name__, url_prefix="/course")
chord_routes = Blueprint("chord", __name__, url_prefix="/chord")
progression_routes = Blueprint("progression", __name__, url_prefix="/progression")
key_routes = Blueprint("key", __name__, url_prefix="/key")
chord_image_routes = Blueprint("chord_image", __name__, url_prefix="/chord-image")


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
        all_songs = db.session.query(Song).filter(Song.song_key.startswith(song_key))
        result_list = []
        print("Backend song_key:", song_key)  # Debug log

        for song in all_songs:
            new_song = song.to_dict()
            result_list.append(new_song)
        print("Backend results:", result_list)  # Debug log
        return jsonify(result_list)
    return jsonify({"msg": "No songs in this key"})


# ADMIN create a song
@song_routes.route("/admin", methods=["POST"])
@login_required
def create_song():
    # Check if the current user is authorized
    if current_user.full_name.strip() != "Admin User":
        print(f"User full name: '{current_user.full_name}'")
        return jsonify({"msg": "Unauthorized - Only     Admin can add songs"}), 403

    song_data = request.json

    new_song = Song(
        song_key=song_data.get("song_key"),
        song=song_data.get("song"),
        artist=song_data.get("artist"),
        chords_used=song_data.get("chords_used"),
        progression_used=song_data.get("progression_used"),
        description=song_data.get("description"),
    )

    db.session.add(new_song)
    db.session.commit()
    return jsonify(new_song.to_dict())


# ADMIN update a song
@song_routes.route("/admin/<song_id>", methods=["PATCH"])
@login_required
def update_song(song_id):
    if current_user.full_name != "Admin User":
        return jsonify({"msg": "Unauthorized - Only     Admin can update songs"}), 403

    song = db.session.query(Song).get(song_id)
    data = request.json

    if song:
        song.song_key = data.get("song_key", song.song_key)
        song.song = data.get("song", song.song)
        song.artist = data.get("artist", song.artist)
        song.chords_used = data.get("chords_used", song.chords_used)
        song.progression_used = data.get("progression_used", song.progression_used)
        song.description = data.get("description", song.description)

        db.session.commit()
        return jsonify(song.to_dict())

    return jsonify({"msg": "Song not found"}), 404


# ADMIN delete a song
@song_routes.route("/admin/<song_id>", methods=["DELETE"])
@login_required
def delete_song(song_id):

    if current_user.full_name != "Admin User":
        return jsonify({"msg": "Unauthorized - Only     Admin can add songs"}), 403

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
@review_routes.route("/create", methods=["POST"])
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
        # Check if the current user isAdmin Demo
        if current_user.full_name == "Admin User":
            db.session.delete(review)
            db.session.commit()
            return jsonify({"msg": "Review successfully deleted"})
        return (
            jsonify({"msg": "Unauthorized - Only Admin can delete reviews"}),
            403,
        )

    return jsonify({"msg": "Review not found"}), 404


## COURSE ENDPOINT
@course_routes.before_request
def ensure_json():
    if not request.is_json:
        return jsonify({"msg": "Invalid content type"}), 400


# ADMIN delete a course from admin
@course_routes.route("/admin/delete/<course_id>", methods=["DELETE"])
@login_required
def delete_course_from_admin(course_id):
    try:
        if current_user.full_name != "Admin User":
            return jsonify({"msg": "Unauthorized"}), 403
        course = Course.query.get(course_id)
        if course:
            stmt = user_courses.delete().where(user_courses.c.courses_id == course_id)
            db.session.execute(stmt)
            db.session.delete(course)
            db.session.commit()
            return jsonify({"msg": "Success"})
        return jsonify({"msg": "Not found"}), 404
    except Exception as e:
        return jsonify({"msg": str(e)}), 500


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


# ADMIN add a course to database
@course_routes.route("/admin", methods=["POST"])
@login_required
def add_course_to_database():
    # Check if the current user is the admin
    if current_user.full_name != "Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can add courses"}), 403

    course_data = request.json
    new_course = Course(**course_data)
    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.to_dict())


# ADMIN edit a course from admin
@course_routes.route("/admin/<course_id>", methods=["PUT"])
@login_required
def edit_course_from_admin(course_id):
    # Verify admin user
    if current_user.full_name != "Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can edit courses"}), 403

    course = Course.query.get(course_id)

    if course:
        # Get data from request
        course_data = request.json

        # Update course fields
        if "course_name" in course_data:
            course.course_name = course_data["course_name"]
        if "details_of_course" in course_data:
            course.details_of_course = course_data["details_of_course"]

        db.session.commit()
        return jsonify(course.to_dict())

    return jsonify({"msg": "Course not found"}), 404


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
    return jsonify(
        {
            "full_name": current_user.full_name,
            "courses": [course.to_dict() for course in user_courses],
        }
    )


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
    )


## SCALE ENDPOINT


# get all scales
@scale_routes.route("/")
@login_required
def scales():

    all_scales = db.session.query(Scale)
    result_list = []

    for scale in all_scales:
        new_scale = scale.to_dict()
        new_scale["notes"] = scale.notes
        result_list.append(new_scale)

    return jsonify(result_list)


# get scale by signature
@scale_routes.route("/<signature>")
@login_required
def get_scale_by_signature(signature):
    # Query all scales with matching signature instead of just first one
    scales = db.session.query(Scale).filter_by(signature=signature).all()

    if scales:
        return jsonify([{**scale.to_dict(), "notes": scale.notes} for scale in scales])

    return jsonify({"msg": "No scales found with that signature"}), 404


# get scale by root
@scale_routes.route("/root/<root>")
@login_required
def get_scale_by_root(root):
    scales = db.session.query(Scale).filter_by(root=root).all()

    if scales:
        return jsonify([{**scale.to_dict(), "notes": scale.notes} for scale in scales])

    return jsonify({"msg": "No scales found with that root"}), 404


# get scale by type
@scale_routes.route("/type/<type>")
@login_required
def get_scale_by_type(type):
    scales = db.session.query(Scale).filter_by(type=type).all()

    if scales:
        return jsonify([{**scale.to_dict(), "notes": scale.notes} for scale in scales])

    return jsonify({"msg": "No scales found with that type"}), 404


# ADMIN add a scale to database
@scale_routes.route("/admin", methods=["POST"])
@login_required
def add_scale_to_database():
    if current_user.full_name != " Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can add scales"}), 403

    scale_data = request.json
    new_scale = Scale(
        **scale_data,
    )
    db.session.add(new_scale)
    db.session.commit()
    return jsonify(new_scale.to_dict(), scale_data["notes"])


# ADMIN update a scale in database
@scale_routes.route("/admin/<scale_id>", methods=["PUT"])
@login_required
def update_scale_in_database(scale_id):
    if current_user.full_name != "Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can update scales"}), 403

    scale = Scale.query.get(scale_id)
    if not scale:
        return jsonify({"msg": "Scale not found"}), 404

    updated_scale_data = request.json

    # Update individual attributes
    if "name" in updated_scale_data:
        scale.name = updated_scale_data["name"]
    if "type" in updated_scale_data:
        scale.type = updated_scale_data["type"]
    if "signature" in updated_scale_data:
        scale.signature = updated_scale_data["signature"]
    if "root" in updated_scale_data:
        scale.root = updated_scale_data["root"]
    if "flats" in updated_scale_data:
        scale.flats = updated_scale_data["flats"]
    if "sharps" in updated_scale_data:
        scale.sharps = updated_scale_data["sharps"]
    if "pulls_to" in updated_scale_data:
        scale.pulls_to = updated_scale_data["pulls_to"]
    if "pulls_from" in updated_scale_data:
        scale.pulls_from = updated_scale_data["pulls_from"]
    if "notes" in updated_scale_data:
        scale.notes = updated_scale_data["notes"]

    db.session.commit()
    return jsonify({**scale.to_dict(), "notes": scale.notes})


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
    if current_user.full_name != "Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can add chords"}), 403

    chord_data = request.json
    new_chord = Chord(**chord_data)
    db.session.add(new_chord)
    db.session.commit()
    print("new Chord added:", new_chord.chord_family)
    return jsonify(new_chord.to_dict())


# ADMIN update a chord in database
@chord_routes.route("/admin/<chord_id>", methods=["PUT"])
@login_required
def update_chord_in_database(chord_id):
    if current_user.full_name != " Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can update chords"}), 403

    chord = Chord.query.get(chord_id)

    if chord:
        if "chord_family" in request.json:
            chord.chord_family = request.json["chord_family"]
        if "chord_name" in request.json:
            chord.chord_name = request.json["chord_name"]
        if "notes" in request.json:
            chord.notes = request.json["notes"]

        print("Chord updated:", chord.chord_family)
        db.session.commit()
        return jsonify(chord.to_dict())

    return jsonify({"msg": "Chord not found"}), 404


# ADMIN delete a chord from database
@chord_routes.route("/admin/<chord_id>", methods=["DELETE"])
@login_required
def delete_chord_from_database(chord_id):
    if current_user.full_name != " Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can delete chords"}), 403

    chord = Chord.query.get(chord_id)

    if chord:
        db.session.delete(chord)
        db.session.commit()
        return jsonify({"msg": "Chord deleted successfully"})

    return jsonify({"msg": "Chord not found"}), 404


@chord_image_routes.route("/save", methods=["POST"])
@login_required  # Optional: if you want to restrict this to logged-in users
def save_chord_image():
    """Save a chord image to the database"""
    try:
        # Get data from request
        data = request.json
        chord_id = data.get("chordId")
        key = data.get("key")
        image_data = data.get("imageData")

        # Remove the data:image/png;base64, prefix if present
        if image_data and "base64," in image_data:
            image_data = image_data.split("base64,")[1]

        # Check if an image for this chord and key already exists
        existing_image = ChordImage.query.filter_by(chord_id=chord_id, key=key).first()

        if existing_image:
            # Update existing image
            existing_image.image_data = image_data
            existing_image.updated_at = datetime.utcnow()
            db.session.commit()
            return jsonify({"success": True, "message": "Image updated successfully"})
        else:
            # Create new image record
            new_image = ChordImage(chord_id=chord_id, key=key, image_data=image_data)
            db.session.add(new_image)
            db.session.commit()
            return jsonify({"success": True, "message": "Image saved successfully"})

    except Exception as e:
        db.session.rollback()
        print(f"Error saving chord image: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@chord_image_routes.route("", methods=["GET"])
def get_chord_images():
    """Get chord images filtered by key"""
    try:
        # Get key from query parameters
        key = request.args.get("key")

        if not key:
            return (
                jsonify({"success": False, "error": "Key parameter is required"}),
                400,
            )

        # Query images for the specified key
        images = ChordImage.query.filter_by(key=key).all()

        # Format the response
        result = {
            "success": True,
            "images": [
                {
                    "id": img.id,
                    "chordId": img.chord_id,
                    "key": img.key,
                    "imageData": img.image_data,
                    "width": img.width,
                    "height": img.height,
                }
                for img in images
            ],
        }

        return jsonify(result)

    except Exception as e:
        print(f"Error retrieving chord images: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


## PROGRESSION ENDPOINT


# get all progressions
@progression_routes.route("/")
def progressions():
    all_progressions = db.session.query(Progression)
    result_list = []

    for progression in all_progressions:
        new_progression = progression.to_dict()
        result_list.append(new_progression)

    return jsonify(result_list)


# get  progression by type
@progression_routes.route("/type/<type>")
@login_required
def get_progression_by_type(type):
    print("BEFORE IF")
    if type:
        all_progressions = (
            db.session.query(Progression).filter_by(progression_type=type).all()
        )
        print("AFTER IF")
        result_list = []

        for progression in all_progressions:
            new_progression = progression.to_dict()
            result_list.append(new_progression)

        return jsonify(result_list)
    return jsonify({"msg": "No progressions found with that type"}), 404


# get  progression by style
@progression_routes.route("/style/<style>")
@login_required
def get_progression_by_style(style):
    if style:
        all_progressions = (
            db.session.query(Progression).filter_by(progression_style=style).all()
        )

        result_list = []

        for progression in all_progressions:
            new_progression = progression.to_dict()
            result_list.append(new_progression)

        return jsonify(result_list)
    return jsonify({"msg": "No progressions found with that type"}), 404


# ADMIN add a progression to database
@progression_routes.route("/admin", methods=["POST"])
@login_required
def add_progression_to_database():
    if current_user.full_name != " Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can add progressions"}), 403

    progression_data = request.json
    new_progression = Progression(**progression_data)
    db.session.add(new_progression)
    db.session.commit()
    print("new Progression added:", new_progression.progression_type)
    return jsonify(new_progression.to_dict())


# ADMIN update a progression in database
@progression_routes.route("/admin/<progression_id>", methods=["PUT"])
@login_required
def update_progression_in_database(progression_id):
    if current_user.full_name != " Admin User":
        return (
            jsonify({"msg": "Unauthorized - Only admin can update progressions"}),
            403,
        )

    progression = Progression.query.get(progression_id)

    if progression:
        if "progression_type" in request.json:
            progression.progression_type = request.json["progression_type"]
        if "progression_name" in request.json:
            progression.progression_name = request.json["progression_name"]

        print("Progression updated:", progression.progression_type)
        db.session.commit()
        return jsonify(progression.to_dict())

    return jsonify({"msg": "Progression not found"}), 404


## KEY ENDPOINT


# get all key keys
@key_routes.route("/")
@login_required
def keys():
    all_keys = db.session.query(Key)
    result_list = []

    for key in all_keys:
        new_key = key.to_dict()
        result_list.append(new_key)

    return jsonify(result_list)


# ADMIN update a key in database
@key_routes.route("/admin/<key_id>", methods=["PUT"])
@login_required
def update_key_in_database(key_id):
    if current_user.full_name != " Admin User":
        return jsonify({"msg": "Unauthorized - Only admin can update keys"}), 403

    key = Key.query.get(key_id)

    if key:
        if "key_name" in request.json:
            key.key_name = request.json["key_name"]
        if "key_description" in request.json:
            key.key_description = request.json["key_description"]

        print("Key updated:", key.key_name)
        db.session.commit()
        return jsonify(key.to_dict())

    return jsonify({"msg": "Key not found"}), 404
