from . import db
from datetime import datetime

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(50), unique=True, nullable=False)
    details_of_course = db.Column(db.String(1000), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    # relationships
    course_reviews = db.relationship('CourseReview', back_populates='courses')
    user_course = db.relationship('UserCourse', back_populates='courses')
    course_lessons = db.relationship('CourseLessons', back_populates='courses')

    def to_dict(self):
        return {
            "id": self.id,
            "course_name": self.course_name,
            "details_of_course": self.details_of_course,
            "course_reviews": [cr.to_dict() for cr in self.course_reviews],
            "user_course": [uc.to_dict() for uc in self.user_course],
            "course_lessons": [cl.to_dict() for cl in self.course_lessons]
        }
