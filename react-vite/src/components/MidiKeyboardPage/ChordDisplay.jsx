import './ChordDisplay.css'
import { Chord } from 'tonal'


const ChordDisplay = ({ currentNotes }) => {
  const getChordName = (notes) => {
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
      const chordInfo = Chord.get(detected[0]);

      // Create a detailed analyzer to handle special cases
      const intervals = chordInfo.intervals || [];
      let formattedName = chordInfo.tonic || '';

      // Handle special case: Major chord with flat 5th
      if (intervals.includes('3M') && intervals.includes('5d')) {
        return `${formattedName}Mb5`;
      }

      // Handle other chord qualities with more precise logic
      switch (chordInfo.quality) {
        case 'Major':
          // Check for special alterations
          if (intervals.includes('5A')) return `${formattedName}aug`;
          // Plain major chord - no suffix
          break;
        case 'Minor':
          formattedName += 'm';
          break;
        case 'Diminished':
          formattedName += 'dim';
          break;
        case 'Major Seventh':
          formattedName += 'maj7';
          break;
        case 'Dominant Seventh':
          formattedName += '7';
          break;
        case 'Minor Seventh':
          formattedName += 'm7';
          break;
        case 'Half Diminished':
          formattedName += 'm7b5';
          break;
        default:
          {
            // For other chord types, analyze intervals manually
            const hasMinor3rd = intervals.includes('3m');
            const hasMajor3rd = intervals.includes('3M');
            const hasDim5th = intervals.includes('5d');
            const hasPerf5th = intervals.includes('5P');
            const hasAug5th = intervals.includes('5A');

            // Build chord name from interval analysis
            if (hasMajor3rd) {
              if (hasDim5th) return `${formattedName}Mb5`;
              if (hasAug5th) return `${formattedName}aug`;
            } else if (hasMinor3rd) {
              if (hasDim5th) return `${formattedName}m5b`;
              if (hasPerf5th) return `${formattedName}m`;
            }
            // Fall back to Tonal's symbol if our analysis is inconclusive
            formattedName += chordInfo.symbol || '';
          }
          break;
      }

      return formattedName;
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
