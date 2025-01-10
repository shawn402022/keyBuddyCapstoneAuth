from . import db
from datetime import datetime

class SongKey(db.Model):
    __tablename__ = 'song_keys'

    id = db.Column(db.Integer, primary_key=True)
    key_id = db.Column(db.Integer, db.ForeignKey('keys.id', ondelete="CASCADE"),   nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id', ondelete="CASCADE"),   nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    # relationships
    keys = db.relationship('Key', back_populates='song_keys')
    songs = db.relationship('Song', back_populates='song_keys')



    def to_dict(self):
        return {
            "id": self.id,
            "key_id": self.key_id,
            "song_id": self.song_id,
            "keys": [key.to_dict() for key in self.keys],
            "songs": [song.to_dict() for song in self.songs]

        }
