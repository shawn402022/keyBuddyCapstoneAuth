import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ChordsInfo } from '../../utils/customChordUtils';
import ChordDiagram from '../ChordDiagram/ChordDiagram';
import { addToUserCourses } from '../../redux/userCourses';
import './CustomCoursePage.css';

const CustomCoursePage = () => {
    const [allChords, setAllChords] = useState([]);
    const [filteredChords, setFilteredChords] = useState([]);
    const [selectedChords, setSelectedChords] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tonicFilter, setTonicFilter] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    // Get all available chords on component mount
    useEffect(() => {
        // Get all chords from ChordsInfo
        const chords = ChordsInfo.voiceSearch('');
        setAllChords(chords);
        setFilteredChords(chords);
    }, []);

    // Filter chords based on search term and tonic
    useEffect(() => {
        let filtered = [...allChords];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(chord =>
                chord.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by tonic
        if (tonicFilter) {
            filtered = filtered.filter(chord =>
                chord.tonic === tonicFilter
            );
        }

        setFilteredChords(filtered);
    }, [searchTerm, tonicFilter, allChords]);

    // Get unique tonics for filter dropdown
    const getUniqueTonics = () => {
        const tonics = allChords.map(chord => chord.tonic);
        return [...new Set(tonics)].filter(Boolean).sort();
    };

    // Handle chord selection
    const toggleChordSelection = (chord) => {
        if (selectedChords.some(c => c.symbol === chord.symbol)) {
            setSelectedChords(selectedChords.filter(c => c.symbol !== chord.symbol));
        } else {
            setSelectedChords([...selectedChords, chord]);
        }
    };

    // Create a new custom course
    const createCourse = async () => {
        if (!courseName.trim()) {
            setMessage('Please enter a course name');
            return;
        }

        if (selectedChords.length === 0) {
            setMessage('Please select at least one chord');
            return;
        }

        // Format selected chords for storage
        const chordSymbols = selectedChords.map(chord => chord.symbol);

        try {
            const courseData = {
                course_name: courseName,
                details_of_course: chordSymbols.join(', '),
                course_type: 'chord'
            };

            await dispatch(addToUserCourses(courseData));

            // Reset form
            setCourseName('');
            setSelectedChords([]);
            setMessage('Course created successfully!');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`Error creating course: ${error.message}`);
        }
    };

    // Assign colors to chords based on tonic
    const getTonicColor = (tonic) => {
        const colorMap = {
            'C': '#FF6B6B',
            'C#': '#FF9E7A',
            'D': '#FFD166',
            'D#': '#E6F98C',
            'E': '#A0E548',
            'F': '#29BB89',
            'F#': '#4ECDC4',
            'G': '#45B7D1',
            'G#': '#6A7FDB',
            'A': '#9A7FDB',
            'A#': '#C77DFF',
            'B': '#E56399'
        };

        return colorMap[tonic] || '#CCCCCC';
    };

    return (
        <div className="custom-course-page">
            <h1>Create Custom Chord Course</h1>

            <div className="course-form">
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />

                <button onClick={createCourse}>Create Course</button>
                {message && <div className="message">{message}</div>}
            </div>

            <div className="filter-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search chords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="tonic-filter">
                    <select
                        value={tonicFilter}
                        onChange={(e) => setTonicFilter(e.target.value)}
                    >
                        <option value="">All Tonics</option>
                        {getUniqueTonics().map(tonic => (
                            <option key={tonic} value={tonic}>{tonic}</option>
                        ))}
                    </select>
                </div>

                <div className="selection-info">
                    Selected: {selectedChords.length} chords
                </div>
            </div>

            <div className="selected-chords">
                <h2>Selected Chords</h2>
                <div className="chord-list">
                    {selectedChords.map(chord => (
                        <div
                            key={chord.symbol}
                            className="chord-item selected"
                            style={{ borderColor: getTonicColor(chord.tonic) }}
                            onClick={() => toggleChordSelection(chord)}
                        >
                            <ChordDiagram
                                chordName={chord.symbol}
                                size="small"
                                showListenButton={false}
                            />
                            <button className="remove-button">✕</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="available-chords">
                <h2>Available Chords ({filteredChords.length})</h2>
                <div className="chord-list">
                    {filteredChords.map(chord => {
                        const isSelected = selectedChords.some(c => c.symbol === chord.symbol);
                        return (
                            <div
                                key={chord.symbol}
                                className={`chord-item ${isSelected ? 'selected' : ''}`}
                                style={{
                                    borderColor: getTonicColor(chord.tonic),
                                    backgroundColor: isSelected ? `${getTonicColor(chord.tonic)}22` : 'transparent'
                                }}
                                onClick={() => toggleChordSelection(chord)}
                            >
                                <ChordDiagram
                                    chordName={chord.symbol}
                                    size="small"
                                    showListenButton={true}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomCoursePage;
