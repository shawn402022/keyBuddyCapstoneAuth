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

user_course = db.Table(
    'users',
    db.Model.metadata,
    db.Column("courses_id", db.Integer,db.ForeignKey(add_prefix_for_prod("courses.id")), primary_key=True),
    db.Column("users_id", db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True)
)


##JOIN TABLES
class UserCourse(db.Model):
    __tablename__ = 'user_courses'


    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id")), primary_key=True,  nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True,  nullable=False)
    extra_data = db.Column(db.String)
    course = db.relationship('Course', back_populates='users')
    user = db.relationship('User', back_populates='courses')

class CourseReview(db.Model):
    __tablename__ = "course_reviews"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("reviews.id")), primary_key=True, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id")), primary_key=True, nullable=False)
    extra_data = db.Column(db.String)
    review = db.relationship('Review', back_populates='courses')
    course = db.relationship('Course', back_populates='reviews')

class CourseLesson(db.Model):
    __tablename__ = "course_lessons"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), nullable=False, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id")), nullable=False, primary_key=True)
    extra_data = db.Column(db.String)
    lesson = db.relationship('Lesson', back_populates="courses")
    course = db.relationship('Course', back_populates="lessons")

class LessonKey(db.Model):
    __tablename__ = "lesson_keys"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    key_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id")), nullable=False, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), nullable=False, primary_key=True)
    extra_data = db.Column(db.String)
    key = db.relationship('Key', back_populates='lessons')
    lesson = db.relationship('Lesson', back_populates='keys')


class LessonSong(db.Model):
    __tablename__ = "lesson_songs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), nullable=False, primary_key=True)
    except_data = db.Column(db.String)
    song = db.relationship('Song', back_populates='lessons')
    lesson = db.relationship('Lesson', back_populates='songs')


class LessonChord(db.Model):
    __tablename__ = "lesson_chords"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id")), nullable=False, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), nullable=False, primary_key=True)
    except_data = db.Column(db.String)
    chord = db.relationship('Chord', back_populates='lessons')
    lesson = db.relationship('Lesson', back_populates='chords')


class LessonProgression(db.Model):
    __tablename__ = "lesson_progressions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id")), nullable=False, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), nullable=False, primary_key=True)
    extra_data = db.Column(db.String)
    progression = db.relationship('Progression', back_populates='lessons')
    lesson = db.relationship('Lesson', back_populates='progressions')


class SongKey(db.Model):
    __tablename__ = "song_keys"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    key_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id")), nullable=False, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False, primary_key=True)
    extra_data = db.Column(db.String)
    key = db.relationship('Key', back_populates='songs')
    song = db.relationship('Song', back_populates='keys')


class SongChord(db.Model):
    __tablename__ = "song_chords"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id")), nullable=False, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False, primary_key=True)
    extra_data = db.Column(db.String)
    song = db.relationship('Song', back_populates='chords')
    chord = db.relationship('Chord', back_populates='songs')


class SongProgression(db.Model):
    __tablename__ = "song_progressions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id")), nullable=False, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False, primary_key=True)
    except_data = db.Column(db.String)
    progression = db.relationship('Progression', back_populates='songs')
    song = db.relationship('Song', back_populates='progressions')

##REGULAR TABLES
class Course(db.Model):
    __tablename__ = "courses"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(50), unique=True, nullable=False)
    details_of_course = db.Column(db.String(1000), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    lessons = (db.relationship( 'CourseLesson',back_populates="course"))
    reviews = (db.relationship( 'CourseReview', back_populates="course"))
    #users = (db.relationship( 'UserCourse', back_populates="course"))
    users = db.relationship('User', secondary= user_course, back_populates="courses")

    def to_dict(self):
        return {
            "id": self.id,
            "course_name": self.course_name,
            "details_of_course": self.details_of_course,
            "lessons": [l.to_dict() for l in self.lessons],
            "users": [uc.to_dict() for uc in self.users],
            "reviews": [cr.to_dict() for cr in self.reviews]

        }

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

    #relationships
    #courses = (db.relationship('UserCourse', back_populates="user"))
    courses = db.relationship('Course', secondary=user_course, back_populates="users")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "courses": [uc.to_dict() for uc in self.courses]
        }

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    review_title = db.Column(db.String(40), nullable=False)
    review = db.Column(db.String(500), nullable=False)
    published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    # relationships
    courses = (db.relationship('CourseReview', back_populates="review"))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.review_title,
            'content': self.review,
            'published': self.published,
            'courses': [cr.to_dict() for cr in self.courses]
        }

class Lesson(db.Model):
    __tablename__ = 'lessons'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    type = db.Column(db.String(255), nullable=False)
    key = db.Column(db.String(255), unique=True, nullable=False)
    pulls_to = db.Column(db.String(100), nullable=True)
    pulls_from = db.Column(db.String(40), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    chords = (db.relationship('LessonChord', back_populates="lesson"))
    courses = (db.relationship('CourseLesson', back_populates="lesson"))
    keys = (db.relationship('LessonKey', back_populates="lesson"))
    progressions = (db.relationship('LessonProgression', back_populates="lesson"))
    songs = (db.relationship('LessonSong', back_populates="lesson"))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "key": self.key,
            "pulls_to": self.pulls_to,
            "pulls_from": self.pulls_from,
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
    chord_name = db.Column(db.String(50), unique=True, nullable=False)
    chord_key = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    songs = (db.relationship('SongChord', back_populates="chord"))
    lessons = (db.relationship('LessonChord', back_populates="chord"))

    def to_dict(self):
        return {
            "id": self.id,
            "chord_name": self.chord_name,
            "lessons": [lc.to_dict() for lc in self.lessons],
            "songs": [sc.to_dict() for sc in self.songs],
            "chord_key": self.chord_key,
            "notes": self.notes
        }

class Progression(db.Model):
    __tablename__ = 'progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progression_name = db.Column(db.String(50), unique=True, nullable=False)
    progression_type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    #relationships
    lessons = (db.relationship('LessonProgression', back_populates="progression"))
    songs = (db.relationship('SongProgression', back_populates="progression"))


    def to_dict(self):
        return {
            "id": self.id,
            "progression_name": self.progression_name,
            "lessons": [lp.to_dict() for lp in self.lessons],
            "songs": [sp.to_dict() for sp in self.songs],
            "progression_type": self.progression_type
        }

class Key(db.Model):
    __tablename__ = 'keys'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    key_name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    #relationships
    lessons = (db.relationship('LessonKey', back_populates="key"))
    songs = (db.relationship('SongKey', back_populates="key"))

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
    song_key = db.Column(db.String(40), nullable=False)
    song = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(40), nullable=False)
    chords_used = db.Column(db.String(40), nullable=False)
    progression_used = db.Column(db.String(40), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    keys = (db.relationship('SongKey', back_populates="song"))
    progressions = (db.relationship('SongProgression', back_populates="song"))
    chords = (db.relationship('SongChord', back_populates="song"))
    lessons = (db.relationship('LessonSong', back_populates="song"))

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
