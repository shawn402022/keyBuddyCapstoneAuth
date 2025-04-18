import { useEffect, useState, useRef } from 'react'
import { reformatData } from '../../utils/formatChordUtils';
import { Instrument } from "piano-chart"
import PianoChordDetailCard from './PianoChordDetailCard';
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
    // Apply musical voicing rules to distribute notes across octaves
    const applyVoicingRules = (notes, rootNote) => {
        // Create a mapping of note positions in the chromatic scale
        const notePositions = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
            'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };

        // Get the position of the root note
        const rootPosition = notePositions[standardizeNoteName(rootNote)];
        if (rootPosition === undefined) {
            // If we can't determine the root position, use default voicing
            return notes.map(note => `${note}4`);
        }

        // Parse the chord quality from the first note (which should include the chord name)
        // This is a more robust way to identify chord extensions
        const chordQuality = notes[0].includes('b13') || notes[0].includes('13') ? '13' :
            notes[0].includes('11') ? '11' :
                notes[0].includes('9') ? '9' :
                    notes[0].includes('7') ? '7' :
                        notes[0].includes('6') ? '6' :
                            notes[0].includes('dim') ? 'dim' :
                                notes[0].includes('aug') ? 'aug' :
                                    notes[0].includes('m') || notes[0].includes('-') ? 'm' : '';

        // Start with the root note in octave 3
        const voiced = [`${rootNote}3`];

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

            // Determine the function of this note in the chord
            let noteFunction = '';
            if (interval === 0) noteFunction = 'root';
            else if (interval === 3 || interval === 4) noteFunction = 'third';
            else if (interval === 7) noteFunction = 'fifth';
            else if (interval === 10 || interval === 11) noteFunction = 'seventh';
            else if (interval === 1 || interval === 2) noteFunction = 'ninth';
            else if (interval === 5 || interval === 6) noteFunction = 'eleventh';
            else if (interval === 8 || interval === 9) noteFunction = 'thirteenth';

            // Determine octave based on note function and chord quality
            let octave;

            // CRITICAL FIX: Explicitly handle the b13 case for B7b13
            // Check if this is a b13 (minor sixth interval) in a dominant 7 chord
            const isB13 = interval === 8 && chordQuality.includes('7') &&
                (notes[0].includes('b13') || notes.length >= 4);

            if (isB13) {
                // Always place the b13 in octave 5 for proper separation
                octave = 5;
            }
            // Handle other extensions
            else if (noteFunction === 'ninth' || noteFunction === 'eleventh' || noteFunction === 'thirteenth') {
                // Extensions always go to octave 5
                octave = 5;
            }
            // Handle basic chord tones
            else if (noteFunction === 'root') {
                // Root duplicates go to octave 4
                octave = 4;
            }
            else if (noteFunction === 'third' || noteFunction === 'fifth') {
                // Basic chord tones go to octave 4
                octave = 4;
            }
            else if (noteFunction === 'seventh') {
                // Sevenths go to octave 4
                octave = 4;
            }
            else {
                // Default for other intervals
                octave = 4;
            }

            // Add the note with its determined octave
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
                    <PianoChordDetailCard
                        key={chordInfo.id}
                        name={chordInfo.name}
                        image={pianoImages[chordInfo.id] ? (
                            <img
                                src={pianoImages[chordInfo.id]}
                                alt={`Piano visualization for ${chordInfo.name}`}
                                className="piano-image"
                                // SOLUTION FOR ISSUE 2: Consistent image dimensions
                                width="250"
                                height="90"
                            />
                        ) : (
                            <div
                                id={`piano-container-${chordInfo.id}`}
                                className="piano-container"
                            // Container dimensions set in createPianoImage function
                            >

                            </div>
                        )}
                        notes={chordInfo.notes}
                        id={chordInfo.id}
                    />

                ))}
            </div>


        </div>
    );
};
// Effect to handle piano creation after render





export default PianoChordDetail;
