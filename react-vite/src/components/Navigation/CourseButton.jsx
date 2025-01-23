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
            {<img className="allCourses-word"
                src="../dist/images/ViewAllCourses -word.png"
                alt="Home" />}
            </button>
        </div>
    );
};

export default CourseButton;
