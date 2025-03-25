import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Instrument } from 'piano-chart';
import './PianoChart.css';

const PianoChart = ({ currentNotes, soundManager }) => {
  const rgbOrange = 'rgb(243, 154, 90)'
  const [startOctave, setStartOctave] = useState(1);
  const [endOctave, setEndOctave] = useState(8); // Define height state
  const [showNoteNames, setShowNoteNames] = useState('always');
  const [keyPressStyle, setKeyPressStyle] = useState('vivid')
  const [vividPressColor, setVividPressColor] = useState(rgbOrange);
  const [scale, setScale] = useState(.7);



  const pianoContainerRef = useRef(null);
  const pianoInstanceRef = useRef(null);
  const previousNotesRef = useRef([]);
  const mountedRef = useRef(true); // Track if component is mounted

  // Initialize the piano chart
  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;

    // Only create a new instance if one doesn't already exist
    if (pianoContainerRef.current && !pianoInstanceRef.current) {
      try {

        // Create a basic instance first
        pianoInstanceRef.current = new Instrument(pianoContainerRef.current);

        // Log the instance to inspect its properties and methods
        console.log("Piano instance:", pianoInstanceRef.current);
        console.log("Instance prototype methods:",
          Object.getOwnPropertyNames(Object.getPrototypeOf(pianoInstanceRef.current)));

        // Check if there's a documented way to get default options
        if (typeof pianoInstanceRef.current.getDefaultOptions === 'function') {
          console.log("Default options:", pianoInstanceRef.current.getDefaultOptions());
        }

        console.log("Creating piano with configuration:", {
          startOctave, endOctave,
          showNoteNames,
        })

        console.log("Creating new piano instance");
        pianoInstanceRef.current = new Instrument(pianoContainerRef.current,{
          startOctave,
          endOctave,
          showNoteNames,
          keyPressStyle,
          vividPressColor,
          scale,

        });
        pianoInstanceRef.current.create();

        if (typeof pianoInstanceRef.current.applySettings === 'function') {
          console.log("Applying settings:", { showNoteNames,startOctave, endOctave });

          // Try different property structures to find what works
          pianoInstanceRef.current.applySettings({
            showNoteNames,
          });

          // After applying settings, call layout to ensure changes take effect
          if (typeof pianoInstanceRef.current.layout === 'function') {
            pianoInstanceRef.current.layout();
          }
        } else {
          console.warn("applySettings method not found on piano instance");
        }

        // Log for debugging
        console.log("Piano instance created successfully");
      } catch (error) {
        console.error("Error creating piano instance:", error);
        console.error("Configuration values:", {
          startOctave, endOctave, showNoteNames,
        });
      }
    }

    // Cleanup function with safety checks
    return () => {
      console.log("Running cleanup for piano instance");

      // Mark component as unmounted
      mountedRef.current = false;

      // Only attempt to destroy if we have an instance
      if (pianoInstanceRef.current) {
        try {
          // Wrap in try/catch to prevent uncaught errors
          console.log("Destroying piano instance");

          // Check if the container still exists in the DOM before destroying
          if (pianoContainerRef.current &&
              pianoContainerRef.current.isConnected &&
              document.body.contains(pianoContainerRef.current)) {
            pianoInstanceRef.current.destroy();
            console.log("Piano instance destroyed successfully");
          } else {
            console.log("Container no longer in DOM, skipping destroy()");
          }
        } catch (error) {
          console.error("Error during piano instance cleanup:", error);
        } finally {
          // Always clear the reference
          pianoInstanceRef.current = null;
        }
      }
    };
  }, []); // Empty dependency array means this runs once on mount
  // Update pressed keys when currentNotes changes
  useEffect(() => {
    // Skip if component is unmounted or instance doesn't exist
    if (!mountedRef.current || !pianoInstanceRef.current || !currentNotes) return;

    try {
      // Create sets for easier comparison
      const currentNoteIds = new Set(currentNotes.map(note => {
        const noteName = note.key.split('/')[0];
        const octave = note.key.split('/')[1];
        return note.isSharp
          ? `${noteName.toUpperCase()}#${octave}`
          : `${noteName.toUpperCase()}${octave}`;
      }));

      const previousNoteIds = new Set(previousNotesRef.current.map(note => {
        const noteName = note.key.split('/')[0];
        const octave = note.key.split('/')[1];
        return note.isSharp
          ? `${noteName.toUpperCase()}#${octave}`
          : `${noteName.toUpperCase()}${octave}`;
      }));

      // Find notes to release (in previous but not in current)
      for (const prevNote of previousNotesRef.current) {
        const noteName = prevNote.key.split('/')[0];
        const octave = prevNote.key.split('/')[1];
        const formattedNote = prevNote.isSharp
          ? `${noteName.toUpperCase()}#${octave}`
          : `${noteName.toUpperCase()}${octave}`;

        if (!currentNoteIds.has(formattedNote)) {
          try {
            // Only update the visual state - no sound playback
            pianoInstanceRef.current.keyUp(formattedNote);
          } catch (error) {
            console.warn(`Error releasing key ${formattedNote}:`, error);
          }
        }
      }

      // Find notes to press (in current but not in previous)
      for (const note of currentNotes) {
        const noteName = note.key.split('/')[0];
        const octave = note.key.split('/')[1];
        const formattedNote = note.isSharp
          ? `${noteName.toUpperCase()}#${octave}`
          : `${noteName.toUpperCase()}${octave}`;

        if (!previousNoteIds.has(formattedNote)) {
          try {
            // Only update the visual state - no sound playback
            pianoInstanceRef.current.keyDown(formattedNote);
          } catch (error) {
            console.warn(`Error pressing key ${formattedNote}:`, error);
          }
        }
      }

      // Update previous notes reference
      previousNotesRef.current = [...currentNotes];
    } catch (error) {
      console.error("Error updating piano keys:", error);
    }
  }, [currentNotes]);
  return (
      <div
    className="piano-chart-container"
    style={{
      "--main-background":"transparent",
      height: '100px', // Set your desired height here
      width: '100%',
      overflow: 'hidden' // Prevent content from overflowing
    }}
  >
      <div
      ref={pianoContainerRef}
      className="piano-chart"
      style={{
        height: '100%', // Make the inner container fill the parent
        width: '100%',
        transform: `scale(1, ${scale})`, // Scale vertically only
        transformOrigin: 'top center', // Scale from the top
        height: `${100/scale}%` // Compensate for scaling
      }}
    ></div>
    </div>
  );
};

export default PianoChart;
