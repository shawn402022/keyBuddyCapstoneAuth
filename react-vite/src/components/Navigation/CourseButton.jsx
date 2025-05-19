import { useNavigate } from 'react-router-dom';

const CourseButton = () => {
    const navigate = useNavigate();

    const handleCourseClick = () => {
        navigate('/course');
    };

    return (
        <div>
            <button
                onClick={handleCourseClick}
                className="course-button"
            >
            {<p className="allCourses-word">All Tests</p>}
            </button>
        </div>
    );
};

export default CourseButton;
