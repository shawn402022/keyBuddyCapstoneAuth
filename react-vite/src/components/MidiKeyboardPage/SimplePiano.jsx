import { useEffect, useRef } from 'react';
import { PIANO_CONFIG } from './config';
import './SimplePiano.css';

const SimplePiano = ({ soundManager, updateActiveNotes, midiController }) => {
    const pianoRef = useRef(null);
    const isDraggingRef = useRef(false);
    const lastTouchedNoteRef = useRef(null);

    useEffect(() => {
        if (!pianoRef.current) return;

        // Store a reference to the container that will persist through cleanup
        const pianoContainer = pianoRef.current;

        // Clear any existing content
        pianoContainer.innerHTML = '';

        // Create SVG element - extended width for more octaves
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "300px"); // Reduced height
        svg.setAttribute("viewBox", "0 0 3200 300"); // Extended width, reduced height
        svg.setAttribute("class", "simple-piano");

        // Constants for key dimensions
        const whiteKeyWidth = 80;
        const whiteKeyHeight = 300; // Reduced height
        const blackKeyWidth = 40;
        const blackKeyHeight = 180; // Reduced proportionally

        // Extended note range to include up to B6
        const extendedChromaticNotes = [
            ...PIANO_CONFIG.chromaticNotes,
            // Add C5-B6 notes here
            "C5", "D5", "E5", "F5", "G5", "A5", "B5",
            "C6", "D6", "E6", "F6", "G6", "A6", "B6"
        ];

        const extendedSharpNotes = [
            ...PIANO_CONFIG.sharpNotes,
            // Add corresponding sharp notes
            "C#5", "D#5", "F#5", "G#5", "A#5",
            "C#6", "D#6", "F#6", "G#6", "A#6"
        ];

        // Create white keys
        extendedChromaticNotes.forEach((note, index) => {
            const whiteKey = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            whiteKey.setAttribute("class", "white-key");
            whiteKey.setAttribute("x", index * whiteKeyWidth);
            whiteKey.setAttribute("y", 0);
            whiteKey.setAttribute("width", whiteKeyWidth);
            whiteKey.setAttribute("height", whiteKeyHeight);
            whiteKey.setAttribute("rx", 3);
            whiteKey.setAttribute("ry", 3);
            whiteKey.setAttribute("data-note", note);

            svg.appendChild(whiteKey);
        });

        // Calculate black key positions
        let blackKeyIndex = 0;
        extendedChromaticNotes.forEach((note, index) => {
            // Check if this position should have a black key
            const noteName = note.charAt(0);
            if (noteName !== 'E' && noteName !== 'B') {
                const blackKey = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                blackKey.setAttribute("class", "black-key");
                blackKey.setAttribute("x", (index * whiteKeyWidth) + (whiteKeyWidth - blackKeyWidth / 2));
                blackKey.setAttribute("y", 0);
                blackKey.setAttribute("width", blackKeyWidth);
                blackKey.setAttribute("height", blackKeyHeight);
                blackKey.setAttribute("rx", 3);
                blackKey.setAttribute("ry", 3);

                // Use the corresponding sharp note
                const sharpNote = extendedSharpNotes[blackKeyIndex];
                blackKey.setAttribute("data-note", sharpNote);

                svg.appendChild(blackKey);
                blackKeyIndex++;
            }
        });

        pianoContainer.appendChild(svg);

        // Handle note events
        function handleNoteOn(noteId) {
            // Add visual feedback
            const keyElement = svg.querySelector(`[data-note="${noteId}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
            }

            // Use the centralized state update function
            if (updateActiveNotes) {
                updateActiveNotes(noteId, true, 0.8);
            }
        }

        function handleNoteOff(noteId) {
            // Remove visual feedback
            const keyElement = svg.querySelector(`[data-note="${noteId}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
            }

            // Use the centralized state update function
            if (updateActiveNotes) {
                updateActiveNotes(noteId, false);
            }
        }

        // Add mouse event listeners for individual keys
        const allKeys = svg.querySelectorAll('[data-note]');
        allKeys.forEach(key => {
            key.addEventListener('mousedown', () => {
                const noteId = key.getAttribute('data-note');
                handleNoteOn(noteId);
            });

            key.addEventListener('mouseup', () => {
                const noteId = key.getAttribute('data-note');
                handleNoteOff(noteId);
            });

            key.addEventListener('mouseleave', () => {
                // Only handle mouseleave if we're not dragging
                if (!isDraggingRef.current) {
                    const noteId = key.getAttribute('data-note');
                    handleNoteOff(noteId);
                }
            });
        });

        // Add drag functionality
        const handleMouseDown = () => {
            isDraggingRef.current = true;
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            lastTouchedNoteRef.current = null;

            // Release all notes when mouse is up
            const activeNotes = [...activeNotesRef.current.keys()];
            activeNotes.forEach(noteId => {
                handleNoteOff(noteId);
            });
        };

        const handleMouseMove = (e) => {
            if (!isDraggingRef.current) return;

            // Find the key element under the cursor
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (!element) return;

            const noteElement = element.closest('[data-note]');
            if (!noteElement) return;

            const noteId = noteElement.getAttribute('data-note');

            // Only trigger if we've moved to a new note
            if (noteId !== lastTouchedNoteRef.current) {
                // If we had a previous note during this drag, release it
                if (lastTouchedNoteRef.current) {
                    handleNoteOff(lastTouchedNoteRef.current);
                }

                handleNoteOn(noteId);
                lastTouchedNoteRef.current = noteId;
            }
        };

        // Add event listeners with proper reference
        pianoContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        // Connect to MIDI controller if available
        if (midiController) {
            midiController.setNoteOnCallback = (noteId, velocity) => {
                handleNoteOn(noteId);
            };

            midiController.setNoteOffCallback = (noteId) => {
                handleNoteOff(noteId);
            };
        }

        // Cleanup function with null checks
        return () => {
            // Check if references still exist before removing listeners
            if (pianoContainer) {
                try {
                    pianoContainer.removeEventListener('mousedown', handleMouseDown);
                } catch (e) {
                    console.warn('Failed to remove mousedown event listener', e);
                }
            }

            // Document should always exist, but wrap in try/catch for safety
            try {
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('mousemove', handleMouseMove);
            } catch (e) {
                console.warn('Failed to remove document event listeners', e);
            }

            // Clean up MIDI controller callbacks safely
            if (midiController) {
                try {
                    midiController.setNoteCallbacks(null, null);
                } catch (e) {
                    console.warn('Failed to clean up MIDI callbacks', e);
                }
            }
        };
    }, [updateActiveNotes, midiController]);

    return (
        <div
            ref={pianoRef}
            className="simple-piano-container"
            style={{
                marginTop: '5px', // Reduced margin
            }}
        />
    );
};

export default SimplePiano;
