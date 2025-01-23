from app.models import (
    db,
    User,
    Course,
    User,
    Review,
    Scale,
    Chord,
    Progression,
    Key,
    Song,
    environment,
    SCHEMA,
)
from app.models import (
    user_courses,
    song_keys,
    song_chords,
    song_progressions,
)
from sqlalchemy.sql import text


## USER user seeding function
# Adds a demo user, you can add other users here if you want
def seed_users():
    # create a bunch of users in an array

    seed_data = [
        User(
            username="user1",
            full_name="Shawn Norbert",
            password="password",
            email="user1@example.com",
        ),
        User(
            username="user2",
            full_name="Bouchra Norbert",
            password="password",
            email="user2@example.com",
        ),
        User(
            username="user3",
            full_name="Hamzah Norbert",
            password="password",
            email="user3@example.com",
        ),
        User(
            username="user4",
            full_name="Shahid Alexander",
            password="password",
            email="user4@example.com",
        ),
        User(
            username="user5",
            full_name="Shirley Kay",
            password="password",
            email="user5@example.com",
        ),
        User(
            username="user6",
            full_name="Trevor Khan",
            password="password",
            email="user6@example.com",
        ),
        User(
            username="user7",
            full_name="Shamir Roberts",
            password="password",
            email="user7@example.com",
        ),
        User(
            username="user8",
            full_name="Allison Nutley",
            password="password",
            email="user8@example.com",
        ),
        User(
            username="Demo",
            full_name="Demo User",
            password="password",
            email="demo@aa.io",
        )
    ]

    # buld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    # Commit the changes to the dn
    db.session.commit()
    print("Seeded users")


def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()


## USER review seeding function
def seed_reviews():
    # create a bunch of users in an array

    seed_data = [
        Review(
            reviewer_name="Bouchra Norbert",
            review_content="great app, my boo did his thing",
        ),
        Review(
            reviewer_name="Shahid Alexander",
            review_content="this app is fire, he said he would, we thought we could and he did",
        ),
        Review(
            reviewer_name="Shirley Kay",
            review_content="Very Proud of the homie.  He gets it done ",
        ),
        Review(
            reviewer_name="Trevor Khan",
            review_content="This is actually a pretty cool App",
        ),
        Review(
            reviewer_name="Shamir Roberts",
            review_content="THIS APP SUCKS!!",
        ),
        Review(
            reviewer_name="Allison Nutley",
            review_content="Im actually impressed, and it takes a lot to impress me.",
        ),
    ]

    db.session.bulk_save_objects(seed_data)

    # Commit the changes to the dn
    db.session.commit()
    print("Seeded reviews")


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()


## USER course seeding function
def seed_courses():
    # create a bunch of users in an array

    seed_data = [
        Course(
            course_name="C course",
            details_of_course=" All Chords in C",

        ),
        Course(
            course_name="D course",
            details_of_course=" All Chords in D",

        ),
        Course(
            course_name="E course",
            details_of_course=" All Chords in E",

        ),
        Course(
            course_name="maj course",
            details_of_course=" All major chords",

        ),
        Course(
            course_name="min course",
            details_of_course=" All minor chords",

        ),
        Course(
            course_name="dim course",
            details_of_course=" All diminished chords",

        ),
    ]
    # buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    # Commit the changes to the dn
    db.session.commit()
    print("Seeded courses")


def undo_courses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.courses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM courses"))

    db.session.commit()


## Admin scale seeding function
def seed_scales():


    # Add a check to ensure this combination doesn't already exist
    existing_scale = Scale.query.filter_by(name="A maj").first()
    if not existing_scale:
        seed_data = [
            Scale(
                name="C maj",
                type="maj",
                signature="natural",
                flats = 0,
                sharps = 0,
                root="C",
                pulls_to="D",
                pulls_from="E",
                notes= ",".join(["C", "D", "E", "F", "G", "A", "B", "C"]),

            ),
            Scale(
                name="Db maj",
                type="maj",
                signature="flat",
                flats = 6,
                sharps = 0,
                root="A",
                pulls_to="Gb",
                pulls_from="Ab",
                notes=",".join(["Db", "Eb", "F", "Gb", "Ab", "Bb", "C", "Db"]),

            ),
            Scale(
                name="D maj",
                type="maj",
                signature="sharp",
                flats = 0,
                sharps = 2,
                root="D",
                pulls_to="G",
                pulls_from="A",
                notes=",".join(["D", "E", "F#", "G", "A", "B", "C#", "D"]),

            ),
            Scale(
                name="Eb maj",
                type="maj",
                signature="flat",
                flats = 4,
                sharps = 0,
                root="Eb",
                pulls_to="Ab",
                pulls_from="Bb",
                notes=",".join(["Eb", "F", "G", "Ab", "Bb", "C", "D", "Eb"]),

            ),
            Scale(
                name="Ab min",
                type="min",
                signature="flat",
                flats = 7,
                sharps = 0,
                root="Ab",
                pulls_to="Db",
                pulls_from="Eb",
                notes=",".join(["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb", "Ab"]),

            ),
            Scale(
                name="A min",
                type="min",
                signature="natural",
                flats = 0,
                sharps = 0,
                root="A",
                pulls_to="D",
                pulls_from="E",
                notes=",".join(["A", "B", "C", "D", "E", "F", "G", "A"]),

            ),
        ]
        db.session.bulk_save_objects(seed_data)
        db.session.commit()
        print("Seeded scales")


def undo_scales():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.scales RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM scales"))

    db.session.commit()


## ADMIN chord seeding function
def seed_chords():
    # create a bunch of users in an array

    seed_data = [
        Chord(
            chord_family="C",
            chord_name="C maj",
            notes=",".join(["C", "E", "G"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="C",
            chord_name="C min",
            notes=",".join(["C", "D#", "G"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="C",
            chord_name="C# min",
            notes=",".join(["C#", "E", "G#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="C",
            chord_name="C# dim",
            notes=",".join(["C#", "E", "G"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="C",
            chord_name="C dim",
            notes=",".join(["C", "D#", "F#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="C",
            chord_name="C aug",
            notes=",".join(["C", "E", "G#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="Db maj",
            notes=",".join(["Db", "F", "Ab"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="D maj",
            notes=",".join(["D", "F#", "A"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="D#",
            notes=",".join(["D", "G", "A#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="D# dim",
            notes=",".join(["C#", "F#", "A#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="D dim",
            notes=",".join(["D", "F", "G#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="D min",
            notes=",".join(["D", "F", "A"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="D",
            chord_name="Db aug",
            notes=",".join(["Db", "F", "A"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E",
            chord_name="E maj",
            notes=",".join(["E", "G#", "B"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E",
            chord_name="Eb maj",
            notes=",".join(["Eb", "G", "Fb"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E",
            chord_name="Eb min",
            notes=",".join(["Eb", "Gb", "Fb"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E",
            chord_name="E dim",
            notes=",".join(["E", "G", "A#"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E",
            chord_name="E min",
            notes=",".join(["E", "G", "A"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E ",
            chord_name="E aug",
            notes=",".join(["E", "G#", "C"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
        Chord(
            chord_family="E ",
            chord_name="Eb aug",
            notes=",".join(["Eb", "G", "F"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
        ),
    ]
    # buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    # Commit the changes to the dn
    db.session.commit()
    print("Seeded chords")


def undo_chords():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.chords RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM chords"))

    db.session.commit()


## ADMIN Progression seeding function
def seed_progressions():
    # create a bunch of users in an array

    seed_data = [
        Progression(progression_name="1-4-5-6", progression_type="maj", progression_style="rock"),
        Progression(progression_name="1-4-6-5", progression_type="maj", progression_style="rock"),
        Progression(progression_name="1-5-6-4", progression_type="maj", progression_style="rock"),
        Progression(progression_name="1-6-4-5", progression_type="min", progression_style="rock"),
        Progression(progression_name="1-6-2-5", progression_type="maj", progression_style="jazz"),
        Progression(progression_name="6-4-1-5", progression_type="maj", progression_style="jazz"),
        Progression(progression_name="1-4-2-5", progression_type="min", progression_style="jazz"),
        Progression(progression_name="1-6-5-4", progression_type="maj", progression_style="country"),
        Progression(progression_name="1-4-1-5", progression_type="maj", progression_style="country"),
        Progression(progression_name="6-4-2-5", progression_type="min", progression_style="country"),
        Progression(progression_name="1-5-4-1", progression_type="maj", progression_style="blues"),
        Progression(progression_name="1-4-7-3", progression_type="maj", progression_style="blues"),
        Progression(progression_name="1-3-5-6", progression_type="maj", progression_style="blues"),
    ]
    # buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    # Commit the changes to the dn
    db.session.commit()
    print("Seeded progressions")


def undo_progressions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.progressions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM progressions"))

    db.session.commit()


## ADMIN Keys seeding function
def seed_keys():
    # create a bunch of users in an array

    seed_data = [
        Key(
            key_name="C",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="C#",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name='Db',
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="D",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name='Eb',
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="E",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="F",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="F#",
        key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name='Gb',
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="G",
        key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="G#",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name='Gb',
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="A",
        key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="A#",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name='Fb',
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
        Key(
            key_name="B",
            key_description = 'alskdfja;sldkfjasfdsasdf'
            ),
    ]
    # buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    # Commit the changes to the dn
    db.session.commit()
    print("Seeded keys")


def undo_keys():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.keys RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM keys"))

    db.session.commit()


## ADMIN Song seeding function
def seed_songs():
    first_chord = Chord.query.first()

    if first_chord:

        seed_data = [
            Song(
                song="Let it Be",
                artist="Beatles",
                song_key="A maj",
                progression_used="1-4-5-6",
                chords_used=",".join(
                    [
                        "C",
                        "G",
                        "Am",
                        "Fmaj7",
                        "F",
                        "C",
                        "E",
                        "Dm7",
                    ]
                ),
                chords=Chord.query.filter(Chord.chord_name == Song.song_key).all(),
            ),
            Song(
                song="Dreams",
                artist="Fleetwood Mac",
                song_key="C maj",
                progression_used="1-3-5-6",
                chords_used=",".join(
                    [
                        "C",
                        "Fmaj7",
                        "F",
                        "Dm7",
                    ]
                ),
                chords=Chord.query.filter(Chord.chord_name == Song.song_key).all(),
            ),
            Song(
                song="Aint No Sunshine",
                artist="Bill Withers",
                song_key="C maj",
                progression_used="1-4-5-2",
                chords_used=",".join(
                    [
                        "C",
                        "Am",
                        "Fmaj7",
                        "F",
                        "C",
                        "E",
                    ]
                ),
                chords=Chord.query.filter(Chord.chord_name == Song.song_key).all(),
            ),
        ]
        # buIld insert seeds into db

        db.session.bulk_save_objects(seed_data)

        # Commit the changes to the dn
        db.session.commit()
        print("Seeded songs")


def undo_songs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM songs"))

    db.session.commit()


## JOIN User Courses Seeding function
def seed_user_courses():
    course_id_1 = Course.query.filter_by(course_name="C course").first().id
    user_id_1 = User.query.filter_by(username="user1").first().id

    course_id_2 = Course.query.filter_by(course_name="C course").first().id
    user_id_2 = User.query.filter_by(username="user2").first().id

    course_id_3 = Course.query.filter_by(course_name="D course").first().id
    user_id_3 = User.query.filter_by(username="user1").first().id

    associations = [
        {"courses_id": course_id_1, "users_id": user_id_1},
        {"courses_id": course_id_2, "users_id": user_id_2},
        {"courses_id": course_id_3, "users_id": user_id_3},
    ]

    db.session.execute(user_courses.insert(), associations)

    db.session.commit()
    print("Seeded user_courses")


def undo_user_courses():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.user_courses RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM user_courses"))

    db.session.commit()


## JOIN Song Keys Seeding function
def seed_song_keys():
    song_id_1 = Song.query.filter_by(song_key="A maj").first().id
    key_id_1 = Key.query.filter_by(key_name="A").first().id

    song_id_2 = Song.query.filter_by(song_key="C maj").first().id
    key_id_2 = Key.query.filter_by(key_name="C").first().id

    associations = [
        {"song_id": song_id_1, "key_id": key_id_1},
        {"song_id": song_id_2, "key_id": key_id_2},
    ]

    db.session.execute(song_keys.insert(), associations)

    db.session.commit()
    print("Seeded song_keys")


def undo_song_keys():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.song_keys RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM song_keys"))

    db.session.commit()




## JOIN Song Progressions Seeding function
def seed_song_progressions():
    song_id_1 = Song.query.filter_by(song="Let it Be").first().id
    progression_id_1 = (
        Progression.query.filter_by(progression_name="1-4-5-6").first().id
    )

    song_id_2 = Song.query.filter_by(song="Dreams").first().id
    progression_id_2 = (
        Progression.query.filter_by(progression_name="1-3-5-6").first().id
    )

    associations = [
        {"song_id": song_id_1, "progression_id": progression_id_1},
        {"song_id": song_id_2, "progression_id": progression_id_2},
    ]

    db.session.execute(song_progressions.insert(), associations)

    db.session.commit()
    print("Seeded song_progressions")


def undo_song_progressions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.song_progressions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM song_progressions"))

    db.session.commit()


## JOIN Song Chords Seeding function
def seed_song_chords():
    song_id_1 = Song.query.filter_by(song="Dreams").first().id
    chord_id_1 = Chord.query.filter_by(chord_name="C maj").first().id

    song_id_2 = Song.query.filter_by(song="Aint No Sunshine").first().id
    chord_id_2 = Chord.query.filter_by(chord_name="C maj").first().id

    associations = [
        {"song_id": song_id_1, "chord_id": chord_id_1},
        {"song_id": song_id_2, "chord_id": chord_id_2},
    ]

    db.session.execute(song_chords.insert(), associations)

    db.session.commit()
    print("Seeded song_chords")


def undo_song_chords():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.song_chords RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM song_chords"))

    db.session.commit()
