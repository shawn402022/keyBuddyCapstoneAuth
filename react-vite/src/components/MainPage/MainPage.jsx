import { useEffect, useContext } from "react"
import { PianoProvider } from '../../context/PianoContext';
import Piano from "../Piano/Piano"
import RunMidiUtil from "../../utils/runMidiUtil"
import PianoStaffDisplay from "../Piano/PianoStaffDisplay"
import PianoNotesDisplay from "../Piano/PianoNotesDisplay"
import PianoChordsDisplay from "../Piano/PianoChordsDisplay"
import Tester from "./Tester";


import './mainPage.css'


const MainPage = () => {



  useEffect(() => {
    RunMidiUtil.setupMidi();
  }, [])

  window.formatChordData = function() {
    return reformatData();
  };

  return (
    <>
      <div id='main-page-container'>
        <div id='piano-display-container'>
          <Piano />
        </div>
        <div id='feedback-display-container'>
          <div className='staff-display-container'>
            <PianoStaffDisplay />
          </div>
          <div className='chord-note-container'>
            <PianoNotesDisplay />
            <PianoChordsDisplay />
          </div>
          <Tester/>
          <div>

          </div>

        </div>

      </div>

    </>

  )
}

export default MainPage
