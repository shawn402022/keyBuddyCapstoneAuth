import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, deleteCourseThunk } from '../../redux/course';
import { Navigate , Link} from'react-router-dom';
import './CoursePage.css';


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

    const handleDelete = (courseId) => {
        dispatch(deleteCourseThunk(courseId));
    }

    return (
        <div className="courses-container">
            <h1>Available Courses</h1>
            <Link to="/createCourse">
                createCourse
            </Link>
            <div className="courses-grid">
                {courses.map(course => (
                    <div  key={course.id} className="course-card">
                        <h2 className='course-name'>{course.course_name}</h2>
                        <p className='course-detail'>{course.details_of_course}</p>
                        <div>
                            <button>
                                songs
                            </button>
                            <button>
                                progressions
                            </button>
                            <button>
                                scales
                            </button>
                            <button>
                                chords
                            </button>
                            <button>
                                keys
                            </button>
                            <button onClick={() => handleDelete(course.id)}>
                                delete
                            </button>



                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};
export default CoursePage;
