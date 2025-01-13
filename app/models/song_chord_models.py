from __future__ import annotations
from typing import List
from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from .db import add_prefix_for_prod
from datetime import datetime
from .db import db, environment, SCHEMA


class SongChord(db.Model):
    __tablename__ ='song_chords'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    chord_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("chords.id")), primary_Key=True,  nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), primary_Key=True,  nullable=False)
    extra_data = db.Column(db.String)
    song = db.relationship('Song', back_populates='chords')
    chord = db.relationship('Chord', back_populates='songs')


class Song(db.Model):
    __tablename__ ='songs'
    id = db.Column(db.Integer, primary_key=True)
    chords = (db.relationship('SongChord', back_populates="song"))


class Chord(db.Model):
    __tablename__ ='chords'
    id = db.Column(db.Integer, primary_key=True)
    songs = (db.relationship('SongChord', back_populates="chord"))





"""
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
"""
