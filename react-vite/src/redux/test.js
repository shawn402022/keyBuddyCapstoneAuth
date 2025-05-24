// Minimal test redux slice - just for contentType
const SET_CONTENT_TYPE = 'test/setContentType';
const CLEAR_CONTENT_TYPE = 'test/clearContentType';

// Simple action creators
const setContentType = (contentType) => ({
    type: SET_CONTENT_TYPE,
    payload: contentType
});

const clearContentType = () => ({
    type: CLEAR_CONTENT_TYPE
});

// Simple thunk to set content type
export const thunkSetContentType = (contentType) => (dispatch) => {
    console.log('Setting content type:', contentType);
    dispatch(setContentType(contentType));
};

// Export for direct use if needed
export { setContentType, clearContentType };

// Minimal initial state
const initialState = {
    contentType: null
};

// Simple reducer
function testReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CONTENT_TYPE:
            return {
                ...state,
                contentType: action.payload
            };
        case CLEAR_CONTENT_TYPE:
            return {
                ...state,
                contentType: null
            };
        default:
            return state;
    }
}

export default testReducer;
