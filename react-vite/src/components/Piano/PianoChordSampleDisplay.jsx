import { usePianoContext } from "../../context/PianoContext"
import { reformatData } from "../Data/ChordData"


import noteUtil from "../../utils/noteUtil"

const PianoChordSampleDisplay = () => {

    console.log('REFORMAT',reformatData())

    console.log(noteUtil.getEveryChord())
    return (
        <div>

        </div>
    )
}

export default PianoChordSampleDisplay
