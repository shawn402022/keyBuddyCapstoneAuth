import {Howl} from 'howler'

export class SoundManager {
    constructor() {
        this.sounds = {};
    }

    async loadSounds(notes) {
        //console.log('Starting to load notes:', notes);
        const loadPromises = notes.map(note => {
            return new Promise((resolve, reject) => {
                const audioPath = `/audio/notes/${note.replace('#', 'sharp')}.mp3`;
                //console.log('Loading audio file:', audioPath);
                this.sounds[note] = new Howl({
                    src: [audioPath],
                    volume: 0.8,
                    preload: true,
                    onload: () => {
                        //console.log(`Successfully loaded sound for note: ${note}`);
                        resolve();
                    },
                    onerror: (error) => {
                        console.error(`Failed to load sound for note: ${note}`, error);
                        reject(error);
                    }
                });
            });
        });

        await Promise.all(loadPromises);
        console.log('Final sounds object:', this.sounds);
        return this.sounds;
    }

    playNote(note) {
        if (this.sounds[note]) {
            this.sounds[note].play();
        }
    }

    isNoteLoaded(note) {
        return this.sounds[note] && this.sounds[note]._state === 'loaded';
    }
}
