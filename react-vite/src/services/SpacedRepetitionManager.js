export class SpacedRepetitionManager {
    static MASTERY_THRESHOLD = 5;
    static MIN_INTERVAL = 1; // days
    static MAX_INTERVAL = 30; // days

    static calculateNextInterval(item) {
        if (!item.isCorrect) return this.MIN_INTERVAL;

        // SuperMemo-2 algorithm implementation
        const easeFactor = Math.max(1.3, 2.5 + (0.1 - (5 - item.quality) * (0.08 + (5 - item.quality) * 0.02)));
        return Math.min(this.MAX_INTERVAL, item.interval * easeFactor);
    }

    static calculateItemDifficulty(correctCount, totalAttempts) {
        const successRate = correctCount / totalAttempts;
        return Math.max(1, Math.min(5, 6 - successRate * 5));
    }

    static isMastered(item) {
        return item.correctCount >= this.MASTERY_THRESHOLD &&
               (item.correctCount / (item.correctCount + item.incorrectCount)) > 0.85;
    }
}
