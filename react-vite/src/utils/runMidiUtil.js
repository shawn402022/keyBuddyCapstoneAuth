
import { WebMidi } from "webmidi"
import RunSoundUtil from "./runSoundUtil";



class RunMidiUtil {
    constructor() {
        this.noteOnListeners = [];
        this.noteOffListeners = [];
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
                    const note = e.note.identifier;
                    console.log("MIDI Note On:", note);
                    this.handleNotePlay(note);
                });

                myInput.addListener("noteoff", (e) => {
                    const note = e.note.identifier;
                    console.log('MIDI Note Off:', note);
                    this.handleNoteOff(note);
                });
            } else {
                console.log('KOMPLETE KONTROL A25 MIDI not found');

                // Try to connect to any available MIDI device
                if (inputs.length > 0) {
                    const firstInput = inputs[0];
                    console.log(`Connecting to available MIDI device: ${firstInput.name}`);

                    firstInput.addListener("noteon", (e) => {
                        const note = e.note.identifier;
                        console.log("MIDI Note On:", note);
                        this.handleNotePlay(note);
                    });

                    firstInput.addListener("noteoff", (e) => {
                        const note = e.note.identifier;
                        console.log("MIDI Note Off:", note);
                        this.handleNoteOff(note);
                    });
                }
            }
        } catch (err) {
            console.log("MIDI device not found or WebMidi not supported");
        }
    };
}

export default new RunMidiUtil();
