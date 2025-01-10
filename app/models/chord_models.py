from . import db
from datetime import datetime

class Chord(db.Model):
    __tablename__ = 'chords'

    id = db.Column(db.Integer, primary_key=True)
    chord_name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # relationships
    lesson_chords = db.relationship('LessonChord', back_populates='chords')
    song_chords = db.relationship('SongChord', back_populates='chords')

    def to_dict(self):
        return {
            "id": self.id,
            "chord_name": self.chord_name,
            "lesson_chords": [lc.to_dict() for lc in self.lesson_chords],
            "song_chords": [sc.to_dict() for sc in self.song_chords]
        }
