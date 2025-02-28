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
import StopWatch from './StopWatch';
import PianoContainer from './PianoContainer.jsx';
import ChordDisplay from './ChordDisplay';
import { TrainingParser } from '../TrainingParser/trainingParse';
import TrainingQuestions from './TrainingQuestions.jsx';
import MasteredList from './MasteredList';  // Add this import
import { LearningQueue } from './LearningQueue';

import { Chord } from 'tonal';
import { startTraining, setGameActive } from '../../redux/game';

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
    const [masteredItems, setMasteredItems] = useState([]);
    const [allMastered, setAllMastered] = useState(false);

    const dispatch = useDispatch();
    const gameState = useSelector(state => state.game);
    const trainingCourse = useSelector(state => state.userCourses.trainingCourse);

    const soundManager = useRef(new SoundManager());
    const noteLabelManager = useRef(new NoteLabelManager());
    const utilities = useRef(new Utilities());
    const keyImages = useRef(new KeyImages());
    const pianoEvents = useRef(new PianoEvents(soundManager.current, noteLabelManager.current));
    const learningQueue = useRef(new LearningQueue());
    const stopwatchRef = useRef(null);

    pianoEvents.current.setNotesCallback = setCurrentNotes;
    const pianoBuilder = useRef(new PianoBuilder(utilities.current, keyImages.current, pianoEvents.current));
    const midiController = useRef(new MidiController(soundManager.current));
    const timeoutRef = useRef(null);
    // Initialize the learning queue with the training sequence
    const initializeLearningQueue = useCallback((sequence) => {
        if (!sequence) {
            console.log('No sequence provided to initialize');
            return;
        }

        console.log('Initializing learning queue with sequence:', sequence);
        learningQueue.current.initialize(sequence);
        learningQueue.current.setStopwatchRef(stopwatchRef);

        // Update mastered items display
        const items = learningQueue.current.getMasteredItems();
        console.log('Initial mastered items:', items);
        setMasteredItems(items);

        // Get the first challenge
        const firstChallenge = learningQueue.current.getNextChallenge();
        console.log('First challenge:', firstChallenge);

        if (firstChallenge) {
            setTargetKey(firstChallenge);
            setMessage(`Play the ${firstChallenge}`);
        }
    }, []);
    // Start the challenge session
    const startKeyChallenge = useCallback(() => {
        dispatch(setGameActive(true));

        // Initialize learning queue if there's a training sequence
        if (currentTrainingSequence) {
            initializeLearningQueue(currentTrainingSequence);
        }

        // Start the stopwatch
        if (stopwatchRef.current) {
            stopwatchRef.current.handleStartTimer();
        }

        setAllMastered(false);
        setFeedback("");
    }, [dispatch, currentTrainingSequence, initializeLearningQueue]);

    // Stop the challenge session
    const stopKeyChallenge = useCallback(() => {
        dispatch(setGameActive(false));

        // Reset the learning queue
        learningQueue.current.reset();

        // Reset UI states
        setTargetKey("");
        setMessage("");
        setFeedback("");
        setAllMastered(false);

        // Stop the stopwatch
        if (stopwatchRef.current) {
            stopwatchRef.current.handleStopTimer();
        }
    }, [dispatch]);

    // Check if played notes match the target
    const checkPlayedNotes = useCallback((playedNotes) => {
        if (!gameState.isActive || !targetKey || allMastered) return;

        // Get the played note letters
        const playedNoteLetters = playedNotes.map(note =>
            note.key.split('/')[0].toUpperCase()
        );

        // Handle scale-specific validation
        if (trainingCourse?.course_name.endsWith('_scale')) {
            if (playedNotes.length > 0) {
                const playedKey = playedNoteLetters[0];

                // Add defensive programming
                if (typeof targetKey !== 'string') {
                    console.error('targetKey is not a string:', targetKey);
                    setFeedback('Error: Invalid target key format');
                    return;
                }

                const targetKeyUpper = targetKey.toUpperCase();

                console.log('Scale validation:', {
                    playedKey,
                    targetKeyUpper,
                    targetKey,
                    playedNotes,
                    playedNoteLetters
                });

                if (playedKey === targetKeyUpper) {
                    setFeedback(`🎉 Correct! You played the ${targetKey} key!`);

                    // Process correct answer in learning queue
                    console.log('Processing correct answer for target:', targetKey);
                    const result = learningQueue.current.processResult(true);
                    console.log('Process result:', result);

                    // Update mastered items display
                    const updatedItems = learningQueue.current.getMasteredItems();
                    console.log('Updated mastered items:', updatedItems);
                    setMasteredItems(updatedItems);

                    // Check if all items are mastered
                    if (result.allMastered) {
                        setAllMastered(true);
                        setFeedback("🎉 Challenge completed! All items mastered!");
                        if (stopwatchRef.current) {
                            stopwatchRef.current.handleStopTimer();
                        }
                    } else if (result.nextChallenge) {
                        // Clear any existing timeout
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }

                        // Set new timeout for next challenge
                        timeoutRef.current = setTimeout(() => {
                            setFeedback("");
                            setTargetKey(result.nextChallenge);
                            setMessage(`Play the key: ${result.nextChallenge}`);
                        }, 800);
                    }
                } else {
                    setFeedback(`You played: ${playedKey} - Keep trying!`);
                }
            }
            return;
        }
        // Format notes for Tonal.js detection
        const noteNames = playedNotes.map(note => {
            const noteLetter = note.key.split('/')[0];
            const baseName = noteLetter.toUpperCase();
            const properNoteName = note.isSharp ? `${baseName}#` : baseName;
            return `${properNoteName}${note.octave}`;
        });

        // Use Tonal.js for chord detection
        const detected = Chord.detect(noteNames, { assumePerfectFifth: false });

        // Custom formatting to match course.details_of_course style
        let detectedChord = 'Unknown Chord';

        if (detected.length > 0) {
            const chordInfo = Chord.get(detected[0]);
            const intervals = chordInfo.intervals || [];
            let formattedName = chordInfo.tonic || '';

            // Special case: Major with flat 5th
            if (intervals.includes('3M') && intervals.includes('5d')) {
                detectedChord = `${formattedName}Mb5`;
            }
            // Format based on chord quality to match course.details_of_course
            else switch(chordInfo.quality) {
                case 'Major':
                    // Check for special alterations
                    if (intervals.includes('5A')) {
                        detectedChord = `${formattedName}aug`;
                    } else {
                        // Plain major chord - no suffix in course.details_of_course
                        detectedChord = formattedName;
                    }
                    break;
                case 'Minor':
                    detectedChord = `${formattedName}m`;
                    break;
                case 'Diminished':
                    detectedChord = `${formattedName}dim`;
                    break;
                case 'Major Seventh':
                    detectedChord = `${formattedName}maj7`;
                    break;
                case 'Dominant Seventh':
                    detectedChord = `${formattedName}7`;
                    break;
                case 'Minor Seventh':
                    detectedChord = `${formattedName}m7`;
                    break;
                case 'Half Diminished':
                    detectedChord = `${formattedName}m7b5`;
                    break;
                default: {
                    // For other chord types, use interval analysis to determine format
                    const hasMajor3rd = intervals.includes('3M');
                    const hasDim5th = intervals.includes('5d');
                    const hasAug5th = intervals.includes('5A');

                    if (hasMajor3rd) {
                        if (hasDim5th) {
                            detectedChord = `${formattedName}Mb5`;
                        } else if (hasAug5th) {
                            detectedChord = `${formattedName}aug`;
                        } else {
                            // Use tonal's symbol as fallback if our analysis is inconclusive
                            detectedChord = `${formattedName}${chordInfo.symbol || ''}`;
                        }
                    } else {
                        // Use tonal's symbol as fallback if our analysis is inconclusive
                        detectedChord = `${formattedName}${chordInfo.symbol || ''}`;
                    }
                }
            }
        }

        if (playedNotes.length > 0) {
            if (detectedChord !== 'Unknown Chord') {
                if (detectedChord === targetKey) {
                    setFeedback(`🎉 Correct! You played ${detectedChord}`);

                    // Process correct answer in learning queue
                    const result = learningQueue.current.processResult(true);

                    // Update mastered items display
                    setMasteredItems(learningQueue.current.getMasteredItems());

                    // Check if all items are mastered
                    if (result.allMastered) {
                        setAllMastered(true);
                        setFeedback("🎉 Challenge completed! All items mastered!");
                        if (stopwatchRef.current) {
                            stopwatchRef.current.handleStopTimer();
                        }
                    } else if (result.nextChallenge) {
                        // Clear any existing timeout
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }

                        // Set new timeout for next challenge
                        timeoutRef.current = setTimeout(() => {
                            setFeedback("");
                            setTargetKey(result.nextChallenge);
                            setMessage(`Play the chord: ${result.nextChallenge}`);
                        }, 800);
                    }
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
    }, [gameState.isActive, targetKey, trainingCourse, allMastered]);

    // Set up the piano events callback
    useEffect(() => {
        if (pianoEvents.current) {
            pianoEvents.current.setNotesCallback = (notes) => {
                console.log('Piano events callback triggered with notes:', notes);
                setCurrentNotes(notes);
                checkPlayedNotes(notes);
            };
        }
    }, [checkPlayedNotes]);

    // Initialize training when course changes
    useEffect(() => {
        if (trainingCourse) {
            console.log('Starting training with course:', trainingCourse);
            const trainingSequence = TrainingParser.parseTrainingContent(trainingCourse);
            console.log('Parsed sequence:', trainingSequence);

            // Set the current training sequence state
            setCurrentTrainingSequence(trainingSequence);

            // Initialize learning queue with the new sequence
            initializeLearningQueue(trainingSequence);

            dispatch(setGameActive(true));
            dispatch(startTraining(trainingSequence));
        }
    }, [trainingCourse, dispatch, initializeLearningQueue]);

    // Set up MIDI controller events
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

            // Add timeout cleanup
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
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

    useEffect(() => {
        console.log("currentTrainingSequence changed:", currentTrainingSequence);
    }, [currentTrainingSequence]);

    if (error) return <div className="error-message">{error}</div>;
    return (
        <div className="piano-page">
            <div className="q-container">
                <StopWatch ref={stopwatchRef} onStartChallenge={startKeyChallenge} onStopChallenge={stopKeyChallenge} />
            </div>
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
                                    <MasteredList items={masteredItems} />
                                    {allMastered && (
                                        <p className="completion-message">🎉 Challenge completed! All items mastered!</p>
                                    )}
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
    )
}

export default MidiKeyboardPage;
