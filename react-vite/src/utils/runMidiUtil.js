
import { WebMidi } from "webmidi"
import RunSoundUtil from "./runSoundUtil";



class RunMidiUtil {
    constructor() {
        this.noteOnListeners = [];
        this.noteOffListeners = [];
        this.useFlats = true;
    }

    getEnharmonicEquivalent(note) {
        const sharpToFlat = {
            'C#': 'Db',
            'D#': 'Eb',
            'F#': 'Gb',
            'G#': 'Ab',
            'A#': 'Bb'
        };

        const flatToSharp = {
            'Db': 'C#',
            'Eb': 'D#',
            'Gb': 'F#',
            'Ab': 'G#',
            'Bb': 'A#'
        };

        // Extract the base note and octave
        const match = note.match(/([A-G][#b]?)(\d+)/);
        if (!match) return note;

        const [, noteName, octave] = match;

        // Convert based on current preference
        if (this.useFlats && sharpToFlat[noteName]) {
            return `${sharpToFlat[noteName]}${octave}`;
        } else if (!this.useFlats && flatToSharp[noteName]) {
            return `${flatToSharp[noteName]}${octave}`;
        }

        return note;
    }

    // Add this method to set accidental preference
    setAccidentalPreference(useFlats) {
        this.useFlats = useFlats;
        console.log(`Accidental preference set to: ${useFlats ? 'flats' : 'sharps'}`);
    }

    /**
     * Add a listener for note-on events
     * @param {Function} callback - The function to call when a note-on event occurs
     * @returns {Function} A cleanup function that removes this listener
     */
    addNoteOnListener = (callback) => {
        // Add the callback to our listeners array
        this.noteOnListeners.push(callback);

        // Return a cleanup function that removes this specific callback
        return () => {
            this.removeNoteOnListener(callback);
        };
    };

    /**
     * Add a listener for note-off events
     * @param {Function} callback - The function to call when a note-off event occurs
     * @returns {Function} A cleanup function that removes this listener
     */
    addNoteOffListener = (callback) => {
        // Add the callback to our listeners array
        this.noteOffListeners.push(callback);

        // Return a cleanup function that removes this specific callback
        return () => {
            this.removeNoteOffListener(callback);
        };
    };

    /**
     * Remove a specific note-on listener
     * @param {Function} callback - The callback function to remove
     */
    removeNoteOnListener = (callback) => {
        // Find the index of this callback in our array
        const index = this.noteOnListeners.indexOf(callback);

        // If found, remove it
        if (index !== -1) {
            this.noteOnListeners.splice(index, 1);
            console.log("Note-on listener removed");
        }
    };

    /**
     * Remove a specific note-off listener
     * @param {Function} callback - The callback function to remove
     */
    removeNoteOffListener = (callback) => {
        // Find the index of this callback in our array
        const index = this.noteOffListeners.indexOf(callback);

        // If found, remove it
        if (index !== -1) {
            this.noteOffListeners.splice(index, 1);
            console.log("Note-off listener removed");
        }
    };

    /**
     * Remove all listeners
     */
    removeAllListeners = () => {
        this.noteOnListeners = [];
        this.noteOffListeners = [];
        console.log("All MIDI listeners removed");
    };

    handleNotePlay = (note) => {
        RunSoundUtil.playNote(note);
        console.log("Playing note:", note);
        this.noteOnListeners.forEach(callback => callback(note));

        // Notify all listeners about the note on event
        this.noteOnListeners.forEach(callback => callback(note));

        return note;
    };

    handleNoteOff = (note) => {
        // Notify all listeners about the note off event
        this.noteOffListeners.forEach(callback => callback(note));
    };

    setupMidi = async () => {
        try {
            await WebMidi.enable();
            // GET ALL CONNECTED MIDI DEVICES AND LOG IN CONSOLE
            const inputs = WebMidi.inputs;
            console.log(inputs);
            const setMidiDevices = inputs.map(input => input.name);
            console.log("Connected MIDI devices:", inputs.map(input => input.name));

            const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");

            if (myInput) {
                myInput.addListener("noteon", (e) => {
                    // Use enharmonic equivalent based on preference
                    const noteIdentifier = this.useFlats ?
                        this.getEnharmonicEquivalent(e.note.identifier) :
                        e.note.identifier;

                    console.log("MIDI Note On:", noteIdentifier);
                    this.handleNotePlay(noteIdentifier);
                });

                myInput.addListener("noteoff", (e) => {
                    // Use enharmonic equivalent based on preference
                    const noteIdentifier = this.useFlats ?
                        this.getEnharmonicEquivalent(e.note.identifier) :
                        e.note.identifier;

                    console.log('MIDI Note Off:', noteIdentifier);
                    this.handleNoteOff(noteIdentifier);
                });
            } else {
                console.log('KOMPLETE KONTROL A25 MIDI not found');

                if (inputs.length > 0) {
                    const firstInput = inputs[0];
                    console.log(`Connecting to available MIDI device: ${firstInput.name}`);

                    firstInput.addListener("noteon", (e) => {
                        // Use enharmonic equivalent based on preference
                        const noteIdentifier = this.useFlats ?
                            this.getEnharmonicEquivalent(e.note.identifier) :
                            e.note.identifier;

                        console.log("MIDI Note On:", noteIdentifier);
                        this.handleNotePlay(noteIdentifier);
                    });

                    firstInput.addListener("noteoff", (e) => {
                        // Use enharmonic equivalent based on preference
                        const noteIdentifier = this.useFlats ?
                            this.getEnharmonicEquivalent(e.note.identifier) :
                            e.note.identifier;

                        console.log("MIDI Note Off:", noteIdentifier);
                        this.handleNoteOff(noteIdentifier);
                    });
                }
            }
        } catch (err) {
            console.log("MIDI device not found or WebMidi not supported");
        }
    };
}

export default new RunMidiUtil();
