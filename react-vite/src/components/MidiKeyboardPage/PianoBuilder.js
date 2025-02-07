import { PIANO_CONFIG } from './config';

export class PianoBuilder {
    constructor(utils, keyImages) {
        this.utils = utils;
        this.keyImages = keyImages;
    }

    createPiano(containerElement) {
        const whiteKeyWidth = 80;
        const pianoHeight = 400;
        let blackKeyPositionX = 60;

        const naturalNotes = this.utils.getNaturalNotes(PIANO_CONFIG.chromaticNotes);
        const pianoWidth = naturalNotes.length * whiteKeyWidth;

        const piano = this.utils.createMainSVG(pianoWidth, pianoHeight, "piano");

        // Create white keys
        PIANO_CONFIG.chromaticNotes.forEach((note, i) => {
            const whiteKey = this.createWhiteKey(note, i, whiteKeyWidth, pianoHeight);
            piano.appendChild(whiteKey);
        });

        // Create black keys
        PIANO_CONFIG.sharpNotes.forEach((note, i) => {
            const blackKey = this.createBlackKey(note, i, whiteKeyWidth, pianoHeight, blackKeyPositionX);
            piano.appendChild(blackKey);
            blackKeyPositionX = this.calculateNextBlackKeyPosition(note, blackKeyPositionX, whiteKeyWidth);
        });

        containerElement.appendChild(piano);
        return piano;
    }

    createWhiteKey(note, index, width, height) {
        const keyGroup = this.utils.createSVGElement('g');
        const keyObject = this.utils.createSVGElement("foreignObject");
        const keyImage = this.utils.createKeyImage(this.keyImages.releasedNatural[index]);

        this.utils.setAttributes(keyObject, {
            "class": "white-key",
            "width": width,
            "height": height,
            "x": width * index,
            "data-id": note
        });

        keyObject.appendChild(keyImage);
        keyGroup.appendChild(keyObject);
        return keyGroup;
    }

    createBlackKey(note, index, whiteKeyWidth, height, positionX) {
        const keyGroup = this.utils.createSVGElement('g');
        const keyObject = this.utils.createSVGElement("foreignObject");
        const keyImage = this.utils.createKeyImage(this.keyImages.releasedSharp[index]);

        this.utils.setAttributes(keyObject, {
            "class": "black-key",
            "width": whiteKeyWidth / 2,
            "height": height / 1.6,
            "x": positionX,
            "data-id": note
        });

        keyObject.appendChild(keyImage);
        keyGroup.appendChild(keyObject);
        return keyGroup;
    }

    calculateNextBlackKeyPosition(note, currentPosition, whiteKeyWidth) {
        return note[0] === "D" || note[0] === "A"
            ? currentPosition + whiteKeyWidth * 2
            : currentPosition + whiteKeyWidth;
    }
}
