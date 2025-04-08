import { useEffect, useContext } from "react"
import Piano from "../Piano/Piano"
import RunMidiUtil from "../../utils/runMidiUtil"
import PianoStaffDisplay from "../Piano/PianoStaffDisplay"
import PianoChordsDisplay from "../Piano/PianoChordsDisplay"
import './mainPage.css'




const MainPage = () => {


  useEffect(() => {
    RunMidiUtil.setupMidi();
  }, [])

  return (
    <>
      <div className='piano-display'>
        <Piano />
      </div>
      <div className='chord-staff-container'>
        <PianoStaffDisplay />
        <PianoChordsDisplay/>

      </div>
    </>

  )
}

export default MainPage
