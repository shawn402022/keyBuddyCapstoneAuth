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






class CourseLesson(db.Model):
    __tablename__ = "course_lessons"
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id")), nullable=False, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id")), nullable=False, primary_key=True)
    extra_data = db.Column(db.String)
    lesson = db.relationship('Lesson', back_populates="courses")
    course = db.relationship('Course',back_populates="lessons")


class Course(db.Model):
    __tablename__ = "courses"
    id = db.Column(db.Integer,primary_key=True)
    lessons = (db.relationship( 'CourseLesson',back_populates="course"))


class Lesson(db.Model):
    __tablename__ = "lessons"
    id = db.Column(db.Integer,primary_key=True)
    courses = (db.relationship('CourseLesson', back_populates="lesson"))
