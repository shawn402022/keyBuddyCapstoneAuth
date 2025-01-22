//## ACTION TYPES
const LOAD_CHORDS = 'chord/LOAD_CHORDS';

//## ACTION CREATORS


export const loadChords = (chords) => ({
    type: LOAD_CHORDS,
    payload: chords,
})

//## THUNK ACTION CREATORS
export const getChords = () => async (dispatch) => {
    const response = await fetch('/api/chord');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadChords(data));
    } else {
        console.error('Error fetching chords');
    }
}


//##REDUCER

export default function chordReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_CHORDS:
        {
            const newState = {...state}
            action.payload.forEach(chord => {
                newState[chord.id] = chord;
            });
            return newState;
        }
        default:
            return state;


    }
}
