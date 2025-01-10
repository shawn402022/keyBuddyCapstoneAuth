from . import db
from datetime import datetime

class Song(db.Model):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(40), nullable=False)
    song = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(40), nullable=False)
    chords_used = db.Column(db.String(40), nullable=False)
    progression_used = db.Column(db.String(40), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # relationships
    song_progression_models = db.relationship('SongProgression', back_populates='songs')
    song_chords = db.relationship('SongChord', back_populates='songs')
    lesson_songs = db.relationship('LessonSong', back_populates='songs')
    song_keys = db.relationship('SongKey', back_populates='songs')


    def to_dict(self):
        return {
            "id": self.id,
            "key": self.key,
            "song": self.song,
            "artist": self.artist,
            "chords_used": self.chords_used,
            "progression_used": self.progression_used,
            "song_progression_models": [spm.to_dict() for spm in self.song_progression_models],
            "song_chords": [sc.to_dict() for sc in self.song_chords],
            "lesson_songs": [ls.to_dict() for ls in self.lesson_songs],
            "song_keys": [sk.to_dict() for sk in self.song_keys]
        }
