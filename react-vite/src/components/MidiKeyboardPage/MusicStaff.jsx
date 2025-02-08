import  { useEffect, useRef } from 'react';
import Vex from 'vexflow';

const MusicStaff = ({ currentNotes }) => {
    const staffRef = useRef(null);

    useEffect(() => {
        if (staffRef.current) {
            staffRef.current.innerHTML = '';
            const VF = Vex.Flow;
            const renderer = new VF.Renderer(staffRef.current, VF.Renderer.Backends.SVG);
            renderer.resize(600, 200);
            const context = renderer.getContext();

            const trebleStave = new VF.Stave(10, 0, 580);
            trebleStave.addClef('treble').setContext(context).draw();

            const bassStave = new VF.Stave(10, 100, 580);
            bassStave.addClef('bass').setContext(context).draw();

            if (currentNotes.length > 0) {
                // Group notes by clef
                const trebleNotes = currentNotes
                    .filter(note => note.octave >= 4)
                    .map(note => new VF.StaveNote({
                        clef: "treble",
                        keys: [note.key],
                        duration: "q"
                    }));

                const bassNotes = currentNotes
                    .filter(note => note.octave < 4)
                    .map(note => new VF.StaveNote({
                        clef: "bass",
                        keys: [note.key],
                        duration: "q"
                    }));

                // Create and draw treble voice if there are treble notes
                if (trebleNotes.length > 0) {
                    const trebleVoice = new VF.Voice({ num_beats: trebleNotes.length, beat_value: 4 });
                    trebleVoice.addTickables(trebleNotes);
                    new VF.Formatter()
                        .joinVoices([trebleVoice])
                        .format([trebleVoice], 580);
                    trebleVoice.draw(context, trebleStave);
                }

                // Create and draw bass voice if there are bass notes
                if (bassNotes.length > 0) {
                    const bassVoice = new VF.Voice({ num_beats: bassNotes.length, beat_value: 4 });
                    bassVoice.addTickables(bassNotes);
                    new VF.Formatter()
                        .joinVoices([bassVoice])
                        .format([bassVoice], 580);
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
