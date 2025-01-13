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



class LessonKey(db.Model):
    __tablename__ = 'lesson_keys'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    key_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id")),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")),  nullable=False)
    extra_data = db.Column(db.String)
    key = db.relationship('Key', back_populates='lessons')
    lesson = db.relationship('Lesson', back_populates='keys')

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    keys = (db.relationship('LessonKey', back_populates="lesson"))

class Key(db.Model):
    __tablename__ = 'keys'
    id = db.Column(db.Integer, primary_key=True)
    lessons = (db.relationship('LessonKey', back_populates="key"))




    
"""
class LessonKey(db.Model):
    __tablename__ = 'lesson_keys'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    key_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id"), ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id"), ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    # relationships
    keys = db.relationship('Key', back_populates='lesson_keys')
    lessons = db.relationship('Lesson', back_populates='lesson_keys')



    def to_dict(self):
        return {
            "id": self.id,
            "key_id": self.key_id,
            "lesson_id": self.lesson_id,
            "keys": [key.to_dict() for key in self.keys],
            "lessons": [lesson.to_dict() for lesson in self.lessons]

        }
"""
