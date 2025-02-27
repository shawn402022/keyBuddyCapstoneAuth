// ===== SHARED CONSTANTS =====

/**
 * Maps note names to their numeric values (0-11)
 */
const noteToNumber = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11
};

/**
* Reverse mapping of numbers to their primary note names
*/
const numberToNote = {
  0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E',
  5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A',
  10: 'A#', 11: 'B'
};

/**
* Define basic chord patterns (intervals from root)
*/
const chordPatterns = {
  major: [0, 4, 7],          // Root, Major Third, Perfect Fifth
  minor: [0, 3, 7],          // Root, Minor Third, Perfect Fifth
  diminished: [0, 3, 6],     // Root, Minor Third, Diminished Fifth
  augmented: [0, 4, 8],      // Root, Major Third, Augmented Fifth
  major7: [0, 4, 7, 11],     // Root, Major Third, Perfect Fifth, Major Seventh
  minor7: [0, 3, 7, 10],     // Root, Minor Third, Perfect Fifth, Minor Seventh
  dominant7: [0, 4, 7, 10],  // Root, Major Third, Perfect Fifth, Minor Seventh
};

/**
* Maps internal chord type names to standardized display format
*/
const chordTypeToDisplay = {
  'major': 'maj',
  'minor': 'min',
  'diminished': 'dim',
  'augmented': 'aug',
  'major7': 'maj7',
  'minor7': 'min7',
  'dominant7': '7'
};

// ===== CHORD DETECTION =====




/**
* Detects the chord type from an array of note objects
*
* @param {Array} notes - Array of note objects with 'key' property
* @return {String|null} Detected chord name or null if not recognized
*/
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

          // Format the chord name according to our display standards
          return formatChordName(`${rootNote} ${chordType}`);
      }
  }

  return "Unknown";
};

/**
* Detects chord from an array of note names (e.g., ['C', 'E', 'G'])
*
* @param {Array} noteNames - Array of note name strings
* @return {String} Detected chord name in standardized format
*/
export const detectChordFromNoteNames = (noteNames) => {
  if (!noteNames || noteNames.length < 3) return "Unknown";

  // Convert notes to numbers
  const noteNumbers = noteNames.map(note => noteToNumber[note]);

  // Continue with the same logic as detectChord...
  const sortedNotes = [...new Set(noteNumbers)].sort((a, b) => a - b);
  const intervals = sortedNotes.map(note =>
      (note - sortedNotes[0] + 12) % 12
  );

  for (const [chordType, pattern] of Object.entries(chordPatterns)) {
      if (intervals.length === pattern.length &&
          pattern.every(interval => intervals.includes(interval))) {
          const rootNote = numberToNote[sortedNotes[0]];
          return formatChordName(`${rootNote} ${chordType}`);
      }
  }

  return "Unknown";
};

// ===== CHORD FORMATTING =====

/**
* Standardizes chord notation according to application conventions:
* - Major chords use "maj" (e.g., "Cmaj")
* - Minor chords use "min" (e.g., "Cmin")
*
* @param {string} chordName - The chord name to normalize
* @return {string} - The normalized chord name
*/
export const normalizeChordNotation = (chordName) => {
  if (!chordName) return '';

  // Extract the root note and chord type using regex
  const chordPattern = /^([A-G][#b]?)(?:\s+)?(.*)$/;
  const match = chordName.match(chordPattern);

  if (!match) return chordName; // Return original if not a valid chord

  const [, rootNote, quality] = match;

  // Normalize based on chord quality
  if (!quality || quality === 'major' || quality === 'M' || quality === 'maj') {
      // Major chord: normalize to "maj"
      return `${rootNote}maj`;
  } else if (quality === 'minor' || quality === 'm' || quality === 'min' || quality === '-') {
      // Minor chord: normalize to "min"
      return `${rootNote}min`;
  } else if (quality in chordTypeToDisplay) {
      // Use our mapping for known chord types
      return `${rootNote}${chordTypeToDisplay[quality]}`;
  } else {
      // Other chord types - keep original
      return chordName;
  }
};

/**
* Formats a chord detected by Tonal to use our standardized notation
*
* @param {string} detectedChord - Chord name from Tonal.Chord.detect()
* @return {string} - Normalized chord name
*/
export const formatDetectedChord = (detectedChord) => {
  if (!detectedChord) return 'Unknown';

  // Handle common Tonal chord formats
  if (/^[A-G][#b]?$/.test(detectedChord)) {
      // Tonal often returns just the root for major chords
      return `${detectedChord}maj`;
  } else if (/^[A-G][#b]?m$/.test(detectedChord)) {
      // Convert minor notation from "Cm" to "Cmin"
      return detectedChord.replace(/^([A-G][#b]?)m$/, '$1min');
  } else if (/^[A-G][#b]?maj$/.test(detectedChord)) {
      // Already in correct format
      return detectedChord;
  } else if (/^[A-G][#b]?min$/.test(detectedChord)) {
      // Already in correct format
      return detectedChord;
  }

  // For other more complex chords, apply general normalization
  return normalizeChordNotation(detectedChord);
};

/**
* Formats a chord name consistently throughout the application
*
* @param {string} chordName - Raw chord name
* @return {string} - Formatted chord name
*/
export const formatChordName = (chordName) => {
  if (!chordName) return '';

  // If it's just a single chord notation (not a full text)
  if (/^[A-G][#b]?$/.test(chordName)) {
      return `${chordName}maj`;
  }

  // For more complex chord names, use our normalizer
  if (/^[A-G][#b]?(?:\s+)?[a-zA-Z0-9]*$/.test(chordName)) {
      return normalizeChordNotation(chordName);
  }

  // For text containing chord notations, replace all instances with properly formatted ones
  return chordName.replace(/\b([A-G][#b]?)(?!\w)/g, '$1maj');
};


/**
* Simple utility to check if a string represents a valid chord name
*
* @param {string} str - String to check
* @return {boolean} - True if it appears to be a chord name
*/
export const isChordName = (str) => {
  return /^[A-G][#b]?(?:maj|min|dim|aug|[0-9])*$/.test(str);
};
