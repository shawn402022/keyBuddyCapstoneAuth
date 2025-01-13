from __future__ import annotations
from typing import List
from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA



class LessonChord(db.Model):
    __tablename__ = 'lesson_chords'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id")),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")),   nullable=False)
    extra_data = db.Column(db.String)
    chord = db.relationship('Chord', back_populates='lessons')
    lessons = db.relationship('Lesson', back_populates='lessons')

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    chords = (db.relationship('LessonChord', back_populates="lesson"))

class Chord(db.Model):
    __tablename__ = 'chords'
    id = db.Column(db.Integer, primary_key=True)
    lessons = (db.relationship('LessonChord', back_populates="chord"))








"""

class LessonChord(db.Model):
    __tablename__ = 'lesson_chords'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id"), ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id"), ondelete="CASCADE"),   nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    chords = db.relationship('Chord', back_populates='lesson_chord_models')
    lessons = db.relationship('Lesson', back_populates='lesson_chord_models')


    def to_dict(self):
        return {
            "id": self.id,
            "chord_id": self.chord_id,
            "lesson_id": self.lesson_id,
            "chords": [chord.to_dict() for chord in self.chords],
            "lessons": [lesson.to_dict() for lesson in self.lessons]

        }
"""
