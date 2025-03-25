import { WebMidi } from "webmidi";
import { NoteLabelManager } from "./NoteLabelManager";

export class MidiController {
    constructor(pianoSoundsRef) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.noteLabelManager = new NoteLabelManager();
        this.currentInput = null;
        this.updateActiveNotesCallback = null; // New callback for centralized state
    }

    setUpdateActiveNotesCallback(callback) {
        this.updateActiveNotesCallback = callback;
    }

    handleNoteOn = (e) => {
        const noteId = e.note.identifier; // e.g., "C4"
        const noteName = e.note.name;     // e.g., "C"
        const octave = e.note.octave;     // e.g., 4
        const isSharp = e.note.accidental === '#';
        console.log(`MIDI NOTE ON: ${noteId}, velocity: ${e.velocity}`);


        // Use the centralized state update function with all necessary information
        if (this.updateActiveNotesCallback) {
            this.updateActiveNotesCallback(noteId, true, e.velocity);
        }

        // Visual feedback only - no sound playback here
        let showPressed = document.getElementById(`${noteId}-pressed`);
        if (showPressed) {
            showPressed.style.visibility = 'visible';

            const keyElement = document.querySelector(`[data-id="${noteId}"]`);
            if (keyElement) {
                this.noteLabelManager.createNoteLabel(noteId, keyElement);
            }
        }
    }

    handleNoteOff = (e) => {
        const noteId = e.note.identifier;
        console.log(`MIDI NOTE OFF: ${noteId}`);


        // Use the centralized state update function
        if (this.updateActiveNotesCallback) {
            this.updateActiveNotesCallback(noteId, false);
        }

        // Visual feedback only - no sound release here
        let showPressed = document.getElementById(`${noteId}-pressed`);
        let showReleased = document.querySelector(`[data-id="${noteId}"]`);
        const noteLabel = document.getElementById(`note-label-${noteId}`);

        if (showPressed) {
            showPressed.style.visibility = 'hidden';
            if (showReleased) showReleased.style.visibility = 'visible';
            if (noteLabel) {
                noteLabel.remove();
            }
        }
    }
    setupMidiListeners(input) {
        if (input) {
            console.log("Setting up MIDI listeners for input:", input.name);

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

        if (this.noteOffDebounceTimeout) {
            clearTimeout(this.noteOffDebounceTimeout);
        }

        WebMidi.disable();
    }
}
