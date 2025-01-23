// ACTION TYPES
const LOAD_REVIEWS = 'review/LOAD_REVIEWS';
const ADD_REVIEW = 'review/ADD_REVIEW';
const DELETE_REVIEW = 'review/DELETE_REVIEW';
const UPDATE_REVIEW = 'review/UPDATE_REVIEW';

// ACTION CREATORS
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    payload: reviews,
});

export const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review,
});

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    payload: reviewId,
});

export const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    payload: review,
});

// THUNK ACTION CREATORS
export const getReviews = () => async (dispatch) => {
    const response = await fetch('/api/review');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data));
    }
};

export const createReview = (reviewContent) => async (dispatch) => {
    const response = await fetch('/api/review/create', {  // Updated endpoint path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_content: reviewContent }),
    });
    if (response.ok) {
        const newReview = await response.json();
        dispatch(addReview(newReview));
        return newReview;
    }
};
// REDUCER
const initialState = {};

export default function reviewReducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_REVIEWS: {
            const newState = {};
            action.payload.forEach(review => {
                newState[review.id] = review;
            });
            return newState;
        }
        case ADD_REVIEW: {
            const newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        case UPDATE_REVIEW: {
            const newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        default:
            return state;
    }
}
