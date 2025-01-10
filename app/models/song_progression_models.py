from . import db
from datetime import datetime

class SongProgression(db.Model):
    __tablename__ = 'song_progressions'

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id', ondelete="CASCADE"),  nullable=False)
    progression_id = db.Column(db.Integer, db.ForeignKey('progressions.id', ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    # relationships
    progressions = db.relationship('Progression', back_populates='song_progression_models')
    songs = db.relationship('Song', back_populates='song_progression_models')


    def to_dict(self):
        return {
            "id": self.id,
            "song_id": self.song_id,
            "progression_id": self.progression_id,
            "songs": [song.to_dict() for song in self.songs],
            "progressions": [progression.to_dict() for progression in self.progressions]


        }
