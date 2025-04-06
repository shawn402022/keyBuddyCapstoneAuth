import { Howl } from 'howler';

class SoundModule {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {

        const notes = ['C','C#', 'D','D#','E', 'F', 'F#', 'G', 'G#',  'A', 'A#', 'B'];
        const octaves = ['2', '3', '4', '5', '6', '7'];

        notes.forEach(note => {
            octaves.forEach(octave => {
                const fullNote = `${note}${octave}`;
                this.sounds[fullNote] = new Howl({
                    src: [`/audio/notes/${fullNote}.mp3`],
                    preload: true,
                });
            });
        });

    }

    playNote(note) {
        if (this.sounds[note]) {
            this.sounds[note].play();
        } else {
            console.error(`Sound not found for note: ${note}`);
        }
    }


}

export default new SoundModule();
