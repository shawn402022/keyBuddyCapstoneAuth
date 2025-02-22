import { createSlice } from '@reduxjs/toolkit';
import { SpacedRepetitionManager } from '../services/SpacedRepetitionManager';

const spacedRepetitionSlice = createSlice({
    name: 'spacedRepetition',
    initialState: {
        items: {},
        masteredItems: [],
        sessionStats: {
            started: null,
            totalAnswered: 0,
            correctAnswers: 0
        }
    },
    reducers: {
        updateItemProgress(state, action) {
            const { itemId, isCorrect, timestamp } = action.payload;

            if (!state.items[itemId]) {
                state.items[itemId] = {
                    correctCount: 0,
                    incorrectCount: 0,
                    interval: 1,
                    lastSeen: timestamp,
                    quality: 3 // Initial quality rating (1-5)
                };
            }

            const item = state.items[itemId];

            // Update stats
            if (isCorrect) {
                item.correctCount++;
                state.sessionStats.correctAnswers++;
            } else {
                item.incorrectCount++;
            }

            state.sessionStats.totalAnswered++;

            // Calculate new interval
            item.interval = SpacedRepetitionManager.calculateNextInterval(item);
            item.lastSeen = timestamp;

            // Check for mastery
            if (SpacedRepetitionManager.isMastered(item)) {
                state.masteredItems.push(itemId);
            }
        },

        startNewSession(state) {
            state.sessionStats = {
                started: Date.now(),
                totalAnswered: 0,
                correctAnswers: 0
            };
        },

        retireItem(state, action) {
            const itemId = action.payload;
            // Remove from active items
            if (state.items[itemId]) {
                delete state.items[itemId];
            }
            // Add to mastered items if not already there
            if (!state.masteredItems.includes(itemId)) {
                state.masteredItems.push(itemId);
            }
        }
    }
});

export const { updateItemProgress, startNewSession, retireItem } = spacedRepetitionSlice.actions;
export default spacedRepetitionSlice.reducer;
