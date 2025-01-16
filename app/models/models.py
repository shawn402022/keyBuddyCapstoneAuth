from __future__ import annotations
from typing import List
from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from .db import db, environment, SCHEMA
from datetime import datetime
from .db import add_prefix_for_prod




##JOIN TABLES
user_courses = db.Table(
    'user_courses',
    db.Model.metadata,
    db.Column("courses_id",
    db.Integer,db.ForeignKey(add_prefix_for_prod("courses.id")), primary_key=True),
    db.Column("users_id", db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True)
)

course_reviews = db.Table(
    'course_reviews',
    db.Model.metadata,
    db.Column("review_id", db.Integer,db.ForeignKey(add_prefix_for_prod("reviews.id")), primary_key=True),
    db.Column("course_id", db.Integer,db.ForeignKey(add_prefix_for_prod("courses.id")), primary_key=True)
)

course_lessons = db.Table(
    'course_lessons',
    db.Model.metadata,
    db.Column("lesson_id", db.Integer,db.ForeignKey(add_prefix_for_prod("lessons.id")), primary_key=True),
    db.Column("course_id", db.Integer,db.ForeignKey(add_prefix_for_prod("courses.id")), primary_key=True)
)

lesson_keys = db.Table(
    "lesson_keys",
    db.Model.metadata,
    db.Column("key_id", db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id")), primary_key=True),
    db.Column("lesson_id", db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), primary_key=True)
)

song_keys = db.Table(
    "song_keys",
    db.Model.metadata,
    db.Column("key_id", db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id")), primary_key=True),
    db.Column("song_id", db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), primary_key=True)
)


lesson_songs = db.Table(
    "lesson_songs",
    db.Model.metadata,
    db.Column("song_id", db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False, primary_key=True),
    db.Column("lesson_id", db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), primary_key=True)
)

lesson_chords = db.Table(
    "lesson_chords",
    db.Model.metadata,
    db.Column("chord_id", db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id")), primary_key=True),
    db.Column("lesson_id", db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), primary_key=True),
    db.UniqueConstraint('chord_id', 'lesson_id', name='unique_lesson_chord')
)

lesson_progressions = db.Table(
    "lesson_progressions",
    db.Model.metadata,
    db.Column("progression_id", db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id")), primary_key=True),
    db.Column("lesson_id", db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), primary_key=True)
)

song_chords = db.Table(
    "song_chords",
    db.Model.metadata,
    db.Column("chord_id", db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id")),  primary_key=True),
    db.Column("song_id", db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")),  primary_key=True)
)

song_progressions = db.Table(
    "song_progressions",
    db.Model.metadata,
    db.Column("progression_id", db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id")), primary_key=True),
    db.Column("song_id", db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), primary_key=True)
)




##REGULAR TABLES
# Course Model
class Course(db.Model):
    __tablename__ = "courses"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    course_key = db.Column(db.String(50), nullable=False, unique=False)
    details_of_course = db.Column(db.String(1000),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    lessons = db.relationship('Lesson', secondary=course_lessons, back_populates="courses")
    reviews = db.relationship('Review', secondary=course_reviews, back_populates="courses")
    users = db.relationship('User', secondary=user_courses, back_populates="courses")

    def to_dict(self):
        return {
            "id": self.id,
            "course_key": self.course_key,
            "details_of_course": self.details_of_course,
            "lessons": [l.to_dict() for l in self.lessons],
            "reviews": [r.to_dict() for r in self.reviews],
            "users": [u.to_dict() for u in self.users]
        }

# User Model
class User(db.Model):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    courses = db.relationship('Course', secondary=user_courses, back_populates="users")


    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "courses": [c.to_dict() for c in self.courses],
            "reviews": [r.to_dict() for r in self.reviews]

        }

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reviewer_name = db.Column(db.String(40),  nullable=True)
    course_reviewed = db.Column(db.String(500), nullable=True)
    review_content = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    # relationships
    courses = (db.relationship('Course', secondary=course_reviews, back_populates="reviews"))


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.reviewer_name,
            'course_reviewed': self.course_reviewed,
            'review_content': self.review_content,
            'courses': [cr.to_dict() for cr in self.courses],
            "user" : [u.to_dict() for u in self.users]
        }

class Lesson(db.Model):
    __tablename__ = 'lessons'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(20), nullable=True)
    pulls_to = db.Column(db.String(100), nullable=True)
    pulls_from = db.Column(db.String(40), nullable=True)
    notes = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    chords = db.relationship('Chord',secondary=lesson_chords, back_populates="lessons")
    courses = db.relationship('Course',secondary=course_lessons, back_populates="lessons")
    keys = db.relationship('Key',secondary=lesson_keys, back_populates="lessons")
    progressions = db.relationship('Progression',secondary=lesson_progressions, back_populates="lessons")
    songs = db.relationship('Song',secondary=lesson_songs, back_populates="lessons")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "type": self.type,
            "key": self.key,
            "pulls_to": self.pulls_to,
            "pulls_from": self.pulls_from,
            "notes": self.notes,
            "songs_used": self.songs_used,
            "chords": [lc.to_dict() for lc in self.chords],
            "courses": [cl.to_dict() for cl in self.courses],
            "keys": [lk.to_dict() for lk in self.keys],
            "progressions": [lp.to_dict() for lp in self.progressions],
            "songs": [ls.to_dict() for ls in self.songs]

        }

class Chord(db.Model):
    __tablename__ = 'chords'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    chord_name = db.Column(db.String(50), unique=False, nullable=True)
    notes = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    songs = db.relationship('Song', secondary=song_chords, back_populates="chords")
    lessons = db.relationship('Lesson', secondary=lesson_chords,  back_populates="chords")

    def to_dict(self):
        return {
            "id": self.id,
            "chord_name": self.chord_name,
            "notes": self.notes,
            "songs": [sc.to_dict() for sc in self.songs],
            "lessons": [ll.to_dict() for ll in self.lessons]
        }

class Progression(db.Model):
    __tablename__ = 'progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progression_name = db.Column(db.String(50), unique=False, nullable=True)
    progression_type = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    #relationships
    lessons = db.relationship('Lesson',secondary=lesson_progressions,  back_populates="progressions")
    songs = db.relationship('Song', secondary=song_progressions, back_populates="progressions")


    def to_dict(self):
        return {
            "id": self.id,
            "progression_name": self.progression_name,
            "lessons": [lp.to_dict() for lp in self.lessons],
            "songs": [sp.to_dict() for sp in self.songs],
            "progression_type": self.progression_type,

        }

class Key(db.Model):
    __tablename__ = 'keys'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    key_name = db.Column(db.String(50), unique=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    #relationships
    lessons = db.relationship('Lesson', secondary=lesson_keys, back_populates="keys")
    songs = db.relationship('Song', secondary=song_keys, back_populates="keys")

    def to_dict(self):
        return {
            "id": self.id,
            "key_name": self.key_name,
            "lessons": [lk.to_dict() for lk in self.lessons],
            "songs": [sk.to_dict() for sk in self.songs]
        }

class Song(db.Model):
    __tablename__ = 'songs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    song_key = db.Column(db.String(40), nullable=True)
    song = db.Column(db.String(100), nullable=True)
    artist = db.Column(db.String(40), nullable=True)
    chords_used = db.Column(db.String(40), nullable=True)
    progression_used = db.Column(db.String(40), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    keys = db.relationship('Key', secondary = song_keys, back_populates="songs")
    progressions = db.relationship('Progression', secondary=song_progressions,  back_populates="songs")
    chords = db.relationship('Chord', secondary=song_chords,  back_populates="songs")
    lessons = db.relationship('Lesson', secondary=lesson_songs,  back_populates="songs")

    def to_dict(self):
        return {
            "id": self.id,
            "song_key": self.song_key,
            "song": self.song,
            "artist": self.artist,
            "chords_used": self.chords_used,
            "progression_used": self.progression_used,
            "keys": [sk.to_dict() for sk in self.keys],
            "progressions": [sp.to_dict() for sp in self.progressions],
            "chords": [sc.to_dict() for sc in self.chords],
            "lessons": self.lesson.to_dict() if self.lesson else None
        }
