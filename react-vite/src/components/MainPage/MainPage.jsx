import { useEffect, useContext } from "react"
import Piano from "../Piano/Piano"
import RunMidiUtil from "../../utils/runMidiUtil"


const MainPage = () => {

  
  useEffect(() => {
    RunMidiUtil.setupMidi();
  }, [])

  return (
    <div>
        <Piano

        />
    </div>
  )
}

export default MainPage
