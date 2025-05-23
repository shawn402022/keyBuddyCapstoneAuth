import { NavLink, useNavigate } from "react-router-dom";
import {  useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";
import { thunkLogout } from "../../redux/session";
import ReviewButton from "./ReviewButton";


import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
          <ProfileButton onLogout={handleLogout} />
        </li>
      </ul>

    </div>
  );
}

export default Navigation;
