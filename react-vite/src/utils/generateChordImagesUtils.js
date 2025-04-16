// This could be a separate utility script that runs during build time

import fs from 'fs';
import path from 'path';
import { reformatData } from '../data/chord-data.js';
import { Instrument } from 'piano-chart';


const generateChordImages = async () => {
    const allChords = reformatData();
    const chordImages = {};

    // Create a hidden container for piano rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '500px';
    container.style.height = '180px';
    document.body.appendChild(container);

    // Process each chord
    for (const chord of allChords) {
        // Create piano instance
        const piano = new Instrument(container, {
            startOctave: 3,
            endOctave: 5,
            // Other settings...
        });

        piano.create();

        // Process and press notes
        const noteArray = chord.notes.split(',').map(note => note.trim());
        // Process notes and press keys...

        // Rasterize and store
        const dataUrl = await new Promise(resolve => {
            piano.rasterize(resolve, `${chord.notes} - ${chord.id}`);
        });

        chordImages[chord.id] = dataUrl;

        // Clean up
        container.innerHTML = '';
    }

    document.body.removeChild(container);

    // Export as JSON
    const outputDir = path.resolve(__dirname, '../assets');
    const outputPath = path.join(outputDir, 'chord-images.json');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the JSON file
    fs.writeFileSync(outputPath, JSON.stringify(chordImages, null, 2));

    console.log(`Chord images JSON saved to: ${outputPath}`);


    // Save to file or export as JSON
    return chordImages;

};

// The result could be saved as a JSON file with data URLs
// or as individual image files that are bundled with your application
export default generateChordImages;
