import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserCourses, deleteUserCourse, setTrainingCourse } from '../../redux/userCourses';
import { ChordsInfo } from '../../utils/customChordUtils';
import ChordDiagram from '../ChordDiagram/ChordDiagram';
import { useHistory } from 'react-router-dom';
import './MyCoursesPage.css';

const MyCoursesPage = () => {
    const [editingCourse, setEditingCourse] = useState(null);
    const [availableChords, setAvailableChords] = useState([]);
    const [filteredChords, setFilteredChords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [tonicFilter, setTonicFilter] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();
    const userCourses = useSelector(state => state.userCourses.courses || []);

    // Fetch user courses on component mount
    useEffect(() => {
        dispatch(getUserCourses());
    }, [dispatch]);

    // Get all available chords when editing mode is activated
    useEffect(() => {
        if (editingCourse) {
            const chords = ChordsInfo.voiceSearch('');
            setAvailableChords(chords);
            setFilteredChords(chords);
        }
    }, [editingCourse]);

    // Filter chords based on search term and tonic
    useEffect(() => {
        if (!editingCourse) return;

        let filtered = [...availableChords];

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
    }, [searchTerm, tonicFilter, availableChords, editingCourse]);

    // Get unique tonics for filter dropdown
    const getUniqueTonics = () => {
        const tonics = availableChords.map(chord => chord.tonic);
        return [...new Set(tonics)].filter(Boolean).sort();
    };

    // Start course training
    const startTraining = (course) => {
        dispatch(setTrainingCourse(course));
        history.push('/training');
    };

    // Delete a course
    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await dispatch(deleteUserCourse(courseId));
            setMessage('Course deleted successfully');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // Start editing a course
    const startEditing = (course) => {
        setEditingCourse({
            ...course,
            selectedChords: course.details_of_course.split(', ').map(symbol => {
                const chordInfo = ChordsInfo.voiceSearch(symbol)[0];
                return chordInfo || { symbol };
            })
        });
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingCourse(null);
        setSearchTerm('');
        setTonicFilter('');
    };

    // Save edited course
    const saveEditedCourse = async () => {
        if (!editingCourse.selectedChords || editingCourse.selectedChords.length === 0) {
            setMessage('Please select at least one chord');
            return;
        }

        try {
            // Format selected chords for storage
            const chordSymbols = editingCourse.selectedChords.map(chord => chord.symbol);

            const courseData = {
                course_name: editingCourse.course_name,
                details_of_course: chordSymbols.join(', '),
                course_type: 'chord'
            };

            // Use the thunk to update the course
            await dispatch(updateUserCourseThunk(editingCourse.id, courseData));

            setMessage('Course updated successfully!');
            setEditingCourse(null);

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`Error updating course: ${error.message}`);
        }
    };
        }
    };

    // Toggle chord selection in edit mode
    const toggleChordSelection = (chord) => {
        if (!editingCourse) return;

        const isSelected = editingCourse.selectedChords.some(c => c.symbol === chord.symbol);

        if (isSelected) {
            setEditingCourse({
                ...editingCourse,
                selectedChords: editingCourse.selectedChords.filter(c => c.symbol !== chord.symbol)
            });
        } else {
            setEditingCourse({
                ...editingCourse,
                selectedChords: [...editingCourse.selectedChords, chord]
            });
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

    // Render course list or edit mode
    return (
        <div className="my-courses-page">
            <h1>My Courses</h1>

            {message && <div className="message">{message}</div>}

            {editingCourse ? (
                <div className="edit-course-container">
                    <div className="edit-header">
                        <h2>Editing: {editingCourse.course_name}</h2>
                        <div className="edit-actions">
                            <button className="save-button" onClick={saveEditedCourse}>
                                Save Changes
                            </button>
                            <button className="cancel-button" onClick={cancelEditing}>
                                Cancel
                            </button>
                        </div>
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
                            Selected: {editingCourse.selectedChords.length} chords
                        </div>
                    </div>

                    <div className="selected-chords">
                        <h3>Selected Chords</h3>
                        <div className="chord-list">
                            {editingCourse.selectedChords.map(chord => (
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
                                    <button
                                        className="remove-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleChordSelection(chord);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="available-chords">
                        <h3>Available Chords ({filteredChords.length})</h3>
                        <div className="chord-list">
                            {filteredChords.map(chord => {
                                const isSelected = editingCourse.selectedChords.some(c => c.symbol === chord.symbol);
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
            ) : (
                <div className="courses-list">
                    {userCourses.length === 0 ? (
                        <div className="no-courses">
                            <p>You don't have any courses yet.</p>
                            <button onClick={() => history.push('/create-course')}>
                                Create Your First Course
                            </button>
                        </div>
                    ) : (
                        userCourses.map(course => (
                            <div key={course.id} className="course-card">
                                <div className="course-info">
                                    <h3>{course.course_name}</h3>
                                    <p>{course.details_of_course.split(', ').length} items</p>
                                </div>

                                <div className="course-preview">
                                    {course.details_of_course.split(', ').slice(0, 3).map((item, index) => (
                                        <div key={index} className="preview-item">
                                            <ChordDiagram
                                                chordName={item}
                                                size="small"
                                                showListenButton={false}
                                            />
                                        </div>
                                    ))}
                                    {course.details_of_course.split(', ').length > 3 && (
                                        <div className="more-items">
                                            +{course.details_of_course.split(', ').length - 3} more
                                        </div>
                                    )}
                                </div>

                                <div className="course-actions">
                                    <button
                                        className="train-button"
                                        onClick={() => startTraining(course)}
                                    >
                                        Start Training
                                    </button>
                                    <button
                                        className="edit-button"
                                        onClick={() => startEditing(course)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteCourse(course.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage;
