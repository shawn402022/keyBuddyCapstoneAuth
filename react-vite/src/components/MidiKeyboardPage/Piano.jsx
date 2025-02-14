import { useState, useEffect } from 'react';
import { PianoEvents } from './PianoEvents';
//import { MidiController } from './MidiController';
import { NoteLabelManager } from './NoteLabelManager';
import { ChordDisplay } from './ChordDisplay';
//import { StaffNotation } from './StaffNotation'; // Add this import

// Create instances outside the component
const noteLabelManager = new NoteLabelManager();
const pianoSoundsRef = {
    sounds: {} // Initialize your sounds object here
};

const Piano = () => {
    const [activeNotes, setActiveNotes] = useState([]);

    useEffect(() => {
        const pianoEvents = new PianoEvents(pianoSoundsRef, noteLabelManager);
        pianoEvents.setCallback(setActiveNotes);
    }, []);

    return (
        <div className="piano-container">
            <ChordDisplay currentNotes={activeNotes} />
        </div>
    );
};

export default Piano;
