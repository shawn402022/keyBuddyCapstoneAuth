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
            console.log("Current user state:", user);
            dispatch(getCourses());
        }
    }, [dispatch, user]);
    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleDelete = async (courseId) => {
        console.log('Starting delete operation for course:', courseId);
        try {
            const response = await dispatch(deleteCourseThunk(courseId));
            console.log('Delete successful:', response);
        } catch (error) {
            console.log('Delete failed with error:', {
                message: error.message,
                status: error.status,
                fullError: error
            });
        }
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
                            <button onClick={() => alert("Feature to be implemented soon")}>Scales</button>
                            <button onClick={() => alert("Feature to be implemented soon")}>Chords</button>
                            <button onClick={() => alert("Feature to be implemented soon")}>Keys</button>
                            <button onClick={() => handleUpdateClick(course)}>
                                Update
                            </button>
                            <button onClick={() => handleDelete(course.id)}>
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
