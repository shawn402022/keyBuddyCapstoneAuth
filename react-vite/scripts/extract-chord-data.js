import { Key } from 'tonal';
import fs from 'fs';

const keyNames = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    'Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'
];

const extractedData = [];

// Extract major keys
keyNames.forEach(keyName => {
    const majorKey = Key.majorKey(keyName);
    extractedData.push({
        name: `${keyName.replace('#', 's').replace('b', 'b')}Major`,
        key: majorKey
    });
});

// Extract minor keys
keyNames.forEach(keyName => {
    const minorKey = Key.minorKey(keyName);
    extractedData.push({
        name: `${keyName.replace('#', 's').replace('b', 'b')}Minor`,
        key: minorKey
    });
});

// Convert to string and write to file
const fileContent = `// Auto-generated chord data
const keys = ${JSON.stringify(extractedData, null, 2)};

export default keys;
`;

fs.writeFileSync('react-vite/src/data/chord-data-extracted.js', fileContent);
console.log('Chord data extracted and saved!');
