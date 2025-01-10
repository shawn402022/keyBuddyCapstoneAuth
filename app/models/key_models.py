from . import db
from datetime import datetime

class Key(db.Model):
    __tablename__ = 'keys'

    id = db.Column(db.Integer, primary_key=True)
    key_name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # relationships
    lesson_keys = db.relationship('LessonKey', back_populates='keys')
    song_keys = db.relationship('SongKey', back_populates='keys')





    def to_dict(self):
        return {
            "id": self.id,
            "key_name": self.key_name,
            "lesson_keys": [lk.to_dict() for lk in self.lesson_keys],
            "song_keys": [sk.to_dict() for sk in self.song_keys]
        }
