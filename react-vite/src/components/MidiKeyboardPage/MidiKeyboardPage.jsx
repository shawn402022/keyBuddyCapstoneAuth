import { SoundManager } from './SoundManager';
import { PianoBuilder } from './PianoBuilder';
import { MidiController } from './MidiController';
import { NoteLabelManager } from './NoteLabelManager';
import { PianoEvents } from './PianoEvents';
import { PIANO_CONFIG } from './config';
import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './MidiKeyboardPage.css';
import MusicStaff from './MusicStaff';
import PianoContainer from './PianoContainer.jsx';
import ChordDisplay from './ChordDisplay';
import { TrainingParser } from '../TrainingParser/trainingParse';


const LoadingSpinner = () => (
    <div className="loading-overlay">
        <p>Loading Piano Sounds...</p>
        <div className="loading-spinner"></div>
    </div>
);

const MidiKeyboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentNotes, setCurrentNotes] = useState([]);
    const [isGameActive, setIsGameActive] = useState(false);
    const [message, setMessage] = useState("");
    const [targetKey, setTargetKey] = useState("");
    const [feedback, setFeedback] = useState("");
    const [currentTrainingSequence, setCurrentTrainingSequence] = useState(null);

    const trainingCourse = useSelector(state => state.userCourses.trainingCourse);

    const soundManager = useRef(new SoundManager());
    const noteLabelManager = useRef(new NoteLabelManager());
    const utilities = useRef(new Utilities());
    const keyImages = useRef(new KeyImages());
    const pianoEvents = useRef(new PianoEvents(soundManager.current, noteLabelManager.current));
    pianoEvents.current.setNotesCallback = setCurrentNotes;
    const pianoBuilder = useRef(new PianoBuilder(utilities.current, keyImages.current, pianoEvents.current));
    const midiController = useRef(new MidiController(soundManager.current));

    const generateChallenge = useCallback((sequence) => {
        if (sequence) {
            if (Array.isArray(sequence[0])) {
                const randomChord = sequence[Math.floor(Math.random() * sequence.length)];
                setTargetKey(randomChord);
                setMessage(`Play the chord: ${randomChord.join('-')}`);
            } else {
                const randomNote = sequence[Math.floor(Math.random() * sequence.length)];
                setTargetKey(randomNote);
                setMessage(`Play the note: ${randomNote}`);
            }
        }
    }, []);

    const startKeyChallenge = useCallback((trainingSequence) => {
        setIsGameActive(true);
        setCurrentTrainingSequence(trainingSequence);
        generateChallenge(trainingSequence);
    }, [generateChallenge]);

    const checkPlayedNotes = useCallback((playedNotes) => {
        if (!isGameActive || !targetKey) return;

        if (Array.isArray(targetKey)) {
            const isChordCorrect = targetKey.every(note =>
                playedNotes.some(played => played.key === note));

            if (isChordCorrect) {
                setFeedback("Correct chord! Next...");
                setTimeout(() => {
                    setFeedback("");
                    generateChallenge(currentTrainingSequence);
                }, 1000);
            }
        } else {
            const isNoteCorrect = playedNotes.some(played =>
                played.key === targetKey);

            if (isNoteCorrect) {
                setFeedback("Correct note! Next...");
                setTimeout(() => {
                    setFeedback("");
                    generateChallenge(currentTrainingSequence);
                }, 1000);
            }
        }
    }, [isGameActive, targetKey, generateChallenge, currentTrainingSequence]);

    useEffect(() => {
        if (pianoEvents.current) {
            pianoEvents.current.setNotesCallback = (notes) => {
                setCurrentNotes(notes);
                checkPlayedNotes(notes);
            };
        }
    }, [checkPlayedNotes]);

    useEffect(() => {
        console.log('Training course in piano page:', trainingCourse);
        if(trainingCourse) {
            const startTraining = () => {
                const trainingSequence = TrainingParser.parseTrainingContent(trainingCourse);
                startKeyChallenge(trainingSequence);
            };
            startTraining();
        }
    }, [trainingCourse, startKeyChallenge]);

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

    useEffect(() => {
        if (pianoEvents) {
            console.log('Setting up piano events callback');
            pianoEvents.setNotesCallback = (notes) => {
                console.log('Callback received notes:', notes);
                setCurrentNotes(notes);
            };
        }
    }, [pianoEvents]);
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="piano-page">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="piano-content">
                    {/* Add game status display */}
                    {isGameActive && (
                        <div className="game-status">
                            <p className="challenge-message">{message}</p>
                            <p className="feedback-message">{feedback}</p>
                            <p className="target-note">Target: {Array.isArray(targetKey) ? targetKey.join('-') : targetKey}</p>
                        </div>
                    )}
                    <div className='staff-notes-chords'>
                        <MusicStaff currentNotes={currentNotes} />
                        <ChordDisplay currentNotes={currentNotes} />
                    </div>
                    <div>
                        <PianoContainer />
                    </div>
                </div>
            )}
        </div>
    );

};

export default MidiKeyboardPage;
