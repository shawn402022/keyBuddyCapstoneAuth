import { useState, useEffect } from 'react';
import { keys } from './CourseData';
import ChordDiagram from '../ChordDiagram/ChordDiagram';
import { useDispatch, useSelector } from 'react-redux';
import { addToUserCourses } from '../../redux/userCourses';
import './CustomCourseList.css';

const CustomCourseList = () => {
  const [uniqueChords, setUniqueChords] = useState([]);
  const [selectedChords, setSelectedChords] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const userId = useSelector(state => state.session.user?.id);

  // Collect all unique chords when component mounts
  useEffect(() => {
    // Create a master Set to hold all unique chords
    const allChordsSet = new Set();

    // Process all keys to extract chords
    keys.forEach((keyData) => {
      let typeChords;
      let typeTriads;

      if (keyData.key.type === 'minor') {
        typeChords = keyData.key.natural.chords;
        typeTriads = keyData.key.natural.triads;
      } else {
        typeChords = keyData.key.chords;
        typeTriads = keyData.key.triads;
      }

      // Add all chords and triads to the Set
      const chordArray = [...typeChords, ...typeTriads];
      chordArray.forEach(chord => allChordsSet.add(chord));
    });

    // Convert Set back to sorted array for display
    setUniqueChords(Array.from(allChordsSet).sort());
  }, []);

  // Toggle chord selection
  const toggleChord = (chord) => {
    if (selectedChords.includes(chord)) {
      setSelectedChords(selectedChords.filter(c => c !== chord));
    } else {
      setSelectedChords([...selectedChords, chord]);
    }
  };

  // Handle course creation
  const handleCreateCourse = async () => {
    if (selectedChords.length === 0) {
      setMessage('Please select at least one chord');
      return;
    }

    if (!courseName.trim()) {
      setMessage('Please enter a course name');
      return;
    }

    setIsSubmitting(true);

    try {
      const courseData = {
        course_name: `${courseName.trim()} Course`,
        details_of_course: selectedChords.join(', '),
        course_type: 'custom'
      };

      await dispatch(addToUserCourses(courseData));

      setMessage('Course created successfully!');
      setSelectedChords([]);
      setCourseName('');
    } catch (error) {
      setMessage('Error creating course. Please try again.');
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-course-container">
      <h2>Create a Custom Course</h2>
      <p>Choose the chords you want to include in your custom course:</p>

      <div className="chords-selection">
        {uniqueChords.map((chord) => (
          <div key={chord} className="chord-item">
            <button
              className={`chord-button ${selectedChords.includes(chord) ? 'selected' : ''}`}
              onClick={() => toggleChord(chord)}
            >
              Add
            </button>
            <ChordDiagram chordName={chord} size="small" />
          </div>
        ))}
      </div>

      {selectedChords.length > 0 && (
        <div className="selected-chords">
          <h3>Selected Chords ({selectedChords.length})</h3>
          <div className="selected-chips">
            {selectedChords.map(chord => (
              <span key={chord} className="chord-chip">
                {chord}
                <button onClick={() => toggleChord(chord)}>×</button>
              </span>
            ))}
          </div>

          <div className="course-name-input">
            <label htmlFor="course-name">Name your course:</label>
            <input
              id="course-name"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
            />
          </div>

          {message && <p className="message">{message}</p>}

          <button
            className="create-course-button"
            onClick={handleCreateCourse}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomCourseList;
