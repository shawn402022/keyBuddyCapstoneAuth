export class PianoEventsAdapter {
    constructor(soundManager) {
        this.soundManager = soundManager;
        this.setNotesCallback = null;
        this.activeNotes = new Map();
    }

    setupKeyEvents(note, octave, isSharp) {
        // This method is now simplified since VexFlow piano handles its own DOM events
        // It returns event handlers that the VexFlow piano component can use
        return {
            onNoteOn: () => this.handleNoteOn(note, octave, isSharp),
            onNoteOff: () => this.handleNoteOff(note, octave)
        };
    }

    handleNoteOn(noteName, octave, isSharp) {
        // Format the note key consistently with how MIDI events format it
        const noteKey = `${noteName.toLowerCase()}/${octave}`;
        const noteId = `${noteName}${octave}`;

        console.log('Playing note:', noteId); // Debug log

        // Check if sound exists and is loaded
        if (this.soundManager && this.soundManager.sounds[noteId]) {
            console.log('Sound found, playing...'); // Debug log
            this.soundManager.sounds[noteId].play();
        } else {
            console.warn(`Sound not found for note: ${noteId}`); // Debug warning

            // Try alternative formats or octaves as fallback
            const alternativeNoteId = `${noteName}4`; // Try octave 4 as fallback
            if (this.soundManager && this.soundManager.sounds[alternativeNoteId]) {
                console.log('Using alternative sound:', alternativeNoteId); // Debug log
                this.soundManager.sounds[alternativeNoteId].play();
            } else {
                console.error('No suitable sound found for note:', noteId); // Debug error
            }
        }

        // Create note info object matching the format expected by chord detection
        const noteInfo = {
            key: noteKey,
            octave: parseInt(octave),
            isSharp: isSharp
        };

        // Store in active notes map
        this.activeNotes.set(noteKey, noteInfo);

        // Update the UI via callback
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }

        console.log(`Note ${noteId} played via mouse/touch`);
    }

    handleNoteOff(noteName, octave) {
        const noteKey = `${noteName.toLowerCase()}/${octave}`;

        // Remove from active notes
        this.activeNotes.delete(noteKey);

        // Update UI
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }
    }

    // Method to handle MIDI input events and keep them in sync with the VexFlow piano
    handleMidiNoteOn(midiNote) {
        // Add null check to prevent errors
        if (!midiNote || !midiNote.key) {
            console.warn('Invalid MIDI note received:', midiNote);
            return;
        }

        const { key, octave, isSharp } = midiNote;
        const noteKey = key;
        const noteId = key.replace('/', '');

        // Store in active notes map
        this.activeNotes.set(noteKey, midiNote);

        // Update the UI
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }

        console.log(`MIDI note ${noteId} received`);
    }

    handleMidiNoteOff(midiNote) {
        // Add null check to prevent errors
        if (!midiNote || !midiNote.key) {
            console.warn('Invalid MIDI note received for note off:', midiNote);
            return;
        }

        const noteKey = midiNote.key;

        // Remove from active notes
        this.activeNotes.delete(noteKey);

        // Update UI
        if (this.setNotesCallback) {
            this.setNotesCallback([...this.activeNotes.values()]);
        }
    }

    // Clear all active notes (useful when stopping playback)
    clearAllNotes() {
        this.activeNotes.clear();

        if (this.setNotesCallback) {
            this.setNotesCallback([]);
        }
    }

    // Set the callback function that will receive note updates
    setCallback(callback) {
        this.setNotesCallback = callback;
    }
}
