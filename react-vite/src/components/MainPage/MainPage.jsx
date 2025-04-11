import { useEffect, useContext } from "react"
import { PianoProvider } from '../../context/PianoContext';

import Piano from "../Piano/Piano"
import RunMidiUtil from "../../utils/runMidiUtil"
import PianoStaffDisplay from "../Piano/PianoStaffDisplay"
import PianoNotesDisplay from "../Piano/PianoNotesDisplay"
import PianoChordsDisplay from "../Piano/PianoChordsDisplay"
import SwitchDisplay from "../Piano/SwitchDisplay";

import NoteUtil from "../../utils/noteUtil"
import './mainPage.css'


const MainPage = () => {

  console.log(NoteUtil.getEveryChord())

  useEffect(() => {
    RunMidiUtil.setupMidi();
  }, [])

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
          <div id="switch-display-container">
            <SwitchDisplay/>
          </div>
        </div>

      </div>

    </>

  )
}

export default MainPage
