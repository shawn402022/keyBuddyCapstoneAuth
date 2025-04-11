// In PianoChordsDisplay.jsx
import { usePianoContext } from '../../context/PianoContext';
import { Chord } from 'tonal';

const PianoChordsDisplay = () => {
    const { activeNotes } = usePianoContext();

    // Determine if the active notes form a chord
    const getChordName = (notes) => {
        if (notes.length < 2) return null;

        // Extract just the note names without octaves for chord detection
        const noteNames = notes.map(note => note.replace(/\d+$/, ''));

        // Use tonal.js to detect the chord
        // This is a simplified example - you'd need more logic for accurate chord detection
        const detected = Chord.detect(noteNames);
        return detected.length > 0 ? detected[0] : null;
    };

    const chordName = getChordName(activeNotes);

    return (
        <div className='piano-chords-display'>
            
            {chordName ? (
                <div className="chord-name">{chordName}</div>
            ) : (
                <div className="no-chord">No chord detected</div>
            )}
        </div>
    );
};


export default PianoChordsDisplay
