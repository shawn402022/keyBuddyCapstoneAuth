import { NavLink, useNavigate } from "react-router-dom";
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
          <NavLink   to="/"><p className="home-icon">Home</p></NavLink>
        </li>
        <li>
          <CourseButton />
        </li>
        <li>
          <p className="create-course-button">
            <NavLink  to="/createCourse">Create Course</NavLink>
          </p>
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
