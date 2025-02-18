import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCourses, deleteUserCourse } from '../../redux/userCourses';
import "./CoursePage.css"

const MyCoursePage = () => {
    const dispatch = useDispatch();
    const userCourses = useSelector(state => state.userCourses);

    useEffect(() => {
        dispatch(getUserCourses());
    }, [dispatch]);

    const handleDelete = async (courseId) => {
        const deleted = await dispatch(deleteUserCourse(courseId));
        if (deleted) {
            // Course was successfully deleted
            // Redux state will automatically update
        }
    };

    return (
        <div className="my-courses-container">
            <h2>My Saved Course Content</h2>
            <div className="courses-grid">
                {userCourses.length > 0 ? (
                    userCourses.map(course => (
                        <div
                        key={course.id} className="saved-course-container">
                            <div className="saved-course-item">
                                <h3>{course.course_name}</h3>
                                <p>{course.details_of_course}</p>
                            </div>
                            <button onClick={() => handleDelete(course.id)}>delete</button>
                            <button>edit</button>
                            <button>train</button>
                        </div>


                    ))
                ) : (
                    <p>No courses saved yet</p>
                )}
            </div>
        </div>
    );
};

export default MyCoursePage;
