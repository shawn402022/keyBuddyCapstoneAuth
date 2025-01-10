from . import db
from datetime import datetime

class Progression(db.Model):
    __tablename__ = 'progressions'

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
