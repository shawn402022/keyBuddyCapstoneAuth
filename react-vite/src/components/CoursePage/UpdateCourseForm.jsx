import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCourseThunk } from '../redux/course';

function UpdateCourseForm({ course, onClose }) {
    const dispatch = useDispatch();
    const [courseName, setCourseName] = useState(course.course_name);
    const [courseDetails, setCourseDetails] = useState(course.details_of_course);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateCourseThunk(course.id, courseName, courseDetails));
        onClose();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="courseName">Course Name:</label>
                    <input
                        type="text"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseDetails">Course Details:</label>
                    <textarea
                        id="courseDetails"
                        value={courseDetails}
                        onChange={(e) => setCourseDetails(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Course</button>
            </form>
            <img className="scales"
            src="../dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />

        </div>

    );
}

export default UpdateCourseForm;
