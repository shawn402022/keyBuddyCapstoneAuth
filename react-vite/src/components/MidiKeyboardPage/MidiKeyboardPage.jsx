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
    const timeoutRef = useRef(null);





    // Add this function somewhere in your component:

    const generateChallenge = useCallback((sequence) => {
        console.log("generateChallenge called with:", sequence);

        if (!sequence) {
            console.log("No sequence provided to generateChallenge");
            return;
        }

        // For scales
        if (sequence.type === 'scale' && sequence.notes) {
            const randomNote = sequence.notes[Math.floor(Math.random() * sequence.notes.length)];
            setTargetKey(randomNote);
            setMessage(`Play the key: ${randomNote}`);
            return;
        }

        // For chord sequences
        if (Array.isArray(sequence)) {
            const randomChord = sequence[Math.floor(Math.random() * sequence.length)];
            const cleanChordName = randomChord.replace(',', '').trim();
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

                    // Clear any existing timeout
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    // Set new timeout and store the reference
                    timeoutRef.current = setTimeout(() => {
                        setFeedback("");
                        generateChallenge(currentTrainingSequence);
                    }, 800);
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
          }        /*
        console.log('Detection Results:', {
            playedNotes: noteNames,
            detectedChord: detectedChord,
            targetChord: targetKey
        });
          */
        if (playedNotes.length > 0) {
            if (detectedChord !== 'Unknown Chord') {
                if (detectedChord === targetKey) {
                    setFeedback(`🎉 Correct! You played ${detectedChord}`);

                    // Clear any existing timeout
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    // Set new timeout and store the reference
                    timeoutRef.current = setTimeout(() => {
                        setFeedback("");
                        generateChallenge(currentTrainingSequence);
                    }, 800);
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
    }, [gameState.isActive, targetKey, generateChallenge, currentTrainingSequence, trainingCourse]);

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

            // Set the current training sequence state
            setCurrentTrainingSequence(trainingSequence);

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
                <StopWatch />
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
