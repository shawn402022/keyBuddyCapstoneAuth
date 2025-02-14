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
            renderer.resize(150, 300);  // Increased width and height
            const context = renderer.getContext();

            // Draw the staves
            const trebleStave = new VF.Stave(10, 40, 780);  // Increased width, adjusted y-position
            trebleStave.addClef('treble').setContext(context).draw();

            const bassStave = new VF.Stave(10, 160, 780);  // Increased width, adjusted y-position
            bassStave.addClef('bass').setContext(context).draw();

            if (currentNotes.length > 0) {
                // Group notes by clef
                const trebleKeys = currentNotes
                    .filter(note => note.octave >= 4)
                    .map(note => note.key);

                const bassKeys = currentNotes
                    .filter(note => note.octave < 4)
                    .map(note => note.key);

                // Create chord notes
                const trebleNotes = trebleKeys.length > 0 ? [
                    new VF.StaveNote({
                        clef: "treble",
                        keys: trebleKeys,
                        duration: "w"  // whole note duration
                    })
                ] : [];

                const bassNotes = bassKeys.length > 0 ? [
                    new VF.StaveNote({
                        clef: "bass",
                        keys: bassKeys,
                        duration: "w"  // whole note duration
                    })
                ] : [];

                // Draw treble notes
                if (trebleNotes.length > 0) {
                    const trebleVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
                    trebleVoice.addTickables(trebleNotes);
                    new VF.Formatter()
                        .joinVoices([trebleVoice])
                        .format([trebleVoice], 780);  // Match stave width
                    trebleVoice.draw(context, trebleStave);
                }

                // Draw bass notes
                if (bassNotes.length > 0) {
                    const bassVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
                    bassVoice.addTickables(bassNotes);
                    new VF.Formatter()
                        .joinVoices([bassVoice])
                        .format([bassVoice], 780);  // Match stave width
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
