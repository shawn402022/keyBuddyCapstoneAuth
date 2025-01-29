import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";
import { thunkLogout } from "../../redux/session";
import ReviewButton from "./ReviewButton";
import { WebMidi } from "webmidi";
import SoundModule from '../SoundModule/SoundModule';

import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const [message, setMessage] = useState("");
  const [targetKey, setTargetKey] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMouseDownRef = useRef(false);

  const generateNewChallenge = useCallback(() => {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const octaves = ['2', '3', '4', '5', '6', '7'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomOctave = octaves[Math.floor(Math.random() * octaves.length)];
    const fullNote = `${randomKey}${randomOctave}`;
    setTargetKey(fullNote);
    setMessage(`Please play ${fullNote} on the piano`);
    setFeedback("");

    setTimeout(() => {
      SoundModule.playNote(fullNote);
    }, 200);
  }, []);

  const checkNote = useCallback((playedNote) => {
    if (!isGameActive) return;

    if (playedNote === targetKey) {
      setFeedback("Correct! Here's your next challenge!");
      //Play the succes sound if you have one.
      setTimeout(generateNewChallenge, 1000);
    } else {
      setFeedback(`Incorrect! Try again. You played ${playedNote}`);
    }
  }, [isGameActive, targetKey, generateNewChallenge]);

  // Make sure this checkNote function is being called in both MIDI and mouse handlers
useEffect(() => {
  if (isGameActive) {
    const setupMidi = async () => {
      try {
        await WebMidi.enable();
        const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");
        if (myInput) {
          myInput.addListener("noteon", (e) => {
            checkNote(e.note.identifier); // This will trigger the feedback
          });
        }
      } catch (err) {
        console.log("MIDI device not found or WebMidi not supported");
      }
    };
    setupMidi();
  }
}, [isGameActive, checkNote]);



  const handleNotePlay = (note) => {
    SoundModule.playNote(note);
    updateKeyImage(note, true);
    setTimeout(() => updateKeyImage(note, false), 200);
    if (isGameActive) {
      checkNote(note);
    }
  };

  const updateKeyImage = (note, isPressed) => {
    const keyElement = document.getElementById(`${note}-${isPressed ? 'pressed' : 'released'}`);
    const oppositeKeyElement = document.getElementById(`${note}-${isPressed ? 'released' : 'pressed'}`);

    if (keyElement && oppositeKeyElement) {
      keyElement.style.visibility = 'visible';
      oppositeKeyElement.style.visibility = 'hidden';
    }
  };

  useEffect(() => {
    const setupMidi = async () => {
      try {
        await WebMidi.enable();
        const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");
        if (myInput) {
          myInput.addListener("noteon", (e) => {
            handleNotePlay(e.note.identifier);
          });
        }
      } catch (err) {
        console.log("MIDI device not found or WebMidi not supported");
      }
    };

    const handleMousePress = (e) => {
      const pressedNote = e.target.getAttribute('data-id');
      if (pressedNote) {
        handleNotePlay(pressedNote);
      }
    };

    document.addEventListener('mousedown', () => {
      isMouseDownRef.current = true;
    });

    document.addEventListener('mouseup', () => {
      isMouseDownRef.current = false;
    });

    setupMidi();

    const pianoKeys = document.querySelectorAll('.white-key img, .black-key img');
    pianoKeys.forEach(key => key.addEventListener('mousedown', handleMousePress));

    return () => {
      pianoKeys.forEach(key => key.removeEventListener('mousedown', handleMousePress));
      document.removeEventListener('mousedown', () => {
        isMouseDownRef.current = true;
      });
      document.removeEventListener('mouseup', () => {
        isMouseDownRef.current = false;
      });
      WebMidi.disable();
    };
  }, []);

  const startKeyChallenge = () => {
    setIsGameActive(true);
    generateNewChallenge();
  };

  const stopKeyChallenge = () => {
    setIsGameActive(false);
    setMessage("");
    setFeedback("");
    setTargetKey("");
  };

  const handleLogout = () => {
    dispatch(thunkLogout()).then(() => {
      navigate('/');
    });
  };

  const handleProtectedAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sessionUser) {
      alert("Please login to access this feature");
      return false;
    }
    return true;
  };

  return (
    <div>
      <ul className="nav">
        <li>
          <NavLink to="/"><p className="home-icon">Home</p></NavLink>
        </li>
        {sessionUser ? (
          <>
            <li>
              <CourseButton />
            </li>
            <li>
              <ReviewButton />
            </li>
            <li>
              {!isGameActive ? (
                <button className='start-challenge' onClick={startKeyChallenge}>
                  Start Key Challenge
                </button>
              ) : (
                <button className='stop-challenge' onClick={stopKeyChallenge}>Stop Key Challenge</button>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <div onClick={handleProtectedAction} className="disabled-link">
                <span>Courses</span>
              </div>
            </li>
            <li>
              <div onClick={handleProtectedAction} className="disabled-link">
                <span>Reviews</span>
              </div>
            </li>
            <li>
              <button onClick={handleProtectedAction} className="disabled-button">
                Start Key Challenge
              </button>
            </li>
          </>
        )}
        <li>
          <ProfileButton onLogout={handleLogout}/>
        </li>
      </ul>
      <div className="q-container">
        {isGameActive && message && <p className="key-message">{message}</p>}
        {isGameActive && feedback && <p className="key-feedback">{feedback}</p>}
      </div>
    </div>
  );
}

export default Navigation;
