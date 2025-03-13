import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../redux/course';
import { Navigate, NavLink } from 'react-router-dom';
import './CoursePage.css';
import { keys } from './CourseData';



console.log('RAW DATA:', keys)
const CoursePage = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);


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

    const keyId = Object.keys(keys)
    console.log("KeyId:", keyId);

    return (
        <div className="courses-container">

            <NavLink to="/createCourse" className="custom-course-button">
                Create Custom Course
            </NavLink>

            <img className="scales"
                src="/images/background-scales-lighter.png"
                alt="KBuddy logo" />
        </div>
    );
};

export default CoursePage;
