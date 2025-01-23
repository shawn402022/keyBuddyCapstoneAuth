import { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { getCourses, deleteCourseThunk } from '../../redux/course';
import { Navigate , Link} from'react-router-dom';
import './CoursePage.css';

const CourseDetail = () => {
    const dispatch = useDispatch();



    return (
        <div>
            <h1>Course Details</h1>
            <p>details info</p>
            <button>
                back
            </button>
            <img className="scales"
            src="../dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />

        </div>

    )
}

export default CourseDetail
