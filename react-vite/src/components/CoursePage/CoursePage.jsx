import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../redux/course';
import { Navigate , Link} from'react-router-dom';


const CoursePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const courses = useSelector(state => state.course ? Object.values(state.course): []);

    useEffect(() => {
        if (user) {
            console.log('DISPATCHING GET COURSES:')
            dispatch(getCourses());
        }
    }, [dispatch, user]);

    if (!user) {
        return <Navigate to="/login" />;
    }



    return (
        <div className="courses-container">
            <h1>Available Courses</h1>
            <Link to="/createCourse">
                createCourse
            </Link>
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <h2>{course.course_name}</h2>
                        <p>{course.details_of_course}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CoursePage;
