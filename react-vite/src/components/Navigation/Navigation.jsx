import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";

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
          <ProfileButton />

        </li>
      </ul>


    </div>

  );
}

export default Navigation;
