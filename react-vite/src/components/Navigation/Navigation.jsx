import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import ReviewButton from "./ReviewButton";
import CreateReviewButton from "./CreateReviewButton";

import "./Navigation.css";

function Navigation() {
  const [message, setMessage] = useState("");
  const [targetKey, setTargetKey] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const generateNewChallenge = () => {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const octaves = ['2', '3', '4', '5', '6', '7'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomOctave = octaves[Math.floor(Math.random() * octaves.length)];
    const fullNote = `${randomKey}${randomOctave}`;
    setTargetKey(fullNote);
    setMessage(`Please play ${fullNote} on the piano`);
    setFeedback("");
  };

  useEffect(() => {
    if (!isGameActive) return;

    const handleNotePress = (e) => {
      const pressedNote = e.target.getAttribute('data-id');
      if (pressedNote === targetKey) {
        setFeedback("Correct! Here's your next challenge!");
        setTimeout(generateNewChallenge, 1000);
      } else {
        setFeedback(`Incorrect! Try again. You played ${pressedNote}`);
      }
    };

    // Add listeners to all piano keys
    const pianoKeys = document.querySelectorAll('.white-key img, .black-key img');
    pianoKeys.forEach(key => key.addEventListener('mousedown', handleNotePress));

    return () => {
      pianoKeys.forEach(key => key.removeEventListener('mousedown', handleNotePress));
    };
  }, [isGameActive, targetKey]);

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
