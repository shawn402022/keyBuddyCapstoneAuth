    import { useEffect, useRef } from 'react'

    const PianoContainer = () => {
      const containerRef = useRef(null)

      useEffect(() => {
        // Log when the container is mounted
        if (containerRef.current) {
          console.log("Piano container mounted:", containerRef.current)
        }
      }, [])

      return (
        <div
          id="piano-container"
          ref={containerRef}
          style={{
            width: '100%',
            minHeight: '400px',
            position: 'relative',
            border: '1px solid #ccc', // Temporary border to see the container
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
          {/* The piano SVG will be inserted here */}
        </div>
      )
    }

    export default PianoContainer
