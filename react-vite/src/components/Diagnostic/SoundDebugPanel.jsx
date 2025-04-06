import "./Diagnostic.css"
// Add this component to your project
const SoundDebugPanel = ({ soundManager }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [activeNotes, setActiveNotes] = useState([]);

    // Update the debug data periodically
    useEffect(() => {
        if (!isOpen || !soundManager) return;

        const updateInterval = setInterval(() => {
            // Get monitor events
            if (soundManager.monitor) {
                setEvents(soundManager.monitor.getEvents());
            }

            // Get active notes
            if (soundManager.getActiveNotes) {
                setActiveNotes(soundManager.getActiveNotes());
            } else if (soundManager.activeNotes) {
                setActiveNotes(Array.from(soundManager.activeNotes.values()));
            }
        }, 500);

        return () => clearInterval(updateInterval);
    }, [isOpen, soundManager]);

    if (!isOpen) {
        return (
            <button
                className="debug-toggle-button"
                onClick={() => setIsOpen(true)}
            >
                🔍 Debug Audio
            </button>
        );
    }

    return (
        <div className="sound-debug-panel">
            <div className="debug-header">
                <h3>Sound Debug Panel</h3>
                <button onClick={() => setIsOpen(false)}>Close</button>
            </div>

            <div className="debug-actions">
                <button onClick={() => soundManager?.forceStopAllHowlSounds?.()}>
                    Force Stop All Sounds
                </button>
                <button onClick={() => soundManager?.resetBrowserAudio?.()}>
                    Reset Browser Audio
                </button>
                <button onClick={() => soundManager?.monitor?.clearEvents()}>
                    Clear Event Log
                </button>
                <button onClick={() => soundManager?.initializeFallbackSystem?.()}>
                    Switch to Fallback System
                </button>
            </div>

            <div className="debug-active-notes">
                <h4>Active Notes ({activeNotes.length})</h4>
                <ul>
                    {activeNotes.map((note, index) => (
                        <li key={index}>
                            {note.note || note.key} - Volume: {note.velocity || 'N/A'},
                            Time: {note.timestamp ? new Date(note.timestamp).toLocaleTimeString() : 'N/A'}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="debug-events">
                <h4>Recent Events ({events.length})</h4>
                <ul>
                    {events.map((event, index) => (
                        <li key={index} className={`event-${event.type}`}>
                            [{new Date(event.timestamp).toLocaleTimeString()}]
                            {event.type}: {event.noteId}
                            {event.details && Object.keys(event.details).length > 0 &&
                                ` (${Object.entries(event.details).map(([k, v]) => `${k}: ${v}`).join(', ')})`
                            }
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
};

export default SoundDebugPanel;
