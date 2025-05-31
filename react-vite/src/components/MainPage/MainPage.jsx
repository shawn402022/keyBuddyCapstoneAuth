import { useState, useEffect } from "react"
import Piano from "../Piano/Piano"
import RunMidiUtil from "../../utils/runMidiUtil"
import PianoStaffDisplay from "../Piano/PianoStaffDisplay"
import PianoNotesDisplay from "../Piano/PianoNotesDisplay"
import PianoChordsDisplay from "../Piano/PianoChordsDisplay"
import { useSelector } from 'react-redux'



import Tester from "./Tester";


import './mainPage.css'


const MainPage = () => {

  const [chords, setChords] = useState([])
  const [activeChord, setActiveChord] = useState(null)

  const contentType = useSelector(state => state.test.contentType)


  useEffect(() => {
    RunMidiUtil.setupMidi();

  }, [])

  useEffect(() => {

    if (contentType) {
      const splitChords = contentType.split(",")
      for (let i = splitChords.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [splitChords[i], splitChords[j]] = [splitChords[j], splitChords[i]]
      }
      setActiveChord(splitChords.shift())
      setChords(splitChords)
    }




  }, [contentType])




  console.log('CHORDDDDSS', chords, activeChord, contentType)
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
          <Tester chord={activeChord} />
          <div>

          </div>

        </div>

      </div>

    </>

  )
}

export default MainPage
