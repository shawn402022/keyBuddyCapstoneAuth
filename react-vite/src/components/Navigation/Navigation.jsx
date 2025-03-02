import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";
import MyCourseButton from "./MyCourseButton";
import { thunkLogout } from "../../redux/session";
import ReviewButton from "./ReviewButton";
import { WebMidi } from "webmidi";
import SoundModule from '../SoundModule/SoundModule';

import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const trainingCourse = useSelector(state => state.userCourses.trainingCourse);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMouseDownRef = useRef(false);

  const handleNotePlay = (note) => {
    SoundModule.playNote(note);
    updateKeyImage(note, true);
    setTimeout(() => updateKeyImage(note, false), 200);
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
            updateKeyImage(e.note.identifier, true);  // Show pressed image
          });

          myInput.addListener("noteoff", (e) => {
            updateKeyImage(e.note.identifier, false);  // Show released image
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
              <MyCourseButton />
            </li>
            <li>
              <CourseButton />
            </li>
            <li>
              <ReviewButton />
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
          </>
        )}
        <li>
          <ProfileButton onLogout={handleLogout}/>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
