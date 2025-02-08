import { WebMidi } from "webmidi";
import { NoteLabelManager } from "./NoteLabelManager";

export class MidiController {
    constructor(pianoSoundsRef) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = new NoteLabelManager();
        this.currentInput = null;
    }

    handleNoteOn = (e) => {
        const noteId = e.note.identifier;
        const noteName = e.note.name;
        const octave = e.note.octave;

        // Update the current note for the staff
        if (this.setNoteCallback) {
            this.setNoteCallback({
                key: `${noteName.toLowerCase()}/${octave}`,
                octave: octave
            });
        }

        // WebMidi.js provides velocity in range 0-127, so we normalize it to 0-1
        const velocity = e.velocity;  // WebMidi.js already normalizes this to 0-1
        let showPressed = document.getElementById(`${noteId}-pressed`);
        if (showPressed) {
            showPressed.style.visibility = 'visible';
            if (this.pianoSoundsRef.sounds[noteId]) {
                // Set volume based on velocity
                this.pianoSoundsRef.sounds[noteId].volume(velocity);
                this.pianoSoundsRef.sounds[noteId].play();

                const keyElement = document.querySelector(`[data-id="${noteId}"]`);
                if (keyElement) {
                    this.noteLabelManager.createNoteLabel(noteId, keyElement);
                }
            }
            console.log(`Note ${noteId} on, velocity: ${velocity}`);
        }
    }
    handleNoteOff = (e) => {
        // Clear the current note
        if (this.setNoteCallback) {
            this.setNoteCallback(null);
        }

        const noteId = e.note.identifier;
        let showPressed = document.getElementById(`${noteId}-pressed`);
        const noteLabel = document.getElementById(`note-label-${noteId}`);

        if (showPressed) {
            showPressed.style.visibility = 'hidden';
            // Remove note label when MIDI note is released
            if (noteLabel) {
                noteLabel.remove();
            }
        }
    }


    setupMidiListeners(input) {
        if (input) {
            input.channels.forEach(channel => {
                channel.addListener('noteon', this.handleNoteOn);
                channel.addListener('noteoff', this.handleNoteOff);
            });
        }
    }

    async initialize() {
        try {
            await WebMidi.enable({ sysex: true });
            this.currentInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");
            if (this.currentInput) {
                this.setupMidiListeners(this.currentInput);
            }
        } catch (err) {
            console.error("MIDI initialization failed:", err);
        }
    }

    cleanup() {
        if (this.currentInput) {
            this.currentInput.channels.forEach(channel => {
                channel.removeListener('noteon');
                channel.removeListener('noteoff');
            });
        }
        WebMidi.disable();
    }
}
