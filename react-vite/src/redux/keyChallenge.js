const SET_GAME_STATUS = 'keyChallenge/SET_GAME_STATUS';
const SET_MESSAGE = 'keyChallenge/SET_MESSAGE';
const SET_TARGET_KEY = 'keyChallenge/SET_TARGET_KEY';
const SET_FEEDBACK = 'keyChallenge/SET_FEEDBACK';

export const setGameStatus = (status) => ({
    type: SET_GAME_STATUS,
    payload: status
});

export const setMessage = (message) => ({
    type: SET_MESSAGE,
    payload: message
});

export const setTargetKey = (key) => ({
    type: SET_TARGET_KEY,
    payload: key
});

export const setFeedback = (feedback) => ({
    type: SET_FEEDBACK,
    payload: feedback
});

const initialState = {
    isGameActive: false,
    message: "",
    targetKey: "",
    feedback: ""
};

export default function keyChallengeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_GAME_STATUS:
            return { ...state, isGameActive: action.payload };
        case SET_MESSAGE:
            return { ...state, message: action.payload };
        case SET_TARGET_KEY:
            return { ...state, targetKey: action.payload };
        case SET_FEEDBACK:
            return { ...state, feedback: action.payload };
        default:
            return state;
    }
}
