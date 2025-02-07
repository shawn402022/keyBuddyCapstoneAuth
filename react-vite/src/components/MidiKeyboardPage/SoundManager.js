import {Howl} from 'howler'

export class SoundManager {
    constructor() {
        this.sounds = {};
    }








    async loadSounds(notes) {
        const loadPromises = notes.map(note => {
            return new Promise((resolve, reject) => {
                const audioPath = `/audio/notes/${note.replace('#', 'sharp')}.mp3`;
                this.sounds[note] = new Howl({
                    src: [audioPath],
                    volume: 0.8,
                    preload: true,
                    onload: resolve,
                    onerror: reject
                });
            });
        });

        await Promise.all(loadPromises);
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
