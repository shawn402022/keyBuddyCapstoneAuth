// scripts/generate-chord-images.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { reformatData } = require('../src/components/Data/ChordData');

// Create a virtual DOM environment for piano-chart to work in
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock the canvas functionality since we're in Node
global.HTMLCanvasElement.prototype.getContext = function() {
  return {
    fillRect: function() {},
    clearRect: function() {},
    getImageData: function() {
      return {
        data: new Array(4)
      };
    },
    putImageData: function() {},
    createImageData: function() { return []; },
    setTransform: function() {},
    drawImage: function() {},
    save: function() {},
    restore: function() {},
    beginPath: function() {},
    moveTo: function() {},
    lineTo: function() {},
    closePath: function() {},
    stroke: function() {},
    translate: function() {},
    scale: function() {},
    rotate: function() {},
    arc: function() {},
    fill: function() {},
  };
};

// Import the piano-chart library after setting up the DOM environment
const { Instrument } = require('piano-chart');

async function generateChordImages() {
    console.log('Starting chord image generation...');

    // Get all chord data
    const allChords = reformatData();
    console.log(`Found ${allChords.length} chords to process`);

    // Create output directories
    const outputDir = path.resolve(__dirname, '../src/assets/chord-images');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Map to store image paths
    const chordImageMap = {};

    // Create a container for the piano
    const container = document.createElement('div');
    container.style.width = '500px';
    container.style.height = '180px';
    document.body.appendChild(container);

    // Process each chord
    for (let i = 0; i < allChords.length; i++) {
        const chord = allChords[i];
        console.log(`Processing chord ${i+1}/${allChords.length}: ${chord.name}`);

        try {
            // Create piano instance with consistent settings
            const piano = new Instrument(container, {
                startOctave: 3,
                endOctave: 5,
                whiteKeyWidth: 40,
                blackKeyWidth: 20,
                blackKeyHeight: 100,
                keyPressStyle:'vivid',

            });

            piano.create();

            // Process notes to ensure consistent octave handling
            const noteArray = chord.notes.split(',').map(note => note.trim());
            const processedNotes = noteArray.map(note => {
                // Extract the note name without octave
                const noteName = note.replace(/\d+$/, '');

                // Determine the best octave to display this note
                let octave = 4; // Default to middle octave

                // If the note already has an octave specified, try to use it if in range
                const octaveMatch = note.match(/\d+$/);
                if (octaveMatch) {
                    const specifiedOctave = parseInt(octaveMatch[0]);
                    // Keep the octave within our visible range
                    if (specifiedOctave >= 3 && specifiedOctave <= 5) {
                        octave = specifiedOctave;
                    }
                }

                return `${noteName}${octave}`;
            });

            // Press all the keys
            processedNotes.forEach(note => {
                try {
                    piano.keyDown(note);
                } catch (error) {
                    console.warn(`Failed to press key ${note}:`, error);
                }
            });

            // Wait for rendering to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            // Rasterize the piano
            const dataUrl = await new Promise(resolve => {
                piano.rasterize(resolve, `${chord.notes} - ${chord.id}`);
            });

            // Save as file
            const imageFileName = `chord-${chord.id}.png`;
            const imagePath = path.join(outputDir, imageFileName);

            // Convert data URL to buffer and save
            const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(imagePath, buffer);

            // Store the relative path in the map
            chordImageMap[chord.id] = `/assets/chord-images/${imageFileName}`;

            // Clean up
            container.innerHTML = '';
        } catch (error) {
            console.error(`Error processing chord ${chord.name}:`, error);
        }
    }

    // Save the image map as JSON
    const mapPath = path.join(outputDir, '../chord-images-map.json');
    fs.writeFileSync(mapPath, JSON.stringify(chordImageMap, null, 2));

    console.log(`Generated ${Object.keys(chordImageMap).length} chord images`);
    console.log(`Image map saved to ${mapPath}`);

    // Clean up
    document.body.removeChild(container);
}

// Run the generation
generateChordImages().catch(error => {
    console.error('Error generating chord images:', error);
    process.exit(1);
});
