    import { useEffect, useRef } from 'react'
    import { PIANO_CONFIG } from './config'
    import { PianoBuilder } from './PianoBuilder'
    import Utilities from './utilities.js'
    import KeyImages from './images.js'
    import { PianoEvents } from './PianoEvents'

    const PianoContainer = ({ soundManager, noteLabelManager, setCurrentNotes }) => {
      const containerRef = useRef(null)
      const pianoBuilderRef = useRef(null)
      const utilsRef = useRef(new Utilities())
      const keyImagesRef = useRef(new KeyImages())
      const pianoEventsRef = useRef(null)

      useEffect(() => {
        // Initialize piano events with the current sound manager and note label manager
        if (soundManager && noteLabelManager) {
          pianoEventsRef.current = new PianoEvents(soundManager, noteLabelManager)

          // Set the callback for notes
          if (setCurrentNotes) {
            pianoEventsRef.current.setNotesCallback = setCurrentNotes
          }

          // Initialize the piano builder
          pianoBuilderRef.current = new PianoBuilder(
            utilsRef.current,
            keyImagesRef.current,
            pianoEventsRef.current
          )

          // Create the piano when the container is available
          if (containerRef.current) {
            console.log("Creating piano in container:", containerRef.current)

            // Clear any existing content
            containerRef.current.innerHTML = ''

            // Create the piano
            const piano = pianoBuilderRef.current.createPiano(containerRef.current)
            console.log("Piano created:", piano)
          }
        }
      }, [soundManager, noteLabelManager, setCurrentNotes])

      return (
        <div
          id="piano-container"
          ref={containerRef}
          style={{
            width: '100%',
            minHeight: '400px',
            position: 'relative',
            border: '1px solid #ccc',
            marginTop: '20px'
          }}
        >
          <img
            className="scales"
            src="/images/background-scales-lighter.png"
            alt="KBuddy logo"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0
            }}
          />
        </div>
      )
    }

    export default PianoContainer
