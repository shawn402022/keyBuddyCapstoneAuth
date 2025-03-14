export class PianoEvents {
    constructor(pianoSoundsRef, noteLabelManager) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = noteLabelManager;
        this.isMouseDown = false;
        this.activeNotes = new Map(); // Add this
        this.setNotesCallback = null; // Add this
        this.bindGlobalMouseEvents();
    }

    bindGlobalMouseEvents() {
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }
    activateKey(noteId) {
        // noteId is something like 'D6'
        const noteName = noteId.slice(0, -1); // Gets 'D'
        const octave = noteId.slice(-1);      // Gets '6'

        const noteInfo = {
            key: `${noteName.toLowerCase()}/${octave}`, // Creates 'd/6'
            octave: parseInt(octave),
            //isSharp: noteName.includes('#')
        };

        this.activeNotes.set(noteId, noteInfo);

        if (this.setNotesCallback) {
            const notes = [...this.activeNotes.values()];
            this.setNotesCallback(notes);
        }

        const normalizedNoteId = noteId;
        console.log('Playing normalized note:', normalizedNoteId);

        if (this.pianoSoundsRef.sounds[normalizedNoteId]) {
            this.pianoSoundsRef.sounds[normalizedNoteId].play();
        }

        const keyElement = document.querySelector(`[data-id="${noteId}"]`);
        const pressedElement = document.getElementById(`${noteId}-pressed`);

        if (keyElement && pressedElement) {
            pressedElement.style.visibility = 'visible';
            keyElement.style.opacity = '0.8';
            // Create note label when key is activated
            this.noteLabelManager.createNoteLabel(noteId, keyElement);
        }
    }
    deactivateKey(noteId) {
        // Remove from active notes
        this.activeNotes.delete(noteId);

        // Update UI
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }

        const keyElement = document.querySelector(`[data-id="${noteId}"]`);
        const pressedElement = document.getElementById(`${noteId}-pressed`);
        const noteLabel = document.getElementById(`note-label-${noteId}`);

        if (keyElement && pressedElement) {
            pressedElement.style.visibility = 'hidden';
            keyElement.style.opacity = '1';
            // Remove note label when key is deactivated
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
