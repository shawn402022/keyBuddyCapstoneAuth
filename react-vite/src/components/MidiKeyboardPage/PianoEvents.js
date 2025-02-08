export class PianoEvents {
    constructor(pianoSoundsRef, noteLabelManager) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = noteLabelManager;
        this.isMouseDown = false;
        this.bindGlobalMouseEvents();
    }

    bindGlobalMouseEvents() {
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    activateKey(noteId) {
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
