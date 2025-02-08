import './ChordDisplay.css'
import { Chord } from 'tonal'

const ChordDisplay = ({ currentNotes }) => {
  const getChordName = (notes) => {
    if (!notes || notes.length < 2) return ''

    // Convert the note objects to note names that tonal.js can understand
    const noteNames = notes.map(note => `${note.key.replace('/', '')}${note.octave}`)

    // Get all possible chord detections from tonal.js
    const detected = Chord.detect(noteNames)

    // Return the first detected chord or "Unknown" if none detected
    return detected.length > 0 ? detected[0] : 'Unknown Chord'
  }

  return (
    <div className="chord-display">
      <h3>Chord:</h3>
      <div className="chord-name">
        {getChordName(currentNotes)}
      </div>
    </div>
  )
}

export default ChordDisplay
