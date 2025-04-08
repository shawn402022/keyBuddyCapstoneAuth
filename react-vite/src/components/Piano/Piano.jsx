import { Instrument } from "piano-chart";
import { useEffect, useRef } from "react";
import RunMidiUtil from "../../utils/runMidiUtil";

const Piano = () => {
    const pianoContainerRef = useRef(null);
    const pianoRef = useRef(null);

    useEffect(() => {
        if (pianoContainerRef.current && !pianoRef.current) {
            pianoRef.current = new Instrument(pianoContainerRef.current, {
                startOctave: 1,
                endOctave: 8,
                showNoteNames: 'always',

                highlightedNotes: ["D", "E", "F#", "G", "A", "B", "C#"],
                specialHighlightedNotes: [{ note: "D" }],
                keyPressStyle: 'vivid',
                vividKeyPressColor: 'rgb(255, 255, 0)',
            });

            pianoRef.current.create()
        }

        //Register listeners for MIDI note events
        const handleNoteOn = (note) => {
            if(pianoRef.current) {
                //convert Note format if needed
                const formattedNote = note.replace('s', '#');
                console.log(`Piano highlighting note: ${formattedNote}`);
                pianoRef.current.keyDown(formattedNote)
            }
        };

        const handleNoteOff = (note) => {
            if(pianoRef.current) {
                //convert Note format if needed
                const formattedNote = note.replace('s', '#');
                console.log(`Piano releasing note: ${formattedNote}`);
                pianoRef.current.keyUp(formattedNote)
            }
        };

        //Add listeners to the MIDI utility
        RunMidiUtil.addNoteOnListener(handleNoteOn);
        RunMidiUtil.addNoteOffListener(handleNoteOff)

        //Initialize MIDI
        RunMidiUtil.setupMidi();

        //Cleanup function
        return () => {
            //pianoRef.current.destroy();
        }

    }, [])

    return (

        <div ref={pianoContainerRef} id="pianoContainer">
            {/* The piano will be rendered here */}
        </div>


    )
}

export default Piano
