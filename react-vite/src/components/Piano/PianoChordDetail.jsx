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
        const processedNotes = applyChordVoicing(noteArray, rootNote, chordName);

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
    const applyChordVoicing = (noteArray, rootNote, chordName) => {
        if (!rootNote) {
            // Fallback if we can't determine the root
            return noteArray.map(note => `${note}4`);
        }

        // Create a mapping to track the original notes and their functions
        const noteMapping = noteArray.map(note => {
            const standardNote = standardizeNoteName(note);
            return {
                original: note,
                standardized: standardNote,
                // We'll fill these in later
                function: '',
                interval: -1,
                octave: 4 // Default octave
            };
        });

        // Find the root note index
        const rootIndex = noteMapping.findIndex(item =>
            standardizeNoteName(item.original) === standardizeNoteName(rootNote)
        );

        if (rootIndex === -1) {
            // Root note not found in the array, use default voicing
            return noteArray.map(note => `${note}4`);
        }

        // Calculate intervals and determine note functions
        const notePositions = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
            'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };

        const rootPosition = notePositions[standardizeNoteName(rootNote)];

        // Determine the chord quality from the chord name
        const hasSharp9 = chordName.includes('#9');
        const hasFlat13 = chordName.includes('b13');

        // Calculate intervals and assign functions for each note
        for (let i = 0; i < noteMapping.length; i++) {
            const item = noteMapping[i];
            const notePosition = notePositions[item.standardized];

            if (notePosition !== undefined) {
                // Calculate interval from root
                item.interval = (notePosition - rootPosition + 12) % 12;

                // Assign function based on interval
                if (item.interval === 0) item.function = 'root';
                else if (item.interval === 3 || item.interval === 4){
                    if (hasSharp9 && item.interval === 3) {
                        item.function = 'sharp9';
                    } else {
                        item.function = 'third';
                    }
                }
                else if (item.interval === 7) item.function = 'fifth';
                else if (item.interval === 10 || item.interval === 11) item.function = 'seventh';
                else if (item.interval === 1 || item.interval === 2) {
                    // Special case for #9 in B7#9b13
                    if (hasSharp9 && item.interval === 2) {
                        item.function = 'sharp9';
                    } else {
                        item.function = 'ninth';
                    }
                }
                else if (item.interval === 5 || item.interval === 6) item.function = 'eleventh';
                else if (item.interval === 8 || item.interval === 9) {
                    // Special case for b13 in B7#9b13
                    if (hasFlat13 && item.interval === 8) {
                        item.function = 'flat13';
                    } else {
                        item.function = 'thirteenth';
                    }
                }
            }
        }

        // Sort notes by their function in the chord
        // This ensures extensions appear in the correct order
        const functionOrder = [
            'root', 'third', 'fifth', 'seventh',
            'ninth', 'sharp9', 'eleventh', 'flat13', 'thirteenth'
        ];

        noteMapping.sort((a, b) => {
            return functionOrder.indexOf(a.function) - functionOrder.indexOf(b.function);
        });

        // Now assign octaves based on function
        const voiced = [];

        for (let i = 0; i < noteMapping.length; i++) {
            const item = noteMapping[i];
            let octave;

            if (item.function === 'root' && i === 0) {
                // The first root goes in octave 3
                octave = 3;
            } else if (item.function === 'root') {
                // Any duplicate roots go in octave 4
                octave = 4;
            } else if (item.function === 'third' || item.function === 'fifth' || item.function === 'seventh') {
                // Basic chord tones go in octave 4
                octave = 4;
            } else {
                // All extensions go in octave 5
                octave = 5;
            }

            // Use the original note name with the assigned octave
            const originalNoteName = item.original.replace(/\d+$/, '');
            voiced.push(`${originalNoteName}${octave}`);
        }

        return voiced;
    };

    // Helper function to standardize note names
    const standardizeNoteName = (note) => {
        // Remove any existing octave number
        const noteName = note.replace(/\d+$/, '');

        // Handle enharmonic equivalents
        const enharmonics = {
            'B#': 'C', 'E#': 'F',
            'Cb': 'B', 'Fb': 'E',
            'C##': 'D', 'D##': 'E',
            'F##': 'G', 'G##': 'A',
            'A##': 'B',
            'Dbb': 'C', 'Ebb': 'D',
            'Gbb': 'F', 'Abb': 'G',
            'Bbb': 'A'
        };

        return enharmonics[noteName] || noteName;
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
