//## ACTION TYPES
const LOAD_REVIEWS = 'course/LOAD_REVIEWS';

//## ACTION CREATORS
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    payload: reviews,
})

//## THUNK ACTION CREATORS
export const getReviews = () => async (dispatch) => {
    const response = await fetch('/api/review');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data));
    } else {
        console.error('Error fetching reviews');
    }
}


//##REDUCER

export default function reviewReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_REVIEWS:
        {
            const newState = {...state}
            action.payload.forEach(review => {
                newState[review.id] = review;
            });
            return newState;
        }
        default:
            return state;


    }
}
