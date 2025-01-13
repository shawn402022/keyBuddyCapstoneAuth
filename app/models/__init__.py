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



from .course_lesson_models import CourseLesson,Course,Lesson
from .course_reviews_models import CourseReview,Review, Course
from .lesson_chord_models import LessonChord,Lesson,Chord
from .lesson_song_models import LessonSong, Lesson, Song
from .lesson_progression_models import LessonProgression, Progression, Lesson
from .user_models import User


"""
from .song_progression_models import SongProgression
from .song_key_models import SongKey
from .song_chord_models import SongChord
from .user_course_models import UserCourse
"""
