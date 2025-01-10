from . import db
from datetime import datetime

class CourseLesson(db.Model):
    __tablename__ = 'course_lessons'

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id', ondelete="CASCADE"), nullable=False)
    course_id = db.Column(db.Integer,  db.ForeignKey('courses.id', ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    lessons = db.relationship('Lesson', back_populates='course_lessons')
    courses = db.relationship('Course', back_populates='course_lessons')

    def to_dict(self):
        return {
            "id": self.id,
            "lesson_id": self.lesson_id,
            "course_id": self.course_id,
            "lessons": [lesson.to_dict() for lesson in self.lessons],
            "courses": [course.to_dict() for course in self.courses]

        }
