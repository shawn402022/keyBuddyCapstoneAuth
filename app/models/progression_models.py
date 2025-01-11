from .db import db
from datetime import datetime
from .db import environment, SCHEMA



class Progression(db.Model):
    __tablename__ = 'progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progression_name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # Relationships
    lesson_progressions = db.relationship('Lesson', back_populates='progression_models')
    song_progression_models = db.relationship('Song', back_populates='progression_models')


    def to_dict(self):
        return {
            "id": self.id,
            "progression_name": self.progression_name,
            "lesson_progressions": [lp.to_dict() for lp in self.lesson_progressions],
            "song_progression_models": [spm.to_dict() for spm in self.song_progression_models]
        }
