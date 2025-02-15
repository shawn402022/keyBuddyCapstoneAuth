import  { useEffect, useRef } from 'react';
import Vex from 'vexflow';
import './MusicStaff.css';

const MusicStaff = ({ currentNotes }) => {
    const staffRef = useRef(null);

    useEffect(() => {
        if (staffRef.current) {
            staffRef.current.innerHTML = '';
            const VF = Vex.Flow;
            const renderer = new VF.Renderer(staffRef.current, VF.Renderer.Backends.SVG);
            renderer.resize(150, 300);
            const context = renderer.getContext();

            const trebleStave = new VF.Stave(10, 40, 780);
            trebleStave.addClef('treble').setContext(context).draw();

            const bassStave = new VF.Stave(10, 160, 780);
            bassStave.addClef('bass').setContext(context).draw();

            if (currentNotes.length > 0) {
                const processNotes = (notes) => {
                    return notes.map(note => {
                        const [noteName, octave] = note.key.split('/');
                        // Ensure sharp notes are properly formatted for VexFlow
                        return note.isSharp ?
                            `${noteName.replace('#', '')}#/${octave}` :
                            `${noteName}/${octave}`;
                    });
                };

                // Group notes by clef
                const trebleKeys = processNotes(
                    currentNotes.filter(note => parseInt(note.key.split('/')[1]) >= 4)
                );

                const bassKeys = processNotes(
                    currentNotes.filter(note => parseInt(note.key.split('/')[1]) < 4)
                );

                // Create treble notes with accidentals
                const trebleNotes = trebleKeys.length > 0 ? [
                    new VF.StaveNote({
                        clef: "treble",
                        keys: trebleKeys,
                        duration: "w"
                    })
                ] : [];

                // Add accidentals for treble notes
                if (trebleNotes.length > 0) {
                    trebleKeys.forEach((key, index) => {
                        if (key.includes('#')) {
                            trebleNotes[0].addModifier(new VF.Accidental("#"), index);
                        }
                    });
                }

                // Create bass notes with accidentals
                const bassNotes = bassKeys.length > 0 ? [
                    new VF.StaveNote({
                        clef: "bass",
                        keys: bassKeys,
                        duration: "w"
                    })
                ] : [];

                // Add accidentals for bass notes
                if (bassNotes.length > 0) {
                    bassKeys.forEach((key, index) => {
                        if (key.includes('#')) {
                            bassNotes[0].addModifier(new VF.Accidental("#"), index);
                        }
                    });
                }

                // Draw treble notes
                if (trebleNotes.length > 0) {
                    const trebleVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
                    trebleVoice.addTickables(trebleNotes);
                    new VF.Formatter()
                        .joinVoices([trebleVoice])
                        .format([trebleVoice], 780);
                    trebleVoice.draw(context, trebleStave);
                }

                // Draw bass notes
                if (bassNotes.length > 0) {
                    const bassVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
                    bassVoice.addTickables(bassNotes);
                    new VF.Formatter()
                        .joinVoices([bassVoice])
                        .format([bassVoice], 780);
                    bassVoice.draw(context, bassStave);
                }
            }
        }
    }, [currentNotes]);

    return (
        <div className="music-staff-container">
            <div ref={staffRef} className="music-staff"></div>
        </div>
    );
};

export default MusicStaff;
