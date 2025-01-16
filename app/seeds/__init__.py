from flask.cli import AppGroup
from .seeders import (
    seed_users,
    undo_users,
    seed_chords,
    undo_chords,
    seed_lessons,
    undo_lessons,
    seed_courses,
    undo_courses,
    seed_progressions,
    undo_progressions,
    seed_keys,
    undo_keys,
    seed_songs,
    undo_songs,
    seed_reviews,
    undo_reviews,
    seed_user_courses,
    undo_user_courses,
    seed_course_lessons,
    undo_course_lessons,
    seed_course_reviews,
    undo_course_reviews,
    seed_song_keys,
    undo_song_keys,
    seed_song_progressions,
    undo_song_progressions,
    seed_song_chords,
    undo_song_chords,
    seed_lesson_keys,
    undo_lesson_keys,
)

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    ## User Seeding
    if environment == "production":
        undo_users()
    seed_users()
    ## Course Seeding
    if environment == "production":
        undo_courses()
    seed_courses()
    ## Reviews Seeding
    if environment == "production":
        undo_courses()
    seed_reviews()
    ## Progressions Seeding
    if environment == "production":
        undo_progressions()
    seed_progressions()
    ## Key Seeding
    if environment == "production":
        undo_keys()
    seed_keys()
    ## Chord Seeding
    if environment == "production":
        undo_chords()
    seed_chords()
    ## Lesson Seeding
    if environment == "production":
        undo_lessons()
    seed_lessons()
    ## Song Seeding
    if environment == "production":
        undo_songs()
    seed_songs()

    ## Course Reviews Seeding
    if environment == "production":
        undo_songs()
    seed_songs()
    ## Course lessons Seeding
    if environment == "production":
        undo_songs()
    seed_songs()

    ## User Courses Seeding
    if environment == "production":
        undo_user_courses()
    seed_user_courses()

    ## Course Reviews Seeding
    if environment == "production":
        undo_course_reviews()
    seed_course_reviews()

    ## Song Keys Seeding
    if environment == "production":
        undo_song_keys()
    seed_song_keys()

    ## Course Lessons Seeding
    if environment == "production":
        undo_course_lessons()
    seed_course_lessons()

    ## Song Progressions Seeding
    if environment == "production":
        undo_song_progressions()
    seed_song_progressions()

    ## Song Chords Seeding
    if environment == "production":
        undo_song_chords()
    seed_song_chords()

    ## Lesson Keys Seeding
    if environment == "production":
        undo_lesson_keys()
    seed_lesson_keys()


    print("All seeds have been executed.")
    # Add other seed functions here






# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_users()
    undo_courses()
    undo_reviews()
    undo_progressions()
    undo_keys()
    undo_chords()
    undo_lessons()
    undo_songs()
    undo_song_keys()

    # Add other undo functions here
