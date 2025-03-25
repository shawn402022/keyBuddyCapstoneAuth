import {Howl} from 'howler'

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.activeNotes = new Map(); // Track which notes are currently active
        this.soundIds = new Map();    // Track the Howl sound IDs for proper management

        // Debug flag - set to true to see detailed logging
        this.debug = false;
    }

    log(...args) {
        if (this.debug) {
            console.log(...args);
        }
    }

    async loadSounds(notes) {
        const loadPromises = notes.map(note => {
            return new Promise((resolve, reject) => {
                // Normalize note format to ensure consistency
                const normalizedNote = this.normalizeNoteFormat(note);

                const audioPath = `/audio/notes/${normalizedNote.replace('#', 'sharp')}.mp3`;
                this.sounds[normalizedNote] = new Howl({
                    src: [audioPath],
                    volume: 0.8,
                    preload: true,
                    // Set a longer duration to allow for sustained notes
                    duration: 3.0,
                    onload: () => {
                        resolve();
                    },
                    onerror: (error) => {
                        console.error(`Failed to load sound for note: ${normalizedNote}`, error);
                        reject(error);
                    }
                });
            });
        });

        await Promise.all(loadPromises);
        this.log('Sound loading complete');
        return this.sounds;
    }

    /**
     * Normalize different note formats to a consistent format
     * @param {string} note - The note in any supported format
     * @returns {string} The normalized note format (e.g., "C4")
     */
    normalizeNoteFormat(note) {
        // Handle format like "C/4"
        if (note.includes('/')) {
            const [noteName, octave] = note.split('/');
            return `${noteName.toUpperCase()}${octave}`;
        }

        // Handle format like "c4" (lowercase)
        if (typeof note === 'string' && note.length >= 2) {
            const noteName = note.charAt(0).toUpperCase() + note.slice(1, -1);
            const octave = note.slice(-1);
            return `${noteName}${octave}`;
        }

        // Already in correct format or unknown format
        return note;
    }
    /**
      * Play a note with the specified velocity
      * @param {string} note - The note identifier (e.g., "C4" or "C/4")
      * @param {number} velocity - The velocity (volume) from 0 to 1
      * @returns {number} The sound ID for tracking
      */
    playNote(note, velocity = 0.8) {
        const normalizedNote = this.normalizeNoteFormat(note);

        console.log(`[${Date.now() - this.instanceCreatedAt}ms] PLAY NOTE REQUEST: ${normalizedNote}, velocity: ${velocity}`);
        console.log(`Current active notes: ${Array.from(this.activeNotes.keys()).join(', ')}`);

        // Skip if already playing
        if (this.activeNotes.has(normalizedNote)) {
            console.log(`Note ${normalizedNote} is already active, skipping playback`);
            return this.soundIds.get(normalizedNote);
        }

        if (!this.sounds[normalizedNote]) {
            console.warn(`Sound not found for note: ${normalizedNote}`);
            return null;
        }

        // Set volume based on velocity
        this.sounds[normalizedNote].volume(velocity);

        // Play the sound and get its ID
        const soundId = this.sounds[normalizedNote].play();

        // Store the sound ID for later reference
        this.soundIds.set(normalizedNote, soundId);

        // Track this note as active
        this.activeNotes.set(normalizedNote, {
            note: normalizedNote,
            velocity,
            timestamp: Date.now(),
            soundId
        });

        console.log(`After playNote, active notes: ${Array.from(this.activeNotes.keys()).join(', ')}`);
        return soundId;
    }

    /**
      * Release a note with a natural fade-out
      * @param {string} note - The note identifier (e.g., "C4" or "C/4")
      * @param {number} fadeTime - The fade-out time in milliseconds
      */
    releaseNote(note, fadeTime = 700) {
        const normalizedNote = this.normalizeNoteFormat(note);

        console.log(`[${Date.now() - this.instanceCreatedAt}ms] RELEASE NOTE REQUEST: ${normalizedNote}`);
        console.log(`Current active notes: ${Array.from(this.activeNotes.keys()).join(', ')}`);

        if (!this.sounds[normalizedNote]) {
            this.log(`SoundManager: No sound found for note: ${normalizedNote}`);
            return;
        }

        if (!this.activeNotes.has(normalizedNote)) {
            this.log(`SoundManager: Note ${normalizedNote} is not active, nothing to release`);
            return;
        }

        // Get the sound ID for this specific note instance
        const soundId = this.soundIds.get(normalizedNote);

        if (soundId !== undefined) {
            // Get current volume for this specific sound instance
            const currentVolume = this.sounds[normalizedNote].volume(undefined, soundId);

            // Fade out this specific sound instance
            this.sounds[normalizedNote].fade(currentVolume, 0, fadeTime, soundId);

            // Remove from tracking after fade completes
            setTimeout(() => {
                this.soundIds.delete(normalizedNote);
                this.activeNotes.delete(normalizedNote);
                this.log(`SoundManager: Note ${normalizedNote} removed from active notes after fade`);
                this.log(`SoundManager: Currently active notes:`, Array.from(this.activeNotes.keys()));
            }, fadeTime);

            this.log(`SoundManager: Releasing note ${normalizedNote} with sound ID ${soundId}`);
        }

        console.log(`After releaseNote (before timeout), active notes: ${Array.from(this.activeNotes.keys()).join(', ')}`);
    }
    

    /**
     * Stop all sounds immediately
     */
    stopAllSounds() {
        this.log('SoundManager: Stopping all sounds');

        // Get all active notes
        const activeNotes = Array.from(this.activeNotes.keys());

        // Release each note
        activeNotes.forEach(note => {
            this.releaseNote(note, 300); // Faster fade-out for all-stop
        });
    }

    /**
     * Check if a note is currently loaded
     * @param {string} note - The note identifier
     * @returns {boolean} Whether the note is loaded
     */
    isNoteLoaded(note) {
        const normalizedNote = this.normalizeNoteFormat(note);
        return this.sounds[normalizedNote] && this.sounds[normalizedNote].state() === 'loaded';
    }

    /**
     * Check if a note is currently playing
     * @param {string} note - The note identifier
     * @returns {boolean} Whether the note is currently active
     */
    isNotePlaying(note) {
        const normalizedNote = this.normalizeNoteFormat(note);
        return this.activeNotes.has(normalizedNote);
    }

    /**
     * Get a list of all currently active notes
     * @returns {Array<string>} Array of active note identifiers
     */
    getActiveNotes() {
        return Array.from(this.activeNotes.keys());
    }

    /**
     * Enable or disable debug logging
     * @param {boolean} enabled - Whether to enable debug logging
     */
    setDebug(enabled) {
        this.debug = enabled;
        this.log(`SoundManager: Debug logging ${enabled ? 'enabled' : 'disabled'}`);
    }
}
