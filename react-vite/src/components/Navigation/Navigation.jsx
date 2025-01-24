import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const sessionUser = useSelector(state => state.session.user);

  const handleLogout = () => {
    dispatch(thunkLogout()).then(() => {
      navigate('/');
    });
  };

  const handleProtectedRoute = (e, path) => {
    if (!sessionUser) {
      e.preventDefault();
      navigate('/login');
    }
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
            <NavLink to="/createCourse" onClick={(e) => handleProtectedRoute(e, '/createCourse')}>
              Create Course
            </NavLink>
          </p>
        </li>
        <li>
          <NavLink to="/reviews" onClick={(e) => handleProtectedRoute(e, '/reviews')}>
            <ReviewButton />
          </NavLink>
        </li>
        <li>
          <NavLink to="/reviews/new" onClick={(e) => handleProtectedRoute(e, '/reviews/new')}>
            <CreateReviewButton />
          </NavLink>
        </li>
        <li>
          <ProfileButton onLogout={handleLogout}/>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
