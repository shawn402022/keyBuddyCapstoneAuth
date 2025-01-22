import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";


import "./Navigation.css";

function Navigation() {
  return (
    <div>
      <ul className="nav">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <ProfileButton />
        </li>
      </ul>
    </div>

  );
}

export default Navigation;
