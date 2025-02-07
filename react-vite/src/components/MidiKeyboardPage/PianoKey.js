export class PianoKey {
    constructor(utils, keyImages) {
        this.utils = utils;
        this.keyImages = keyImages;
    }

    createKey(note, keyType, width, height, position) {
        const keyGroup = this.utils.createSVGElement('g');
        const keyObject = this.createKeyObject(note, keyType, width, height, position);
        const keyObjectPressed = this.createKeyObjectPressed(note, keyType, width, height, position);

        keyGroup.appendChild(keyObject);
        keyGroup.appendChild(keyObjectPressed);

        return keyGroup;
    }
}
