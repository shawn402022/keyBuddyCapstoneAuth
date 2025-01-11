from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA



class SongChord(db.Model):
    __tablename__ = 'song_chords'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id"), ondelete="CASCADE"),  nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id"), ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    # relationships
    chords = db.relationship('Chord', back_populates='song_chords')
    songs = db.relationship('Song', back_populates='song_chords')



    def to_dict(self):
        return {
            "id": self.id,
            "chord_id": self.chord_id,
            "song_id": self.song_id,
            "chords": [chord.to_dict() for chord in self.chords],
            "songs": [song.to_dict() for song in self.songs]

        }
