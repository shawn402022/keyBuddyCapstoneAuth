from . import db
from datetime import datetime

class LessonKey(db.Model):
    __tablename__ = 'lesson_keys'

    id = db.Column(db.Integer, primary_key=True)
    key_id = db.Column(db.Integer, db.ForeignKey('keys.id', ondelete="CASCADE"),   nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id', ondelete="CASCADE"),  nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,onupdate=datetime.utcnow)




    # relationships
    keys = db.relationship('Key', back_populates='lesson_keys')
    lessons = db.relationship('Lesson', back_populates='lesson_keys')



    def to_dict(self):
        return {
            "id": self.id,
            "key_id": self.key_id,
            "lesson_id": self.lesson_id,
            "keys": [key.to_dict() for key in self.keys],
            "lessons": [lesson.to_dict() for lesson in self.lessons]

        }
