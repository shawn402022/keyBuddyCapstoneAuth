import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
            {userCourses.map(course => (
                <div key={course.id} className="saved-course-item">
                    <h3>{course.table_name}</h3>
                    <p>{course.table_description}</p>
                </div>
            ))}
        </div>
    )
}
