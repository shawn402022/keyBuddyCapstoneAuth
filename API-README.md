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

Return Scales filtered by query parameters.

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
      "Scales": [
        {
          "id": 1,
          "scaleId": 1,
          "name": "Scale name",
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
