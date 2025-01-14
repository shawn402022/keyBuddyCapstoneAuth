from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user, login_user, logout_user
from app.models import User, db
from app.forms import LoginForm, SignUpForm


auth_routes = Blueprint('auth', __name__)
user_routes = Blueprint("user", __name__, url_prefix="/user")
users_routes = Blueprint('users', __name__, url_prefix="/users")
song_routes = Blueprint("song", __name__, url_prefix="/song")
lesson_routes = Blueprint("lesson", __name__, url_prefix="/lesson")
review_routes = Blueprint("review", __name__, url_prefix="/review")
course_routes = Blueprint("course", __name__, url_prefix="/course")
chord_routes = Blueprint("chord", __name__, url_prefix="/chord")
progression_routes = Blueprint("progression", __name__, url_prefix="/progression")
key_routes = Blueprint("key", __name__, url_prefix="/key")




## AUTHENTICATION ENDPOINT

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401


## USERS ENDPOINT

# login Users
@users_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

# Read Users by ID
@users_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

# Read User
@user_routes.route("/")
def users():
    # USE THE DB TO QUERY ALL USERS
    all_users = db.session.query(User)
    result_list= []

    #iterate through the users and add their names to the string
    for user in all_users:
        new_user = user.to_dict()
        result_list.append(new_user)

    return jsonify(result_list)

#Create User

@user_routes.route('/', methods=['POST'])
def create_user():
    user_data = request.json


    #use the user model to create a new user
    new_user = User(**user_data)#<--spread the user object in the the user model
    #add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    #return the newly created user in a json format
    return jsonify(new_user.to_dict()), 201
    print(user_data)
    return jsonify(user_data.to_dict())

#Update User

@user_routes.route("/<user_id>", methods=['PATCH'])
def update_user(user_id):
    #query the db to find the user we want to update
    #.get(user_id) is looking for primary key
    user = db.session.query(User).get(user_id)

    if user:
        if 'full_name' in  request.json:
            user.full_name = request.json['full_name']
        if 'email' in request.json:
            user.email = request.json['email']
        if 'password' in request.json:
            user.password = request.json['password']
        if 'username' in request.json:
            user.username = request.json['username']

        #save user into the database
        db.session.commit()

        #send back th updated user
        return jsonify(user.to_dict())
    return jsonify({'msg': 'User not found'})

#Delete Users

@user_routes.route("/<user_id>", methods=['DELETE'])
def delete_user(user_id):
    #query the db to find the user we want to delete
    user = db.session.query(User).get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'msg': 'User deleted'})

    return jsonify({'msg': 'User not found'})

## SONG ENDPOINT

@song_routes.route("/")
def songs():
    return "This is the song endpoint"

## REVIEW ENDPOINT

@review_routes.route("/")
def reviews():
    return "This is the review endpoint"


## COURSE ENDPOINT

@course_routes.route("/")
def courses():
    return "This is the courses endpoint"


## LESSON ENDPOINT

@lesson_routes.route("/")
def lessons():
    return "This is the lesson endpoint"

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


## PROGRESSION ENDPOINT
@progression_routes.route("/")
def progressions():
    return "This is the progression endpoint"


## KEY ENDPOINT
@key_routes.route("/")
def keys():
    return "This is the key endpoint"
