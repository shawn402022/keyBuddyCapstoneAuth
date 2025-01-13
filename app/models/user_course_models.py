from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA








"""

class UserCourse(db.Model):
    __tablename__ = 'user_courses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"),  nullable=False)
    course_id = db.Column( db.Integer, db.ForeignKey(add_prefix_for_prod("courses.id"), ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # Add relationships
    users = db.relationship('User', back_populates='user_courses')
    courses = db.relationship('Course', back_populates='user_courses')



    # Create a method to spit out a dictionary version of the course object for JSON serialization


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "course_id": self.course_id,
            "users": [user.to_dict() for user in self.users],
            "courses": [course.to_dict() for course in self.courses]
        }
"""
