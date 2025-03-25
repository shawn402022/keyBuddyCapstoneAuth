import './ChordDisplay.css'
import { Chord } from 'tonal'

const ChordDisplay = ({ currentNotes }) => {
  console.log("ChordDisplay received notes:", currentNotes);
  
  const getChordName = (notes) => {
    if (!notes || notes.length < 2) return '';

    // Format notes for Tonal.js
    const noteNames = notes.map(note => {
      const noteLetter = note.key.split('/')[0];
      const baseName = noteLetter.toUpperCase();
      const properNoteName = note.isSharp ? `${baseName}#` : baseName;
      return `${properNoteName}${note.octave}`;
    });

    // Debug the note names being passed to Tonal.js
    console.log("Notes passed to Chord.detect:", noteNames);

    // Use Tonal.js to detect the chord
    const detected = Chord.detect(noteNames, { assumePerfectFifth: false });
    console.log("Tonal.js detected chords:", detected);

    if (detected.length > 0) {
      // Get the first detected chord
      const firstChord = detected[0];
      console.log("First detected chord:", firstChord);

      const chordInfo = Chord.get(firstChord);
      console.log("Chord info from Tonal.js:", chordInfo);

      // Check for specific chord patterns

      // Check for G7 pattern (G dominant 7th)
      if (noteNames.length >= 4) {
        const roots = noteNames.map(n => n.charAt(0));
        const hasG = roots.includes('G');
        const hasB = roots.includes('B');
        const hasD = roots.includes('D');
        const hasF = roots.includes('F');

        if (hasG && hasB && hasD && hasF && noteNames.length === 4) {
          return 'G7';
        }

        // Check for Bm7b5 (half-diminished)
        const hasA = roots.includes('A');
        if (hasB && hasD && hasF && hasA && noteNames.length === 4) {
          return 'Bm7b5';
        }

        // Check for Bdim7
        const hasGSharp = noteNames.some(n => n.includes('G#'));
        if (hasB && hasD && hasF && hasGSharp && noteNames.length === 4) {
          return 'Bdim7';
        }
      }

      // Create a detailed analyzer to handle special cases
      const intervals = chordInfo.intervals || [];
      let formattedName = chordInfo.tonic || '';

      // Log intervals for debugging
      console.log("Chord intervals:", intervals);

      // Handle special chord types explicitly
      if (intervals.includes('3M') && intervals.includes('5P') && intervals.includes('7m')) {
        return `${formattedName}7`; // Dominant 7th
      }

      if (intervals.includes('3m') && intervals.includes('5d') && intervals.includes('7m')) {
        return `${formattedName}m7b5`; // Half-diminished
      }

      if (intervals.includes('3m') && intervals.includes('5d') && intervals.includes('7d')) {
        return `${formattedName}dim7`; // Diminished 7th
      }

      // Handle special case: Major chord with flat 5th
      if (intervals.includes('3M') && intervals.includes('5d')) {
        return `${formattedName}Mb5`;
      }

      // Handle other chord qualities with more precise logic
      switch (chordInfo.quality) {
        case 'Major':
          // Check for dominant 7th
          if (intervals.includes('7m')) {
            return `${formattedName}7`;
          }
          // Check for augmented
          if (intervals.includes('5A')) {
            return `${formattedName}aug`;
          }
          // Check for major 7th
          if (intervals.includes('7M')) {
            return `${formattedName}maj7`;
          }
          // Plain major chord - no suffix
          return formattedName;

        case 'Minor':
          // Check for minor 7th
          if (intervals.includes('7m')) {
            return `${formattedName}m7`;
          }
          return `${formattedName}m`;

        case 'Diminished':
          // Check for diminished 7th
          if (intervals.includes('7d')) {
            return `${formattedName}dim7`;
          }
          return `${formattedName}dim`;

        case 'Major Seventh':
          return `${formattedName}maj7`;

        case 'Dominant Seventh':
          return `${formattedName}7`;

        case 'Minor Seventh':
          return `${formattedName}m7`;

        case 'Half Diminished':
          return `${formattedName}m7b5`;

        case 'Diminished Seventh':
          return `${formattedName}dim7`;

        default:
          {
            // For other chord types, analyze intervals manually
            const hasMinor3rd = intervals.includes('3m');
            const hasMajor3rd = intervals.includes('3M');
            const hasDim5th = intervals.includes('5d');
            const hasPerf5th = intervals.includes('5P');
            const hasAug5th = intervals.includes('5A');
            const hasMin7th = intervals.includes('7m');
            const hasMaj7th = intervals.includes('7M');
            const hasDim7th = intervals.includes('7d');

            // Debug interval detection
            console.log("Interval detection:", {
              hasMinor3rd, hasMajor3rd, hasDim5th,
              hasPerf5th, hasAug5th, hasMin7th, hasMaj7th, hasDim7th
            });

            // Build chord name from interval analysis
            if (hasMajor3rd) {
              if (hasMin7th) {
                return `${formattedName}7`;
              }
              if (hasMaj7th) {
                return `${formattedName}maj7`;
              }
              if (hasDim5th) {
                return `${formattedName}Mb5`;
              }
              if (hasAug5th) {
                return `${formattedName}aug`;
              }
              return formattedName;
            }
            else if (hasMinor3rd) {
              if (hasDim5th && hasMin7th) {
                return `${formattedName}m7b5`;
              }
              if (hasDim5th && hasDim7th) {
                return `${formattedName}dim7`;
              }
              if (hasMin7th) {
                return `${formattedName}m7`;
              }
              if (hasMaj7th) {
                return `${formattedName}mM7`;
              }
              if (hasDim5th) {
                return `${formattedName}dim`;
              }
              return `${formattedName}m`;
            }

            // Fall back to Tonal's symbol as a last resort
            return `${formattedName}${chordInfo.symbol || ''}`;
          }
      }
    }

    return 'Unknown Chord';
  }

  const getNoteNames = (notes) => {
    if (!notes || notes.length === 0) return '';
    return notes.map(note => {
      const noteLetter = note.key.split('/')[0];
      const baseName = noteLetter.toUpperCase();
      const properNoteName = note.isSharp ? `${baseName}#` : baseName;
      return `${properNoteName}`;
    }).join(', ');
  }

  return (
    <div className="chord-display">
      <div className="chord-section">
        <h3>Playing Chord:</h3>
        <div className="chord-name">
          {getChordName(currentNotes)}
        </div>
      </div>
      <div className="notes-section">
        <h3>Playing Notes:</h3>
        <div className="note-name">
          {getNoteNames(currentNotes)}
        </div>
      </div>
    </div>
  )
}

export default ChordDisplay
