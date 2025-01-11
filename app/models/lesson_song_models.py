from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA



class LessonSong(db.Model):
    __tablename__ = 'lesson_songs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id") , ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lessons.id"), ondelete="CASCADE"),   nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    # relationships
    songs = db.relationship('Song', back_populates='lesson_songs')
    lessons = db.relationship('Lesson', back_populates='lesson_songs')


    def to_dict(self):
        return {
            "id": self.id,
            "song_id": self.song_id,
            "lesson_id": self.lesson_id,
            "songs": [song.to_dict() for song in self.songs],
            "lessons": [lesson.to_dict() for lesson in self.lessons]


        }
