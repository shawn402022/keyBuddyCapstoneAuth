//## ACTION TYPES
const LOAD_PROGRESSIONS = 'progression/LOAD_PROGRESSIONS';

//## ACTION CREATORS
export const loadProgressions = (progressions) => ({
    type: LOAD_PROGRESSIONS,
    payload: progressions,
})

//## THUNK ACTION CREATORS
export const getProgressions = () => async (dispatch) => {
    const response = await fetch('/api/progression');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadProgressions(data));
    } else {
        console.error('Error fetching progressions');
    }
}


//##REDUCER

export default function progressionReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_PROGRESSIONS:
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
