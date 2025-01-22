# KEY BUDDY
## how to install
npm install tonal --save
npm install webmidi

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

## Scales

### Get all Scales

Returns all available the Scales.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: '/scale'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
   [
    {
        "flats": 7,
        "id": 5,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    {
        "flats": 0,
        "id": 6,
        "name": "A min",
        "notes": "A,B,C,D,E,F,G,A",
        "pulls_from": "E",
        "pulls_to": "D",
        "root": "A",
        "sharps": 0,
        "signature": "natural",
        "type": "min"
    }
    ]

    ```

### Get all Scales by signature

Returns all scales in a specific key signature ie  flat, natural sharp.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: '/scale/:signature'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    [
    {
        "flats": 7,
        "id": 5,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    {
        "flats": 0,
        "id": 6,
        "name": "A min",
        "notes": "A,B,C,D,E,F,G,A",
        "pulls_from": "E",
        "pulls_to": "D",
        "root": "A",
        "sharps": 0,
        "signature": "natural",
        "type": "min"
    }
    ]
    ```

* Error Response: Not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
          "msg": "No scales found with that signature",

      }
    }
    ```

### Get scale by root

Returns all scales in a specific root.

* Require Authentication: false
* Request
  * Method: GET
  * Route path:'/scale/root/:root'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "flats": 0,
        "id": 1,
        "name": "C maj",
        "notes": "C,D,E,F,G,A,B,C",
        "pulls_from": "E",
        "pulls_to": "D",
        "root": "C",
        "sharps": 0,
        "signature": "natural",
        "type": "maj"
    },
    {
        "flats": 6,
        "id": 2,
        "name": "Db maj",
        "notes": "Db,Eb,F,Gb,Ab,Bb,C,Db",
        "pulls_from": "Ab",
        "pulls_to": "Gb",
        "root": "A",
        "sharps": 0,
        "signature": "flat",
        "type": "maj"
    },

    ```
* Error Response: Not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
          "msg": "No scales found with that root",

      }
    }
    ```

### Get scale by type

Returns all scales in a specific type ie major, mine.

* Require Authentication: true
* Request
  * Method: GET
  * Route path:'/scale/type/:type'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
```json
    {
        "flats": 7,
        "id": 5,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    {
        "flats": 0,
        "id": 6,
        "name": "A min",
        "notes": "A,B,C,D,E,F,G,A",
        "pulls_from": "E",
        "pulls_to": "D",
        "root": "A",
        "sharps": 0,
        "signature": "natural",
        "type": "min"
    }
```

* Error Response: Not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
          "msg": "No scales found with that type
      }
    }
    ```
### ADMIN create scale
Creates scale and adds to database

* Require Authentication: true
* Request
  * Method: POST
  * Route path:'/scale/admin
  * Body:
    ```json
       {
        "flats": 7,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    ```


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
       {
        "flats": 7,
        "id": 5,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    ```

### ADMIN udpate scale
Creates scale and adds to database

* Require Authentication: true
* Request
  * Method: PUT
  * Route path:'/scale/admin
  * Body:
    ```json
       {
        "flats": 7,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    ```


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
       {
        "flats": 7,
        "id": 5,
        "name": "Ab min",
        "notes": "Ab,Bb,Cb,Db,Eb,Fb,Gb,Ab",
        "pulls_from": "Eb",
        "pulls_to": "Db",
        "root": "Ab",
        "sharps": 0,
        "signature": "flat",
        "type": "min"
    },
    ```




## Courses

### Get All Courses

returns all courses available

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /course
  * Headers:
    * Content-Type: application/json
  * Body: None


* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json

    {
        "course_name": "C course",
        "details_of_course": " All Chords in C",
        "id": 1
    },
    {
        "course_name": "D course",
        "details_of_course": " All Chords in D",
        "id": 2
    },
    {
        "course_name": "E course",
        "details_of_course": " All Chords in E",
        "id": 3
    },
    ```


### Get User courses

returns all the users courses

* Require Authentication: true
* Require proper authorization: Course must belong to the current user
* Request
  * Method: GET
  * Route path: /course/:userId
  * Headers:
    * Content-Type: application/json
  * Body:



* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    "courses": [
        {
            "course_name": "C course",
            "details_of_course": " All Chords in C",
            "id": 1
        },
        {
            "course_name": "D course",
            "details_of_course": " All Chords in D",
            "id": 2
        }
    ],
    "full_name": "Shawn Norbert"
    ```
* Error Response: Not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
          "msg": "Unauthorized- you can only view your own courses",

      }
    }
    ```


### Admin add a course to database

Allows Admin to add courses to database for users to use.

* Require Authentication: true
* Require proper authorization: Course must belong to the current user
* Request
  * Method: POST
  * Route path: '/course/admin'
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "course_name": "C course",
        "details_of_course": " All Chords in C",
    },
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "course_name": "C course",
        "details_of_course": " All Chords in C",
        "id": 8
    },
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
        "msg": "Unauthorized- Only admin can add courses",

      }
    }
    ```

### users add course to use

returns the current users courses.

* Require Authentication: true
* Require proper authorization: course must belong to the current user
* Request
  * Method: POST
  * Route path: '/course/:userId'
  * Headers:
    * Content-Type: application/json
  * Body:
     ```json
    {
    {
        "course_name": "C course",
        "details_of_course": " All Chords in C",
    },
    {
        "course_name": "D course",
        "details_of_course": " All Chords in D",
    },

    }

    ```


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    {
        "course_name": "C course",
        "details_of_course": " All Chords in C",
        "id": 1
    },
    {
        "course_name": "D course",
        "details_of_course": " All Chords in D",
        "id": 2
    },

    }

    ```


### user Delete a Course

Deletes The current User's existing course.

* Require Authentication: true
* Require proper authorization: course must belong to the current user
* Request
  * Method: DELETE
  * Route path: 'course/:userId/:courseId'
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
      "scale 1": "C major",
      "scale 2": "C minor",
      "scale 3": "Jazz Chord Progression",
      "scale 4": "Rock Chord Progression",
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
      "scale 1": "C major",
      "scale 2": "C minor",
      "scale 3": "Jazz Chord Progression",
      "scale 4": "Rock Chord Progression",
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

### Get all Reviews

Returns all the reviewss

* Require Authentication: false
* Request
  * Method: GET
  * Route path: '/course/review
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 1,
        "review_content": "great app, my boo did his thing",
        "reviewer_name": "Bouchra Norbert"
    },
    {
        "id": 2,
        "review_content": "this app is fire, he said he would, we thought we could and he did",
        "reviewer_name": "Shahid Alexander"
    },
    {
        "id": 3,
        "review_content": "Very Proud of the homie.  He gets it done ",
        "reviewer_name": "Shirley Kay"
    },
    ```



### Create a Review

Create a review for the application

* Require Authentication: true
* Request
  * Method: POST
  * Route path:'/review'
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "review_content": "THIS APP SUCKS!!",
        "reviewer_name": "Shamir Roberts"
    },
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 5,
        "review_content": "THIS APP SUCKS!!",
        "reviewer_name": "Shamir Roberts"
    },
    ```


### Edit a Review

Update and return an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: PATCH
  * Route path: /review/:reviewId
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "review_content": "This is actually a pretty cool App",
    },
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 4,
        "review_content": "This is actually a pretty cool App",
        "reviewer_name": "Trevor Khan"
    },
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
        "msg": "Unaurthorized - you cna only update your own reviews",

      }
    }
    ```

### Delete a Review

Delete an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: DELETE
  * Route path: review/:reviewId
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


## Chords

### Get all Chords

Returns all the chords

* Require Authentication: True
* Request
  * Method: GET
  * Route path: '/chord'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "chord_family": "C",
        "chord_name": "C maj",
        "id": 1,
        "notes": "C,E,G"
    },
    {
        "chord_family": "C",
        "chord_name": "C min",
        "id": 2,
        "notes": "C,D#,G"
    },
    {
        "chord_family": "C",
        "chord_name": "C# min",
        "id": 3,
        "notes": "C#,E,G#"
    },
    ```



### Get chord by root/chord family

Get all chords with a certain root /chord family

* Require Authentication: true
* Request
  * Method: GET
  * Route path:'/chord/root/:chord_family'
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
        "chord_family": "D",
        "chord_name": "Db maj",
        "id": 7,
        "notes": "Db,F,Ab"
    },
    {
        "chord_family": "D",
        "chord_name": "D maj",
        "id": 8,
        "notes": "D,F#,A"
    },
    {
        "chord_family": "D",
        "chord_name": "D#",
        "id": 9,
        "notes": "D,G,A#"
    },
    ```


### ADMIN add chord to database

Update and return an existing review.

* Require Authentication: true
* Require proper authorization: Review must be admin
  * Method: POST
  * Route path: /admin
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "chord_family": "D",
        "chord_name": "Db aug",
        "notes": "Db,F,A"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "chord_family": "D",
        "chord_name": "Db aug",
        "id": 13,
        "notes": "Db,F,A"
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
        "msg": "Unaurthorized - only admin can add chords",

      }
    }
    ```

### ADMIN update chord in database

update a chord

* Require Authentication: true
* Require proper authorization: Admin must be logged on
* Request
  * Method: PUT
  * Route path: chord/admin/:chordId
  * Body:
    ```json
    {

        "notes": "C,D#,F#,E,A,G,"
    },
    ```
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "chord_family": "C",
        "chord_name": "C dim",
        "id": 5,
        "notes": "C,D#,F#,E,A,G"
    },
    ```

* Error response: Unauthorized - only admin can update chords
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

### ADMIN delete chord in database

update a chord

* Require Authentication: true
* Require proper authorization: Admin must be logged on
* Request
  * Method: DELETE
  * Route path: chord/admin/:chordId
  * Body:

    ```
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Chord deleted successfully "
    }
    ```

* Error response: Unauthorized - only admin can update chords
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


## Progressions

### Get all Progressions

Returns all the progressions

* Require Authentication: True
* Request
  * Method: GET
  * Route path: '/progression'
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 1,
        "progression_name": "1-4-5-6",
        "progression_type": "maj",
        "progression_style":" jazz"

    },
    {
        "id": 2,
        "progression_name": "1-4-6-5",
        "progression_type": "maj",
         "progression_style":" rock"
    },
    ```



### Get progression by type

Get all chords with a certain root /chord family

* Require Authentication: true
* Request
  * Method: GET
  * Route path:'/chord/root/:chord_family'
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
        "chord_family": "D",
        "chord_name": "Db maj",
        "id": 7,
        "notes": "Db,F,Ab"
    },
    {
        "chord_family": "D",
        "chord_name": "D maj",
        "id": 8,
        "notes": "D,F#,A"
    },
    {
        "chord_family": "D",
        "chord_name": "D#",
        "id": 9,
        "notes": "D,G,A#"
    },
    ```


### ADMIN add progression to database

    add a progression to the database

* Require Authentication: true
* Require proper authorization: Review must be admin
  * Method: POST
  * Route path: /admin
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "progression_name": "1-4-6-5",
        "progression_style": "rock",
        "progression_type": "maj"
    },
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 1,
        "progression_name": "1-4-5-6",
        "progression_style": "rock",
        "progression_type": "maj"
    },
    {
        "id": 2,
        "progression_name": "1-4-6-5",
        "progression_style": "rock",
        "progression_type": "maj"
    },
    ```

* Error Response:  errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "msg": "Unauthorized - only admin can add progressions",

      }
    }
    ```

### ADMIN update progression in database

update a progression

* Require Authentication: true
* Require proper authorization: Admin must be logged on
* Request
  * Method: PUT
  * Route path: progression/admin/:progressionId
  * Body:
    ```json
    {

        "progression_name": "1-4-6-5-7",

    },
    ```
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id":"2",
        "progression_name": "1-4-6-5-7",
        "progression_style": "rock",
        "progression_type": "min"
    },
    ```

* Error response: Unauthorized - only admin can update chords
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "unauthorized - Only admin can update progressions"
    }
    ```
## Keys

### get all keys

    get all keys

* Require Authentication: true
* Require proper authorization:  must be admin
  * Method: GET
  * Route path: /key
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
        "id": 1,
        "key_description": "alskdfja;sldkfjasfdsasdf",
        "key_name": "C"
    },
    {
        "id": 2,
        "key_description": "alskdfja;sldkfjasfdsasdf",
        "key_name": "C#"
    },
    {
        "id": 3,
        "key_description": "alskdfja;sldkfjasfdsasdf",
        "key_name": "Db"
    },
    ```



### ADMIN update a key in database

update a key

* Require Authentication: true
* Require proper authorization: Admin must be logged on
* Request
  * Method: PUT
  * Route path: key/admin/:keyId
  * Body:
    ```json
    {

        "key_description": "very natural key ",

    },
    ```
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 1,
        "key_description": "alskdfja;sldkfjasfdsasdf",
        "key_name": "C"
    },
    {
        "id": 2,
        "key_description": "very natural key",
        "key_name": "C#"
    },
    ```

* Error response: Unauthorized - only admin can update chords
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "unauthorized - Only admin can update progressions"
    }
    ```
