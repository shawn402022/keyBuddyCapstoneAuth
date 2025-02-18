// Action Types
const SET_USER_COURSES = 'userCourses/SET_USER_COURSES';
const ADD_USER_COURSE = 'userCourses/ADD_USER_COURSE';

// Action Creators
export const setUserCourses = (courses) => ({
    type: SET_USER_COURSES,
    payload: courses
});

export const addToUserCourses = (courseData) => async (dispatch, getState) => {
    const {session} = getState();
    const userId = session.user.id;


    const response = await fetch(`/api/course/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch({
            type: ADD_USER_COURSE,
            payload: data
        });
        return data;
    }
};


// Thunk
export const getUserCourses = () => async (dispatch, getState) => {
    const {session} = getState();
    const userId = session.user.id;

    const response = await fetch(`/api/course/${userId}`);
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
        case ADD_USER_COURSE:
            return[...state, action.payload];
        default:
            return state;
    }
};

export default userCoursesReducer;
