import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../redux/course';

const CoursePage = () => {
    const dispatch = useDispatch();
    const courses = useSelector(state => state.course ? Object.values(state.course): []);

    useEffect(() => {
        dispatch(getCourses());
    }, [dispatch]);

    return (
        <div className="courses-container">
            <h1>Available Courses</h1>
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CoursePage;
