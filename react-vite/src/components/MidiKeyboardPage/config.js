import * as Tonal from 'tonal';

export const PIANO_CONFIG = {
    chromaticNotes: Tonal.Range.chromatic(['C2', 'B7'], { sharps: true }).filter((note) => note.length === 2),
    sharpNotes: Tonal.Range.chromatic(['C2', 'B7'], { sharps: true }).filter((note) => note.length > 2),
    dimensions: {
        whiteKeyWidth: 80,
        pianoHeight: 400
    }
};
