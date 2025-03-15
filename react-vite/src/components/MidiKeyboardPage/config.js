// Piano configuration for VexFlow implementation

export const PIANO_CONFIG = {
    // Notes for the piano (C2 to B7)
    chromaticNotes: [
        // Octave 2
        'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
        // Octave 3
        'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
        // Octave 4 (middle octave)
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
        // Octave 5
        'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
        // Octave 6
        'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
        // Octave 7
        'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7'
    ],

    // Natural notes (white keys)
    naturalNotes: [
        'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
        'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
        'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
        'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
        'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6',
        'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'
    ],

    // Sharp notes (black keys)
    sharpNotes: [
        'C#2', 'D#2', 'F#2', 'G#2', 'A#2',
        'C#3', 'D#3', 'F#3', 'G#3', 'A#3',
        'C#4', 'D#4', 'F#4', 'G#4', 'A#4',
        'C#5', 'D#5', 'F#5', 'G#5', 'A#5',
        'C#6', 'D#6', 'F#6', 'G#6', 'A#6',
        'C#7', 'D#7', 'F#7', 'G#7', 'A#7'
    ],

    // Default octave for training
    defaultOctave: 4,

    // Piano dimensions
    dimensions: {
        whiteKeyWidth: 40,
        whiteKeyHeight: 150,
        blackKeyWidth: 24,
        blackKeyHeight: 100
    },

    // Colors
    colors: {
        whiteKeyFill: '#FFFFFF',
        whiteKeyStroke: '#000000',
        blackKeyFill: '#000000',
        blackKeyStroke: '#000000',
        activeKeyFill: '#42A5F5',
        targetKeyFill: '#4CAF50',
        targetKeyStroke: '#FFA726'
    }
};

// Note to MIDI number mapping (useful for MIDI operations)
export const NOTE_TO_MIDI = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11
};

// Convert a note name to MIDI number
export const noteToMidiNumber = (noteName) => {
    if (!noteName) return null;

    // Parse the note name and octave
    const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
    if (!match) return null;

    const [, note, octave] = match;

    // Calculate MIDI number
    return NOTE_TO_MIDI[note] + (parseInt(octave) + 1) * 12;
};

// Convert a MIDI number to note name
export const midiNumberToNote = (midiNumber) => {
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteIndex = midiNumber % 12;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    return `${noteNames[noteIndex]}${octave}`;
};
