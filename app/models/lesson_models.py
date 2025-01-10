from . import db
from datetime import datetime

class Lesson(db.Model):
    __tablename__ = 'lessons'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer,)
    name = db.Column(db.String(255), unique=True, nullable=False)
    type = db.Column(db.String(255), nullable=False)
    key = db.Column(db.String(255), unique=True, nullable=False)
    pulls_to = db.Column(db.String(100), nullable=False)
    pulls_from = db.Column(db.String(40), nullable=False)
    songs = db.Column(db.String(40), nullable=False)
    chords = db.Column(db.String(40), nullable=False)
    progressions = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)


    # Relationships
    course_lessons = db.relationship('CourseLesson', back_populates='lesson_models')
    lesson_chords = db.relationship('LessonChord', back_populates='lesson_models')
    lessons = db.relationship('Lesson', back_populates='lesson_models')
    lesson_progressions = db.relationship('LessonProgression', back_populates='lesson_models')
    lesson_songs = db.relationship('LessonSong', back_populates='lesson_models')
    lesson_keys = db.relationship('LessonKey', back_populates='lesson_models')


    def to_dict(self):
        return {
            "id": self.id,
            "course_id": self.course_id,
            "name": self.name,
            "type": self.type,
            "key": self.key,
            "pulls_to": self.pulls_to,
            "pulls_from": self.pulls_from,
            "songs": self.songs,
            "chords": self.chords,
            "progressions": self.progressions,
            "course_lessons": [cl.to_dict() for cl in self.course_lessons],
            "lesson_chords": [lc.to_dict() for lc in self.lesson_chords],
            "lessons": [lesson.to_dict() for lesson in self.lessons],
            "lesson_progressions": [lp.to_dict() for lp in self.lesson_progressions],
            "lesson_songs": [ls.to_dict() for ls in self.lesson_songs],
            "lesson_keys": [lk.to_dict() for lk in self.lesson_keys]
        }
