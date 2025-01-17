from app.models import db, Review, Course, User, environment, SCHEMA

# from app.seeds.user_seeders import user_data
# from app.seeds.course_seeders import course_data
from sqlalchemy.sql import text


user_user_name = [user_data["username"] for user_data in user_data]
course_course_name = [course_data["course_name"] for course_data in course_data]

review_data = [
    {
        "id": 1,
        "course_id": 1,
        "review_title": "good course",
        "review": "good scales in this course for beginners",
    },
    {
        "id": 2,
        "course_id": 1,
        "review_title": "great course",
        "review": "great progressions in this course",
    },
    {
        "id": 3,
        "course_id": 2,
        "review_title": "excellent course",
        "review": "excellent scales in this course especially for intermediates",
    },
    {
        "id": 4,
        "course_id": 2,
        "review_title": "ok course",
        "review": "its ok  its kind of regular",
    },
    {
        "id": 5,
        "course_id": 5,
        "review_title": "bad course",
        "review": "this course is not good at all. simple scales",
    },
    {
        "id": 6,
        "course_id": 7,
        "review_title": "terrible course",
        "review": "this is a terrible course i would not recommend it",
    },
    {
        "id": 7,
        "course_id": 7,
        "review_title": "helpful course",
        "review": "very helpful course for people with no experience",
    },
    {
        "id": 8,
        "course_id": 7,
        "review_title": "fire course",
        "review": "hands down the best course ever created on this site.  ",
    },
]


## USER review seeding function
def seed_reviews():
    users = User.query.filter(User.username.in_(user_user_name)).all()
    courses = Course.query.filter(Course.course_name.in_(course_course_name)).all()

    for review in review_data:
        review = Review(
            id=review["id"],
            course_id=review["course_id"],
            review_title=review["review_title"],
            review=review["review"],
            user_id=users[review_data["course_id"] - 1].id,
            course_id=courses[review_data["course_id"] - 1].id,
        )
        db.session.add(review)

    db.session.commit()
    print("Seeded reviews")


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
