from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA


class SongProgression(db.Model):
    __tablename__ ='song_progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id")), primary_key=True,  nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), primary_key=True,   nullable=False)
    extra_data = db.Column(db.String)
    progression = db.relationship('Progression', back_populates='songs')
    song = db.relationship('Song', back_populates='progressions')


class Song(db.Model):
    __tablename__ ='songs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    progressions = db.relationship('SongProgression', back_populates='song')


class Progression(db.Model):
    __tablename__ ='progressions'
    id = db.Column(db.Integer, primary_key=True)
    songs = db.relationship('SongProgression', back_populates='progression')





"""
class SongProgression(db.Model):
    __tablename__ = 'song_progressions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id"), ondelete="CASCADE"),  nullable=False)
    progression_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("progressions.id"), ondelete="CASCADE"),  nullable=False)
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
"""
