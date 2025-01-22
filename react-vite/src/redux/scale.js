//## ACTION TYPES
const LOAD_SCALES = 'scale/LOAD_SCALES';

//## ACTION CREATORS
export const loadScales = (scales) => ({
    type: LOAD_SCALES,
    payload: scales,
})

//## THUNK ACTION CREATORS
export const getScales = () => async (dispatch) => {
    const response = await fetch('/api/scale');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadScales(data));
    } else {
        console.error('Error fetching scales');
    }
}


//##REDUCER
export default function scaleReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_SCALES:
        {
            const newState = {...state}
            action.payload.forEach(scale => {
                newState[scale.id] = scale;
            });
            return newState;
        }
        default:
            return state;


    }
}
