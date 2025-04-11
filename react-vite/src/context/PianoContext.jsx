import { createContext, useContext, useState, useEffect } from 'react';
import RunMidiUtil from '../utils/runMidiUtil';

// Create context
const PianoContext = createContext();

// Custom hook for using the context
export const usePianoContext = () => useContext(PianoContext);

// Provider component
export const PianoProvider = ({ children }) => {
    const [activeNotes, setActiveNotes] = useState([]);

    useEffect(() => {
        // Handler for note on events
        const handleNoteOn = (note) => {
            console.log("Context received note on:", note);
            setActiveNotes(prevNotes => {
                // Add the note if it's not already in the list
                if (!prevNotes.includes(note)) {
                    return [...prevNotes, note];
                }
                return prevNotes;
            });
        };

        // Handler for note off events
        const handleNoteOff = (note) => {
            console.log("Context received note off:", note);
            setActiveNotes(prevNotes => {
                // Remove the note from the list
                return prevNotes.filter(n => n !== note);
            });
        };

        // Register listeners and store the cleanup functions
        const removeNoteOnListener = RunMidiUtil.addNoteOnListener(handleNoteOn);
        const removeNoteOffListener = RunMidiUtil.addNoteOffListener(handleNoteOff);

        console.log("MIDI listeners registered for PianoContext");

        // Return a cleanup function that calls both cleanup functions
        return () => {
            console.log("Cleaning up MIDI listeners for PianoContext");
            removeNoteOnListener?.();
            removeNoteOffListener?.();
        };
    }, []);

    // Value to be provided by the context
    const contextValue = {
        activeNotes,
    };

    return (
        <PianoContext.Provider value={contextValue}>
            {children}
        </PianoContext.Provider>
    );
};
