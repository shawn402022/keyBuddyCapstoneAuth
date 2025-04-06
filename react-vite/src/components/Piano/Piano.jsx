import { Instrument } from "piano-chart";
import { useEffect, useRef } from "react";

const Piano = () => {
    const pianoContainerRef = useRef(null);
    const pianoRef = useRef(null);

    useEffect(() => {
        if (pianoContainerRef.current && !pianoRef.current) {
            pianoRef.current = new Instrument(pianoContainerRef.current, {
                startOctave: 1,
                endOctave: 8,
                showNoteNames:'always',

                highlightedNotes: ["D", "E", "F#", "G", "A", "B", "C#"],
                specialHighlightedNotes: [{ note: "D" }],
                keyPressStyle:'vivid',
                vividKeyPressColor: 'rgb(255, 255, 0)',
              }
            );
            pianoRef.current.create()
        }
    },[])

    return (
        <div ref={pianoContainerRef} id="pianoContainer">
            {/* The piano will be rendered here */}
        </div>
    )
}

export default Piano
