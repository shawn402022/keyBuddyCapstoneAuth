import { SoundManager } from './SoundManager';
import { PianoBuilder } from './PianoBuilder';
import { MidiController } from './MidiController';
import { PIANO_CONFIG } from './config';
import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect, useRef, useState } from 'react';
import './MidiKeyboardPage.css'

const LoadingSpinner = () => (
    <div className="loading-overlay">
        <p>Loading Piano Sounds...</p>
        <div className="loading-spinner"></div>
    </div>
);

const PianoContainer = () => (
    <div id="piano-container">
        <img
            className="scales"
            src="/images/background-scales-lighter.png"
            alt="KBuddy logo"
        />
    </div>
);

const MidiKeyboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const pianoBuilder = useRef(new PianoBuilder(new Utilities(), new KeyImages()));
    const soundManager = useRef(new SoundManager());
    const midiController = useRef(new MidiController(soundManager.current));

    useEffect(() => {
        const currentMidiController = midiController.current;

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
                <div id="piano-container">
                    <img
                        className="scales"
                        src="/images/background-scales-lighter.png"
                        alt="KBuddy logo"
                    />
                </div>
            )}
            <div className="pbottom"></div>
        </div>
    );
};

export default MidiKeyboardPage;
