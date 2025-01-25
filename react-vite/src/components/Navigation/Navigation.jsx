import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import ReviewButton from "./ReviewButton";
import CreateReviewButton from "./CreateReviewButton";
import { WebMidi } from "webmidi";

import "./Navigation.css";

function Navigation() {
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
  }, []);

  const checkNote = useCallback((playedNote) => {
    if (!isGameActive) return;

    if (playedNote === targetKey) {
      setFeedback("Correct! Here's your next challenge!");
      setTimeout(generateNewChallenge, 1000);
    } else {
      setFeedback(`Incorrect! Try again. You played ${playedNote}`);
    }
  }, [isGameActive, targetKey, generateNewChallenge]);

  useEffect(() => {
    if (!isGameActive) return;

    const handleMousePress = (e) => {
      const pressedNote = e.target.getAttribute('data-id');
      if (pressedNote) {
        checkNote(pressedNote);
      }
    };

    const setupMidi = async () => {
      try {
        await WebMidi.enable();
        const myInput = WebMidi.getInputByName("KOMPLETE KONTROL A25 MIDI");
        if (myInput) {
          myInput.addListener("noteon", (e) => {
            checkNote(e.note.identifier);
          });
        }
      } catch (err) {
        console.log("MIDI device not found or WebMidi not supported");
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
      WebMidi.disable();
      document.removeEventListener('mousedown', () => {
        isMouseDownRef.current = true;
      });
      document.removeEventListener('mouseup', () => {
        isMouseDownRef.current = false;
      });
    };
  }, [isGameActive, checkNote]);

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

  return (
    <div>
      <ul className="nav">
        <li>
          <NavLink to="/"><p className="home-icon">Home</p></NavLink>
        </li>
        <li>
          <CourseButton />
        </li>
        <li>
          <p className="create-course-button">
            <NavLink to="/createCourse">Create Course</NavLink>
          </p>
        </li>
        <li>
          <ReviewButton />
        </li>
        <li>
          <CreateReviewButton />
        </li>
        <li>
          {!isGameActive ? (
            <button onClick={startKeyChallenge}>Start Key Challenge</button>
          ) : (
            <button onClick={stopKeyChallenge}>Stop Key Challenge</button>
          )}
        </li>
        <li>
          <ProfileButton onLogout={handleLogout}/>
        </li>
      </ul>
      {message && <div className="key-message">{message}</div>}
      {feedback && <div className="key-feedback">{feedback}</div>}
    </div>
  );
}

export default Navigation;
