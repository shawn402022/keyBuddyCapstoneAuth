from __future__ import annotations
from typing import List
from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from .db import db
from .db import environment, SCHEMA


from .models import (
    user_courses,
    song_keys,
    song_chords,
    song_progressions,
    Course,
    User,
    Review,
    Scale,
    Chord,
    Progression,
    Key,
    Song,
)
