import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCourses } from '../../redux/userCourses';
import "./CoursePage.css"

const MyCoursePage = () => {
    const dispatch = useDispatch();
    const userCourses = useSelector(state => state.userCourses);

    useEffect(() => {
        dispatch(getUserCourses());
    }, [dispatch]);

    return (
        <div className="my-courses-container">
            <h2>My Saved Course Content</h2>
            {userCourses.length > 0 ? (
                userCourses.map(course => (
                    <div key={course.id} className="saved-course-item">
                        <h3>{course.course_name}</h3>
                        <p>{course.details_of_course}</p>
                    </div>
                ))
            ) : (
                <p>No courses saved yet</p>
            )}
        </div>
    )
}

export default MyCoursePage;
