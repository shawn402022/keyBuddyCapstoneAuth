import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { LuKeyboardMusic } from "react-icons/lu";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button className='p-button' onClick={toggleMenu}>
        <LuKeyboardMusic className='pButton' />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <div>
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </div>
          ) : (
            <>
              <OpenModalMenuItem
                itemText={<img className="login-word"
                  src="../dist/images/login-word.png"
                  alt="Home" />}
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText={<img className="signin-word"
                  src="../dist/images/Signin-word.png"
                  alt="Home" />}
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
