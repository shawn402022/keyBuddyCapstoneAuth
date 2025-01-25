//## ACTION TYPES
const LOAD_COURSES = 'course/LOAD_COURSES';
const CREATE_COURSES = 'course/CREATE_COURSES';
const DELETE_COURSES = 'course/DELETE_COURSES';
const UPDATE_COURSES = 'course/UPDATE_COURSES';

//## ACTION CREATORS
export const loadCourses = (courses) => ({
    type: LOAD_COURSES,
    payload: courses,
});

export const createCourses = (course) => ({
    type: CREATE_COURSES,
    payload: { course },
});

export const deleteCourses = (courseId) => ({
    type: DELETE_COURSES,
    payload: courseId
});

export const updateCourses = (course_id, course_name, details_of_course) => ({
    type: UPDATE_COURSES,
    payload: {
        course_id,
        course_name,
        details_of_course
    }
})

//## THUNK ACTION CREATORS
//get courses
export const getCourses = () => async (dispatch) => {
    const response = await fetch('/api/course/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(loadCourses(data));
    } else {
        console.error('Error fetching courses');
    }
}

//create courses
export const createCoursesFetch = (course_name, details_of_course) => async (dispatch) => {
    const response = await fetch('/api/course/admin', {
        method: 'POST',
        body: JSON.stringify({
            course_name,
            details_of_course
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createCourses(data));
    } else {
        console.error('Error creating courses');
    }
}
//## delete courses
export const deleteCourseThunk = (courseId) => async (dispatch) => {
    console.log('Delete request starting for course:', courseId);
    try {
        const response = await fetch(`/api/course/admin/delete/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            dispatch({
                type: DELETE_COURSES,
                payload: courseId
            });
            dispatch(getCourses());
            return { success: true };
        }
    } catch (error) {
        console.log('Delete operation failed:', error);
        return error;
    }
}//update courses
export const updateCourseThunk = (course_id, course_name, details_of_course) => async (dispatch) => {
    const response = await fetch(`/api/course/admin/${course_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            course_name,
            details_of_course
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    if (response.ok) {
        const updatedCourse = await response.json();
        dispatch(updateCourses(course_id, course_name, details_of_course));
        return updatedCourse;
    }
};

//##REDUCER
export default function courseReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_COURSES: {
            const newState = { ...state };
            action.payload.forEach(course => {
                newState[course.id] = course;
            });
            return newState;
        }
        case CREATE_COURSES: {
            const newState = { ...state };
            newState[action.payload.course.id] = action.payload.course;
            return newState;
        }
        case DELETE_COURSES: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        case UPDATE_COURSES: {
            const newState = { ...state };
            newState[action.payload.course_id] = {
                id: action.payload.course_id,
                course_name: action.payload.course_name,
                details_of_course: action.payload.details_of_course
            };
            return newState;
        }
        default:
            return state;
    }
}
