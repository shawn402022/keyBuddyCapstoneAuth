from .db import add_prefix_for_prod
from datetime import datetime
from .db import db,environment, SCHEMA



class LessonProgression(db.Model):
    __tablename__ = 'lesson_progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id"), ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id"), ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    #relationships
    lessons = db.relationship('Lesson', back_populates='lesson_progression_models')
    progressions = db.relationship('Progression', back_populates='lesson_progression_models')


    def to_dict(self):
        return {
            "id": self.id,
            "progression_id": self.progression_id,
            "lesson_id": self.lesson_id,
            "lessons": [lesson.to_dict() for lesson in self.lessons],
            "progressions": [progression.to_dict() for progression in self.progressions]

        }
