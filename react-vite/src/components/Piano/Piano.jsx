import { Instrument } from "piano-chart";
import { useEffect, useRef } from "react";
import RunMidiUtil from "../../utils/runMidiUtil";
import { useAccidentalContext } from "../../context/AccidentalContext";



const Piano = () => {
    const pianoContainerRef = useRef(null);
    const pianoRef = useRef(null);
    const { highlightedNotes, useFlats } = useAccidentalContext();

    // Store event listeners for cleanup
    const listenersRef = useRef({ noteOn: null, noteOff: null });


    useEffect(() => {
        // Function to safely destroy the piano instance
        const safelyDestroyPiano = () => {
            if (pianoRef.current) {
                try {
                    // Check if there's a destroy method
                    if (typeof pianoRef.current.destroy === 'function') {
                        pianoRef.current.destroy();
                    }
                } catch (error) {
                    console.warn("Error destroying piano instance:", error);
                    // Continue despite the error - we'll create a new instance anyway
                }
                pianoRef.current = null;
            }
        };

        // Function to create the piano instance
        const createPianoInstance = () => {
            // Only create if we have a container and no current instance
            if (pianoContainerRef.current && !pianoRef.current) {
                try {
                    // Clear the container's contents first to avoid conflicts
                    pianoContainerRef.current.innerHTML = '';

                    // Create new instance
                    pianoRef.current = new Instrument(pianoContainerRef.current, {
                        startOctave: 1,
                        endOctave: 8,
                        showNoteNames: 'always',
                        highlightedNotes: highlightedNotes,
                        specialHighlightedNotes: [{ note: "D" }],
                        keyPressStyle: 'vivid',
                        vividKeyPressColor: 'rgb(255, 255, 0)',
                    });

                    pianoRef.current.create();
                } catch (error) {
                    console.error("Error creating piano instance:", error);
                    pianoRef.current = null;
                }
            }
        };

        // First safely destroy any existing instance
        safelyDestroyPiano();

        // Then create a new instance
        createPianoInstance();

        // Register listeners for MIDI note events
        const handleNoteOn = (note) => {
            if (pianoRef.current) {
                try {
                    // Convert note format if needed
                    const formattedNote = useFlats
                        ? note
                        : note.replace('s', '#');

                    console.log(`Piano highlighting note: ${formattedNote}`);
                    pianoRef.current.keyDown(formattedNote);
                } catch (error) {
                    console.warn(`Error highlighting note ${note}:`, error);
                }
            }
        };

        const handleNoteOff = (note) => {
            if (pianoRef.current) {
                try {
                    // Convert note format if needed
                    const formattedNote = useFlats
                        ? note
                        : note.replace('s', '#');

                    console.log(`Piano releasing note: ${formattedNote}`);
                    pianoRef.current.keyUp(formattedNote);
                } catch (error) {
                    console.warn(`Error releasing note ${note}:`, error);
                }
            }
        };

        // Add listeners to the MIDI utility
        const removeNoteOnListener = RunMidiUtil.addNoteOnListener(handleNoteOn);
        const removeNoteOffListener = RunMidiUtil.addNoteOffListener(handleNoteOff);

        // Store listeners for cleanup
        listenersRef.current = {
            noteOn: removeNoteOnListener,
            noteOff: removeNoteOffListener
        };

        // Cleanup function
        return () => {
            // Remove MIDI listeners
            if (listenersRef.current.noteOn) listenersRef.current.noteOn();
            if (listenersRef.current.noteOff) listenersRef.current.noteOff();

            // Clean up piano instance
            safelyDestroyPiano();
        };
    }, [highlightedNotes, useFlats]);

    return (

        <div ref={pianoContainerRef} className="piano-display">
            {/* The piano will be rendered here */}
        </div>


    )
}

export default Piano
