import { useEffect } from "react"
import { PianoProvider } from "../../context/PianoContext"
import RunMidiUtil from "../../utils/runMidiUtil"
import PianoStaffDisplayMain from "../Piano/PianoStaffDisplayMain"
import PianoChordsDisplay from "../Piano/PianoChordsDisplay"
import PianoNotesDisplay from "../Piano/PianoNotesDisplay"
import Piano from "../Piano/Piano"
import './testPage.css'




const TestPage = () => {
    return (
        <div id='main-page-container-main'>
            <div id='piano-display-container-main'>
                <Piano/>
            </div>
            <div id='feedback-display-container-main'>
                <PianoStaffDisplayMain/>
            </div>
            <div className='chord-note-container'>
                <PianoNotesDisplay />
                <PianoChordsDisplay />
            </div>


        </div>
    )
}

export default TestPage
