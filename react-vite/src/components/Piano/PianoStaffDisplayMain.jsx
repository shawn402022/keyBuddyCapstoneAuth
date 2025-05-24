import { useEffect, useRef, useState, useCallback } from 'react';
import { usePianoContext } from '../../context/PianoContext';
//import { useAccidentalContext } from '../../context/AccidentalContext';

import { Renderer, Stave, StaveConnector, Formatter, Voice, StaveNote, Accidental } from 'vexflow';

import AccidentalToggle from '../AccidentalToggle';
const RESOLUTION = 4096;

import './PianoDisplaysMain.css'

const PianoStaffDisplayMain = () => {
    // Get active notes from context instead of local state
    const { activeNotes } = usePianoContext();

    // Create a ref to store the  DOM element
    const staffContainerRef = useRef(null);
    const wrapperRef = useRef(null);


    // Use tickNotesRef to store notes that should be displayed
    const tickNotesRef = useRef([]);


    // State for dynamic dimensions
    const [dimensions, setDimensions] = useState({ width: 880, height: 220 });

    // Reference to store VexFlow context and staves
    const vexFlowRef = useRef({
        context: null,
        trebleStave: null,
        bassStave: null
    });

    // Debounced resize handler
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Calculate responsive dimensions
    const calculateDimensions = useCallback(() => {
        if (wrapperRef.current) {
            const containerWidth = wrapperRef.current.offsetWidth;
            // Leave some padding and ensure minimum/maximum widths
            const availableWidth = Math.max(300, Math.min(containerWidth - 40, 1200));
            const aspectRatio = 220 / 880; // Original height/width ratio
            const newHeight = Math.max(180, availableWidth * aspectRatio);

            setDimensions({
                width: availableWidth,
                height: newHeight
            });
        }
    }, []);

    // Debounced resize handler
    const debouncedResize = useCallback(
        debounce(calculateDimensions, 150),
        [calculateDimensions]
    );

    // Set up resize listener
    useEffect(() => {
        // Calculate initial dimensions
        calculateDimensions();

        // Add resize listener
        window.addEventListener('resize', debouncedResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', debouncedResize);
        };
    }, [debouncedResize, calculateDimensions]);

    // Convert MIDI note to VexFlow format
    const convertToVexFlowNote = (midiNote) => {
        // Extract the note name and octave (e.g., "C4" -> "C" and "4")
        const noteName = midiNote.replace(/\d+$/, '');
        const octave = midiNote.match(/\d+$/)[0];

        // Handle sharps/flats notation
        let vexFlowNote = noteName;
        if (noteName.includes('#')) {
            vexFlowNote = noteName.replace('#', '');
            vexFlowNote += '#';
        } else if (noteName.includes('s')) {
            // Convert 's' notation to '#' for VexFlow
            vexFlowNote = noteName.replace('s', '');
            vexFlowNote += '#';
        } else if (noteName.includes('b')) {
            vexFlowNote = noteName.replace('b', '');
            vexFlowNote += 'b';
        }

        // Return the note in VexFlow format with octave
        return vexFlowNote + '/' + octave;
    };

    // Determine if a note belongs on the treble or bass clef
    const isNoteTrebleClef = (midiNote) => {
        // Extract the octave
        const octave = parseInt(midiNote.match(/\d+$/)[0]);

        // Notes with octave 4 and above go on the treble clef
        // Middle C (C4) is typically drawn on the bass clef with a ledger line
        if (octave >= 4) {
            // Special case for C4 (middle C)
            if (octave === 4 && midiNote.startsWith('C') && !midiNote.includes('#') && !midiNote.includes('b')) {
                return false;
            }
            return true;
        }
        return false;
    };


    // Initialize or reinitialize the staff display
    const initializeStaff = useCallback(() => {
        if (staffContainerRef.current && dimensions.width > 0) {
            // Clear any previous content
            staffContainerRef.current.innerHTML = '';

            // Create the renderer with the updated API
            const renderer = new Renderer(
                staffContainerRef.current,
                Renderer.Backends.SVG
            );

            // Configure the renderer with responsive dimensions
            renderer.resize(dimensions.width, dimensions.height);

            const context = renderer.getContext();
            context.setFont('Arial', 10);

            // Calculate stave height based on total height
            const staveHeight = dimensions.height * 0.45; // Each stave takes 45% of total height

            // Draw the stave for treble clef
            const trebleStave = new Stave(0, 0, dimensions.width);
            trebleStave.addClef('treble');
            trebleStave.setContext(context).draw();

            // Draw the stave for bass clef
            const bassStave = new Stave(0, staveHeight, dimensions.width);
            bassStave.addClef('bass');
            bassStave.setContext(context).draw();

            // Connect the staves with a brace
            const brace = new StaveConnector(trebleStave, bassStave).setType(3);
            brace.setContext(context).draw();

            // Connect the staves with a line at the beginning
            const lineLeft = new StaveConnector(trebleStave, bassStave).setType(1);
            lineLeft.setContext(context).draw();

            // Connect the staves with a line at the end
            const lineRight = new StaveConnector(trebleStave, bassStave).setType(6);
            lineRight.setContext(context).draw();

            vexFlowRef.current = {
                context,
                trebleStave,
                bassStave,
                renderer
            };
        }
    }, [dimensions]);

    // Initialize staff when dimensions change
    useEffect(() => {
        initializeStaff();
    }, [initializeStaff]);


    // Function to render notes on the staves
    const renderNotes = useCallback(() => {
        if (!vexFlowRef.current.context) return;

        const { context, trebleStave, bassStave } = vexFlowRef.current;

        try {
            // Clear previous notes by redrawing the staves
            // Get the SVG element
            const svg = staffContainerRef.current.querySelector('svg');
            // Remove all elements except the staves and connectors
            const staveElements = svg.querySelectorAll('.vf-stavenote, .vf-stem, .vf-notehead, .vf-accidental');
            staveElements.forEach(el => el.remove());

            // Separate notes into treble and bass clef
            const trebleNotes = [];
            const bassNotes = [];

            // Process active notes
            activeNotes.forEach(note => {
                if (isNoteTrebleClef(note)) {
                    trebleNotes.push(note);
                } else {
                    bassNotes.push(note);
                }
            });

            // Calculate available width for notes (accounting for clef and margins)
            const availableNoteWidth = dimensions.width * 0.7; // 70% of total width for notes

            // Create VexFlow notes for treble clef
            if (trebleNotes.length > 0) {
                const vfTrebleNotes = [];

                // If we have multiple notes, create a chord
                if (trebleNotes.length > 1) {
                    const keys = trebleNotes.map(note => convertToVexFlowNote(note));

                    // Create the note - using try/catch to handle potential API differences
                    let vfNote;
                    try {
                        vfNote = new StaveNote({
                            clef: 'treble',
                            keys: keys,
                            duration: 'q'
                        });

                        // Add accidentals if needed - using try/catch to handle potential API differences
                        keys.forEach((key, i) => {
                            try {
                                if (key.includes('#')) {
                                    // Try different ways to add accidentals based on VexFlow version
                                    if (typeof vfNote.addAccidental === 'function') {
                                        vfNote.addAccidental(i, new Accidental('#'));
                                    } else if (typeof vfNote.addModifier === 'function') {
                                        vfNote.addModifier(new Accidental('#'), i);
                                    }
                                } else if (key.includes('b')) {
                                    if (typeof vfNote.addAccidental === 'function') {
                                        vfNote.addAccidental(i, new Accidental('b'));
                                    } else if (typeof vfNote.addModifier === 'function') {
                                        vfNote.addModifier(new Accidental('b'), i);
                                    }
                                }
                            } catch (accidentalError) {
                                console.warn('Error adding accidental:', accidentalError);
                                // Continue without adding the accidental
                            }
                        });
                    } catch (noteError) {
                        console.error('Error creating note:', noteError);
                        // Skip this note and continue
                        return;
                    }

                    vfTrebleNotes.push(vfNote);
                } else {
                    // Single note
                    const key = convertToVexFlowNote(trebleNotes[0]);

                    // Create the note - using try/catch to handle potential API differences
                    let vfNote;
                    try {
                        vfNote = new StaveNote({
                            clef: 'treble',
                            keys: [key],
                            duration: 'q'
                        });

                        // Add accidental if needed - using try/catch to handle potential API differences
                        try {
                            if (key.includes('#')) {
                                // Try different ways to add accidentals based on VexFlow version
                                if (typeof vfNote.addAccidental === 'function') {
                                    vfNote.addAccidental(0, new Accidental('#'));
                                } else if (typeof vfNote.addModifier === 'function') {
                                    vfNote.addModifier(new Accidental('#'), 0);
                                }
                            } else if (key.includes('b')) {
                                if (typeof vfNote.addAccidental === 'function') {
                                    vfNote.addAccidental(0, new Accidental('b'));
                                } else if (typeof vfNote.addModifier === 'function') {
                                    vfNote.addModifier(new Accidental('b'), 0);
                                }
                            }
                        } catch (accidentalError) {
                            console.warn('Error adding accidental:', accidentalError);
                            // Continue without adding the accidental
                        }
                    } catch (noteError) {
                        console.error('Error creating note:', noteError);
                        // Skip this note and continue
                        return;
                    }

                    vfTrebleNotes.push(vfNote);
                }

                // Create a voice for the treble clef
                const trebleVoice = new Voice({
                    num_beats: 4,
                    beat_value: 4,
                    resolution: RESOLUTION
                });

                trebleVoice.addTickables(vfTrebleNotes);

                // Format and draw with responsive width
                new Formatter().joinVoices([trebleVoice]).format([trebleVoice], availableNoteWidth);
                trebleVoice.draw(context, trebleStave);
            }

            // Create VexFlow notes for bass clef
            if (bassNotes.length > 0) {
                const vfBassNotes = [];

                // If we have multiple notes, create a chord
                if (bassNotes.length > 1) {
                    const keys = bassNotes.map(note => convertToVexFlowNote(note));

                    // Create the note - using try/catch to handle potential API differences
                    let vfNote;
                    try {
                        vfNote = new StaveNote({
                            clef: 'bass',
                            keys: keys,
                            duration: 'q'
                        });

                        // Add accidentals if needed - using try/catch to handle potential API differences
                        keys.forEach((key, i) => {
                            try {
                                if (key.includes('#')) {
                                    // Try different ways to add accidentals based on VexFlow version
                                    if (typeof vfNote.addAccidental === 'function') {
                                        vfNote.addAccidental(i, new Accidental('#'));
                                    } else if (typeof vfNote.addModifier === 'function') {
                                        vfNote.addModifier(new Accidental('#'), i);
                                    }
                                } else if (key.includes('b')) {
                                    if (typeof vfNote.addAccidental === 'function') {
                                        vfNote.addAccidental(i, new Accidental('b'));
                                    } else if (typeof vfNote.addModifier === 'function') {
                                        vfNote.addModifier(new Accidental('b'), i);
                                    }
                                }
                            } catch (accidentalError) {
                                console.warn('Error adding accidental:', accidentalError);
                                // Continue without adding the accidental
                            }
                        });
                    } catch (noteError) {
                        console.error('Error creating note:', noteError);
                        // Skip this note and continue
                        return;
                    }

                    vfBassNotes.push(vfNote);
                } else {
                    // Single note
                    const key = convertToVexFlowNote(bassNotes[0]);

                    // Create the note - using try/catch to handle potential API differences
                    let vfNote;
                    try {
                        vfNote = new StaveNote({
                            clef: 'bass',
                            keys: [key],
                            duration: 'q'
                        });

                        // Add accidental if needed - using try/catch to handle potential API differences
                        try {
                            if (key.includes('#')) {
                                // Try different ways to add accidentals based on VexFlow version
                                if (typeof vfNote.addAccidental === 'function') {
                                    vfNote.addAccidental(0, new Accidental('#'));
                                } else if (typeof vfNote.addModifier === 'function') {
                                    vfNote.addModifier(new Accidental('#'), 0);
                                }
                            } else if (key.includes('b')) {
                                if (typeof vfNote.addAccidental === 'function') {
                                    vfNote.addAccidental(0, new Accidental('b'));
                                } else if (typeof vfNote.addModifier === 'function') {
                                    vfNote.addModifier(new Accidental('b'), 0);
                                }
                            }
                        } catch (accidentalError) {
                            console.warn('Error adding accidental:', accidentalError);
                            // Continue without adding the accidental
                        }
                    } catch (noteError) {
                        console.error('Error creating note:', noteError);
                        // Skip this note and continue
                        return;
                    }

                    vfBassNotes.push(vfNote);
                }

                // Create a voice for the bass clef
                const bassVoice = new Voice({
                    num_beats: 4,
                    beat_value: 4,
                    resolution: RESOLUTION
                });

                bassVoice.addTickables(vfBassNotes);

                // Format and draw with responsive width
                new Formatter().joinVoices([bassVoice]).format([bassVoice], availableNoteWidth);
                bassVoice.draw(context, bassStave);
            }
        } catch (error) {
            console.error('Error rendering notes:', error);
            // Optionally, you could display a fallback or error message in the UI
        }
    }, [activeNotes, dimensions]);


    // Effect to render notes when active notes change
    useEffect(() => {
        console.log("Active notes changed:", activeNotes);
        if (activeNotes.length > 0 || tickNotesRef.current.length > 0) {
            // Update tickNotesRef to match activeNotes
            tickNotesRef.current = [...activeNotes];
            renderNotes();
        }
    }, [activeNotes, renderNotes]);


    console.log('Staff received notes:')
    return (
        <div
            ref={wrapperRef}
            className='staff-display-wrapper'
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
            }}
        >
            <div className="staff-controls">
                <AccidentalToggle />
            </div>
            <div
                ref={staffContainerRef}
                className='staff-display'
                style={{
                    display: 'block',
                    textAlign: 'left',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* VexFlow will render here */}
            </div>
        </div>

    )
}

export default PianoStaffDisplayMain
