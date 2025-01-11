from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA



class LessonChord(db.Model):
    __tablename__ = 'lesson_chords'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id"), ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id"), ondelete="CASCADE"),   nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)

    #relationships
    chords = db.relationship('Chord', back_populates='lesson_chord_models')
    lessons = db.relationship('Lesson', back_populates='lesson_chord_models')


    def to_dict(self):
        return {
            "id": self.id,
            "chord_id": self.chord_id,
            "lesson_id": self.lesson_id,
            "chords": [chord.to_dict() for chord in self.chords],
            "lessons": [lesson.to_dict() for lesson in self.lessons]

        }
