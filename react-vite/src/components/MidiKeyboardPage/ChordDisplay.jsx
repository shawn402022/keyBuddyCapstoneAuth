import './ChordDisplay.css'
import { Chord } from 'tonal'

const ChordDisplay = ({ currentNotes }) => {
  const getChordName = (notes) => {
    if (!notes || notes.length < 2) return ''
    const noteNames = notes.map(note => `${note.key.replace('/', '')}${note.octave}`)
    const detected = Chord.detect(noteNames)
    return detected.length > 0 ? detected[0] : 'Unknown Chord'
  }

  const getNoteNames = (notes) => {
    if (!notes || notes.length === 0) return '';
    return notes.map(note => {
        const noteLetter = note.key.split('/')[0];
        const baseName = noteLetter.toUpperCase();
        const properNoteName = note.isSharp ? `${baseName}#` : baseName;
        return `${properNoteName}${note.octave}`;
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
