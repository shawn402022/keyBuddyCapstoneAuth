import React, { useEffect, useRef, useState, useCallback } from 'react';
import Vex from 'vexflow';
import { PIANO_CONFIG } from './config';
import { PianoEventsAdapter } from './PianoEventsAdapter';

// Define the component with React.forwardRef
const VexFlowPianoComponent = React.forwardRef(({
  activeNotes = [],
  targetKey = null,
  isTrainingMode = false,
  soundManager,
  onNotePlay = () => { },
  onNoteRelease = () => { }
}, ref) => {
  // Component state and refs
  const pianoContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const keysRef = useRef({});
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const adapterRef = useRef(null);

  // Helper function to draw a key
  const drawKey = (context, keyData, fillColor) => {
    const { x, y, width, height, isSharp, label } = keyData;
    // Draw the key rectangle
    context.beginPath();
    context.rect(x, y, width, height);
    context.fillStyle = fillColor;
    context.strokeStyle = '#000000';
    context.lineWidth = 1;
    context.fill();
    context.stroke();

    // Draw the label with improved positioning
    context.fillStyle = isSharp ? '#FFFFFF' : '#000000';
    context.font = isSharp ? '8px Arial' : '10px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle'; // Changed to middle for better vertical centering

    // Position text in the center-bottom area of the key
    const textX = x + width / 2;
    const textY = isSharp
      ? y + height - (height * 0.25) // Position text at 75% of the black key height
      : y + height - (height * 0.15); // Position text at 85% of the white key height

    context.fillText(label, textX, textY);
  };

  // Initialize adapter on mount
  useEffect(() => {
    if (soundManager && !adapterRef.current) {
      adapterRef.current = new PianoEventsAdapter(soundManager);
      adapterRef.current.setCallback(onNotePlay);
    }

    if (soundManager) {
      console.log('Sound manager initialized'); // Debug log
      console.log('Available sounds:', Object.keys(soundManager.sounds)); // Debug log
    } else {
      console.warn('Sound manager not available'); // Debug warning
    }

    return () => {
      // Clean up adapter if needed
      if (adapterRef.current) {
        adapterRef.current.clearAllNotes();
      }
    };
  }, [soundManager, onNotePlay]);

  // Initialize piano dimensions on mount
  useEffect(() => {
    if (pianoContainerRef.current) {
      const { width } = pianoContainerRef.current.getBoundingClientRect();
      setDimensions({
        width: width,
        height: 180 // Fixed height for piano
      });
    }

    // Cleanup on unmount
    return () => {
      if (rendererRef.current) {
        rendererRef.current.getContext().clear();
        rendererRef.current = null;
      }
    };
  }, []);
  // Handle mouse down event
  const handleMouseDown = useCallback((event) => {
    console.log('Mouse down event triggered'); // Debug log


    const { clientX, clientY } = event;
    const rect = pianoContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check which key was clicked
    let clickedNote = null;
    let clickedKeyData = null;

    if (clickedNote) {
      console.log('Clicked note:', clickedNote); // Debug log
    }

    // Check black keys first (they're on top)
    Object.entries(keysRef.current).forEach(([noteKey, keyData]) => {
      if (keyData.isSharp) {
        const { x: keyX, y: keyY, width, height } = keyData;
        if (x >= keyX && x <= keyX + width && y >= keyY && y <= keyY + height) {
          clickedNote = noteKey;
          clickedKeyData = keyData;
        }
      }
    });

    // If no black key was clicked, check white keys
    if (!clickedNote) {
      Object.entries(keysRef.current).forEach(([noteKey, keyData]) => {
        if (!keyData.isSharp) {
          const { x: keyX, y: keyY, width, height } = keyData;
          if (x >= keyX && x <= keyX + width && y >= keyY && y <= keyY + height) {
            clickedNote = noteKey;
            clickedKeyData = keyData;
          }
        }
      });
    }

    // Trigger note play if a key was clicked
    if (clickedNote && adapterRef.current) {
      // Parse the note name and octave
      const match = clickedNote.match(/([A-G][#]?)(\d+)/);
      if (match) {
        const [, noteName, octave] = match;

        // Create a note object
        const noteObj = {
          key: `${noteName.toLowerCase()}/${octave}`,
          octave: parseInt(octave),
          isSharp: noteName.includes('#')
        };

        // Use the adapter to handle the note
        adapterRef.current.handleNoteOn(noteName, octave, noteName.includes('#'));

        // Also call the onNotePlay callback for direct integration with training
        onNotePlay(noteObj);

        // Apply visual feedback immediately
        if (rendererRef.current && clickedKeyData) {
          const context = rendererRef.current.getContext();
          const isTarget = isTrainingMode && targetKey &&
            clickedNote.startsWith(targetKey.toUpperCase());
          const pressedColor = isTarget ? '#4CAF50' : '#42A5F5';
          drawKey(context, clickedKeyData, pressedColor);
        }
      }
    }
  }, [isTrainingMode, onNotePlay, targetKey]);
  // Handle mouse up event
  const handleMouseUp = useCallback(() => {
    // In a real implementation, you'd track which note was pressed
    // For simplicity, we'll just clear all notes on mouse up
    if (adapterRef.current) {
      adapterRef.current.clearAllNotes();
    }

    // Call the onNoteRelease callback
    onNoteRelease();

    // Redraw all keys to their default state
    if (rendererRef.current) {
      const context = rendererRef.current.getContext();

      Object.entries(keysRef.current).forEach(([noteKey, keyData]) => {
        const { isSharp } = keyData;
        const defaultColor = isSharp ? '#000000' : '#FFFFFF';

        // Draw the key with its default color
        drawKey(context, keyData, defaultColor);

        // Maintain the target key highlighting in training mode
        if (isTrainingMode && targetKey && noteKey.startsWith(targetKey.toUpperCase())) {
          // Add a highlight border
          context.beginPath();
          context.rect(
            keyData.x,
            keyData.y,
            keyData.width,
            keyData.height
          );
          context.strokeStyle = '#FFA726';
          context.lineWidth = 2;
          context.stroke();
        }
      });
    }
  }, [onNoteRelease, isTrainingMode, targetKey]);

  // Create and render the piano when dimensions change
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !pianoContainerRef.current) return;

    // Clear previous content
    pianoContainerRef.current.innerHTML = '';

    // Create renderer
    rendererRef.current = new Vex.Flow.Renderer(
      pianoContainerRef.current,
      Vex.Flow.Renderer.Backends.SVG
    );

    rendererRef.current.resize(dimensions.width, dimensions.height);
    const context = rendererRef.current.getContext();
    context.setFont("Arial", 10);

    // Store key references for highlighting
    keysRef.current = {};

    // Calculate key dimensions
    const whiteKeyWidth = dimensions.width / 21; // 3 octaves = 21 white keys
    const blackKeyWidth = whiteKeyWidth * 0.6;
    const whiteKeyHeight = dimensions.height;
    const blackKeyHeight = whiteKeyHeight * 0.6;

    // Draw white keys
    let whiteKeyIndex = 0;
    PIANO_CONFIG.chromaticNotes.forEach(note => {
      const isSharp = note.includes('#');
      if (!isSharp) {
        const x = whiteKeyIndex * whiteKeyWidth;
        const label = note.replace(/\d+$/, '');

        // Store key data for later use
        keysRef.current[note] = {
          isSharp: false,
          x,
          y: 0,
          width: whiteKeyWidth,
          height: whiteKeyHeight,
          label
        };

        // Draw the white key
        drawKey(context, keysRef.current[note], '#FFFFFF');

        whiteKeyIndex++;
      }
    });

    // Draw black keys on top
    let blackKeyIndex = 0;
    const blackKeyPositions = [0.5, 1.5, 3.5, 4.5, 5.5, 7.5, 8.5, 10.5, 11.5, 12.5]; // Positions within each octave
    PIANO_CONFIG.chromaticNotes.forEach(note => {
      const isSharp = note.includes('#');
      if (isSharp) {
        // Calculate position based on adjacent white keys
        const noteName = note.replace(/\d+/, '');
        const position = blackKeyPositions[blackKeyIndex % blackKeyPositions.length];
        const octaveOffset = Math.floor(blackKeyIndex / blackKeyPositions.length) * 7;
        const x = (position + octaveOffset) * whiteKeyWidth + (whiteKeyWidth - blackKeyWidth) / 2;
        const label = noteName.replace(/\d+$/, '');

        // Store key data for later use
        keysRef.current[note] = {
          isSharp: true,
          x,
          y: 0,
          width: blackKeyWidth,
          height: blackKeyHeight,
          label
        };

        // Draw the black key
        drawKey(context, keysRef.current[note], '#000000');

        blackKeyIndex++;
      }
    });

    // Add click handlers for mouse interaction
    const svgElement = pianoContainerRef.current.querySelector('svg');
    if (svgElement) {
      // Remove any existing listeners to prevent duplicates
      svgElement.removeEventListener('mousedown', handleMouseDown);
      svgElement.removeEventListener('mouseup', handleMouseUp);
      svgElement.removeEventListener('mouseleave', handleMouseUp);

      // Add listeners
      svgElement.addEventListener('mousedown', handleMouseDown);
      svgElement.addEventListener('mouseup', handleMouseUp);
      svgElement.addEventListener('mouseleave', handleMouseUp);

      console.log('Event listeners attached to piano'); // Debug log
    } else {
      console.warn('SVG element not found in piano container'); // Debug warning
    }


    return () => {
      if (svgElement) {
        svgElement.removeEventListener('mousedown', handleMouseDown);
        svgElement.removeEventListener('mouseup', handleMouseUp);
        svgElement.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, [dimensions, handleMouseDown, handleMouseUp]);
  // Update key highlighting when active notes change
  useEffect(() => {
    if (!rendererRef.current || !keysRef.current) return;

    const context = rendererRef.current.getContext();

    // Reset all keys to default state
    Object.entries(keysRef.current).forEach(([noteKey, keyData]) => {
      const { isSharp } = keyData;
      drawKey(context, keyData, isSharp ? '#000000' : '#FFFFFF');
    });

    // Highlight active notes
    if (activeNotes && activeNotes.length > 0) {
      activeNotes.forEach(noteObj => {
        if (!noteObj || !noteObj.key) return; // Add null check

        const noteId = noteObj.key.replace('/', '');
        if (keysRef.current[noteId]) {
          // Use different highlight colors for target key vs other pressed keys
          const isTarget = targetKey && noteId.startsWith(targetKey.toUpperCase());
          const highlightColor = isTarget ? '#4CAF50' : '#42A5F5';
          drawKey(context, keysRef.current[noteId], highlightColor);
        }
      });
    }

    // If in training mode and we have a target key, subtly highlight it
    if (isTrainingMode && targetKey && targetKey.length > 0) {
      // Find all keys that match the target (could be multiple octaves)
      Object.entries(keysRef.current).forEach(([noteKey, keyData]) => {
        // More specific matching to avoid highlighting too many keys
        // For single notes, match the exact note letter (e.g., "C" should only match "C" notes, not "C#")
        const isExactNoteMatch = targetKey.length === 1 &&
          noteKey.charAt(0) === targetKey.toUpperCase() &&
          (noteKey.length === 1 || noteKey.charAt(1) !== '#');

        // For chords or more complex targets, use the existing logic
        const isChordRootMatch = targetKey.length > 1 && noteKey.startsWith(targetKey.toUpperCase());

        if (isExactNoteMatch || isChordRootMatch) {
          context.beginPath();
          context.rect(
            keyData.x,
            keyData.y,
            keyData.width,
            keyData.height
          );
          context.strokeStyle = '#FFA726';
          context.lineWidth = 2;
          context.stroke();
        }
      });
    }
  }, [activeNotes, targetKey, isTrainingMode]);


  // Add a method to programmatically highlight keys (useful for demonstrations)
  const highlightKey = useCallback((noteId, color = '#42A5F5') => {
    if (rendererRef.current && keysRef.current[noteId]) {
      const context = rendererRef.current.getContext();
      const keyData = keysRef.current[noteId];

      // Draw the key with the highlight color
      drawKey(context, keyData, color);

      // Return a function to reset the key
      return () => {
        drawKey(context, keyData, keyData.isSharp ? '#000000' : '#FFFFFF');
      };
    }
    return () => { }; // Return empty function if key not found
  }, []);

  // Expose the highlightKey method via a ref
  React.useImperativeHandle(ref, () => ({
    highlightKey
  }));

  return (
    <div
      ref={pianoContainerRef}
      id="piano-container"
      style={{
        width: '100%',
        height: '180px',
        position: 'relative',
        marginTop: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    />
  );
}); // This closing parenthesis and semicolon are critical - they close the React.forwardRef call
// Set the display name explicitly
VexFlowPianoComponent.displayName = 'VexFlowPiano';
// Export the component - this must be OUTSIDE the component definition
export default VexFlowPianoComponent;
