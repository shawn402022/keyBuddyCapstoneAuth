import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        isActive: false,
        currentScore: 0,
        currentTraining: null
    },
    reducers: {
        setGameActive: (state, action) => {
            state.isActive = action.payload;
        },
        setCurrentTraining: (state, action) => {
            state.currentTraining = action.payload;
        },
        setScore: (state, action) => {
            state.currentScore = action.payload;
        },
        startTraining: (state, action) => {
            state.isActive = true;
            state.currentTraining = action.payload;
            state.currentScore = 0;
        }
    }
});

export const { setGameActive, setCurrentTraining, setScore, startTraining } = gameSlice.actions;
export default gameSlice.reducer;
