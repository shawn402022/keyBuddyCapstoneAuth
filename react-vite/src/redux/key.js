//## ACTION TYPES
const LOAD_KEYS = 'key/LOAD_KEYS';

//## ACTION CREATORS
export const loadKeys= (keys) => ({
    type: LOAD_KEYS,
    payload: keys,
})

//## THUNK ACTION CREATORS
export const getKeys = () => async (dispatch) => {
    const response = await fetch('/api/key');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadKeys(data));
    } else {
        console.error('Error fetching keys');
    }
}


//##REDUCER
export default function keysReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_KEYS:
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
