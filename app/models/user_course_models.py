from . import db
from datetime import datetime

class UserCourse(db.Model):
    __tablename__ = 'user_courses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"),  nullable=False)
    course_id = db.Column( db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"),  nullable=False)
    published = db.Column(db.Boolean, default=False)
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
            "published": self.published,
            "users": [user.to_dict() for user in self.users],
            "courses": [course.to_dict() for course in self.courses]
        }
