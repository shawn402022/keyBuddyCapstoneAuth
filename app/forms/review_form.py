from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Review

class ReviewForm(FlaskForm):
    review = StringField('Review', validators=[DataRequired()])

    user_id = StringField('user_id', validators=[DataRequired()])
    text = StringField('text', validators=[DataRequired()])
    submit = StringField('Submit')
