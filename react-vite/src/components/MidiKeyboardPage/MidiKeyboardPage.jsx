import { SoundManager } from './SoundManager';
import { PianoBuilder } from './PianoBuilder';
import { MidiController } from './MidiController';
import { NoteLabelManager } from './NoteLabelManager';
import { PianoEvents } from './PianoEvents';
import { PIANO_CONFIG } from './config';
import Utilities from './utilities.js';
import KeyImages from './images.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './MidiKeyboardPage.css';
import MusicStaff from './MusicStaff';
import PianoContainer from './PianoContainer.jsx';
import ChordDisplay from './ChordDisplay';
import { TrainingParser } from '../TrainingParser/trainingParse';
import TrainingQuestions from './TrainingQuestions.jsx';
import { Chord } from 'tonal';
import { startTraining } from '../../redux/game';

import { setGameActive } from '../../redux/game';



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
    const [message, setMessage] = useState("");
    const [targetKey, setTargetKey] = useState("");
    const [feedback, setFeedback] = useState("");
    const [currentTrainingSequence, setCurrentTrainingSequence] = useState(null);

    const dispatch = useDispatch();
    const gameState = useSelector(state => state.game);
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
        if (!sequence) return;

        // Handle scale-specific format
        if (sequence.type === 'scale' && sequence.notes) {
            const randomNote = sequence.notes[Math.floor(Math.random() * sequence.notes.length)];
            setTargetKey(randomNote);
            setMessage(`Play the key: ${randomNote}`);
            return;
        }

        // Handle traditional format
        if (Array.isArray(sequence)) {
            const randomChord = sequence[Math.floor(Math.random() * sequence.length)];
            const cleanChordName = randomChord.replace(',', '');
            setTargetKey(cleanChordName);
            setMessage(`Play the chord: ${cleanChordName}`);
        }
    }, []);

    const startKeyChallenge = useCallback((trainingSequence) => {
        dispatch(setGameActive(true));
        setCurrentTrainingSequence(trainingSequence);
        generateChallenge(trainingSequence);
    }, [dispatch, generateChallenge]);

    const checkPlayedNotes = useCallback((playedNotes) => {
        if (!gameState.isActive || !targetKey) return;

        // Get the played note letters
        const playedNoteLetters = playedNotes.map(note =>
            note.key.split('/')[0].toUpperCase()
        );

        // Handle scale-specific validation
        if (trainingCourse?.course_name.endsWith('_scale')) {
            if (playedNotes.length > 0) {
                const playedKey = playedNoteLetters[0];
                const targetKeyUpper = targetKey.toUpperCase();

                if (playedKey === targetKeyUpper) {
                    setFeedback(`🎉 Correct! You played the ${targetKey} key!`);
                    setTimeout(() => {
                        setFeedback("");
                        generateChallenge(currentTrainingSequence);
                    }, 1500);
                } else {
                    setFeedback(`You played: ${playedKey} - Keep trying!`);
                }
            }
            return;
        }

        // Get detected chords
        const possibleChords = Chord.detect(playedNoteLetters, { assumePerfectFifth: false });

        console.log('Detection Results:', {
            playedNotes: playedNoteLetters,
            detectedChords: possibleChords,
            targetChord: targetKey
        });

        if (playedNotes.length > 0) {
            if (possibleChords.length > 0) {
                // Get the detected chord
                const detectedChord = possibleChords[0];

                // Parse the chord to get root and quality
                let formattedChord = '';

                if (detectedChord) {
                    // Extract root note and quality
                    const root = detectedChord[0];
                    let quality = '';

                    // Simplify chord quality naming
                    if (detectedChord.includes('min') || detectedChord.includes('m')) {
                        quality = 'm';  // Minor
                    } else if (detectedChord.includes('maj')) {
                        quality = 'M';  // Major
                    } else if (detectedChord.includes('dim')) {
                        quality = 'dim';  // Diminished
                    } else if (detectedChord.includes('aug')) {
                        quality = 'aug';  // Augmented
                    } else {
                        quality = 'M';  // Default to major if no quality specified
                    }

                    formattedChord = root + quality;
                } else {
                    formattedChord = possibleChords[0];  // Fallback to original name
                }

                // Compare with target
                const targetChordRoot = targetKey[0].toUpperCase();
                const targetQuality = targetKey.slice(1).toLowerCase().replace('m', 'min');

                const detectedRoot = formattedChord[0];
                const detectedQuality = formattedChord.slice(1);

                const matchFound = detectedRoot === targetChordRoot &&
                                  (detectedQuality.includes('m') === targetQuality.includes('min'));

                if (matchFound) {
                    setFeedback(`🎉 Correct! You played ${targetKey}!`);
                    setTimeout(() => {
                        setFeedback("");
                        generateChallenge(currentTrainingSequence);
                    }, 1500);
                } else {
                    setFeedback(`You played: ${formattedChord} - Keep trying!`);
                }
            } else {
                setFeedback(`Notes played: ${playedNoteLetters.join(', ')}`);
            }
        }
    }, [gameState.isActive, targetKey, generateChallenge, currentTrainingSequence, trainingCourse]);    useEffect(() => {
        if (pianoEvents.current) {
            pianoEvents.current.setNotesCallback = (notes) => {
                console.log('Piano events callback triggered with notes:', notes);
                setCurrentNotes(notes);
                checkPlayedNotes(notes);
            };
        }
    }, [checkPlayedNotes]);

    useEffect(() => {
        if (trainingCourse) {
            console.log('Starting training with course:', trainingCourse);
            const trainingSequence = TrainingParser.parseTrainingContent(trainingCourse);
            console.log('Parsed sequence:', trainingSequence);
            dispatch(setGameActive(true));
            dispatch(startTraining(trainingSequence));
            generateChallenge(trainingSequence);
        }
    }, [trainingCourse, startKeyChallenge, dispatch, generateChallenge]);

    useEffect(() => {
        const currentMidiController = midiController.current;
        currentMidiController.setNotesCallback = (notes) => {
            setCurrentNotes(notes);
            checkPlayedNotes(notes);

            if (notes.length === 0) {
                setFeedback("");
            }
        };

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
    }, [checkPlayedNotes]); // Add checkPlayedNotes here

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
                    <div className='staff-notes-chords'>
                        <MusicStaff currentNotes={currentNotes} />
                        <ChordDisplay currentNotes={currentNotes} />
                        <div className='answers'>
                            {trainingCourse && <TrainingQuestions course={trainingCourse} />}
                            {gameState.isActive && targetKey && (
                                <div className="game-status">
                                    <p className="challenge-message">{message}</p>
                                    <p className="feedback-message">{feedback}</p>
                                    <p className="target-note">Target: {targetKey}</p>

                                </div>
                            )}
                        </div>
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
