from flask.cli import AppGroup
from .seeders import seed_users, undo_users, seed_chords, undo_chords, seed_lessons, undo_lessons, seed_courses, undo_courses, seed_progressions, undo_progressions, seed_keys, undo_keys, seed_songs, undo_songs, seed_reviews, undo_reviews

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    ## User Seeding
    if environment == 'production':
        undo_users()
    seed_users()
    ## Course Seeding
    if environment == 'production':
        undo_courses()
    seed_courses()
    ## Reviews Seeding
    if environment == 'production':
        undo_courses()
    seed_reviews()
    ## Progressions Seeding
    if environment == 'production':
        undo_progressions()
    seed_progressions()
    ## Key Seeding
    if environment == 'production':
        undo_keys()
    seed_keys()
    ## Chord Seeding
    if environment == 'production':
        undo_chords()
    seed_chords()
    ## Lesson Seeding
    if environment == 'production':
        undo_lessons()
    seed_lessons()
    ## Song Seeding
    if environment == 'production':
        undo_songs()
    seed_songs()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_courses()
    undo_reviews()
    undo_progressions()
    undo_keys()
    undo_chords()
    undo_lessons()
    undo_songs()




    # Add other undo functions here
