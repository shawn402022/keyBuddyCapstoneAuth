
import { WebMidi } from "webmidi"
import RunSoundUtil from "./runSoundUtil";



class RunMidiUtil {

    //Event Listeners array to store callbacks
    constructor() {
        this.noteOnListeners = []
        this.noteOffListeners = []
    }

    //Method to register note on listeners
    addNoteOnListener = (callback) => {
        this.noteOnListeners.push(callback)
    };

    //Method to register note off listeners
    addNoteOffListener = (callback) => {
        this.noteOffListeners.push(callback)
    };

    handleNotePlay = (note) => {
        RunSoundUtil.playNote(note);
        console.log("Playing note:", note);

        //Notify all listeners about the note on event
        this.noteOnListeners.forEach(callback => callback(note))

        return note;
    };

    handleNoteOff = (note) => {
        //Notify all listeners about the note off event
        this.noteOffListeners.forEach(callback => callback(note))
    }

    setupMidi = async () => {
        try {
            await WebMidi.enable();
            //GET ALL CONNECTED MIDI DEVICES AND LOG IN CONSOLE
            const inputs = WebMidi.inputs;
            console.log(inputs)
            const setMidiDevices = inputs.map(input => input.name);
            console.log("Connected MIDI devices:", inputs.map(input => input.name));


            const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");

            if (myInput) {
                myInput.addListener("noteon", (e) => {
                    const note = e.note.identifier;
                    console.log("MIDI Note On:", note);  // Add this line for debugging
                    this.handleNotePlay(note);

                });

                myInput.addListener("noteoff", (e) => {
                    const note = e.note.identifier;
                    console.log('MIDI Note Off:',note);
                    this.handleNoteOff(note);
                });
            } else {
                console.log('KOMPLETE KONTROL A25 MIDI not found')

                //Try to connect to any available MIDI device
                if (inputs.length > 0) {
                    const firstInput = inputs[0];
                    console.log(`Connecting to available MIDI device: ${firstInput.name}`);

                    firstInput.addListener("noteOn", (e) => {
                        const note = e.note.identifier;
                        console.log("MIDI Note Off:", note);
                        this.handleNoteOff(note)
                    })
                }
            }
        } catch (err) {
            console.log("MIDI device not found or WebMidi not supported");
        }
    };

}



export default new RunMidiUtil
