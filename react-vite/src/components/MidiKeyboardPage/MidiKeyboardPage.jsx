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
        console.log('Generating challenge from sequence:', sequence);
        if (sequence) {
            const randomChord = sequence[Math.floor(Math.random() * sequence.length)];
            const cleanChordName = randomChord.replace(',', '');
            console.log('Setting target to:', cleanChordName);
            setTargetKey(cleanChordName);
            setMessage(`Play the chord: ${cleanChordName}`);

            const expectedNotes = Chord.get(cleanChordName).notes;
            console.log('Generated challenge:', {
                chord: cleanChordName,
                expectedNotes: expectedNotes
            });
        }
    }, []);

    const startKeyChallenge = useCallback((trainingSequence) => {
        dispatch(setGameActive(true));
        setCurrentTrainingSequence(trainingSequence);
        generateChallenge(trainingSequence);
    }, [dispatch, generateChallenge]);

    const checkPlayedNotes = useCallback((playedNotes) => {
        // Log game state to verify activity
        console.log('Game State:', {
            isActive: gameState.isActive,
            targetKey,
            playedNotes
        });

        if (!gameState.isActive || !targetKey) {
            console.log('Game not active or no target key');
            return;
        }

        // Convert played notes to format for Tonal.js
        const playedNoteLetters = playedNotes.map(note =>
            note.key.split('/')[0].toUpperCase()
        ).sort();

        // Get detected chords
        const possibleChords = Chord.detect(playedNoteLetters);

        // Log detection results
        console.log('Detection Results:', {
            playedNotes: playedNoteLetters,
            detectedChords: possibleChords,
            targetChord: targetKey
        });

        if (playedNotes.length > 0) {
            if (possibleChords.length > 0) {
                const matchFound = possibleChords.some(chord =>
                    chord.replace(/\d/g, '') === targetKey.replace(/\d/g, '')
                );

                if (matchFound) {
                    // Success feedback
                    setFeedback(`🎉 Correct! You played ${targetKey}!`);
                    // Play success sound if available
                    setTimeout(() => {
                        setFeedback("");
                        generateChallenge(currentTrainingSequence);
                    }, 1500);
                } else {
                    // "Getting close" feedback
                    setFeedback(`You played: ${possibleChords[0]} - Keep going!`);
                }
            } else {
                // Early feedback while building chord
                setFeedback(`Notes played: ${playedNoteLetters.join(', ')}`);
            }
        }
    }, [gameState.isActive, targetKey, generateChallenge, currentTrainingSequence]);

    useEffect(() => {
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
            console.log('MIDI controller callback triggered with notes:', notes);
            setCurrentNotes(notes);
            checkPlayedNotes(notes);
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
