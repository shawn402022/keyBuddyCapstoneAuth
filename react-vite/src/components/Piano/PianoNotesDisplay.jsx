import './PianoDisplays.css'
import { usePianoContext } from '../../context/PianoContext';
import { useState, useEffect } from 'react';


const PianoNotesDisplay = () => {
    const { activeNotes } = usePianoContext();

    //Parse a note string into a note name and octave

    const parseNote = (noteString) => {
        //Find index of first digit
        const firstDigitIndex = noteString.search(/\d/);

        //If a digit is found, split the string at that index
        if (firstDigitIndex !== -1) {
            return {
                //Everything before the first digit is the note name
                noteName: noteString.substring(0, firstDigitIndex),
                //Everything fro the first digit onwards is the octave
                octave: noteString.substring(firstDigitIndex)
            };
        }

        // Fallback in case no digit is found (unlikely for valid notes)
        return { noteName: noteString, octave: '' };
    };

    return (
        <div className='piano-notes-display'>
            <div className="notes-list">
                {activeNotes.map(note => {
                    // Parse each note into its name and octave components
                    const { noteName, octave } = parseNote(note);

                    return (
                        <span key={note} className="note-tag">
                            {/* Render the note name with its own class for styling */}
                            <span className="note-name">{noteName}</span>

                            {/* Render the octave with its own class for styling */}
                            <span className="note-octave">{octave}</span>

                            {/* Add a comma and space after each note except the last one */}
                            {activeNotes.indexOf(note) < activeNotes.length - 1 ?? "" }
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default PianoNotesDisplay
