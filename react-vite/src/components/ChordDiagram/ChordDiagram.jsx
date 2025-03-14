import { useEffect, useRef, useState } from 'react';
import { TrainingParser } from '../TrainingParser/trainingParse';
import audioEngine from '../../utils/audioEngine';
import './ChordDiagram.css';

const ChordDiagram = ({ chordName, showListenButton = true, size = 'small' }) => {
  const diagramRef = useRef(null);
  const [chordNotes, setChordNotes] = useState([]);
  const [error, setError] = useState(null);

  // Parse chord to get notes whenever the chord name changes
  useEffect(() => {
    try {
      if (chordName) {
        // Get playable notes for this chord
        const notes = TrainingParser.chordToPlayableNotes(chordName);
        console.log(`Chord ${chordName} notes:`, notes);

        // Validate notes before setting state
        if (notes && notes.length > 0 && !notes.some(note =>
          note.includes('undefined') || note.includes('NaN'))) {
          setChordNotes(notes);
          setError(null);
        } else {
          console.error(`Invalid notes for chord ${chordName}:`, notes);
          setChordNotes(['C4', 'E4', 'G4']); // Default to C major
          setError(`Could not determine notes for ${chordName}`);
        }
      }
    } catch (err) {
      console.error(`Error getting notes for chord ${chordName}:`, err);
      setChordNotes(['C4', 'E4', 'G4']); // Default to C major
      setError(`Error processing chord ${chordName}`);
    }
  }, [chordName]);

  // Play the chord when listen button is clicked
  const playChord = () => {
    if (chordNotes && chordNotes.length > 0) {
      // Play notes with slight delay for arpeggio effect
      chordNotes.forEach((note, index) => {
        setTimeout(() => {
          audioEngine.playNote(note);
        }, index * 80);
      });
    }
  };

  // Draw the chord diagram using HTML/CSS for better control
  useEffect(() => {
    if (diagramRef.current && chordNotes.length > 0) {
      // Clear previous content
      diagramRef.current.innerHTML = '';

      // Create container for the piano with proper positioning context
      const pianoContainer = document.createElement('div');
      pianoContainer.className = 'chord-piano-container'; // Use a unique class name

      // Set dimensions based on size prop
      const containerWidth = size === 'small' ? 120 : 180;
      pianoContainer.style.width = `${containerWidth}px`;
      pianoContainer.style.position = 'relative'; // Ensure positioning context
      pianoContainer.style.height = '120px';

      // Create title element
      const titleElement = document.createElement('div');
      titleElement.className = 'chord-title';
      titleElement.textContent = chordName;
      diagramRef.current.appendChild(titleElement);

      // Extract note names without octaves for highlighting
      const noteNames = chordNotes.map(note => {
        const match = note.match(/^([A-G][#b]?)/);
        return match ? match[1] : null;
      }).filter(Boolean);

      // Create white keys
      const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      whiteKeyNames.forEach(noteName => {
        const keyElement = document.createElement('div');
        keyElement.className = 'chord-white-key'; // Use a unique class name

        // Check if this key is part of the chord
        if (noteNames.includes(noteName)) {
          keyElement.classList.add('highlighted');
        }

        pianoContainer.appendChild(keyElement);
      });

      // Create black keys with precise positioning
      const blackKeyPositions = [
        { index: 0, left: containerWidth / 7 * 0.85 - 5 },  // C#
        { index: 1, left: containerWidth / 7 * 1.85 - 5 },  // D#
        { index: 3, left: containerWidth / 7 * 3.85 - 5 },  // F#
        { index: 4, left: containerWidth / 7 * 4.85 - 5 },  // G#
        { index: 5, left: containerWidth / 7 * 5.85 - 5 }   // A#
      ];

      const blackKeyNames = ['C#', 'D#', 'F#', 'G#', 'A#'];

      blackKeyPositions.forEach((position, i) => {
        const keyElement = document.createElement('div');
        keyElement.className = 'chord-black-key'; // Use a unique class name

        // Set explicit positioning
        keyElement.style.left = `${position.left}px`;
        keyElement.style.top = '0px'; // Explicitly set top to 0

        // Check if this key is part of the chord
        const sharpName = blackKeyNames[i];
        const flatEquivalents = {
          'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
        };

        if (noteNames.includes(sharpName) || noteNames.includes(flatEquivalents[sharpName])) {
          keyElement.classList.add('highlighted');
        }

        pianoContainer.appendChild(keyElement);
      });

      // Add the piano to the diagram
      diagramRef.current.appendChild(pianoContainer);

      // Add error message if there was an error
      if (error) {
        const errorElement = document.createElement('div');
        errorElement.className = 'chord-error';
        errorElement.textContent = error;
        diagramRef.current.appendChild(errorElement);
      }
    }
  }, [chordNotes, chordName, size, error]);
  return (
    <div className={`chord-diagram ${size}`}>
      <div ref={diagramRef} className="diagram-container"></div>
      {showListenButton && (
        <button
          className="listen-button"
          onClick={playChord}
          aria-label={`Listen to ${chordName} chord`}
        >
          🔊
        </button>
      )}
    </div>
  );
};

export default ChordDiagram;
