//## ACTION TYPES
const LOAD_COURSES = 'course/LOAD_COURSES';
const CREATE_COURSES = 'course/CREATE_COURSES'

//## ACTION CREATORS
export const loadCourses = (courses) => ({
    type: LOAD_COURSES,
    payload: courses,
})

export const createCourses = (course) => ({
    type: CREATE_COURSES,
    payload: { course },
})



//## THUNK ACTION CREATORS
//getcourses
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

//##REDUCER
export default function courseReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_COURSES:
            {
                const newState = { ...state }
                action.payload.forEach(course => {
                    newState[course.id] = course;
                });
                return newState;
            }
        case CREATE_COURSES:
            {
                const newState = { ...state }
                newState[action.payload.course.id] = action.payload.course
                return newState;
            }
        default:
            return state;
    }
}
