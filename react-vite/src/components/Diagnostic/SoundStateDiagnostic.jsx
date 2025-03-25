// Create a new file: SoundStateDiagnostic.jsx
import React from 'react';

const SoundStateDiagnostic = ({ soundManager, activeNotes }) => {
    if (!soundManager) return null;

    return (
        <div className="sound-state-diagnostic">
            <h4>Sound State Diagnostic</h4>
            <div>
                <strong>Active Notes in SoundManager:</strong>
                <ul>
                    {soundManager.getActiveNotes ?
                        soundManager.getActiveNotes().map(note => (
                            <li key={note}>{note}</li>
                        )) :
                        <li>getActiveNotes method not available</li>
                    }
                </ul>
            </div>
            <div>
                <strong>Active Notes in Component State:</strong>
                <ul>
                    {activeNotes && activeNotes.map(note => (
                        <li key={note.id || note.key || Math.random()}>
                            {note.id || note.key || JSON.stringify(note)}
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => soundManager.setDebug && soundManager.setDebug(!soundManager.debug)}
            >
                Toggle Debug Logging
            </button>
            <button
                onClick={() => soundManager.stopAllSounds && soundManager.stopAllSounds()}
            >
                Stop All Sounds
            </button>
        </div>
    );
};

export default SoundStateDiagnostic;
