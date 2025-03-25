// SoundContext.js
import  { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Howl } from 'howler';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
    // State for tracking active notes
    const [activeNotes, setActiveNotes] = useState(new Map());

    // Refs for sound instances and IDs
    const soundsRef = useRef({});
    const soundIdsRef = useRef(new Map());

    // Load sounds function
    const loadSounds = useCallback(async (notes) => {
        const loadPromises = notes.map(note => {
            return new Promise((resolve, reject) => {
                const audioPath = `/audio/notes/${note.replace('#', 'sharp')}.mp3`;
                soundsRef.current[note] = new Howl({
                    src: [audioPath],
                    volume: 0.8,
                    preload: true,
                    onload: resolve,
                    onerror: reject
                });
            });
        });

        await Promise.all(loadPromises);
        console.log('Sound loading complete');
        return soundsRef.current;
    }, []);

    // Play note function with retriggering prevention
    const playNote = useCallback((note, velocity = 0.8) => {
        console.log(`Request to play note: ${note}`);

        // Skip if already playing to prevent retriggering
        if (activeNotes.has(note)) {
            console.log(`Note ${note} already active, skipping`);
            return soundIdsRef.current.get(note);
        }

        if (!soundsRef.current[note]) {
            console.warn(`Sound not found for note: ${note}`);
            return null;
        }

        // Set volume based on velocity
        soundsRef.current[note].volume(velocity);

        // Play the sound and get its ID
        const soundId = soundsRef.current[note].play();

        // Store the sound ID
        soundIdsRef.current.set(note, soundId);

        // Update active notes state
        setActiveNotes(prev => {
            const newMap = new Map(prev);
            newMap.set(note, {
                note,
                velocity,
                timestamp: Date.now(),
                soundId
            });
            return newMap;
        });

        console.log(`Playing note ${note} with sound ID ${soundId}`);
        console.log(`Active notes: ${Array.from(activeNotes.keys()).join(', ')}`);

        return soundId;
    }, [activeNotes]);
    // Release note function
    const releaseNote = useCallback((note, fadeTime = 700) => {
        console.log(`Request to release note: ${note}`);

        if (!soundsRef.current[note]) {
            console.warn(`Sound not found for note: ${note}`);
            return;
        }

        if (!activeNotes.has(note)) {
            console.log(`Note ${note} not active, nothing to release`);
            return;
        }

        // Get the sound ID
        const soundId = soundIdsRef.current.get(note);

        if (soundId !== undefined) {
            // Get current volume
            const currentVolume = soundsRef.current[note].volume(undefined, soundId);

            // Fade out
            soundsRef.current[note].fade(currentVolume, 0, fadeTime, soundId);

            // Remove from tracking after fade completes
            setTimeout(() => {
                soundIdsRef.current.delete(note);

                setActiveNotes(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(note);
                    return newMap;
                });

                console.log(`Note ${note} removed from active notes after fade`);
            }, fadeTime);

            console.log(`Releasing note ${note} with sound ID ${soundId}`);
        }
    }, [activeNotes]);

    // Stop all sounds
    const stopAllSounds = useCallback(() => {
        console.log('Stopping all sounds');

        // Get all active notes
        const notesToRelease = Array.from(activeNotes.keys());

        // Release each note
        notesToRelease.forEach(note => {
            releaseNote(note, 300); // Faster fade-out for all-stop
        });
    }, [activeNotes, releaseNote]);

    // Context value
    const contextValue = {
        activeNotes: Array.from(activeNotes.values()),
        loadSounds,
        playNote,
        releaseNote,
        stopAllSounds,
        isNotePlaying: note => activeNotes.has(note)
    };

    return (
        <SoundContext.Provider value={contextValue}>
            {children}
        </SoundContext.Provider>
    );
}

// Custom hook for using the sound context
export function useSoundContext() {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSoundContext must be used within a SoundProvider');
    }
    return context;
}
