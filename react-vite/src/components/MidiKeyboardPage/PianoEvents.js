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
        // For a note like "a/5" or "a#/5"
        let [noteName] = noteId.split('/');
        noteName = noteName.slice(0,-1)
        const noteInfo = {
            key: noteName.toLowerCase(), // Keep lowercase

        };


        this.activeNotes.set(noteId, noteInfo);

        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
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
}
