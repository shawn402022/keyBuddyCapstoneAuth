import { PIANO_CONFIG } from './config';

export class PianoBuilder {
    constructor(utils, keyImages, pianoEvents) {
        this.utils = utils;
        this.keyImages = keyImages;
        this.pianoEvents = pianoEvents;
    }
    createPiano(containerElement) {
        const whiteKeyWidth = 80;
        const pianoHeight = 400;
        let blackKeyPositionX = 60;

        const naturalNotes = this.utils.getNaturalNotes(PIANO_CONFIG.chromaticNotes);
        const pianoWidth = naturalNotes.length * whiteKeyWidth;

        const piano = this.utils.createMainSVG(pianoWidth, pianoHeight, "piano");

        // Create white keys with event listeners
        PIANO_CONFIG.chromaticNotes.forEach((note, i) => {
            const whiteKey = this.createWhiteKey(note, i, whiteKeyWidth, pianoHeight);
            piano.appendChild(whiteKey);
            const keyElement = whiteKey.querySelector(`[data-id="${note}"]`);
            if (keyElement) {
                this.pianoEvents.setupKeyEvents(keyElement, note);
            }
        });

        // Create black keys with event listeners
        PIANO_CONFIG.sharpNotes.forEach((note, i) => {
            const blackKey = this.createBlackKey(note, i, whiteKeyWidth, pianoHeight, blackKeyPositionX);
            piano.appendChild(blackKey);
            const keyElement = blackKey.querySelector(`[data-id="${note}"]`);
            if (keyElement) {
                this.pianoEvents.setupKeyEvents(keyElement, note);
            }
            blackKeyPositionX = this.calculateNextBlackKeyPosition(note, blackKeyPositionX, whiteKeyWidth);
        });

        containerElement.appendChild(piano);
        return piano;
    }
    createWhiteKey(note, index, width, height) {
        const keyGroup = this.utils.createSVGElement('g');

        // Create regular key
        const keyObject = this.utils.createSVGElement("foreignObject");
        const keyImage = this.utils.createKeyImage(this.keyImages.releasedNatural[index]);

        // Create pressed state key
        const pressedKeyObject = this.utils.createSVGElement("foreignObject");
        const pressedKeyImage = this.utils.createKeyImage(this.keyImages.pressedNatural[index]);

        this.utils.setAttributes(keyObject, {
            "class": "white-key",
            "width": width,
            "height": height,
            "x": width * index,
            "data-id": note
        });

        this.utils.setAttributes(pressedKeyObject, {
            "class": "white-key-pressed",
            "width": width,
            "height": height,
            "x": width * index,
            "id": `${note}-pressed`,
            "style": "visibility: hidden"
        });

        keyObject.appendChild(keyImage);
        pressedKeyObject.appendChild(pressedKeyImage);
        keyGroup.appendChild(keyObject);
        keyGroup.appendChild(pressedKeyObject);
        return keyGroup;
    }

    createBlackKey(note, index, whiteKeyWidth, height, positionX) {
        const keyGroup = this.utils.createSVGElement('g');

        // Create regular key
        const keyObject = this.utils.createSVGElement("foreignObject");
        const keyImage = this.utils.createKeyImage(this.keyImages.releasedSharp[index]);

        // Create pressed state key
        const pressedKeyObject = this.utils.createSVGElement("foreignObject");
        const pressedKeyImage = this.utils.createKeyImage(this.keyImages.pressedSharp[index]);

        this.utils.setAttributes(keyObject, {
            "class": "black-key",
            "width": whiteKeyWidth / 2,
            "height": height / 1.6,
            "x": positionX,
            "data-id": note
        });

        this.utils.setAttributes(pressedKeyObject, {
            "class": "black-key-pressed",
            "width": whiteKeyWidth / 2,
            "height": height / 1.6,
            "x": positionX,
            "id": `${note}-pressed`,
            "style": "visibility: hidden"
        });

        keyObject.appendChild(keyImage);
        pressedKeyObject.appendChild(pressedKeyImage);
        keyGroup.appendChild(keyObject);
        keyGroup.appendChild(pressedKeyObject);
        return keyGroup;
    }
    calculateNextBlackKeyPosition(note, currentPosition, whiteKeyWidth) {
        return note[0] === "D" || note[0] === "A"
            ? currentPosition + whiteKeyWidth * 2
            : currentPosition + whiteKeyWidth;
    }
}
