import  { useEffect, useRef } from 'react';
import Vex from 'vexflow';

const MusicStaff = ({ currentNote }) => {
    const staffRef = useRef(null);

    useEffect(() => {
        if (staffRef.current) {
            // Clear previous rendering
            staffRef.current.innerHTML = '';

            // Initialize VexFlow
            const VF = Vex.Flow;
            const renderer = new VF.Renderer(staffRef.current, VF.Renderer.Backends.SVG);

            // Set size of staff
            renderer.resize(600, 200);
            const context = renderer.getContext();

            // Create a stave for treble clef
            const trebleStave = new VF.Stave(10, 0, 580);
            trebleStave.addClef('treble').setContext(context).draw();

            // Create a stave for bass clef
            const bassStave = new VF.Stave(10, 100, 580);
            bassStave.addClef('bass').setContext(context).draw();

            if (currentNote) {
                // Create note based on MIDI input
                const note = new VF.StaveNote({
                    clef: currentNote.octave >= 4 ? "treble" : "bass",
                    keys: [currentNote.key],
                    duration: "q"
                });

                // Create voice and formatter
                const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
                voice.addTickables([note]);

                // Format and draw
                new VF.Formatter()
                    .joinVoices([voice])
                    .format([voice], 580);

                voice.draw(context, currentNote.octave >= 4 ? trebleStave : bassStave);
            }
        }
    }, [currentNote]);

    return (
        <div className="music-staff-container">
            <div ref={staffRef} className="music-staff"></div>
        </div>
    );
};

export default MusicStaff;
