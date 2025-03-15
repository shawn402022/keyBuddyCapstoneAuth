import { Howl } from 'howler';

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadingPromises = [];
        this.isLoaded = false;
    }

    /**
     * Load sounds for a set of notes
     * @param {Array} notes - Array of note identifiers to load
     * @returns {Promise} - Promise that resolves when all sounds are loaded
     */
    loadSounds(notes) {
        console.log("Loading sounds for notes:", notes);

        // Clear any existing loading promises
        this.loadingPromises = [];

        // Create a promise for each note
        notes.forEach(note => {
            // Skip if already loaded
            if (this.sounds[note] && this.sounds[note].state() === 'loaded') {
                return;
            }

            // Create a promise for this note's loading
            const loadPromise = new Promise((resolve, reject) => {
                this.sounds[note] = new Howl({
                    src: [`/audio/notes/${note}.mp3`],
                    preload: true,
                    onload: () => {
                        console.log(`Loaded sound for note: ${note}`);
                        resolve(note);
                    },
                    onloaderror: (id, error) => {
                        console.error(`Error loading sound for note ${note}:`, error);
                        reject(error);
                    }
                });
            });

            this.loadingPromises.push(loadPromise);
        });

        // Return a promise that resolves when all sounds are loaded
        return Promise.all(this.loadingPromises)
            .then(() => {
                console.log("All sounds loaded successfully");
                this.isLoaded = true;
                return true;
            })
            .catch(error => {
                console.error("Error loading sounds:", error);
                throw error;
            });
    }

    /**
     * Play a note with the specified volume
     * @param {string} note - Note identifier
     * @param {number} volume - Volume level (0-1)
     * @returns {number} - Sound ID if played successfully, undefined otherwise
     */
    playNote(note, volume = 0.75) {
        if (!this.sounds[note]) {
            console.warn(`Sound not found for note: ${note}`);
            return;
        }

        if (this.sounds[note].state() !== 'loaded') {
            console.warn(`Sound not loaded for note: ${note}`);
            return;
        }

        // Set volume and play
        this.sounds[note].volume(volume);
        return this.sounds[note].play();
    }

    /**
     * Stop a specific note or all notes
     * @param {string} [note] - Note identifier (if omitted, stops all notes)
     */
    stopNote(note) {
        if (note) {
            if (this.sounds[note]) {
                this.sounds[note].stop();
            }
        } else {
            // Stop all sounds
            Object.values(this.sounds).forEach(sound => {
                sound.stop();
            });
        }
    }

    /**
     * Check if all sounds are loaded
     * @returns {boolean} - True if all sounds are loaded
     */
    areAllSoundsLoaded() {
        return this.isLoaded && Object.values(this.sounds).every(sound => sound.state() === 'loaded');
    }

    /**
     * Get loading progress percentage
     * @returns {number} - Percentage of sounds loaded (0-100)
     */
    getLoadingProgress() {
        if (!this.sounds || Object.keys(this.sounds).length === 0) {
            return 0;
        }

        const totalSounds = Object.keys(this.sounds).length;
        const loadedSounds = Object.values(this.sounds).filter(sound => sound.state() === 'loaded').length;

        return Math.round((loadedSounds / totalSounds) * 100);
    }
}
