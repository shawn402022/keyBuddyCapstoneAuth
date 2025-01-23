import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, deleteCourseThunk, updateCourseThunk } from '../../redux/course';
import { Navigate, Link } from 'react-router-dom';
import './CoursePage.css';

const CoursePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const courses = useSelector(state => state.course ? Object.values(state.course) : []);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        course_name: '',
        details_of_course: ''
    });

    useEffect(() => {
        if (user) {
            dispatch(getCourses());
        }
    }, [dispatch, user]);
    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleDelete = (courseId) => {
        dispatch(deleteCourseThunk(courseId));
    }

    const handleUpdateClick = (course) => {
        setSelectedCourse(course);
        setUpdateFormData({
            course_name: course.course_name,
            details_of_course: course.details_of_course
        });
        setShowUpdateForm(true);
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateCourseThunk(
            selectedCourse.id,
            updateFormData.course_name,
            updateFormData.details_of_course
        ));
        setShowUpdateForm(false);
    }

    return (
        <div className="courses-container">
            <Link to="/createCourse">
                create course
            </Link>
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <h2 className='course-name'>{course.course_name}</h2>
                        <p className='course-detail'>{course.details_of_course}</p>
                        <div>
                            <button>
                            <Link to={`/songs/${course.course_name[0]}`}>Songs</Link>
                            </button>
                            <button><Link to="/create-song">Add Song</Link></button>
                            <button>scales</button>
                            <button>chords</button>
                            <button>keys</button>
                            <button onClick={() => handleUpdateClick(course)}>
                                update
                            </button>
                            <button onClick={() => handleDelete(course.id)}>
                                delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showUpdateForm && selectedCourse && (
                <div className="update-form-modal">
                    <form onSubmit={handleUpdateSubmit}>
                        <input
                            type="text"
                            value={updateFormData.course_name}
                            onChange={(e) => setUpdateFormData({
                                ...updateFormData,
                                course_name: e.target.value
                            })}
                            placeholder="Course Name"
                            required
                        />
                        <textarea
                            value={updateFormData.details_of_course}
                            onChange={(e) => setUpdateFormData({
                                ...updateFormData,
                                details_of_course: e.target.value
                            })}
                            placeholder="Course Details"
                            required
                        />
                        <button type="submit">Update Course</button>
                        <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                    </form>
                </div>
            )}
            <img className="scales"
            src="../dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    );
};

export default CoursePage;
