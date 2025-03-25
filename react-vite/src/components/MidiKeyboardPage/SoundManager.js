import { Howl } from 'howler'

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.activeNotes = new Map(); // Track which notes are currently active
        this.soundIds = new Map();    // Track the Howl sound IDs for proper management

        // Add a timestamp for logging
        this.instanceCreatedAt = Date.now();

        // Debug flag - set to true to see detailed logging
        this.debug = true;

        // Add a new map to track notes that are in the process of being released
        this.releasingNotes = new Map();
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

        console.log(`PLAY NOTE REQUEST: ${normalizedNote}, velocity: ${velocity}`);

        // Check if the note is currently active
        const isActive = this.activeNotes.has(normalizedNote);

        // Check if the note is in the process of being released
        const isReleasing = this.releasingNotes.has(normalizedNote);

        // If the note is active but not in the process of being released,
        // we don't need to do anything - it's already playing
        if (isActive && !isReleasing) {
            console.log(`Note ${normalizedNote} is already active and not being released, skipping playback`);
            return this.soundIds.get(normalizedNote);
        }

        // If the note is in the process of being released, cancel the release
        if (isReleasing) {
            console.log(`Note ${normalizedNote} is being released, cancelling release`);

            // Get the release timeout ID
            const releaseTimeout = this.releasingNotes.get(normalizedNote);

            // Cancel the timeout
            clearTimeout(releaseTimeout);

            // Remove from releasing notes
            this.releasingNotes.delete(normalizedNote);

            // If the note is still active, just update its velocity and return
            if (isActive) {
                // Get the sound ID
                const soundId = this.soundIds.get(normalizedNote);

                // Update the velocity
                if (soundId !== undefined) {
                    this.sounds[normalizedNote].volume(velocity, soundId);
                }

                console.log(`Note ${normalizedNote} was active, updated velocity to ${velocity}`);
                return soundId;
            }

            // If we get here, the note was being released but is no longer active
            // So we need to play it again
        }

        // If the note doesn't exist, log a warning and return
        if (!this.sounds[normalizedNote]) {
            console.warn(`Sound not found for note: ${normalizedNote}`);
            return null;
        }

        // Play the sound and get its ID
        const soundId = this.sounds[normalizedNote].play();

        // Set volume based on velocity
        this.sounds[normalizedNote].volume(velocity, soundId);

        // Store the sound ID for later reference
        this.soundIds.set(normalizedNote, soundId);

        // Track this note as active
        this.activeNotes.set(normalizedNote, {
            note: normalizedNote,
            velocity,
            timestamp: Date.now(),
            soundId
        });

        console.log(`Note ${normalizedNote} is now active with sound ID ${soundId}`);
        return soundId;
    }

    /**
      * Release a note with a natural fade-out
      * @param {string} note - The note identifier (e.g., "C4" or "C/4")
      * @param {number} fadeTime - The fade-out time in milliseconds
      */
    releaseNote(note, fadeTime = 700) {
        const normalizedNote = this.normalizeNoteFormat(note);

        console.log(`RELEASE NOTE REQUEST: ${normalizedNote}`);

        // If the note doesn't exist or isn't active, log and return
        if (!this.sounds[normalizedNote]) {
            console.log(`No sound found for note: ${normalizedNote}`);
            return;
        }

        if (!this.activeNotes.has(normalizedNote)) {
            console.log(`Note ${normalizedNote} is not active, nothing to release`);
            return;
        }

        // Get the sound ID for this specific note instance
        const soundId = this.soundIds.get(normalizedNote);

        if (soundId !== undefined) {
            // Get current volume for this specific sound instance
            const currentVolume = this.sounds[normalizedNote].volume(undefined, soundId);

            // Fade out this specific sound instance
            this.sounds[normalizedNote].fade(currentVolume, 0, fadeTime, soundId);

            // Mark the note as being released
            const releaseTimeout = setTimeout(() => {
                // Remove from tracking
                this.soundIds.delete(normalizedNote);
                this.activeNotes.delete(normalizedNote);
                this.releasingNotes.delete(normalizedNote);

                console.log(`Note ${normalizedNote} removed from active notes after fade`);
            }, fadeTime);

            // Store the timeout ID so we can cancel it if needed
            this.releasingNotes.set(normalizedNote, releaseTimeout);

            console.log(`Note ${normalizedNote} is now being released with sound ID ${soundId}`);
        }
    }

    restartNote(note, velocity = 0.8) {
        const normalizedNote = this.normalizeNoteFormat(note);

        console.log(`RESTART NOTE REQUEST: ${normalizedNote}, velocity: ${velocity}`);

        // Stop the current sound immediately
        if (this.activeNotes.has(normalizedNote)) {
            const soundId = this.soundIds.get(normalizedNote);
            if (soundId !== undefined) {
                this.sounds[normalizedNote].stop(soundId);
            }

            // Clean up tracking
            this.soundIds.delete(normalizedNote);
            this.activeNotes.delete(normalizedNote);

            // Also clean up any release in progress
            if (this.releasingNotes.has(normalizedNote)) {
                clearTimeout(this.releasingNotes.get(normalizedNote));
                this.releasingNotes.delete(normalizedNote);
            }
        }

        // Now play the note fresh
        return this.playNote(note, velocity);
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
