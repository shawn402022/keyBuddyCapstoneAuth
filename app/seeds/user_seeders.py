from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text




## USER user seeding function
user_data = [
        {
        "id":1,
        "username":"user1",
        "full_name":"Shawn Norbert",
        "password":"password",
        "email":"user1@example.com"
    },
    {
        "id":2,
        "username":"user2",
        "full_name":"Bouchra Norbert",
        "password":"password",
        "email":"user2@example.com"
    },
    {
        "id":3,
        "username":"user3",
        "full_name":"Hamzah Norbert",
        "password":"password",
        "email":"user3@example.com"
    },
    {
        "id":4,
        "username":"user4",
        "full_name":"Shahid Alexander",
        "password":"password",
        "email":"user4@example.com"
    },
    {
        "id":5,
        "username":"user5",
        "full_name":"Shirley Kay",
        "password":"password",
        "email":"user5@example.com"
    },
    {
        "id":6,
        "username":"user6",
        "full_name":"Trevor Khan",
        "password":"password",
        "email":"user6@example.com"
    },
    {
        "id":7,
        "username":"user7",
        "full_name":"Shamir Roberts",
        "password":"password",
        "email":"user7@example.com"
    },
    {
        "id":8,
        "username":"user8",
        "full_name":"Allison Nutley",
        "password":"password",
        "email":"user8@example.com"
    }
]
# Adds a demo user, you can add other users here if you want
def seed_users():
    for user in user_data:
        user = User(**user_data)
        db.session.add(user)
    db.session.commit()
    db.session.commit()
    print("Seeded users")

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()
