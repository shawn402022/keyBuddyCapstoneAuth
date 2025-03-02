import { createSlice } from '@reduxjs/toolkit';

const spacedRepetitionSlice = createSlice({
  name: 'spacedRepetition',
  initialState: {
    queue: [],
    masteredItems: {},
    currentItem: null,
    startTime: null,
    isComplete: false,
    isInitialized: false
  },
  reducers: {
    initializeItems: (state, action) => {
      // Reset state
      state.queue = [];
      state.masteredItems = {};
      state.currentItem = null;
      state.startTime = null;
      state.isComplete = false;

      // Handle different content formats (scale or array)
      let items = [];
      if (action.payload?.type === 'scale' && action.payload.notes) {
        items = action.payload.notes;
      } else if (Array.isArray(action.payload)) {
        items = action.payload.map(item =>
          typeof item === 'string' ? item.replace(',', '').trim() : item
        );
      } else {
        return; // Invalid format
      }

      // Initialize queue with extracted items
      state.queue = items.map(item => ({
        value: item,
        mastered: false
      }));

      // Initialize mastered items tracking
      state.masteredItems = items.reduce((acc, item) => {
        acc[item] = { mastered: false, color: 'lightgrey' };
        return acc;
      }, {});

      state.isInitialized = true;
    },

    getNextItem: (state) => {
      if (state.queue.length === 0) return;

      // Ensure enough time has passed
      const now = Date.now();
      const minTimeGap = 800; // milliseconds

      if (state.startTime && (now - state.startTime < minTimeGap)) {
        console.log("Processing next item with timing adjustment");
      }

      // Get next item and update state
      state.currentItem = state.queue[0];
      state.queue.shift();
      state.startTime = Date.now();

      return state.currentItem.value;
    },

    processResult: (state, action) => {
      if (!state.currentItem || !action.payload.correct) return;

      const timeTaken = (Date.now() - state.startTime) / 1000;
      const { value } = state.currentItem;

      // Update mastery status based on time
      if (timeTaken < 2) {
        // Fast answer - mark as mastered
        state.masteredItems[value] = { mastered: true, color: 'red' };
      } else {
        // Not mastered - keep or update status
        state.masteredItems[value] = { mastered: false, color: 'lightgrey' };

        // Re-insert into queue based on time
        const newItem = { value, mastered: false };

        if (timeTaken < 4) {
          // End of queue
          state.queue.push(newItem);
        } else if (timeTaken < 5) {
          // Middle of queue
          const mid = Math.floor(state.queue.length / 2);
          state.queue.splice(mid, 0, newItem);
        } else {
          // Near front
          state.queue.splice(Math.min(1, state.queue.length), 0, newItem);
        }
      }

      // Clear current item
      state.currentItem = null;

      // Check if everything is mastered
      const allMastered = state.queue.length === 0 &&
        Object.values(state.masteredItems).every(item => item.mastered);

      state.isComplete = allMastered;
    },

    resetLearning: (state) => {
      // Reset queue with all items
      const allItems = Object.keys(state.masteredItems);
      state.queue = allItems.map(value => ({ value, mastered: false }));

      // Reset mastery status
      for (const key in state.masteredItems) {
        state.masteredItems[key] = { mastered: false, color: 'lightgrey' };
      }

      state.currentItem = null;
      state.startTime = null;
      state.isComplete = false;
    },

    setStartTime: (state, action) => {
      state.startTime = action.payload;
    }
  }
});

// Export actions
export const {
  initializeItems,
  getNextItem,
  processResult,
  resetLearning,
  setStartTime
} = spacedRepetitionSlice.actions;

// Selectors
export const selectCurrentItem = state => state.spacedRepetition.currentItem?.value;
export const selectQueue = state => state.spacedRepetition.queue;
export const selectMasteredItems = state => {
  const items = state.spacedRepetition.masteredItems;
  return Object.entries(items).map(([name, status]) => ({
    name,
    color: status.color,
    mastered: status.mastered
  }));
};
export const selectIsComplete = state => state.spacedRepetition.isComplete;
export const selectIsInitialized = state => state.spacedRepetition.isInitialized;

export default spacedRepetitionSlice.reducer;
