import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, updateCourseThunk } from '../../redux/course';
import { Navigate, Link, useNavigate, NavLink } from 'react-router-dom';
import './CoursePage.css';
import { keys} from './CourseData';
import CourseTile from './CourseTile';


console.log('RAW DATA:', keys)
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

    const isAdmin = user.full_name.trim() === "Admin User";
    console.log("Is admin?", isAdmin);
    console.log("User full name:", user.full_name);

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
    const keyId = Object.keys(keys)
    console.log("KeyId:", keyId);

    return (
        <div className="courses-container">
            {isAdmin && (
                <p className="create-course-button-container">
                    <NavLink to="/createCourse" className="create-course-button">
                        Create Course
                    </NavLink>
                </p>
            )}

            <div className="courses-grid">
            {keys.map((keyData, index) => {
                // Handle different key types
                let keyProperties;

                if (keyData.key.type === 'minor') {
                    // For minor keys, use melodic structure
                    keyProperties = {
                        ...keyData.key.natural,
                        type:keyData.key.type,//the type key is not in natural structure so you have to explicitly add it.
                    }
                } else {
                    // For major keys, use direct key properties
                    keyProperties = keyData.key;
                }

                const {
                    chords,
                    scale,
                    tonic,
                    type,
                    triads
                } = keyProperties;

                return (
                    <div key={`${keyData.name}-${index}`} className="course-card">
                        <CourseTile
                            chords={chords}
                            scale={scale}
                            tonic={tonic}
                            type={type}
                            triads={triads}
                        />
                    </div>
                );
            })}
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
