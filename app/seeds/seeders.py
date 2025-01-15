from app.models import (
    db,
    User,
    Course,
    User,
    Review,
    Lesson,
    Chord,
    Progression,
    Key,
    Song,
    environment,
    SCHEMA,
)
from app.models import (
    user_courses,
    course_reviews,
    course_lessons,
    lesson_keys,
    lesson_songs,
    lesson_chords,
    lesson_progressions,
    song_keys,
    song_chords,
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
            reviewer_name="Shawn Norbert",
            course_reviewed="A maj",
            review_content=" good lessons in this course for beginners",
        ),
        Review(
            reviewer_name="Shawn Norbert",
            course_reviewed="Ab maj",
            review_content="great progressions in this course",
        ),
        Review(
            reviewer_name="Shahid Alexander",
            course_reviewed="Ab maj",
            review_content="excellent lessons in this course especially for intermediates",
        ),
        Review(
            reviewer_name="Shirley Kay",
            course_reviewed="A maj",
            review_content="its ok  its kind of regular",
        ),
        Review(
            reviewer_name="Trevor Khan",
            course_reviewed="C maj",
            review_content="this course is not good at all. simple lessons",
        ),
        Review(
            reviewer_name="Trevor Khan",
            course_reviewed="A maj",
            review_content="this is a terrible course i would not recommend it",
        ),
        Review(
            reviewer_name="Shamir Roberts",
            course_reviewed="C maj",
            review_content="very helpful course for people with no experience",
        ),
        Review(
            reviewer_name="Allison Nutley",
            course_reviewed="C maj",
            review_content="hands down the best course ever created on this site.",
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
            course_key="Ab maj",
            details_of_course=" chords, A maj, A min, C maj D maj",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="Ab maj",
            details_of_course="chords,  D maj",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="Ab maj",
            details_of_course="chords-scales,  C maj D maj",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="C maj",
            details_of_course="chords,  D maj",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="C maj",
            details_of_course="chords, A maj",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="C maj",
            details_of_course="scales, A min, C maj D maj",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="A maj",
            details_of_course="chords-scales, A maj, A min",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
        ),
        Course(
            course_key="A maj",
            details_of_course="scales, A maj, A min, ",
            reviews=Review.query.filter(
                Review.course_reviewed == Course.course_key
            ).all(),
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
## Admin lesson seeding function
def seed_lessons():
    first_course = Course.query.first()
    first_progression = Progression.query.first()
    first_key = Key.query.first()
    first_chord = Chord.query.first()

    # Add a check to ensure this combination doesn't already exist
    existing_lesson = Lesson.query.filter_by(name="A maj").first()
    if not existing_lesson:
        seed_data = [
            Lesson(
                name="A maj",
                type="scale",
                pulls_to="D",
                pulls_from="E",
                notes=",".join(["A", "Db", "E", "F", "G", "Ab", "Bb"]),
                progressions=[first_progression],
                keys=[first_key],
                chords=list(set([first_chord])),
                courses=[first_course]
            )
        ]
        db.session.bulk_save_objects(seed_data)
        db.session.commit()
        print("Seeded lessons")
def undo_lessons():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lessons RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lessons"))

    db.session.commit()


## ADMIN chord seeding function
def seed_chords():
    # create a bunch of users in an array

    seed_data = [
        Chord(
            chord_name="A maj",
            notes=",".join(["B", "C", "E", "F", "G"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
            lessons=Lesson.query.filter(Lesson.name == Chord.chord_name).all(),
        ),
        Chord(
            chord_name="A dim",
            notes=",".join(["D", "E", "F", "G"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
            lessons=Lesson.query.filter(Lesson.name == Chord.chord_name).all(),
        ),
        Chord(
            chord_name="Ab maj",
            notes=",".join(["B", "C", "D", "E", "F", "G"]),
            songs=Song.query.filter(Song.song_key == Chord.chord_name).all(),
            lessons=Lesson.query.filter(Lesson.name == Chord.chord_name).all(),
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
        Progression(progression_name="1-4-5", progression_type="maj"),
        Progression(progression_name="1-4-6-5", progression_type="maj"),
        Progression(progression_name="1-5-6-4", progression_type="maj"),
        Progression(progression_name="1-6-4-5", progression_type="maj"),
        Progression(progression_name="1-6-2-5", progression_type="maj"),
        Progression(progression_name="6-4-1-5", progression_type="maj"),
        Progression(progression_name="1-4-2-5", progression_type="maj"),
        Progression(progression_name="1-6-5-4", progression_type="maj"),
        Progression(progression_name="1-4-1-5", progression_type="maj"),
        Progression(progression_name="6-4-2-5", progression_type="maj"),
        Progression(progression_name="1-5-4-1", progression_type="maj"),
        Progression(progression_name="1-4-7-3", progression_type="maj"),
        Progression(progression_name="1-6-4-2", progression_type="maj"),
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
        Key(key_name="C"),
        Key(key_name="C#"),
        # Key(key_name='Db'),
        Key(key_name="D"),
        # Key(key_name='Eb'),
        Key(key_name="E"),
        Key(key_name="F"),
        Key(key_name="F#"),
        # Key(key_name='Gb'),
        Key(key_name="G"),
        Key(key_name="G#"),
        # Key(key_name='Gb'),
        Key(key_name="A"),
        Key(key_name="A#"),
        # Key(key_name='Fb'),
        Key(key_name="B"),
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
                song_key="C maj",
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
                chords= Chord.query.filter(Chord.chord_name == Song.song_key).all(),
                lessons=Lesson.query.filter(Lesson.name == Song.song_key).all()
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
                chords= Chord.query.filter(Chord.chord_name == Song.song_key).all(),
                lessons=Lesson.query.filter(Lesson.name == Song.song_key).all()
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
                chords= Chord.query.filter(Chord.chord_name == Song.song_key).all(),
                lessons=Lesson.query.filter(Lesson.name == Song.song_key).all()
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
