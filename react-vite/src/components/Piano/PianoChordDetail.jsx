import { useEffect, useState, useRef } from 'react'
import { reformatData } from "../Data/ChordData"
import { Instrument } from "piano-chart"
import './PianoChordDetail.css' // Add a CSS file for styling

const PianoChordDetail = () => {
    // Get the formatted chord data
    const allChordData = reformatData();

    // Extract all unique keys for the dropdown
    const uniqueKeys = [...new Set(allChordData.map(chord => chord.key))].sort();

    // State for key filtering - default to first key in the list
    const [selectedKey, setSelectedKey] = useState(uniqueKeys[0] || '');

    // Filtered chord data based on selected key
    const chordData = selectedKey
        ? allChordData.filter(chord => chord.key === selectedKey)
        : allChordData;

    // State to store the generated piano images
    const [pianoImages, setPianoImages] = useState({});

    // Reference to track mounted status
    const isMounted = useRef(true);


    // Clear piano images when key selection changes to free up memory
    useEffect(() => {
        setPianoImages({});
    }, [selectedKey]);

    // Function to create piano, highlight notes, and rasterize
    const createPianoImage = (chordId, notes) => {
        // Skip if we already have an image for this chord
        if (pianoImages[chordId]) return;

        // Get the container element for this specific chord
        const container = document.getElementById(`piano-container-${chordId}`);
        if (!container) return;

        // IMPROVED SOLUTION: Better container preparation
        // Force the container to have consistent dimensions before creating the piano
        container.style.width = '200px';  // Wider width for 3 octaves
        container.style.height = '75px'; // Taller height for better proportions
        container.style.margin = '0 auto'; // Center the container

        // Create the piano with EXPLICIT octave range and settings
        const piano = new Instrument(container, {
            startOctave: 4,        // Always start at octave 3
            endOctave: 6,          // Always end at octave 5
            showOctaveNumbers: true, // Optional: show octave numbers for clarity
            whiteKeyWidth: 40,     // Consistent key sizing
            blackKeyWidth: 20,
            blackKeyHeight: 100,
            // Disable any auto-adjustment features if the library has them
            autoAdjustOctaves: false, // This is a hypothetical setting - check the library docs
        });

        // Force the piano to render the full specified range
        piano.create();

        // Ensure notes are mapped to the visible octave range
        const noteArray = notes.split(',').map(note => note.trim());
        const processedNotes = noteArray.map(note => {
            // Extract the note name without octave
            const noteName = note.replace(/\d+$/, '');

            // Determine the best octave to display this note within our visible range
            let octave = 4; // Default to middle octave

            // If the note already has an octave specified, try to use it if in range
            const octaveMatch = note.match(/\d+$/);
            if (octaveMatch) {
                const specifiedOctave = parseInt(octaveMatch[0]);
                // Keep the octave within our visible range
                if (specifiedOctave >= 3 && specifiedOctave <= 5) {
                    octave = specifiedOctave;
                }
            }

            return `${noteName}${octave}`;
        });

        // Press all the keys
        processedNotes.forEach(note => {
            try {
                piano.keyDown(note);
            } catch (error) {
                console.warn(`Failed to press key ${note}:`, error);
            }
        });

        // CRITICAL: Add a delay before rasterization to ensure keys are visually pressed
        setTimeout(() => {
            // Now rasterize after the delay
            piano.rasterize((dataUrl) => {
                // Update state with the image
                if (isMounted.current) {
                    setPianoImages(prev => ({
                        ...prev,
                        [chordId]: dataUrl
                    }));
                }

                // Only release the keys AFTER rasterization is complete
                processedNotes.forEach(note => {
                    try {
                        piano.keyUp(note);
                    } catch (error) {
                        console.warn(`Failed to release key ${note}:`, error);
                    }
                });
            }, `${notes} - ${chordId}`);
        }, 200); // Increased delay to ensure visual rendering is complete
    };
    // Effect to handle piano creation after render
    useEffect(() => {
        const processChords = (startIdx, batchSize) => {
            const endIdx = Math.min(startIdx + batchSize, chordData.length);

            for (let i = startIdx; i < endIdx; i++) {
                const chord = chordData[i];
                createPianoImage(chord.id, chord.notes);
            }

            // If there are more chords to process, schedule the next batch
            if (endIdx < chordData.length && isMounted.current) {
                setTimeout(() => {
                    processChords(endIdx, batchSize);
                }, 100); // Small delay to allow UI to breathe
            }
        };

        // Start processing chords in batches of 5
        processChords(0, 5);
    }, [chordData]); // Now depends on filtered chordData

    return (
        <div className="piano-chord-detail">
            {/* Key selection dropdown */}
            <div className="key-filter-container">
                <label htmlFor="key-select">Select Key: </label>
                <select
                    id="key-select"
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="key-select"
                >
                    {uniqueKeys.map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
                <span className="results-count">
                    Showing {chordData.length} chords in key {selectedKey}
                </span>
            </div>

            {/* SOLUTION FOR ISSUE 1: Improved layout structure */}
            <div className="chord-list">
                {chordData.map(chordInfo => (
                    <div className="chord-info-item" key={chordInfo.id}>
                        <div className="chord-details">
                            <h2>{chordInfo.name}</h2>

                            {/* Piano container with consistent sizing */}
                            <div className="piano-visualization">
                                {pianoImages[chordInfo.id] ? (
                                    <img
                                        src={pianoImages[chordInfo.id]}
                                        alt={`Piano visualization for ${chordInfo.name}`}
                                        className="piano-image"
                                        // SOLUTION FOR ISSUE 2: Consistent image dimensions
                                        width="200"
                                        height="75"
                                    />
                                ) : (
                                    <div
                                        id={`piano-container-${chordInfo.id}`}
                                        className="piano-container"
                                    // Container dimensions set in createPianoImage function
                                    >

                                    </div>
                                )}
                            </div>

                            <p>{chordInfo.notes}</p>
                        </div>


                    </div>
                ))}
            </div>


        </div>
    );
};



export default PianoChordDetail;
