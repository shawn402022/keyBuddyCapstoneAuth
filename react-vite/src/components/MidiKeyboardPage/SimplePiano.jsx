import { useEffect, useRef } from 'react';
import { PIANO_CONFIG } from './config';
import './SimplePiano.css';

const SimplePiano = ({ soundManager, setCurrentNotes, midiController }) => {
    const pianoRef = useRef(null);
    const activeNotesRef = useRef(new Map());
    const isDraggingRef = useRef(false);
    const lastTouchedNoteRef = useRef(null);

    useEffect(() => {
        if (!pianoRef.current) return;

        // Clear any existing content
        pianoRef.current.innerHTML = '';

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

        pianoRef.current.appendChild(svg);

        // Handle note events
        function handleNoteOn(noteId) {
            // Play the sound
            if (soundManager && soundManager.sounds[noteId]) {
                soundManager.sounds[noteId].play();
            }

            // Add visual feedback
            const keyElement = svg.querySelector(`[data-note="${noteId}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
            }

            // Add to active notes
            const noteInfo = {
                key: noteId.toLowerCase(),
                octave: noteId.includes('/') ? noteId.split('/')[1] : noteId.slice(-1),
                isSharp: noteId.includes('#')
            };

            activeNotesRef.current.set(noteId, noteInfo);

            // Update parent component
            if (setCurrentNotes) {
                setCurrentNotes([...activeNotesRef.current.values()]);
            }
        }

        function handleNoteOff(noteId) {
            // Remove visual feedback
            const keyElement = svg.querySelector(`[data-note="${noteId}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
            }

            // Remove from active notes
            activeNotesRef.current.delete(noteId);

            // Update parent component
            if (setCurrentNotes) {
                setCurrentNotes([...activeNotesRef.current.values()]);
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

        // Add event listeners for drag functionality
        pianoRef.current.addEventListener('mousedown', handleMouseDown);
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

        // Cleanup function
        return () => {
            pianoRef.current.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);

            // Clean up MIDI controller callbacks
            if (midiController) {
                midiController.setNoteOnCallback = null;
                midiController.setNoteOffCallback = null;
            }
        };
    }, [soundManager, setCurrentNotes, midiController]);

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
