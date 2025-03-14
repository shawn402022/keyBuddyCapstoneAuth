export class TrainingParser {
    static parseChordProgression(chordString) {
        // Example input: "Cmaj7 Dm7 Em7 Fmaj7"
        const chords = chordString.split(' ');
        return chords.map(chord => this.chordToNotes(chord));
    }

    static parseScale(scaleString) {
        // Example input: "C major scale"
        const [root, type] = scaleString.split(' ');
        return this.getScaleNotes(root, type);
    }

    static noteToMidiNumber(note) {
        // Comprehensive note mapping including theoretical notes
        const noteMap = {
            'C': 60, 'C#': 61, 'Db': 61,
            'D': 62, 'D#': 63, 'Eb': 63,
            'E': 64, 'E#': 65, 'Fb': 64, // E# is enharmonic with F, Fb with E
            'F': 65, 'F#': 66, 'Gb': 66,
            'G': 67, 'G#': 68, 'Ab': 68,
            'A': 69, 'A#': 70, 'Bb': 70,
            'B': 71, 'B#': 72, 'Cb': 71  // B# is enharmonic with C, Cb with B
        };

        // If the note isn't in our map, log an error and return a default value
        if (noteMap[note] === undefined) {
            console.error(`Invalid note name: ${note}. Using C as fallback.`);
            return 60; // Default to C
        }

        return noteMap[note];
    }

    static midiNumberToNote(midiNumber) {
        const octave = Math.floor(midiNumber / 12) - 1;
        // Use simpler note names for better compatibility
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Handle out-of-range MIDI numbers
        if (midiNumber < 0 || midiNumber > 127) {
            console.error(`MIDI number out of range: ${midiNumber}. Using C4 as fallback.`);
            return 'C4';
        }

        const noteName = noteNames[midiNumber % 12];
        return `${noteName}${octave}`;
    }

    static chordToNotes(chord) {
        // Improved regex to better handle various chord notations
        const match = chord.match(/^([A-G][#b]?)(.*)$/);
        if (!match) {
            console.error(`Invalid chord format: ${chord}`);
            return ['C4', 'E4', 'G4']; // Return a C major chord as fallback
        }

        const [_, root, quality] = match;

        // Check if the root note is valid
        if (!this.isValidNote(root)) {
            console.error(`Invalid root note: ${root} in chord ${chord}. Using C as fallback.`);
            return ['C4', 'E4', 'G4']; // Return a C major chord as fallback
        }

        const baseNote = this.noteToMidiNumber(root);

        // Normalize chord quality for better matching
        let normalizedQuality = quality;

        // Map common abbreviations to our internal format
        const qualityMap = {
            '': 'maj',     // C -> Cmaj
            'm': 'min',    // Am -> Amin
            '-': 'min',    // A- -> Amin
            'M': 'maj',    // CM -> Cmaj
            'maj': 'maj',  // Already correct
            'min': 'min',  // Already correct
            'dim': 'dim',  // Already correct
            'aug': 'aug',  // Already correct
            '+': 'aug',    // C+ -> Caug
            'o': 'dim',    // Co -> Cdim
            'ø': 'm7b5',   // Cø -> Cm7b5
            '7': '7',      // Already correct
            'maj7': 'maj7', // Already correct
            'M7': 'maj7',  // CM7 -> Cmaj7
            'm7': 'm7',    // Already correct
            '-7': 'm7',    // C-7 -> Cm7
            'mM7': 'mM7',  // Already correct
            'm(maj7)': 'mM7', // Cm(maj7) -> CmM7
            'dim7': 'dim7', // Already correct
            'o7': 'dim7',  // Co7 -> Cdim7
            'm7b5': 'm7b5', // Already correct
            'ø7': 'm7b5',  // Cø7 -> Cm7b5
        };

        // Handle special cases for flat/sharp notation in the quality
        if (quality.startsWith('b') || quality.startsWith('#')) {
            // This is likely a note alteration, not a quality
            // For example, "Abb" should be treated as "Ab" (root) with no quality
            normalizedQuality = 'maj';
        }
        // Handle common quality abbreviations
        else if (qualityMap[quality]) {
            normalizedQuality = qualityMap[quality];
        }
        // Handle compound qualities (e.g., "m7", "maj7", etc.)
        else {
            // Try to match known patterns
            if (quality.startsWith('m') && quality.includes('7')) {
                if (quality.includes('maj7') || quality.includes('M7')) {
                    normalizedQuality = 'mM7';
                } else if (quality.includes('7b5')) {
                    normalizedQuality = 'm7b5';
                } else {
                    normalizedQuality = 'm7';
                }
            } else if (quality.includes('maj7') || quality.includes('M7')) {
                normalizedQuality = 'maj7';
            } else if (quality.includes('7')) {
                normalizedQuality = '7';
            } else if (quality.startsWith('m')) {
                normalizedQuality = 'min';
            }
        }

        // If we still don't have a match, log a warning and default to major
        if (!this.chordMap[normalizedQuality]) {
            console.warn(`Unknown chord quality "${quality}" (normalized to "${normalizedQuality}") in chord "${chord}". Defaulting to major.`);
            normalizedQuality = 'maj';
        }

        try {
            // Generate notes and add octave information
            return this.chordMap[normalizedQuality].map(interval => {
                const note = this.midiNumberToNote(baseNote + interval);
                // Validate the generated note
                if (!note || note.includes('undefined') || note.includes('NaN')) {
                    throw new Error(`Invalid note generated for chord ${chord}: ${note}`);
                }
                return note;
            });
        } catch (error) {
            console.error(`Error generating notes for chord ${chord}:`, error);
            // Return a fallback chord
            return ['C4', 'E4', 'G4']; // C major as fallback
        }
    }

    // Add a helper method to validate note names
    static isValidNote(note) {
        const validNotes = [
            'C', 'C#', 'Db',
            'D', 'D#', 'Eb',
            'E', 'E#', 'Fb',
            'F', 'F#', 'Gb',
            'G', 'G#', 'Ab',
            'A', 'A#', 'Bb',
            'B', 'B#', 'Cb'
        ];
        return validNotes.includes(note);
    }

    static chordToPlayableNotes(chordName) {
        try {
            // Extract root and quality
            const match = chordName.match(/^([A-G][#b]?)(.*)$/);
            if (!match) {
                console.error(`Invalid chord format: ${chordName}`);
                return ['C4', 'E4', 'G4']; // Return C major as fallback
            }

            const [_, root, quality] = match;

            // Check if the root note is valid
            if (!this.isValidNote(root)) {
                console.error(`Invalid root note: ${root} in chord ${chordName}. Using C as fallback.`);
                return ['C4', 'E4', 'G4']; // Return C major as fallback
            }

            // Use existing method to get the theoretical notes
            const theoreticalNotes = this.chordToNotes(`${root}${quality}`);

            if (!theoreticalNotes || theoreticalNotes.length === 0) {
                console.warn(`No notes generated for chord: ${chordName}`);
                return ['C4', 'E4', 'G4']; // Return C major as fallback
            }

            // Validate each note
            const playableNotes = theoreticalNotes.map(note => {
                // If note already has octave and is valid, use it
                if (/^[A-G][#b]?\d+$/.test(note)) return note;

                // Extract the note name without octave
                const noteName = note.replace(/\d+$/, '');

                // Add octave 4 for middle range
                return `${noteName}4`;
            });

            // Final validation to ensure no invalid notes
            return playableNotes.filter(note =>
                !note.includes('undefined') &&
                !note.includes('NaN') &&
                /^[A-G][#b]?\d+$/.test(note)
            );
        } catch (error) {
            console.error(`Error in chordToPlayableNotes for ${chordName}:`, error);
            return ['C4', 'E4', 'G4']; // Return C major as fallback
        }
    }

    static chordMap = {
        // Triads
        'maj': [0, 4, 7],          // Major
        'min': [0, 3, 7],          // Minor
        'dim': [0, 3, 6],          // Diminished
        'aug': [0, 4, 8],          // Augmented
        'sus2': [0, 2, 7],         // Suspended 2nd
        'sus4': [0, 5, 7],         // Suspended 4th

        // Seventh Chords
        'maj7': [0, 4, 7, 11],     // Major 7th
        'm7': [0, 3, 7, 10],       // Minor 7th
        '7': [0, 4, 7, 10],        // Dominant 7th
        'dim7': [0, 3, 6, 9],      // Diminished 7th
        'm7b5': [0, 3, 6, 10],     // Half Diminished 7th
        'mM7': [0, 3, 7, 11],      // Minor Major 7th
        'aug7': [0, 4, 8, 10],     // Augmented 7th
        '7sus4': [0, 5, 7, 10],    // 7th Suspended 4th

        // Extended Chords
        'maj9': [0, 4, 7, 11, 14], // Major 9th
        '9': [0, 4, 7, 10, 14],    // Dominant 9th
        'm9': [0, 3, 7, 10, 14],   // Minor 9th
        'maj11': [0, 4, 7, 11, 14, 17], // Major 11th
        '11': [0, 4, 7, 10, 14, 17],    // Dominant 11th
        'm11': [0, 3, 7, 10, 14, 17],   // Minor 11th
        'maj13': [0, 4, 7, 11, 14, 21], // Major 13th
        '13': [0, 4, 7, 10, 14, 21],    // Dominant 13th
        'm13': [0, 3, 7, 10, 14, 21],   // Minor 13th

        // Add9 Chords
        'add9': [0, 4, 7, 14],     // Add 9
        'madd9': [0, 3, 7, 14],    // Minor Add 9

        // 6th Chords
        '6': [0, 4, 7, 9],         // Major 6th
        'm6': [0, 3, 7, 9],        // Minor 6th
        '69': [0, 4, 7, 9, 14],    // 6/9 Chord

        // Altered Dominants
        '7b5': [0, 4, 6, 10],      // 7 flat 5
        '7#5': [0, 4, 8, 10],      // 7 sharp 5
        '7b9': [0, 4, 7, 10, 13],  // 7 flat 9
        '7#9': [0, 4, 7, 10, 15],  // 7 sharp 9
        '7#11': [0, 4, 7, 10, 18], // 7 sharp 11
        '7b13': [0, 4, 7, 10, 20], // 7 flat 13
    };

    static getScaleNotes(root, type) {
        const scaleMap = {
            // Common Scales
            'major': [0, 2, 4, 5, 7, 9, 11],              // Major/Ionian
            'minor': [0, 2, 3, 5, 7, 8, 10],              // Natural Minor/Aeolian
            'harmonicMinor': [0, 2, 3, 5, 7, 8, 11],      // Harmonic Minor
            'melodicMinor': [0, 2, 3, 5, 7, 9, 11],       // Melodic Minor (ascending)

            // Modes of Major Scale
            'dorian': [0, 2, 3, 5, 7, 9, 10],             // Dorian Mode
            'phrygian': [0, 1, 3, 5, 7, 8, 10],           // Phrygian Mode
            'lydian': [0, 2, 4, 6, 7, 9, 11],             // Lydian Mode
            'mixolydian': [0, 2, 4, 5, 7, 9, 10],         // Mixolydian Mode
            'locrian': [0, 1, 3, 5, 6, 8, 10],            // Locrian Mode

            // Pentatonic Scales
            'majorPentatonic': [0, 2, 4, 7, 9],           // Major Pentatonic
            'minorPentatonic': [0, 3, 5, 7, 10],          // Minor Pentatonic

            // Blues Scales
            'blues': [0, 3, 5, 6, 7, 10],                 // Blues Scale
            'majorBlues': [0, 2, 3, 4, 7, 9],             // Major Blues Scale

            // Jazz and Modal Scales
            'bebop': [0, 2, 4, 5, 7, 9, 10, 11],          // Bebop Dominant
            'diminished': [0, 2, 3, 5, 6, 8, 9, 11],      // Diminished Scale
            'wholeTone': [0, 2, 4, 6, 8, 10],             // Whole Tone Scale
            'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Chromatic Scale

            // Exotic Scales
            'hungarian': [0, 2, 3, 6, 7, 8, 11],          // Hungarian Minor
            'persian': [0, 1, 4, 5, 6, 8, 11],            // Persian Scale
            'japanese': [0, 2, 3, 7, 8],                  // Japanese (Hirajoshi)
            'arabic': [0, 2, 3, 6, 7, 8, 11],             // Arabic Scale
            'egyptian': [0, 2, 5, 7, 10],                 // Egyptian Scale

            // Synthetic Scales
            'enigmatic': [0, 1, 4, 6, 8, 10, 11],         // Enigmatic Scale
            'prometheus': [0, 2, 4, 6, 9, 10],            // Prometheus Scale
            'symmetrical': [0, 1, 4, 5, 8, 9],
        };

        const baseNote = this.noteToMidiNumber(root);
        return scaleMap[type].map(interval =>
            this.midiNumberToNote(baseNote + interval));
    }


    static formatNote(note) {
        // Check if note already includes an octave number
        if (/[0-9]/.test(note)) {
            return note;
        }

        // Default to octave 4 if no octave is specified
        return `${note}4`;
    }

    static parseTrainingContent(course) {
        if (!course || !course.details_of_course) {
            return [];
        }

        const content = course.details_of_course;
        const courseName = course.course_name || '';

        // Handle scale-specific content
        if (courseName.endsWith('_scale')) {
            const notes = content.split(', ').map(item => item.trim());
            return {
                type: 'scale',
                notes: notes,
                raw: content
            };
        }

        // Return regular array for non-scale content
        return content.split(', ').map(item => item.trim());
    }
}

// Potential enhancement to the TrainingParser
