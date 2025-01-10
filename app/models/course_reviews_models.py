from . import db
from datetime import datetime

class CourseReview(db.Model):
    __tablename__ = 'course_reviews'

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey('reviews.id', ondelete="CASCADE"),  nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"),  nullable=False)
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
