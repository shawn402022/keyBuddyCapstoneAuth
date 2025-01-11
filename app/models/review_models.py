from .db import db
from datetime import datetime
from .db import environment, SCHEMA



class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    review_title = db.Column(db.String(40), nullable=False)
    review = db.Column(db.String(500), nullable=False)
    published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # relationships
    course_reviews = db.relationship('CourseReview', back_populates='reviews')



    def to_dict(self):
        return {
            "id": self.id,
            "review_title": self.review_title,
            "review": self.review,
            "published": self.published,
            "course_reviews": [cr.to_dict() for cr in self.course_reviews]
        }
