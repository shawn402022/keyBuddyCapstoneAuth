import { SoundManager } from './SoundManager';
import { PianoBuilder } from './PianoBuilder';
import { MidiController } from './MidiController';


import { NoteLabelManager } from './NoteLabelManager';
import { PianoEvents } from './PianoEvents';
import { PIANO_CONFIG } from './config';
import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect, useRef, useState } from 'react';
import './MidiKeyboardPage.css'
import MusicStaff from './MusicStaff';
import PianoContainer from './PianoContainer.jsx';
import ChordDisplay from './ChordDisplay';




const LoadingSpinner = () => (
    <div className="loading-overlay">
        <p>Loading Piano Sounds...</p>
        <div className="loading-spinner"></div>
    </div>
);

const MidiKeyboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Change from single note to array of notes
    const [currentNotes, setCurrentNotes] = useState([]);

    // Create refs for all required instances
    const soundManager = useRef(new SoundManager());
    const noteLabelManager = useRef(new NoteLabelManager());
    const pianoEvents = useRef(new PianoEvents(soundManager.current, noteLabelManager.current));
    const pianoBuilder = useRef(new PianoBuilder(new Utilities(), new KeyImages(), pianoEvents.current));
    const midiController = useRef(new MidiController(soundManager.current));

    useEffect(() => {
        const currentMidiController = midiController.current;
        currentMidiController.setNotesCallback = setCurrentNotes;

        const initialize = async () => {
            try {
                await soundManager.current.loadSounds([...PIANO_CONFIG.chromaticNotes, ...PIANO_CONFIG.sharpNotes]);
                await currentMidiController.initialize();
                const container = document.getElementById('piano-container');
                if (container) {
                    pianoBuilder.current.createPiano(container);
                }
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        initialize();
        return () => {
            currentMidiController.cleanup();
        };
    }, []);

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="piano-page">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="piano-content">
                    <div className='staff-notes-chords'>
                        <MusicStaff currentNotes={currentNotes} />
                        <ChordDisplay currentNotes={currentNotes} />
                    </div>
                    <div>
                        <PianoContainer />
                    </div>
                </div>
            )}
            <div className="pbottom"></div>
        </div>
    );

};



export default MidiKeyboardPage;
