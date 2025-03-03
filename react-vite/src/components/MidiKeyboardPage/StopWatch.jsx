import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setStartTime, selectIsComplete } from '../../redux/spacedRepetition';

const StopWatch = ({ onStart, onStop }) => {
    const [startTime, setStartTimeState] = useState(null);
    const [now, setNow] = useState(null);
    const intervalRef = useRef(null);
    const dispatch = useDispatch();
    const isActive = useSelector(state => state.game.isActive);
    const isComplete = useSelector(selectIsComplete);

    // Automatically stop timer when game becomes inactive
    useEffect(() => {
        if (!isActive && intervalRef.current) {
            handleStopTimer();
        }
    }, [isActive]);

    // Automatically stop timer when challenge is complete
    useEffect(() => {
        if (isComplete && intervalRef.current) {
            handleStopTimer();
        }
    }, [isComplete]);

    function handleStartTimer() {
        // Start the timer
        const currentTime = Date.now();
        setStartTimeState(currentTime);
        setNow(currentTime);

        // Dispatch to Redux for spaced repetition tracking
        dispatch(setStartTime(currentTime));

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            // Update the current time every 10ms
            setNow(Date.now());
        }, 10);

        if (onStart) onStart();
    }

    function handleStopTimer() {
        clearInterval(intervalRef.current);
        setStartTimeState(null);
        setNow(null);

        if (onStop) onStop();
    }

    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    let secondsPassed = 0;
    if (startTime != null && now != null) {
        secondsPassed = (now - startTime) / 1000;
    }

    return (
        <div className="timer-container">
            <h1 className="stopwatch">Time Passed: <span className="timer-value">{secondsPassed.toFixed(3)}</span></h1>
            <div className="button-container">
                <button className="start-lesson-button" onClick={handleStartTimer} disabled={isActive}>
                    Start Challenge
                </button>

            </div>
        </div>
    )
}

export default StopWatch;
