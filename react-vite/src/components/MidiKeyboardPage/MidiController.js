import { WebMidi } from "webmidi";


export class MidiController {
    constructor(pianoSoundsRef) {
        this.pianoSoundsRef = pianoSoundsRef;
        this.activeNotes = new Map();
        this.setNotesCallback = null;
        this.pianoRef = null; // Reference to the VexFlow piano component
    }

    setPianoRef(ref) {
        this.pianoRef = ref;
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

        // Update the UI via callback
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }

        // WebMidi.js provides velocity in range 0-127, so we normalize it to 0-1
        const velocity = e.velocity;  // WebMidi.js already normalizes this to 0-1

        // Play the sound
        if (this.pianoSoundsRef.sounds[noteId]) {
            // Set volume based on velocity
            this.pianoSoundsRef.sounds[noteId].volume(velocity);
            this.pianoSoundsRef.sounds[noteId].play();
        }

        // Highlight the key on the VexFlow piano if available
        if (this.pianoRef && this.pianoRef.current) {
            // The piano component will handle the highlighting internally
            // based on the activeNotes state that we're updating via the callback
        }

        console.log(`Note ${noteId} on, velocity: ${velocity}`);
    }

    handleNoteOff = (e) => {
        const noteName = e.note.name;
        const octave = e.note.octave;
        const noteKey = `${noteName.toLowerCase()}/${octave}`;

        // Delete the note using its unique key
        this.activeNotes.delete(noteKey);

        // Update the UI via callback
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }

        // The piano component will handle unhighlighting the key
        // based on the updated activeNotes state

        console.log(`Note ${e.note.identifier} off`);
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

            // Try to find the MIDI device by name
            this.currentInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");

            // If not found, use the first available input if any
            if (!this.currentInput && WebMidi.inputs.length > 0) {
                console.log("Specific MIDI device not found, using first available input");
                this.currentInput = WebMidi.inputs[0];
            }

            if (this.currentInput) {
                console.log(`Connected to MIDI device: ${this.currentInput.name}`);
                this.setupMidiListeners(this.currentInput);
            } else {
                console.warn("No MIDI inputs available");
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
