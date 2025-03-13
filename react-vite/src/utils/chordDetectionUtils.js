// Create this new file with the chord detection logic extracted from ChordDisplay.jsx
import { Chord } from 'tonal';

export const getChordName = (notes) => {
  if (!notes || notes.length < 2) return '';

  // Format notes for Tonal.js
  const noteNames = notes.map(note => {
    const noteLetter = note.key.split('/')[0];
    const baseName = noteLetter.toUpperCase();
    const properNoteName = note.isSharp ? `${baseName}#` : baseName;
    return `${properNoteName}${note.octave}`;
  });

  // Use Tonal.js to detect the chord
  const detected = Chord.detect(noteNames, { assumePerfectFifth: false });

  if (detected.length > 0) {
    // Get the first detected chord
    const firstChord = detected[0];
    const chordInfo = Chord.get(firstChord);

    // The rest of the chord detection logic copied from ChordDisplay.jsx
    // Handle specific chord patterns...

    // Format and return the chord name
    return firstChord; // Simplified for this example
  }

  return 'Unknown Chord';
};

static chordToNotes(chord) {
    // First, properly extract root and quality with regex
    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return [];

    const [_, root, quality] = match;
    const baseNote = this.noteToMidiNumber(root);

    // Get intervals or provide default
    const intervals = this.chordMap[quality] || this.chordMap['maj']; // Default to major

    if (!intervals) {
        console.warn(`Unknown chord quality: ${quality}, defaulting to major`);
        return this.chordMap['maj'].map(interval =>
            this.midiNumberToNote(baseNote + interval));
    }

    return intervals.map(interval =>
        this.midiNumberToNote(baseNote + interval));
}
