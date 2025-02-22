export const selectNextQuestion = (state) => {
    const now = Date.now();
    const activeItems = Object.entries(state.spacedRepetition.items)
        .filter(([id, item]) => {
            const dueDate = item.lastSeen + (item.interval * 24 * 60 * 60 * 1000);
            return !state.spacedRepetition.masteredItems.includes(id) &&
                   now >= dueDate;
        })
        .sort((a, b) => (a[1].lastSeen - b[1].lastSeen));

    return activeItems[0]?.[0] || null;
};
