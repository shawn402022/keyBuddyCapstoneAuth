import { Howl } from 'howler';

class RunSoundUtil {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {

        const notes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

        const octaves = ['1', '2', '3', '4', '5', '6', '7', '8'];

        notes.forEach(note => {
            octaves.forEach(octave => {
                const fullNote = `${note}${octave}`;
                const fileName = fullNote.replace('#', 's');

                this.sounds[fullNote] = new Howl({
                    src: [`/audio/notes/${fileName}.mp3`],
                    preload: true,
                    volume: 1.0,
                    //onload: () => console.log(`Loaded sound: ${fullNote}`),
                    onloaderror: (id, error) => console.error(`Error loading ${fullNote}:`, error)
                });
            });
        });

        //console.log("Available sounds:", Object.keys(this.sounds));



    }

    playNote(note) {
        //console.log(`Attempting to play note: ${note}`);

        // Check if the note needs normalization (e.g., convert C#4 to Cs4)
        const soundNote = this.convertToSoundFormat(note);


        if (this.sounds[soundNote]) {
            //console.log(`Playing sound for note: ${normalizedNote}`);
            this.sounds[soundNote].volume(1.0); // Ensure volume is up
            this.sounds[soundNote].play();
        } else {
            console.error(`Sound not found for note: ${soundNote}`);
            //console.log("Available notes:", Object.keys(this.sounds));
        }
    }

    convertToSoundFormat(note) {
        // Extract the note name and octave
        const match = note.match(/([A-G][#b]?)(\d+)/);
        if (!match) return note;

        const [, noteName, octave] = match;

        // Map for converting to sound system format
        const noteToSound = {
            'C#': 'Cs', 'Db': 'Cs',
            'D#': 'Ds', 'Eb': 'Ds',
            'F#': 'Fs', 'Gb': 'Fs',
            'G#': 'Gs', 'Ab': 'Gs',
            'A#': 'As', 'Bb': 'As'
        };

        // Convert if we have a mapping
        if (noteToSound[noteName]) {
            return `${noteToSound[noteName]}${octave}`;
        }

        // Handle the case where the note already uses 's' notation
        if (noteName.includes('s')) {
            return note;
        }

        // For other notes (natural notes), no conversion needed
        return note;
    }

    // Test method to manually verify sounds
    testPlayAllNotes() {
        //console.log("Testing all notes...");
        Object.keys(this.sounds).forEach((note, index) => {
            setTimeout(() => {
                //console.log(`Testing note: ${note}`);
                this.playNote(note);
            }, index * 500); // Play each note with a delay
        });
    }


}

export default new RunSoundUtil();
