import './ChordDisplay.css'
import { Chord } from 'tonal'
import { formatChordName } from '../../utils/chordUtils'

const ChordDisplay = ({ currentNotes }) => {
  const getChordName = (notes) => {
    if (!notes || notes.length < 2) return ''

    // Use the same note formatting logic as in getNoteNames, but include octaves
    const noteNames = notes.map(note => {
      const noteLetter = note.key.split('/')[0]
      const baseName = noteLetter.toUpperCase()
      const properNoteName = note.isSharp ? `${baseName}#` : baseName
      return `${properNoteName}${note.octave}`; // Properly formatted note with octave
    })

    console.log('Properly formatted notes:', noteNames)
    const detected = Chord.detect(noteNames, { assumePerfectFifth: false })

    // Format the chord name to ensure consistency with the rest of the application
    return detected.length > 0 ? formatChordName(detected[0]) : 'Unknown Chord'
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
