import './ChordDisplay.css'
import { Chord, Note } from 'tonal'
//import { MidiAccessCheck } from './MidiAccessCheck.js';
import { MidiController } from './MidiController.js';

//MidiAccessCheck();

const midiController = new MidiController();



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
      <h3>Playing Chord:</h3>
      <div className="chord-name">
        {getChordName(currentNotes)}
      </div>
      <h3>Playing Notes:</h3>
      <div className='note-name'>
        {getNoteNames(currentNotes)  }
      </div>
    </div>
  )
}

export default ChordDisplay
