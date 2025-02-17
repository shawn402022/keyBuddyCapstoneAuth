import { useNavigate } from 'react-router-dom';

const MyCourseButton = () => {
    const navigate = useNavigate();

    const handleCourseClick = () => {
        navigate('/course/2');
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
