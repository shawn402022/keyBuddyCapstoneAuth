import allChordsObj from "../data/chord-data";

export const reformatData = () => {
    let reformattedData = []
    let idCounter = 1
    allChordsObj.forEach((obj) => {

        for (let key in obj) {
            let newObj = {}
            let chordName = obj[key]
            let chordKeys = key
            let unNatural = `${chordName[0]}${chordName[1]}`

            //let id =
            //newObj[id] = i-1;
            newObj['id'] = idCounter++
            if (chordName[1] === '#' || chordName[1] === 'b') {
                newObj['key'] = unNatural
            } else {
                newObj['key'] = `${chordName[0]}`
            }
            newObj['name'] = chordName;
            newObj['notes'] = chordKeys;




            reformattedData.push(newObj)
        }

    });
    return reformattedData
}

console.log('REFORMAT', reformatData())


// Get the formatted chord data
export const allChordData = reformatData();

// Extract all unique keys
export const uniqueKeys = [...new Set(allChordData.map(chord => chord.key))].sort();

// Create a lookup table for chords by key
export const chordsByKey = uniqueKeys.reduce((acc, key) => {
    acc[key] = allChordData.filter(chord => chord.key === key);
    return acc;
}, {});

// Create a lookup table for individual chords by ID
export const chordsById = allChordData.reduce((acc, chord) => {
    acc[chord.id] = chord;
    return acc;
}, {});

// Create a lookup table for chords by name (case-insensitive)
export const chordsByName = allChordData.reduce((acc, chord) => {
    const lowerName = chord.name.toLowerCase();
    if (!acc[lowerName]) {
        acc[lowerName] = [];
    }
    acc[lowerName].push(chord);
    return acc;
}, {});

// Helper function to get chords by difficulty level
// This is a simple example - you might define difficulty differently
export const getChordsByDifficulty = (difficulty) => {
    switch (difficulty) {
        case 'beginner':
            return allChordData.filter(chord =>
                chord.notes.split(',').length <= 3);
        case 'intermediate':
            return allChordData.filter(chord =>
                chord.notes.split(',').length === 4);
        case 'advanced':
            return allChordData.filter(chord =>
                chord.notes.split(',').length > 4);
        default:
            return allChordData;
    }
};
