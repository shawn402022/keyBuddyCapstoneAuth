from flask import Blueprint, jsonify, request
from app.models import db
from app.models.user_models import User

bp = Blueprint("user", __name__, url_prefix="/user")

#READ USER
@bp.route("/")
def users():
    # USE THE DB TO QUERY ALL USERS
    all_users = db.session.query(User)
    result_list= []

    #iterate thrrough the users and add their names to the string
    for user in all_users:
        new_user = user.to_dict()
        result_list.append(new_user)

    return jsonify(result_list)

#CREATE USER

@bp.route('/', methods=['POST'])
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

#UPDATE USER

@bp.route("/<user_id>", methods=['PATCH'])
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

        #send back th epdated cat
        return jsonify(user.to_dict())
    return jsonify({'msg': 'User not found'})

#DELETE USER

@bp.route("/<user_id>", methods=['DELETE'])
def delete_user(user_id):
    #query the db to find the user we want to delete
    user = db.session.query(User).get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'msg': 'User deleted'})

    return jsonify({'msg': 'User not found'})
