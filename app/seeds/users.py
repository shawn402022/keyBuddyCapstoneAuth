from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


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
