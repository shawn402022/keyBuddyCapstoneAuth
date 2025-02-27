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
import { formatChordName } from '../../utils/chordUtils';
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


    // Add this function somewhere in your component:
    const getSimplifiedChordName = (notes) => {
        // First get all possible interpretations from tonal
        const allPossibleChords = Chord.detect(notes, { assumePerfectFifth: true });

        // If we have 3 notes exactly, prioritize triads (major, minor, dim, aug)
        if (notes.length === 3) {
            // Check for simple triads first
            for (const chord of allPossibleChords) {
                // Look for simple triad names
                if (/^[A-G][#b]?(maj|min|m|dim|aug)$/.test(chord) ||
                    /^[A-G][#b]?$/.test(chord)) { // Major triads sometimes have no quality suffix
                    return chord;
                }
            }
        }

        // If no simple triad was found or we have more/fewer than 3 notes,
        // return the first suggestion from tonal
        return allPossibleChords.length > 0 ? allPossibleChords[0] : 'Unknown';
    };
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







            // Remove any commas but preserve the exact chord name format
            const cleanChordName = randomChord.replace(',', '').trim();

            // Use cleanChordName directly to maintain the exact format from course.details_of_course
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

        // Format notes the same way as in ChordDisplay for consistency
        const noteNames = playedNotes.map(note => {
            const noteLetter = note.key.split('/')[0];
            const baseName = noteLetter.toUpperCase();
            const properNoteName = note.isSharp ? `${baseName}#` : baseName;
            return `${properNoteName}${note.octave}`;
        });

        // Use Tonal.js directly as ChordDisplay does
        const detected = Chord.detect(noteNames, { assumePerfectFifth: false });
        const detectedChord = detected.length > 0 ? formatChordName(detected[0]) : 'Unknown Chord';

        console.log('Detection Results:', {
            playedNotes: noteNames,
            detectedChord: detectedChord,
            targetChord: targetKey
        });

        if (playedNotes.length > 0) {
            if (detectedChord !== 'Unknown Chord') {
                if (detectedChord === targetKey) {
                    setFeedback(`🎉 Correct! You played ${detectedChord}`);
                    setTimeout(() => {
                        setFeedback("");
                        generateChallenge(currentTrainingSequence);
                    }, 1500);
                } else {
                    setFeedback(`You played: ${detectedChord}. Try again for ${targetKey}.`);
                }
            } else {
                // If no chord is recognized, show the notes
                const playedNoteLetters = playedNotes.map(note =>
                    note.key.split('/')[0].toUpperCase()
                ).join(', ');
                setFeedback(`Notes played: ${playedNoteLetters}`);
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
