import React, { createContext, useState, useContext } from 'react';

// Create the context
const AccidentalContext = createContext();

// Custom hook for using the context
export const useAccidentalContext = () => useContext(AccidentalContext);

// Provider component
export const AccidentalProvider = ({ children }) => {
    // State to track current preference (true for flats, false for sharps)
    const [useFlats, setUseFlats] = useState(true);

    // Define highlighted notes based on accidental preference
    const highlightedNotes = useFlats
        ? ['Db', 'Eb', 'Gb', 'Ab', 'Bb']
        : [];

    // Function to toggle between flats and sharps
    const toggleAccidentals = () => {
        setUseFlats(prevState => !prevState);
    };

    // Value object to be provided to consumers
    const value = {
        useFlats,
        toggleAccidentals,
        highlightedNotes
    };

    return (
        <AccidentalContext.Provider value={value}>
            {children}
        </AccidentalContext.Provider>
    );
};
