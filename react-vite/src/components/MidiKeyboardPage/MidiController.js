import { WebMidi } from "webmidi";
import { NoteLabelManager } from "./NoteLabelManager";

export class MidiController {
    constructor(pianoSoundsRef) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = new NoteLabelManager();
        this.currentInput = null;
        // Create a Map using the note key as the unique identifier
        this.activeNotes = new Map();
    }

    handleNoteOn = (e) => {
        const noteId = e.note.identifier;
        const noteName = e.note.name;  // This includes sharp information
        const octave = e.note.octave;
        // Preserve the sharp information from the MIDI note
        const noteKey = `${noteName.toLowerCase()}/${octave}`;

        const noteInfo = {
            key: noteKey,
            octave: octave,
            isSharp: e.note.accidental === '#'  // Add this flag
        };

        // Use the noteKey as the Map key to prevent duplicates
        this.activeNotes.set(noteKey, noteInfo);

        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
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
        const noteName = e.note.name;
        const octave = e.note.octave;
        const noteKey = `${noteName.toLowerCase()}/${octave}`;

        // Delete the note using its unique key
        this.activeNotes.delete(noteKey);

        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
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
