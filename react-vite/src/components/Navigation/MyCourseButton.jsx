import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MyCourseButton = () => {
    const navigate = useNavigate();
    //Selecting user from the Redux store
    const user = useSelector(state => state.session.user);

    const handleCourseClick = () => {
        navigate(`/course/${user.id}`);
    };

    return (
        <div>
            <button
                onClick={handleCourseClick}
                className="my-course-button"
            >
                <p className="myCourses-word">My Courses</p>
            </button>
        </div>
    );
};

export default MyCourseButton;
