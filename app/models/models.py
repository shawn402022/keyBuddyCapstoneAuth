from __future__ import annotations
from typing import List
from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)



##JOIN TABLES
user_courses = db.Table(
    "user_courses",
    db.Model.metadata,
    db.Column(
        "courses_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("courses.id")),
        primary_key=True,
    ),
    db.Column(
        "users_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True,
    ),
)

song_keys = db.Table(
    "song_keys",
    db.Model.metadata,
    db.Column(
        "key_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("keys.id")),
        primary_key=True,
    ),
    db.Column(
        "song_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("songs.id")),
        primary_key=True,
    ),
)



song_chords = db.Table(
    "song_chords",
    db.Model.metadata,
    db.Column(
        "chord_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("chords.id")),
        primary_key=True,
    ),
    db.Column(
        "song_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("songs.id")),
        primary_key=True,
    ),
)

song_progressions = db.Table(
    "song_progressions",
    db.Model.metadata,
    db.Column(
        "progression_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("progressions.id")),
        primary_key=True,
    ),
    db.Column(
        "song_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("songs.id")),
        primary_key=True,
    ),
)


##REGULAR TABLES
# Course Model
class Course(db.Model):
    __tablename__ = "courses"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(255), nullable=False)
    details_of_course = db.Column(db.String(1000), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships

    users = db.relationship("User", secondary=user_courses, back_populates="courses")

    def to_dict(self):
        return {
            "id": self.id,
            "course_name": self.course_name,
            "details_of_course": self.details_of_course,
        }


# User Model
class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    courses = db.relationship("Course", secondary=user_courses, back_populates="users")

    @property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
        }

    def check_password(self, password):
        """Check hashed password against provided password"""
        return check_password_hash(self.password_hash, password)


class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reviewer_name = db.Column(db.String(40), nullable=True)
    review_content = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships


    def to_dict(self):
        return {
            "id": self.id,
            "reviewer_name": self.reviewer_name,
            "review_content": self.review_content,
        }


class Scale(db.Model):
    __tablename__ = "scales"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(255), unique=False, nullable=True)
    signature = db.Column(db.String(255), nullable=True)
    root = db.Column(db.String(5), nullable=True)
    flats = db.Column(db.Integer, nullable=True)
    sharps = db.Column(db.Integer, nullable=True)
    pulls_to = db.Column(db.String(255), nullable=True)
    pulls_from = db.Column(db.String(255), nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships




    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "signature": self.signature,
            "root": self.root,
            "flats": self.flats,
            "sharps": self.sharps,
            "pulls_to": self.pulls_to,
            "pulls_from": self.pulls_from,
        }


class Chord(db.Model):
    __tablename__ = "chords"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    chord_family = db.Column(db.String(50), unique=False, nullable=True)
    chord_name = db.Column(db.String(50), unique=False, nullable=True)
    notes = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships
    songs = db.relationship("Song", secondary=song_chords, back_populates="chords")


    def to_dict(self):
        return {
            "id": self.id,
            "chord_family": self.chord_family,
            "chord_name": self.chord_name,
            "notes": self.notes
            }


class Progression(db.Model):
    __tablename__ = "progressions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progression_name = db.Column(db.String(50), unique=False, nullable=True)
    progression_type = db.Column(db.String(50), nullable=True)
    progression_style = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships

    songs = db.relationship(
        "Song", secondary=song_progressions, back_populates="progressions"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "progression_name": self.progression_name,
            "progression_type": self.progression_type,
            "progression_style": self.progression_style,
        }


class Key(db.Model):
    __tablename__ = "keys"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    key_name = db.Column(db.String(50), unique=False, nullable=False)
    key_description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships

    songs = db.relationship("Song", secondary=song_keys, back_populates="keys")

    def to_dict(self):
        return {
            "id": self.id,
            "key_name": self.key_name,
            "key_description": self.key_description,
}


class Song(db.Model):
    __tablename__ = "songs"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    song_key = db.Column(db.String(40), nullable=True)
    song = db.Column(db.String(100), nullable=True)
    artist = db.Column(db.String(40), nullable=True)
    chords_used = db.Column(db.String(40), nullable=True)
    progression_used = db.Column(db.String(40), nullable=True)
    description = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # relationships
    keys = db.relationship("Key", secondary=song_keys, back_populates="songs")
    progressions = db.relationship(
        "Progression", secondary=song_progressions, back_populates="songs"
    )
    chords = db.relationship("Chord", secondary=song_chords, back_populates="songs")


    def to_dict(self):
        return {
            "id": self.id,
            "song_key": self.song_key,
            "song": self.song,
            "artist": self.artist,
            "chords_used": self.chords_used,
            "progression_used": self.progression_used,
            "description": self.description
        }
