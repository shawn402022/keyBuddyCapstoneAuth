// Action Types
const SET_USER_COURSES = 'userCourses/SET_USER_COURSES';

// Action Creators
export const setUserCourses = (courses) => ({
    type: SET_USER_COURSES,
    payload: courses
});

// Thunk
export const getUserCourses = () => async (dispatch) => {
    const response = await fetch('/api/course/2');
    if (response.ok) {
        const data = await response.json();
        dispatch(setUserCourses(data.courses));
    }
};

// Reducer
const initialState = [];

const userCoursesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_COURSES:
            return action.payload;
        default:
            return state;
    }
};

export default userCoursesReducer;
