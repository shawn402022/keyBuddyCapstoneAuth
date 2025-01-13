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
from .db import db,environment, SCHEMA



class LessonProgression(db.Model):
    __tablename__ = 'lesson_progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id")),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")),  nullable=False)
    extra_data = db.Column(db.String)
    progression = db.relationship('Progression', back_populates='lessons')
    lesson = db.relationship('Lesson', back_populates='progressions')

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    progressions = (db.relationship('LessonProgression', back_populates="lesson"))

class Progression(db.Model):
    __tablename__ = 'progressions'
    id = db.Column(db.Integer, primary_key=True)
    lessons = (db.relationship('LessonProgression', back_populates="progression"))


"""
class LessonProgression(db.Model):
    __tablename__ = 'lesson_progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id"), ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id"), ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    #relationships
    lessons = db.relationship('Lesson', back_populates='lesson_progression_models')
    progressions = db.relationship('Progression', back_populates='lesson_progression_models')


    def to_dict(self):
        return {
            "id": self.id,
            "progression_id": self.progression_id,
            "lesson_id": self.lesson_id,
            "lessons": [lesson.to_dict() for lesson in self.lessons],
            "progressions": [progression.to_dict() for progression in self.progressions]

        }
"""
