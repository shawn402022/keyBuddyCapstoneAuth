import { Howl } from 'howler';

class SoundModule {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {

        const notes = ['C','Cs', 'D','Ds','E', 'F', 'Fs', 'G', 'Gs',  'A', 'As', 'B'];
        const octaves = ['1','2', '3', '4', '5', '6', '7','8'];

        notes.forEach(note => {
            octaves.forEach(octave => {
                const fullNote = `${note}${octave}`;
                const fileName = fullNote.replace('#', 's');

                this.sounds[fullNote] = new Howl({
                    src: [`/audio/notes/${fileName}.mp3`],
                    preload: true,
                    volume: 1.0,
                    onload: () => console.log(`Loaded sound: ${fullNote}`),
                    onloaderror: (id, error) => console.error(`Error loading ${fullNote}:`, error)
                });
            });
        });

        console.log("Available sounds:", Object.keys(this.sounds));



    }

    playNote(note) {
        console.log(`Attempting to play note: ${note}`);

        // Check if the note needs normalization (e.g., convert C#4 to Cs4)
        const normalizedNote = note.replace('#', 's');

        if (this.sounds[normalizedNote]) {
            console.log(`Playing sound for note: ${normalizedNote}`);
            this.sounds[normalizedNote].volume(1.0); // Ensure volume is up
            this.sounds[normalizedNote].play();
        } else {
            console.error(`Sound not found for note: ${normalizedNote}`);
            console.log("Available notes:", Object.keys(this.sounds));
        }
    }

    // Test method to manually verify sounds
    testPlayAllNotes() {
        console.log("Testing all notes...");
        Object.keys(this.sounds).forEach((note, index) => {
            setTimeout(() => {
                console.log(`Testing note: ${note}`);
                this.playNote(note);
            }, index * 500); // Play each note with a delay
        });
    }


}

export default new SoundModule();
