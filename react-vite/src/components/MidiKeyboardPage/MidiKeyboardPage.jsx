
import ChordDiagram from '../ChordDiagram/ChordDiagram';
import PianoDiagnostic from '../Diagnostic/PianoDiagnostic';
//import SimplePiano from './SimplePiano';
import PianoChart from './PianoChart.jsx';


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

import ChordDisplay from './ChordDisplay';
import { TrainingParser } from '../TrainingParser/trainingParse';
import TrainingQuestions from './TrainingQuestions.jsx';
import MasteredItemsDisplay from './MasteredItemsDisplay';
import { TrainingLinkedList } from '../../utils/LinkedList';


import { Chord } from 'tonal';
import {
    startTraining,
    setGameActive,
    setScore
} from '../../redux/game';

import {
    initializeItems,
    getNextItem,
    processResult,
    resetLearning,
    selectCurrentItem,
    selectIsComplete,
    selectIsInitialized
} from '../../redux/spacedRepetition';

const LoadingSpinner = () => (<div className="loading-overlay">
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
    const [startTime, setStartTime] = useState(null);
    const linkedListRef = useRef(null);

    const dispatch = useDispatch();
    const gameState = useSelector(state => state.game);
    const trainingCourse = useSelector(state => state.userCourses.trainingCourse);
    const currentItem = useSelector(selectCurrentItem);
    const isComplete = useSelector(selectIsComplete);
    const isInitialized = useSelector(selectIsInitialized);

    const soundManager = useRef(new SoundManager());
    const noteLabelManager = useRef(new NoteLabelManager());
    const utilities = useRef(new Utilities());
    const keyImages = useRef(new KeyImages());
    const pianoEvents = useRef(new PianoEvents(soundManager.current, noteLabelManager.current));
    pianoEvents.current.setNotesCallback = setCurrentNotes;
    const pianoBuilder = useRef(new PianoBuilder(utilities.current, keyImages.current, pianoEvents.current));
    const midiController = useRef(new MidiController(soundManager.current));
    const timeoutRef = useRef(null);

    // Check if sound is loaded before playing
    const playNote = (note) => {
        if (soundManager.current.sounds[note] && soundManager.current.sounds[note].state() === 'loaded') {
            soundManager.current.sounds[note].play();
        } else {
            console.warn(`Sound not loaded for note: ${note}`);
        }
    };


    // Initialize the spaced repetition system when course changes
    useEffect(() => {
        if (trainingCourse && trainingCourse.details_of_course) {
            const trainingSequence = TrainingParser.parseTrainingContent(trainingCourse);
            setCurrentTrainingSequence(trainingSequence);

            // Initialize the redux state for spaced repetition
            dispatch(initializeItems(trainingSequence));

            // Also initialize our LinkedList as a backup/alternative
            if (Array.isArray(trainingSequence)) {
                linkedListRef.current = new TrainingLinkedList(trainingSequence);
            } else if (trainingSequence.type === 'scale' && trainingSequence.notes) {
                linkedListRef.current = new TrainingLinkedList(trainingSequence.notes);
            }
        }
    }, [trainingCourse, dispatch]);

    // When the challenge starts
    const handleStartChallenge = useCallback(() => {
        dispatch(setGameActive(true));
        dispatch(startTraining(currentTrainingSequence)); // Add this line
        dispatch(setScore(0)); // Add this line
        dispatch(resetLearning());
        setStartTime(Date.now());

        // Get the first item
        dispatch(getNextItem());
    }, [dispatch, currentTrainingSequence]);

    // Set the target key when current item changes
    // Set the target key when current item changes
    useEffect(() => {
        if (currentItem) {
            setTargetKey(currentItem);
            // Fix: Ensure proper conditional handling of the course name
            const itemType = trainingCourse && trainingCourse.course_name &&
                trainingCourse.course_name.includes('scale') ? 'key' : 'chord';
            setMessage(`Play the ${itemType}: ${currentItem}`);
        }
    }, [currentItem, trainingCourse]);


    // Show completion message when all items are mastered
    useEffect(() => {
        if (isComplete && isInitialized) {
            setFeedback("🎉🎉 Congratulations! You have completed the challenge!");
            dispatch(setGameActive(false));
        }
    }, [isComplete, isInitialized, dispatch]);
    // This function processes a correct answer and determines the next item based on response time
    const processAnswer = useCallback((correct) => {
        if (!correct || !startTime) return;

        // Calculate time taken in milliseconds
        const timeTaken = Date.now() - startTime;

        // Process the result in Redux
        dispatch(processResult({
            correct: true,
            timeTaken
        }));

        // Stop sounds immediately when the answer is correct
        stopAllSounds();

        // Also process in our linked list as a backup
        if (linkedListRef.current) {
            const result = linkedListRef.current.handleResponseTime(timeTaken);
            console.log("LinkedList result:", result);
        }

        // Clear any existing timeout to prevent race conditions
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a timeout to get the next item
        timeoutRef.current = setTimeout(() => {
            setFeedback("");

            // Get next item, only if we haven't completed yet
            if (!isComplete) {
                dispatch(getNextItem());
                setStartTime(Date.now()); // Reset the start time for the next question
            }
        }, 800);

        // When getting the next item, use the training sequence:
        if (currentTrainingSequence) {
            // Use it here for some logic
            console.log("Using training sequence:", currentTrainingSequence);
        }
    }, [dispatch, startTime, isComplete, currentTrainingSequence]);

    const checkPlayedNotes = useCallback((playedNotes) => {
        if (!gameState.isActive || !targetKey || !startTime) return;

        // Get the played note letters
        const playedNoteLetters = playedNotes.map(note =>
            note.key.split('/')[0].toUpperCase()
        );

        let isCorrect = false;

        // Handle scale-specific validation
        if (trainingCourse?.course_name.includes('scale')) {
            if (playedNotes.length > 0) {
                const playedKey = playedNoteLetters[0];
                const targetKeyUpper = targetKey.toUpperCase();

                isCorrect = playedKey === targetKeyUpper;

                if (isCorrect) {
                    setFeedback(`🎉 Correct! You played the ${targetKey} key!`);
                    processAnswer(true);
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

        // Check for specific chord patterns first
        let detectedChord = 'Unknown Chord';

        // Check for G7 pattern (G dominant 7th)
        if (noteNames.length === 4) {
            const roots = noteNames.map(n => n.charAt(0));
            const hasG = roots.includes('G');
            const hasB = roots.includes('B');
            const hasD = roots.includes('D');
            const hasF = roots.includes('F');

            if (hasG && hasB && hasD && hasF) {
                detectedChord = 'G7';
            } else {
                // Check for Bm7b5 (half-diminished)
                const hasB = roots.includes('B');
                const hasD = roots.includes('D');
                const hasF = roots.includes('F');
                const hasA = roots.includes('A');
                if (hasB && hasD && hasF && hasA) {
                    detectedChord = 'Bm7b5';
                } else {
                    // Check for Bdim7
                    const hasB = roots.includes('B');
                    const hasD = roots.includes('D');
                    const hasF = roots.includes('F');
                    const hasGSharp = noteNames.some(n => n.includes('G#'));
                    if (hasB && hasD && hasF && hasGSharp) {
                        detectedChord = 'Bdim7';
                    }
                }
            }
        }

        // If not a special case, use Tonal.js
        if (detectedChord === 'Unknown Chord') {
            // Use Tonal.js for chord detection
            const detected = Chord.detect(noteNames, { assumePerfectFifth: false });

            if (detected.length > 0) {
                const chordInfo = Chord.get(detected[0]);
                const intervals = chordInfo.intervals || [];
                let formattedName = chordInfo.tonic || '';

                // Handle specific interval patterns first
                if (intervals.includes('3M') && intervals.includes('5P') && intervals.includes('7m')) {
                    detectedChord = `${formattedName}7`; // Dominant 7th
                } else if (intervals.includes('3m') && intervals.includes('5d') && intervals.includes('7m')) {
                    detectedChord = `${formattedName}m7b5`; // Half-diminished
                } else if (intervals.includes('3m') && intervals.includes('5d') && intervals.includes('7d')) {
                    detectedChord = `${formattedName}dim7`; // Diminished 7th
                }
                // Special case: Major with flat 5th
                else if (intervals.includes('3M') && intervals.includes('5d')) {
                    detectedChord = `${formattedName}Mb5`;
                }
                // Format based on chord quality to match course.details_of_course
                else switch (chordInfo.quality) {
                    case 'Major':
                        // Check for special alterations
                        if (intervals.includes('7m')) {
                            detectedChord = `${formattedName}7`;
                        } else if (intervals.includes('5A')) {
                            detectedChord = `${formattedName}aug`;
                        } else if (intervals.includes('7M')) {
                            detectedChord = `${formattedName}maj7`;
                        } else {
                            // Plain major chord - no suffix in course.details_of_course
                            detectedChord = formattedName;
                        }
                        break;
                    case 'Minor':
                        if (intervals.includes('7m')) {
                            detectedChord = `${formattedName}m7`;
                        } else {
                            detectedChord = `${formattedName}m`;
                        }
                        break;
                    case 'Diminished':
                        if (intervals.includes('7d')) {
                            detectedChord = `${formattedName}dim7`;
                        } else {
                            detectedChord = `${formattedName}dim`;
                        }
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
                        const hasMinor3rd = intervals.includes('3m');
                        const hasDim5th = intervals.includes('5d');
                        const hasAug5th = intervals.includes('5A');
                        const hasMin7th = intervals.includes('7m');
                        const hasMaj7th = intervals.includes('7M');

                        if (hasMajor3rd) {
                            if (hasMin7th) {
                                detectedChord = `${formattedName}7`;
                            } else if (hasMaj7th) {
                                detectedChord = `${formattedName}maj7`;
                            } else if (hasDim5th) {
                                detectedChord = `${formattedName}Mb5`;
                            } else if (hasAug5th) {
                                detectedChord = `${formattedName}aug`;
                            } else {
                                detectedChord = formattedName;
                            }
                        } else if (hasMinor3rd) {
                            if (hasMin7th) {
                                detectedChord = `${formattedName}m7`;
                            } else if (hasMaj7th) {
                                detectedChord = `${formattedName}mM7`;
                            } else {
                                detectedChord = `${formattedName}m`;
                            }
                        } else {
                            // Use tonal's symbol as fallback if our analysis is inconclusive
                            detectedChord = `${formattedName}${chordInfo.symbol || ''}`;
                        }
                    } break;
                }
            }
        }

        if (playedNotes.length > 0) {
            if (detectedChord !== 'Unknown Chord') {
                isCorrect = detectedChord === targetKey;

                if (isCorrect) {
                    setFeedback(`🎉 Correct! You played ${detectedChord}`);
                    processAnswer(true);
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
    }, [gameState.isActive, targetKey, startTime, trainingCourse, processAnswer]);



    useEffect(() => {
        if (pianoEvents.current) {
            pianoEvents.current.setNotesCallback = (notes) => {
                setCurrentNotes(notes);
                checkPlayedNotes(notes);
            };
        }
    }, [checkPlayedNotes]);
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

                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    const container = document.getElementById('piano-container');
                    console.log("Piano container:", container); // Debug log

                    if (container) {
                        // Clear any existing content
                        container.innerHTML = '';

                        // Create the piano
                        const piano = pianoBuilder.current.createPiano(container);
                        console.log("Piano created:", piano); // Debug log

                        // Verify the piano was appended
                        console.log("Container children:", container.children.length);
                    } else {
                        console.error("Piano container not found!");
                    }

                    setIsLoading(false);
                }, 100);
            } catch (err) {
                console.error("Error initializing piano:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        initialize();

        return () => {
            currentMidiController.cleanup();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [checkPlayedNotes]);
    const stopAllSounds = () => {
        // Get all loaded sound keys
        const soundKeys = Object.keys(soundManager.current.sounds || {});

        // Stop each active sound
        soundKeys.forEach(key => {
            if (soundManager.current.sounds[key]) {
                soundManager.current.sounds[key].stop();
            }
        });
    };

    const chordTimeoutsRef = useRef([]);

    // Add a function to play the current challenge
    const playCurrentChallenge = useCallback(() => {
        if (!targetKey || !soundManager.current) return;

        stopAllSounds();

        chordTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
        chordTimeoutsRef.current = []; // Reset the array

        // For scales (single notes)
        if (trainingCourse?.course_name.includes('scale')) {
            // Convert note name to proper format (e.g., "C" to "C4")
            const noteToPlay = `${targetKey}4`; // Assuming octave 4 for consistent playback
            playNote(noteToPlay);
            // Play the note using the sound manager
            if (soundManager.current.sounds[noteToPlay]) {
                soundManager.current.sounds[noteToPlay].play();
            }
            return;
        }

        // For chords, use the TrainingParser to get the notes
        let chordNotes = [];
        try {
            // This approach uses your existing TrainingParser to convert chord names to notes
            // For example: "Cmaj7" → ["C4", "E4", "G4", "B4"]
            const cleanChordName = targetKey.trim();

            // Improved debugging - log the chord we're trying to play
            console.log(`Attempting to play chord/triad: ${cleanChordName}`);

            // Extract root and quality (e.g., "Cmaj7" → "C" and "maj7")
            const match = cleanChordName.match(/^([A-G][#b]?)(.*)$/);
            if (match) {
                const [_, root, quality] = match;
                chordNotes = TrainingParser.chordToNotes(cleanChordName);


                // Determine if it's a triad by checking the course name or chord structure
                const isTriad = trainingCourse?.course_name.toLowerCase().endsWith('triads')


                // For triads, we might need special handling
                if (isTriad) {
                    console.log(`Detected triad: ${root}${quality}`);

                    // Attempt to use our existing chord parser
                    chordNotes = TrainingParser.chordToNotes(cleanChordName);

                    // If parsing fails, fallback to basic triad construction
                    if (!chordNotes || chordNotes.length === 0) {
                        console.log("Initial parsing failed, trying direct note construction");
                        // For C major triad, directly use ["C4", "E4", "G4"]
                        if (root === "C" && (!quality || quality === "maj")) {
                            chordNotes = ["C4", "E4", "G4"];
                        } else {
                            // Other triads - construct using music theory
                            // ...
                        }
                    }
                } else {
                    // Regular chord processing
                    chordNotes = TrainingParser.chordToNotes(cleanChordName);
                }

                console.log("Notes to play:", chordNotes);


                // Play chord notes with slight delay between each
                if (chordNotes && chordNotes.length > 0) {
                    chordNotes.forEach((note, index) => {
                        // Ensure note has an octave specification
                        const noteWithOctave = note.includes('/') ? note.replace('/', '') :
                            (note.match(/\d/) ? note : `${note}4`);


                        const timeoutId = setTimeout(() => {


                            console.log("Sound availability:", {
                                note: noteWithOctave,
                                available: soundManager.current.sounds[noteWithOctave] ? true : false,
                                state: soundManager.current.sounds[noteWithOctave]?.state()
                            });

                            playNote(noteWithOctave)
                            if (soundManager.current.sounds[noteWithOctave]) {
                                soundManager.current.sounds[noteWithOctave].play();
                            }
                        }, index * 80); // Slight delay for arpeggio effect

                        chordTimeoutsRef.current.push(timeoutId);

                    });
                } else {
                    console.warn(`Could not determine notes for: ${cleanChordName}`);
                }
            } else {
                console.warn(`Invalid chord/triad format: ${cleanChordName}`);
            }

        } catch (err) {
            console.error("Error playing challenge chord:", err);
        }
    }, [targetKey, trainingCourse, soundManager]);

    // Also clear timeouts on component unmount
    useEffect(() => {
        return () => {
            chordTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
        };
    }, []);

    // Add effect to play the challenge when it starts
    useEffect(() => {
        if (currentItem && gameState.isActive) {
            // Play the challenge sound after a short delay to ensure sounds are loaded
            setTimeout(() => {
                playCurrentChallenge();
            }, 300);
        }
    }, [currentItem, gameState.isActive, playCurrentChallenge]);



    if (error) return <div className="error-message">{error}</div>;
    return (
        <div className="piano-page">
            <div className="q-container">
                <StopWatch onStart={handleStartChallenge} />
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
                                    <div className="challenge-header">
                                        <p className="challenge-message">{message}</p>
                                        <button
                                            className="play-again-button"
                                            onClick={playCurrentChallenge}
                                            aria-label="Play the sound again"
                                        >
                                            🔊 Listen
                                        </button>

                                        {targetKey && !trainingCourse?.course_name?.toLowerCase().includes('scale') && (
                                            <div className="chord-diagram-wrapper">
                                                <ChordDiagram
                                                    chordName={targetKey}
                                                    showListenButton={false}
                                                    size="medium"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="feedback-message">{feedback}</p>
                                    <MasteredItemsDisplay />
                                </div>

                            )}
                            {isComplete && (
                                <div className="completion-message">
                                    <h2>Congratulations! 🎉</h2>
                                    <p>You have mastered all items in this course!</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <PianoChart
                            currentNotes={currentNotes}
                            soundManager={soundManager.current}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MidiKeyboardPage;
