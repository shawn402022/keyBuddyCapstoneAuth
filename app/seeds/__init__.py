from flask.cli import AppGroup
from .seeders import (
    seed_users,
    undo_users,
    seed_chords,
    undo_chords,
    seed_scales,
    undo_scales,
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
    seed_song_keys,
    undo_song_keys,
    seed_song_progressions,
    undo_song_progressions,
    seed_song_chords,
    undo_song_chords,

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
        undo_reviews()
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
    ## Scale Seeding
    if environment == "production":
        undo_scales()
    seed_scales()
    ## Song Seeding
    if environment == "production":
        undo_songs()
    seed_songs()

    ## User Courses Seeding
    if environment == "production":
        undo_user_courses()
    seed_user_courses()

    ## Song Keys Seeding
    if environment == "production":
        undo_song_keys()
    seed_song_keys()


    if environment == "production":
        undo_song_progressions()
    seed_song_progressions()

    ## Song Chords Seeding
    if environment == "production":
        undo_song_chords()
    seed_song_chords()


    print("All seeds have been executed.")
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_song_chords()
    undo_song_progressions()
    undo_song_keys()
    undo_user_courses()
    undo_songs()
    undo_scales()
    undo_chords()
    undo_keys()
    undo_progressions()
    undo_reviews()
    undo_courses()
    undo_users()

    # Add other undo functions here
