from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA



class SongKey(db.Model):
    __tablename__ = 'song_keys'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    key_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("keys.id"), ondelete="CASCADE"),   nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id"), ondelete="CASCADE"),   nullable=False)
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
