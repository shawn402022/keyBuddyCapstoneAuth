import { useState, useEffect } from 'react';
import { keys } from './CourseData';
//import './CustomCourseList.css'; // Create this file for styling

const CustomCourseList = () => {
  const [uniqueChords, setUniqueChords] = useState([]);
  const [selectedChords, setSelectedChords] = useState([]);

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

  return (
    <div className="custom-course-container">
      <h2>Create a Custom Course</h2>
      <p>Choose the chords you want to include in your custom course:</p>

      <div className="chords-selection">
        {uniqueChords.map((chord) => (
          <button
            key={chord}
            className={`chord-button ${selectedChords.includes(chord) ? 'selected' : ''}`}
            onClick={() => toggleChord(chord)}
          >
            {chord}
          </button>
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
          <button
            className="create-course-button"
            onClick={() => {
              // Handle course creation with selectedChords
              console.log("Creating course with chords:", selectedChords);
              // Call API or dispatch action here
            }}
          >
            Create Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomCourseList;
