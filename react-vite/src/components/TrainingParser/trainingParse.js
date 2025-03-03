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

    static chordToNotes(chord) {
        const chordMap = {
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

        const root = chord.slice(0, 1);
        const quality = chord.slice(1);
        const baseNote = this.noteToMidiNumber(root);

        return chordMap[quality].map(interval =>
            this.midiNumberToNote(baseNote + interval));
    }

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

    static noteToMidiNumber(note) {
        const noteMap = {
            'C': 60, 'C#': 61, 'Db': 61,
            'D': 62, 'D#': 63, 'Eb': 63,
            'E': 64,
            'F': 65, 'F#': 66, 'Gb': 66,
            'G': 67, 'G#': 68, 'Ab': 68,
            'A': 69, 'A#': 70, 'Bb': 70,
            'B': 71
        };
        return noteMap[note];
    }

    static chordToPlayableNotes(chordName) {
        // Extract root and quality (e.g., "Cmaj7" → "C" and "maj7")
        const match = chordName.match(/^([A-G][#b]?)(.*)$/);
        if (!match) return [];

        const [_, root, quality] = match;

        // Use existing method but adjust octave for playability
        const theoreticalNotes = this.chordToNotes(`${root}${quality}`);

        // Convert to playable format (ensure octave is specified)
        return theoreticalNotes.map(note => {
            // If note already has octave, use it
            if (/[0-9]/.test(note)) return note;
            // Otherwise, add octave 4 for middle range
            return `${note}4`;
        });
    }

    static midiNumberToNote(midiNumber) {
        const octave = Math.floor(midiNumber / 12) - 1;
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteName = noteNames[midiNumber % 12];
        return `${noteName}${octave}`;
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
