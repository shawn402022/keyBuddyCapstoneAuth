import { useEffect, useState, useRef } from 'react'
import { reformatData } from '../../utils/formatChordUtils';
import { Instrument } from "piano-chart"
import PianoChordDetailCard from './PianoChordDetailCard';
import axios from 'axios';
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
                        image={
                            <img
                                src={`images/chordImages/${encodeURIComponent(chordInfo.name)}-ID${chordInfo.id}.png`}
                                alt={`Piano visualization for ${chordInfo.name}`}
                                className="piano-image"
                                // SOLUTION FOR ISSUE 2: Consistent image dimensions
                                width="250"
                                height="90"
                            />
                        }
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
