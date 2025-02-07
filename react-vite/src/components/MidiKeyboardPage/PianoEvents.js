export class PianoEvents {
    constructor(pianoSoundsRef, noteLabelManager) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = noteLabelManager;
        this.isMouseDown = false;
    }

    activateKey(noteId) {
        // Play the note
        if (this.pianoSoundsRef[noteId]._state === 'loaded') {
            this.pianoSoundsRef[noteId].play();
        }

        // Show pressed key
        const showPressed = document.getElementById(`${noteId}-pressed`);
        showPressed.style.visibility = 'visible';

        // Create and show note label
        this.noteLabelManager.createNoteLabel(noteId, showPressed);
    }

    setupKeyEvents(key, noteId) {
        const events = {
            mousedown: () => {
                this.isMouseDown = true;
                this.activateKey(noteId);
            },
            mouseup: () => this.deactivateKey(noteId),
            mouseleave: () => this.deactivateKey(noteId),
            mouseenter: () => {
                if (this.isMouseDown) this.activateKey(noteId);
            }
        };

        Object.entries(events).forEach(([event, handler]) => {
            key.addEventListener(event, handler);
        });
    }

    deactivateKey(noteId) {
        const showPressed = document.getElementById(`${noteId}-pressed`);
        showPressed.style.visibility = 'hidden';
        this.noteLabelManager.removeLabel(noteId);
    }
}
