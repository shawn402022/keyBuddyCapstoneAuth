import { useNavigate } from 'react-router-dom';

const CourseButton = () => {
    const navigate = useNavigate();

    const handleCourseClick = () => {
        navigate('/courses');
    };

    return (
        <div>
            <button
                onClick={handleCourseClick}
                className="course-button"
            >
                View All Courses
            </button>
        </div>
    );
};

export default CourseButton;
