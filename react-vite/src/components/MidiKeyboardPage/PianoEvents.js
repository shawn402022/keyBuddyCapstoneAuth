export class PianoEvents {
    constructor(pianoSoundsRef, noteLabelManager) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = noteLabelManager;
        this.isMouseDown = false;
        this.activeNotes = new Map(); // Local tracking for UI purposes
        this.updateActiveNotesCallback = null; // New callback for centralized state
        this.bindGlobalMouseEvents();
    }

    // Add a setter for the centralized state callback
    setUpdateActiveNotesCallback(callback) {
        this.updateActiveNotesCallback = callback;
    }

    bindGlobalMouseEvents() {
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    activateKey(noteId) {
        // Parse note information
        const noteName = noteId.slice(0, -1);
        const octave = noteId.slice(-1);

        const noteInfo = {
            key: `${noteName.toLowerCase()}/${octave}`,
            octave: parseInt(octave),
            isSharp: noteName.includes('#')
        };

        // Add to local tracking for UI consistency
        this.activeNotes.set(noteId, noteInfo);

        // Use the centralized state update function
        if (this.updateActiveNotesCallback) {
            this.updateActiveNotesCallback(noteId, true, 0.8); // Default velocity
        }

        // Visual feedback only - sound is handled by the callback
        const keyElement = document.querySelector(`[data-id="${noteId}"]`);
        const pressedElement = document.getElementById(`${noteId}-pressed`);

        if (keyElement && pressedElement) {
            pressedElement.style.visibility = 'visible';
            keyElement.style.opacity = '0.8';
            this.noteLabelManager.createNoteLabel(noteId, keyElement);
        }
    }

    deactivateKey(noteId) {
        // Remove from local tracking
        this.activeNotes.delete(noteId);

        // Use the centralized state update function
        if (this.updateActiveNotesCallback) {
            this.updateActiveNotesCallback(noteId, false);
        }

        // Visual feedback only - sound release is handled by the callback
        const keyElement = document.querySelector(`[data-id="${noteId}"]`);
        const pressedElement = document.getElementById(`${noteId}-pressed`);
        const noteLabel = document.getElementById(`note-label-${noteId}`);

        if (keyElement && pressedElement) {
            pressedElement.style.visibility = 'hidden';
            keyElement.style.opacity = '1';
            if (noteLabel) {
                noteLabel.remove();
            }
        }
    }

    setupKeyEvents(key, noteId) {
        const events = {
            mousedown: (e) => {
                e.preventDefault();
                this.isMouseDown = true;
                this.activateKey(noteId);
            },
            mouseup: () => {
                this.deactivateKey(noteId);
            },
            mouseleave: () => {
                if (this.isMouseDown) {
                    this.deactivateKey(noteId);
                }
            },
            mouseenter: () => {
                if (this.isMouseDown) {
                    this.activateKey(noteId);
                }
            }
        };

        Object.entries(events).forEach(([event, handler]) => {
            key.addEventListener(event, handler);
        });
    }

    // In the handleKeyDown method
    handleKeyDown(event) {
        const noteId = event.currentTarget.getAttribute('data-id');
        if (noteId) {
            // Show pressed state
            const pressedKey = document.getElementById(`${noteId}-pressed`);
            if (pressedKey) {
                pressedKey.style.visibility = 'visible';
            }

            // Hide released state (optional - depends on your visual design)
            // event.currentTarget.style.visibility = 'hidden';

            // Play sound
            if (this.pianoSoundsRef.sounds[noteId]) {
                this.pianoSoundsRef.sounds[noteId].play();
            }

            // Add to active notes
            // ... existing code ...
        }
    }

    // In the handleKeyUp method
    handleKeyUp(event) {
        const noteId = event.currentTarget.getAttribute('data-id');
        if (noteId) {
            // Hide pressed state
            const pressedKey = document.getElementById(`${noteId}-pressed`);
            if (pressedKey) {
                pressedKey.style.visibility = 'hidden';
            }

            // Show released state (ensure it's visible)
            event.currentTarget.style.visibility = 'visible';

            // Remove from active notes
            // ... existing code ...
        }
    }
}
