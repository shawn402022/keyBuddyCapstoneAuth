from . import db
from datetime import datetime

class LessonSong(db.Model):
    __tablename__ = 'lesson_songs'

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id' , ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id', ondelete="CASCADE"),   nullable=False)
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
