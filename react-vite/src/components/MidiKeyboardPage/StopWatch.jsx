import {useState, useRef} from 'react'

const StopWatch = () => {
    const [startTime, setStartTime] = useState(null);
    const [now, setNow] = useState(null);
    const intervalRef = useRef(null);

    function handleStartTimer() {
        //Start the timer
        setStartTime(Date.now());
        setNow(Date.now());

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            //Update teh current time every 10ms
            setNow(Date.now());
        }, 10)
    }

    function handleStopTimer() {

        clearInterval(intervalRef.current)
        setStartTime(null)
        setNow(null);
    }

    let secondsPassed= 0;
    if (startTime != null && now != null){
        secondsPassed = (now-startTime)/1000;
    }

    return (
        <div className="timer-container">
        <h1 className="stopwatch">Time Passed: <span className="timer-value">{secondsPassed.toFixed(3)}</span></h1>
        <div className="button-container">
                <button className="start-lesson-button" onClick={handleStartTimer}>
                Start Challenge
                </button>
                <button className="stop-lesson-button" onClick={handleStopTimer}>
                Stop Challenge
                </button>
            </div>

        </div>
    )
}

export default StopWatch;
