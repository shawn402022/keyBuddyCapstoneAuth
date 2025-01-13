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



class CourseReview(db.Model):
    __tablename__ = 'course_reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("reviews.id")),  nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id")),  nullable=False)
    extra_data = db.Column(db.String)
    review = db.relationship('Review', back_populates='courses')
    course = db.relationship('Course', back_populates='reviews')


class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    reviews = (db.relationship( 'CourseReview', back_populates="course"))


class Review(db.Model):
    __tablename__ ='reviews'
    id = db.Column(db.Integer, primary_key=True)
    courses = (db.relationship( 'CourseReview', back_populates="review"))
"""
class CourseReview(db.Model):
    __tablename__ = 'course_reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("reviews.id"), ondelete="CASCADE"),  nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id"), ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Add relationships
    reviews = db.relationship('Review', back_populates='course_reviews')
    courses = db.relationship('Course', back_populates='course_reviews')

    def to_dict(self):
        return {
            "id": self.id,
            "review_id": self.review_id,
            "course_id": self.course_id,
            "reviews": [review.to_dict() for review in self.reviews],
            "courses": [course.to_dict() for course in self.courses]
        }
"""
