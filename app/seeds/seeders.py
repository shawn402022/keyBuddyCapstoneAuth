from app.models import db, User,  Course, User,Review, Lesson, Chord, Progression, Key, Song, environment, SCHEMA
from sqlalchemy.sql import text


## USER user seeding function
# Adds a demo user, you can add other users here if you want
def seed_users():
    #create a bunch of users in an array

    seed_data = [
        User(username='user1', full_name='Shawn Norbert', password="password", email='user1@example.com'),
        User(username='user2', full_name='Bouchra Norbert', password="password", email='user2@example.com'),
        User(username='user3', full_name='Hamzah Norbert', password="password", email='user3@example.com'),
        User(username='user4', full_name='Shahid Alexander', password="password", email='user4@example.com'),
        User(username='user5', full_name='Shirley Kay', password="password", email='user5@example.com'),
        User(username='user6', full_name='Trevor Khan', password="password", email='user6@example.com'),
        User(username='user7', full_name='Shamir Roberts', password="password", email='user7@example.com'),
        User(username='user8', full_name='Allison Nutley', password="password", email='user8@example.com')
    ]

    #buld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded users")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()


## USER review seeding function
def seed_reviews():
    #create a bunch of users in an array

    seed_data = [
        Review(review_title='good course', review =' good lessons in this course for beginners', published=0),
        Review(review_title='great course', review ='great progressions in this course',published=0),
        Review(review_title='excellent course', review ='excellent lessons in this course especially for intermediates', published=0),
        Review(review_title='ok course', review ='its ok  its kind of regular', published=1),
        Review(review_title='bad course', review ='this course is not good at all. simple lessons', published=0),
        Review(review_title='terrible course', review ='this is a terrible course i would not recommend it', published=0),
        Review(review_title='helpful course', review ='very helpful course for people with no experience', published=1),
        Review(review_title='fire course', review ='hands down the best course ever created on this site.', published=1)
    ]

    #buld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded reviews")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()


## USER course seeding function
def seed_courses():
    #create a bunch of users in an array

    seed_data = [
        Course(course_name='good course', details_of_course =' chords, A maj, A min, C maj D maj'),
        Course(course_name='great course', details_of_course ='chords,  D maj'),
        Course(course_name='excellent course', details_of_course ='chords-scales,  C maj D maj'),
        Course(course_name='ok course', details_of_course ='chords,  D maj'),
        Course(course_name='bad course', details_of_course ='chords, A maj' ),
        Course(course_name='terrible course', details_of_course ='scales, A min, C maj D maj'),
        Course(course_name='helpful course', details_of_course ='chords-scales, A maj, A min'),
        Course(course_name='fire course', details_of_course ='scales, A maj, A min, ')
    ]
    #buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded courses")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_courses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.courses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM courses"))

    db.session.commit()



## Admin lesson seeding function
def seed_lessons():
    #create a bunch of users in an array

    seed_data = [
        Lesson(
            name='A major',
            type ='chord',
            pulls_to='D',
            pulls_from='E',
            chords=Chord.query.filter_by(chord_name='A maj').first(),
            progressions=Progression.query.filter_by(progression_type='major').first(),
            songs=Song.query.filter_by(song_key='A').first(),
            courses = [ ],
            key = Key.query.filter_by(key_name ='A').first(),
        ),
        Lesson(
            name='Ab major',
            type ='chord',
            pulls_to='Db',
            pulls_from='Eb',
            chords=Chord.query.filter_by(chord_name='Ab maj').all(),
            progressions=Progression.query.filter_by(progression_type='major').all(),
            songs= Song.query.filter_by(song_key='Ab').all(),
            courses = [ ],
            key = Key.query.filter_by(key_name ='Ab').all(),
        ),
        Lesson(
            name='C major',
            type ='chord',
            pulls_to='F',
            pulls_from='G',
            chords=Chord.query.filter_by(chord_name='C major').all(),
            progressions=Progression.query.filter_by(progression_type='major').all(),
            songs= Song.query.filter_by(song_key='C major').all(),
            courses = [ ],
            key = Key.query.filter_by(key_name ='C Major').all(),
        ),

    ]
    #buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded courses")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_lessons():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lessons RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lessons"))

    db.session.commit()


## ADMIN chord seeding function
def seed_chords():
    #create a bunch of users in an array

    seed_data = [
        Chord(chord_name='A maj', chord_key='A', notes =','.join (['B', 'C', 'E', 'F', 'G']), songs = Song.query.filter_by(song_key = 'A major').all() , lessons = []),
        Chord(chord_name='A dim', chord_key='A', notes =','.join([ 'D', 'E', 'F', 'G']), songs = Song.query.filter_by(song_key = 'A diminished').all() , lessons = []),
        Chord(chord_name='Ab maj', chord_key='A', notes =','.join (['B', 'C', 'D', 'E', 'F', 'G']), songs = Song.query.filter_by(song_key = 'Ab major').all()    , lessons = []),
        Chord(chord_name='A aug', chord_key='A', notes =','.join (['B', 'C', 'D', 'E', ]), songs = Song.query.filter_by(song_key = 'A augmented').all() , lessons = []),
        Chord(chord_name='A min', chord_key='A', notes =','.join (['B', 'C','F', 'G']), songs = Song.query.filter_by(song_key = 'A minor').all() , lessons = [] ),
        Chord(chord_name='A# dim', chord_key='A', notes =','.join (['B', 'C', 'D', 'E',  'G']), songs = Song.query.filter_by(song_key = 'A# diminished').all()    , lessons = []),
        Chord(chord_name='B maj', chord_key='B', notes =','.join (['B', 'D', 'E', 'F', 'G']), songs = Song.query.filter_by(song_key = 'B major').all() , lessons = []),
        Chord(chord_name='B dim', chord_key='B', notes =','.join([ 'C', 'D', 'E', 'F', ]), songs = Song.query.filter_by(song_key = 'B diminished').all() , lessons = []),
        Chord(chord_name='Bb maj', chord_key='B', notes =','.join (['B', 'C', 'D', 'E', 'F', 'G']), songs = Song.query.filter_by(song_key = 'Bb major').all()    , lessons = []),
        Chord(chord_name='Bb aug', chord_key='B', notes =','.join (['B', 'C',  'G']), songs = Song.query.filter_by(song_key = 'Bb augmented').all()    , lessons = []),
        Chord(chord_name='B aug', chord_key='B', notes =','.join (['E', 'F', 'G']), songs = Song.query.filter_by(song_key = 'B augmented').all() , lessons = []),
        Chord(chord_name='B min', chord_key='B', notes =','.join (['D',  'F', 'G']), songs = Song.query.filter_by(song_key = 'B minor').all() , lessons = [] ),
        Chord(chord_name='Bb min', chord_key='B', notes =','.join (['B',  'D', 'E',]), songs = Song.query.filter_by(song_key = 'Bb minor').all()    , lessons = []),


    ]
    #buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded chords")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_chords():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.chords RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM chords"))

    db.session.commit()


## ADMIN Progression seeding function
def seed_progressions():
    #create a bunch of users in an array

    seed_data = [
        Progression(progression_name='1-4-5', progression_type = 'major'),
        Progression(progression_name='1-4-6-5', progression_type = 'major'),
        Progression(progression_name='1-5-6-4', progression_type = 'major'),
        Progression(progression_name='1-6-4-5', progression_type = 'major'),
        Progression(progression_name='1-6-2-5', progression_type = 'major' ),
        Progression(progression_name='6-4-1-5', progression_type = 'major'),
        Progression(progression_name='1-4-2-5', progression_type = 'major'),
        Progression(progression_name='1-6-5-4', progression_type = 'major'),
        Progression(progression_name='1-4-1-5', progression_type = 'major'),
        Progression(progression_name='6-4-1-5', progression_type = 'major'),
        Progression(progression_name='1-5-4-1', progression_type = 'major'),
        Progression(progression_name='1-4-7-3', progression_type = 'major' ),
        Progression(progression_name='1-6-4-2', progression_type = 'major'),


    ]
    #buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded progressions")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_progressions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.progressions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM progressions"))

    db.session.commit()


## ADMIN Keys seeding function
def seed_keys():
    #create a bunch of users in an array

    seed_data = [
        Key(key_name='C'),
        Key(key_name='C#'),
        #Key(key_name='Db'),
        Key(key_name='D'),
        #Key(key_name='Eb'),
        Key(key_name='E'),
        Key(key_name='F'),
        Key(key_name='F#'),
        #Key(key_name='Gb'),
        Key(key_name='G'),
        Key(key_name='G#'),
        #Key(key_name='Gb'),
        Key(key_name='A'),
        Key(key_name='A#'),
       # Key(key_name='Fb'),
        Key(key_name='B'),




    ]
    #buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded keys")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_keys():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.keys RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM keys"))

    db.session.commit()


## ADMIN Song seeding function
def seed_songs():
    #create a bunch of users in an array

    seed_data = [
        Song(song_title = 'Let it Be', artist = 'Beatles',song_key='C major', progressions = '1-4-5-6', chords = ['C', 'G', 'Am', 'Fmaj7', 'F', 'C','E','Dm7',], lessons = Lesson.query.filter_by(lesson_name = 'C major').all()),
        Song(song_title = 'Dreams', artist = 'Fleetwood Mac',song_key='C major', progressions = '1-3-5-6', chords = ['C',   'Fmaj7', 'F', 'Dm7',], lessons = Lesson.query.filter_by(lesson_name = 'C major').all()),
        Song(song_title = 'Aint No Sunshine', artist = 'Bill Withers',song_key='C major', progressions = '1-4-5-2', chords =  ['C',  'Am', 'Fmaj7', 'F', 'C','E',], lessons = Lesson.query.filter_by(lesson_name = 'C major').all()),
        Song(song_title = 'Tiny Dancer', artist = 'Elton Jogn',song_key='C major', progressions = '2-4-5-6', chords =  ['C',  'Am', 'F', 'C'], lessons = Lesson.query.filter_by(lesson_name = 'C major').all()),
        Song(song_title = 'Thriller', artist = 'Micheal Jackson',song_key='C major', progressions = '1-5-4-6', chords =  [ 'Am', 'Fmaj7', 'F', 'E','Dm7'], lessons =Lesson.query.filter_by(lesson_name = 'C major').all()),
        Song(song_title = 'Imagine', artist = 'John Lennon',song_key='C major', progressions = '1-4-2-6', chords =  ['C', 'G', 'Am',  'F', 'C','E','Dm7'], lessons = Lesson.query.filter_by(lesson_name = 'C major').all()),
        Song(song_title = 'Californication', artist = 'Red Hot Chili Peppers',song_key='C', progressions = '1-5-3-4', chords =  ['C',  'Am', 'Fmaj7', 'F', 'C','E','Dm7'], lessons = Lesson.query.filter_by(lesson_name = 'C major').all()),
        ## A major
        Song(song_title = 'Take On Me', artist = 'Ah- Ha',song_key='A major', progressions = '1-5-6', chords = ['C',   'Fmaj7', 'F', 'Dm7',], lessons = Lesson.query.filter_by(lesson_name = 'A major').all()),
        Song(song_title = 'Jimi Hendrix', artist = 'Hey Jo',song_key='A major', progressions = '1-4-5', chords =  ['C',  'Am', 'F', 'C','E',], lessons = Lesson.query.filter_by(lesson_name = 'A major').all()),
        Song(song_title = 'White Christmas', artist = 'Bing Crosby',song_key='A major', progressions = '2-4-6', chords =  ['C',  'Am', 'F', 'C'], lessons = Lesson.query.filter_by(lesson_name = 'A major').all()),
        ## Ab major
        Song(song_title = 'Fire Works', artist = 'Katie Perry',song_key='Ab major', progressions = '5-4-6', chords =  [  'F', 'E','Dm7'], lessons =Lesson.query.filter_by(lesson_name = 'Ab major').all()),
        Song(song_title = 'Every Breath You Take', artist = 'The Police',song_key='Ab major', progressions = '4-2-6', chords =  [  'F', 'C','E','Dm7'], lessons = Lesson.query.filter_by(lesson_name = 'Ab major').all()),
        Song(song_title = 'All Of Me', artist = 'John Legend',song_key='Ab major', progressions = '5-3-4', chords =  ['C',  'Am', 'Fmaj7'], lessons = Lesson.query.filter_by(lesson_name = 'Ab major').all()),





    ]
    #buIld insert seeds into db

    db.session.bulk_save_objects(seed_data)

    #Commit the changes to the dn
    db.session.commit()
    print("Seeded songs")


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_songs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM songs"))

    db.session.commit()
