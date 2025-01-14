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



from .models import UserCourse, CourseReview, CourseLesson, LessonKey, LessonSong, LessonChord, LessonProgression, SongKey, SongChord, SongProgression, Course, User,Review, Lesson, Chord, Progression, Key, Song




