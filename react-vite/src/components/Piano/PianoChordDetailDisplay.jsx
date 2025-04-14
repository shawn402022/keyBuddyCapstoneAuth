import { reformatData } from "../Data/ChordData"
import noteUtil from "../../utils/noteUtil"

const PianoChordDetailDisplay = ({id,key,name,notes}) => {
    console.log('REFORMAT',reformatData())

    console.log(noteUtil.getEveryChord())

    return (
        <div>

        </div>
    )
}

export default PianoChordDetailDisplay
