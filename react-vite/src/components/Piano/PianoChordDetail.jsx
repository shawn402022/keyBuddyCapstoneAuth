import { useEffect, useState, useRef } from 'react'
import { reformatData } from '../../utils/formatChordUtils';
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
    const createPianoImage = (chordId, notes, chordName) => {
        // Skip if we already have an image for this chord
        if (pianoImages[chordId]) return;

        // Get the container element for this specific chord
        const container = document.getElementById(`piano-container-${chordId}`);
        if (!container) return;

        // Force the container to have consistent dimensions
        container.style.width = '500px';
        container.style.height = '180px';
        container.style.margin = '0 auto';

        // Create the piano with wider octave range to accommodate voicing
        const piano = new Instrument(container, {
            startOctave: 3,        // Start at octave 3 to give room for lower notes
            endOctave: 6,          // End at octave 5 for higher notes
            showOctaveNumbers: true,
            whiteKeyWidth: 40,
            blackKeyWidth: 20,
            blackKeyHeight: 100,
            keyPressStyle: "vivid",
        });

        piano.create();

        // Parse the chord name to extract the root note
        const rootNote = extractRootNote(chordName);

        // Process notes with intelligent voicing
        const noteArray = notes.split(',').map(note => note.trim());
        const processedNotes = applyChordVoicing(noteArray, rootNote);

        // Press all the keys
        processedNotes.forEach(note => {
            try {
                piano.keyDown(note);
            } catch (error) {
                console.warn(`Failed to press key ${note}:`, error);
            }
        });

        // Rasterize after delay
        setTimeout(() => {
            piano.rasterize((dataUrl) => {
                if (isMounted.current) {
                    setPianoImages(prev => ({
                        ...prev,
                        [chordId]: dataUrl
                    }));
                }

                // Release the keys after rasterization
                processedNotes.forEach(note => {
                    try {
                        piano.keyUp(note);
                    } catch (error) {
                        console.warn(`Failed to release key ${note}:`, error);
                    }
                });
            }, `${notes} - ${chordId}`);
        }, 200);
    };

    // Helper function to extract the root note from chord name
    const extractRootNote = (chordName) => {
        // Most chord names start with the root note
        // This regex matches the first part of the chord name (e.g., "A" from "A7#9b13")
        const rootMatch = chordName.match(/^([A-G][#b]?)/);
        return rootMatch ? rootMatch[1] : null;
    };

    // Helper function to apply proper chord voicing
    const applyChordVoicing = (noteArray, rootNote) => {
        if (!rootNote) {
            // Fallback if we can't determine the root
            return noteArray.map(note => `${note}4`);
        }

        // Standardize note names (e.g., convert B# to C)
        const standardizedNotes = noteArray.map(standardizeNoteName);

        // Find the root note index in the array
        const rootIndex = standardizedNotes.findIndex(note =>
            standardizeNoteName(note) === standardizeNoteName(rootNote)
        );

        if (rootIndex === -1) {
            // Root note not found in the array, use default voicing
            return standardizedNotes.map(note => `${note}4`);
        }

        // Reorder notes to start with the root
        const reordered = [
            ...standardizedNotes.slice(rootIndex),
            ...standardizedNotes.slice(0, rootIndex)
        ];

        // Apply voicing rules
        return applyVoicingRules(reordered, rootNote);
    };

    // Helper function to standardize note names
    const standardizeNoteName = (note) => {
        // Remove any existing octave number
        const noteName = note.replace(/\d+$/, '');

        // Handle enharmonic equivalents
        const enharmonics = {
            'B#': 'C', 'E#': 'F',
            'Cb': 'B', 'Fb': 'E',
            // Add more as needed
        };

        return enharmonics[noteName] || noteName;
    };

    // Apply musical voicing rules to distribute notes across octaves
    const applyVoicingRules = (notes, rootNote) => {
        // Start with the root note in octave 3
        const voiced = [`${rootNote}3`];

        // Calculate the position of each note relative to the root
        const notePositions = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
            'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };

        // Get the position of the root note
        const rootPosition = notePositions[standardizeNoteName(rootNote)];

        // For each note after the root, determine its octave based on musical principles
        for (let i = 1; i < notes.length; i++) {
            const note = notes[i];
            const standardNote = standardizeNoteName(note);
            const notePosition = notePositions[standardNote];

            if (notePosition === undefined) {
                // If we can't determine the position, default to octave 4
                voiced.push(`${note}4`);
                continue;
            }

            // Calculate the interval from the root (0-11)
            let interval = (notePosition - rootPosition + 12) % 12;

            // Determine octave based on interval
            let octave;
            if (interval === 0) {
                // If it's the same note as root (e.g., another A in A7), put it in octave 4
                octave = 4;
            } else if (interval <= 4) {
                // For close intervals like thirds and fourths, keep in octave 4
                octave = 4;
            } else if (interval <= 8) {
                // For fifths and sixths, could go either way - use octave 4
                octave = 4;
            } else {
                // For sevenths, ninths, etc., put in octave 4 or 5
                octave = interval === 10 || interval === 11 ? 4 : 5;
            }

            // For extended chords (9, 11, 13), adjust octaves to spread them out
            if (notes.length > 4) {
                // If we have many notes, distribute them more evenly
                if (i >= 4) {
                    octave = 5; // Put extensions in higher octave
                }
            }

            voiced.push(`${standardNote}${octave}`);
        }

        return voiced;
    };

    useEffect(() => {
        const processChords = (startIdx, batchSize) => {
            const endIdx = Math.min(startIdx + batchSize, chordData.length);

            for (let i = startIdx; i < endIdx; i++) {
                const chord = chordData[i];
                createPianoImage(chord.id, chord.notes, chord.name);
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
                    <div  key={chordInfo.id}>
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
                                        width="500"
                                        height="180"
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
// Effect to handle piano creation after render





export default PianoChordDetail;
