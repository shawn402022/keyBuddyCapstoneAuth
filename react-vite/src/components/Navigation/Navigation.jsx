import { NavLink, useNavigate} from "react-router-dom";
import ProfileButton from "./ProfileButton";
import CourseButton from "./CourseButton";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import ReviewButton from "./ReviewButton";
import CreateReviewButton from "./CreateReviewButton";



import "./Navigation.css";

function Navigation() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(thunkLogout()).then(() => {
      navigate('/');
    });
  };


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
          <ReviewButton />
        </li>
        <li>
          <CreateReviewButton />
        </li>

        <li>
          <ProfileButton onLogout={handleLogout}/>

        </li>
      </ul>


    </div>

  );
}

export default Navigation;
