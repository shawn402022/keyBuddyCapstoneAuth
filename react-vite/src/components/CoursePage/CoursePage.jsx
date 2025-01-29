import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, updateCourseThunk } from '../../redux/course';
import { Navigate, Link, useNavigate, NavLink } from 'react-router-dom';
import './CoursePage.css';

const CoursePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const course = useSelector(state => state.course ? Object.values(state.course) : []);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        course_name: '',
        details_of_course: ''
    });

    useEffect(() => {
        if (user) {
            console.log("Current user state:", user);
            dispatch(getCourses());
        }
    }, [dispatch, user]);
    if (!user) {
        return <Navigate to="/login" />;
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
            <p className="create-course-button-container">
                <NavLink to="/createCourse" className="create-course-button">
                    Create Course
                </NavLink>
            </p>

            <div className="courses-grid">
                {course.map(course => (
                    <div key={course.id} className="course-card">
                        <h2 className='course-name'>{course.course_name}</h2>
                        <p className='course-detail'>{course.details_of_course}</p>
                        <div>
                            <button>
                                <Link to={`/songs/${course.course_name[0]}`}>Songs</Link>
                            </button>
                    
                            <button onClick={() => alert("Feature to be implemented soon")}>Scales</button>
                            <button onClick={() => alert("Feature to be implemented soon")}>Chords</button>
                            <button onClick={() => alert("Feature to be implemented soon")}>Keys</button>
                            <button onClick={() => handleUpdateClick(course)}>
                                Update
                            </button>
                            <button onClick={() => navigate(`/course/admin/delete/${course.id}`)}>
                                Delete
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
                src="/images/background-scales-lighter.png"
                alt="KBuddy logo" />
        </div>
    );
};

export default CoursePage;
