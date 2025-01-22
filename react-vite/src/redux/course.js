//## ACTION TYPES
const LOAD_COURSES = 'course/LOAD_COURSES';

//## ACTION CREATORS
export const loadCourses = (courses) => ({
    type: LOAD_COURSES,
    payload: courses,
})

//## THUNK ACTION CREATORS
export const getCourses = () => async (dispatch) => {
    const response = await fetch('/api/course');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadCourses(data));
    } else {
        console.error('Error fetching courses');
    }
}


//##REDUCER
export default function courseReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_COURSES:
        {
            const newState = {...state}
            action.payload.forEach(course => {
                newState[course.id] = course;
            });
            return newState;
        }
        default:
            return state;
    }
}
