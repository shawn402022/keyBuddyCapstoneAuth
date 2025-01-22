import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";

import "./Navigation.css";

function Navigation() {
  return (
    <div>
      <ul className="nav">
        <li>
          <NavLink  to="/"><img className="home-icon"
          src="../dist/images/home-word.png"
          alt="Home" /></NavLink>
        </li>
        <li>
          <CourseButton />
        </li>

        <li>
          <ProfileButton />

        </li>
      </ul>


    </div>

  );
}

export default Navigation;
