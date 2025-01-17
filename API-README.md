# KEY BUDDY

## Database Schema Design



![KeyBuddySchema](/images/keybuddy_schema.jpg)

## API Documentation

## User Authentication/Authorization

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: '/user'
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

* Require Authentication: false
  * Method: POST
  * Route path: '/user'
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: Get
  * Route path: '/users/signup'
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## Lessons

### Get all Lessons

Returns all available the Lessons.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: '/lessons'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Lessons": [
        {
          "id": 1,
          "name":"C Major",
          "key":"C",
          "LessonType":"Scale",
          "description": "Practice common note in the scale of C major",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Difficulty": "beginner",
          "previewImage": "image url"
        },
        {
          "id": 2,
          "name": "C Major Chords",
          "key":"C",
          "lessonType":"Chords",
          "description": "Practice common chords and Songs in the key of C",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Difficulty": "intermediate",
          "previewImage": "image url"
        },
        {
          "id": 3,
          "name": "Progressions",
          "key":"Cm",
          "LessonType":"Progression",
          "description": "Practice commonly used Chord Progressions",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Difficulty": "challenging",
          "previewImage": "image url"
        },
      ]
    }
    ```

### Get all Lessons completed by the Current User

Returns all the lessons completed by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: '/:userId/lessons'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
           {
          "id": 1,
          "name":"C Major",
          "key":"C",
          "LessonType":"Scale",
          "description": "Practice common note in the scale of C major",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Difficulty": "beginner",
          "previewImage": "image url"
        },
        {
          "id": 2,
          "name": "C Chords",
          "key":"C",
          "LessonType":"Chords",
          "description": "Practice common chords in the key of C",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Difficulty": "intermediate",
          "previewImage": "image url"
        },
        {
          "id": 3,
          "name": "C Chord Progressions",
          "key":"C",
          "LessonType":"Chord Progression",
          "description": "Practice commonly used Chord Progressions",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Difficulty": "challenging",
          "previewImage": "image url"
        },
    ```

### Get details of a lesson from an id

Returns the details of a lesson specified by its id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path:'/lesson/:lessonId'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "details": {
          "Name": "C major",
          "Pulls to":" 'C' pulls to 'F'",
          "Pulls from":" 'C' pulls from 'G'",
          "Long Description": "C major is scale is a major scale based on C, consisting of the keys.
            C,D,E,F,G,A and B. C major is one of the most common keys used in music. Its key signature has no flats or sharps, and it's relative minor is A minor, and its parallel minor is C minor.
          ",
          "SongsInKey":
          {
          "Beatles":"Let it Be",
          "Fleetwood Mac":"Dreams",
          "Bill Withers":"Ain't No Sunshine",
          "BrunoMars":"if I was your man"
          },
          "ChordsInKey":
          {
          "I":"C", "II":"Dm","III":"Em",
          "IV":"F","V":"G","VI":"Am",
          "VII":"Bdim",
          },
          "KeysInScale": {
            "I":"C",
            "II":"D",
            "III":"E",
            "IV":"F",
            "V":"G",
            "VI":"A",
            "VII":"B",
          },
          "progression": [
            {
            "progressionId": 1,
            "type":"Jazz",
            "ii": "Dm7B5",
            "V": "G7b9",
            "I": "Cm7"
            }
          ],

      },
    }

## Courses

### Design a course

Creates and returns a new course, comprised of 1 - 4 different lessons.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: /:userId/courses
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name":"Course Name",
      "lesson1": "C Major",
      "lesson2": "C Minor",
      "lesson3": "D Minor",
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json

    {
      "name":"Course Name",
      "lesson1": "C Major",
      "lesson2": "C Minor",
      "lesson3": "D Minor",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
          "name": "Choose name for Course",
          "lesson 1": " Must have at least 1 lesson",

      }
    }
    ```

### Get Course Details by id

Creates and returns a new course, comprised of 1 - 4 different lessons.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /:userId/course/:courseId
  * Headers:
    * Content-Type: application/json
  * Body:



* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id":"1",
      "name":"Course Name",
      "lesson1": {
          "name":"C Major",
          "key":"C",
          "type":"Scales",
          "style":"",
      },
      "lesson2": {
          "name":"C Minor",
          "key":"Cm",
          "type":"Chords",
          "style":"modern",
      },
      "lesson3": {
          "name":"D Minor",
          "key":"Dm",
          "type":"Chord Progression",
          "style":"jazz",
      },
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```



### Edit a Course

Updates and returns an existing course.

* Require Authentication: true
* Require proper authorization: Spot must belong to the current user
* Request
  * Method: POST
  * Route path: '/:userId/course/:courseId/edit'
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name":"Course Name",
      "lesson 1": "C major",
      "lesson 2": "C minor",
      "lesson 3": "Jazz Chord Progression",
      "lesson 4": "Rock Chord Progression",
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "name":"Course Name",
      "lesson 1": "C major",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "lesson": "You must have at least 1 lesson",

      }
    }
    ```

### Get current user courses

returns the current users courses.

* Require Authentication: true
* Require proper authorization: course must belong to the current user
* Request
  * Method: GET
  * Route path: '/:userId/course'
  * Headers:
    * Content-Type: application/json
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Courses": [
        {
          "id": 1,
          "name":"Coarse Name",
          "description": "Course Description",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
        },
        {
          "id": 2,
          "name": "Course Name",
          "description": "Course Description",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
        },
      ]
    }

    ```


### Delete a Course

Deletes The current User's existing course.

* Require Authentication: true
* Require proper authorization: course must belong to the current user
* Request
  * Method: POST
  * Route path: '/:userId/course/:courseId/delete'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Authentication errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "errors": "Course does not belong to user"
    }
    ```

### Publish a Course

Publishes an existing course for other Users to try.

* Require Authentication: true
* Require proper authorization: course must belong to the current user
* Request
  * Method: POST
  * Route path: '/:userId/course/:courseId/publish'
  * Body:
    ```json
    { "name": "course name",
      "lesson 1": "C major",
      "lesson 2": "C minor",
      "lesson 3": "Jazz Chord Progression",
      "lesson 4": "Rock Chord Progression",
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "ownerId": 1,
      "name":"Course Name",
      "created by":" owner name",
      "lesson 1": "C major",
      "lesson 2": "C minor",
      "lesson 3": "Jazz Chord Progression",
      "lesson 4": "Rock Chord Progression",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

### Get all Courses published by  other Users

Returns all the courses published by other users.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: '/published-courses'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Published": [
        {
          "id": 1,
          "ownerId":1,
          "name":"Coarse Name",
          "created by": "owner name",
          "subscribed": 1,
          "description": "Course Description",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
        },
        {
          "id": 2,
          "ownerId":2,
          "name":"Coarse Name",
          "created by": "owner name",
          "subscribed": 1,
          "description": "Course Description",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
        },


      ]
    }
    ```

## Reviews

### Get all Reviews by a Course's id

Returns all the reviews that belong to a course specified by id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: '/course/:courseId/reviews'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "courseId": 1,
          "review": "This was an awesome course!",
          "stars": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36" ,
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
        }
      ]
    }
    ```

* Error response: Couldn't find a Course with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Course couldn't be found"
    }
    ```

### Create a Review for a Course based on the Course's id

Create and return a new review for a spot specified by id.

* Require Authentication: true
* Request
  * Method: POST
  * Route path:'/course/:courseId/reviews'
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "review": "This was an awesome course!",
      "stars": 5,
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome course!",
      "stars": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    }
    ```

* Error response: Couldn't find a Spot with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Course couldn't be found"
    }
    ```

* Error response: Review from the current user already exists for the Course
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already has a review for this course"
    }
    ```


### Edit a Review

Update and return an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: PATCH
  * Route path: /reviews/:reviewId
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "review": "This was an awesome course!",
      "stars": 4,
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome course, cant wait for another !",
      "stars": 4,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    }
    ```

* Error response: Couldn't find a Review with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

### Delete a Review

Delete an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: DELETE
  * Route path: reviews/:reviewId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error response: Couldn't find a Review with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```


## Add Query Filters to Get All Courses

Return Lessons filtered by query parameters.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: '/courses'
  * Query Parameters
    * page: integer, minimum: 1, default: 1
    * size: integer, minimum: 1, maximum: 20, default: 20
    * key: string, optional
    * scale: string, optional
    * chord: string, optional


  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Lessons": [
        {
          "id": 1,
          "lessonId": 1,
          "name": "Lesson name",
          "key": "123 Disney Lane",
          "scale": "San Francisco",
          "chord": "California",
          "description": "Place where web developers are created",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url"
        }
      ],
      "page": 2,
      "size": 20
    }
    ```

* Error Response: Query parameter validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be between 1 and 20",
      }
    }
    ```
