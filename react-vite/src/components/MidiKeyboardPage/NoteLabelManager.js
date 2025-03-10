export class NoteLabelManager {
    createNoteLabel(noteId, keyElement) {
        const noteLabel = document.createElement('div');
        noteLabel.id = `note-label-${noteId}`;
        this.setLabelStyles(noteLabel, keyElement);
        this.updateLabelText(noteLabel, noteId);
        document.body.appendChild(noteLabel);
        return noteLabel;
    }

    setLabelStyles(noteLabel, keyElement) {
        const rect = keyElement.getBoundingClientRect();
        const isNaturalKey = keyElement.classList.contains('white-key');
        Object.assign(noteLabel.style, {
            position: 'fixed',
            textAlign: 'center',
            width: '25px',
            height: '25px',
            color: 'maroon',
            fontSize: '15px',
            backgroundColor: 'white',
            padding: '0',
            margin: '0',
            lineHeight: '25px',
            borderRadius: '3px',
            border: '1px solid black',
            left: `${rect.left + (rect.width / 2) - 12.5}px`,
            top: isNaturalKey
                ? `${rect.top - 27}px`  // Natural keys: label      appears above the key
                : `${rect.bottom + 2}px` // Sharp keys: label   appears below the key
        });
    }

    updateLabelText(noteLabel, noteId) {
        // Display the full noteId which includes both note name and octave
        noteLabel.textContent = noteId;
    }
}
