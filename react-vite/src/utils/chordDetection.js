// Define basic chord patterns (intervals from root)
const chordPatterns = {
    major: [0, 4, 7],          // Root, Major Third, Perfect Fifth
    minor: [0, 3, 7],          // Root, Minor Third, Perfect Fifth
    diminished: [0, 3, 6],     // Root, Minor Third, Diminished Fifth
    augmented: [0, 4, 8],      // Root, Major Third, Augmented Fifth
    major7: [0, 4, 7, 11],     // Root, Major Third, Perfect Fifth, Major Seventh
    minor7: [0, 3, 7, 10],     // Root, Minor Third, Perfect Fifth, Minor Seventh
    dominant7: [0, 4, 7, 10],  // Root, Major Third, Perfect Fifth, Minor Seventh
};

const noteToNumber = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11
};

export const detectChord = (notes) => {
    if (!notes || notes.length < 3) return null;

    // Convert notes to numbers (0-11)
    const noteNumbers = notes.map(note => {
        const noteName = note.key.replace(/\/\d+/, ''); // Remove octave
        return noteToNumber[noteName];
    });

    // Sort and normalize to first note
    const sortedNotes = [...new Set(noteNumbers)].sort((a, b) => a - b);
    const intervals = sortedNotes.map(note =>
        (note - sortedNotes[0] + 12) % 12
    );

    // Check against patterns
    for (const [chordType, pattern] of Object.entries(chordPatterns)) {
        if (intervals.length === pattern.length &&
            pattern.every(interval => intervals.includes(interval))) {
            const rootNote = Object.keys(noteToNumber).find(
                key => noteToNumber[key] === sortedNotes[0]
            );
            return `${rootNote} ${chordType}`;
        }
    }

    return "Unknown";
};
