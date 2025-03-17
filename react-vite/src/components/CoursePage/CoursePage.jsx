import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../redux/course';
import { Navigate,  NavLink } from 'react-router-dom';
import './CoursePage.css';
import { keys} from './CourseData';
import { Scale } from "tonal"
import CourseTile from './CourseTile';


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
            {isAdmin && (
                <p className="create-course-button-container">
                    <NavLink to="/createCourse" className="create-course-button">
                        Create Course
                    </NavLink>
                </p>
            )}
            <NavLink to="/createCourse" className="custom-course-button">
                 Create Custom Course
            </NavLink>
            <div className='test'>
            TEST
            {keys.map((data) => {
                let key = data.key.tonic;
                let type = data.key.type;
                let name = `${key} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                //console.log('NAME', name)
                let note = Scale.get(name).notes
                //console.log('NOTES', note)
                let maj7 = [1,3,5, 7].map(Scale.degrees(name))
                //console.log('MAJ7',name, maj7)
            })}
            </div>
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


            <img className="scales"
                src="/images/background-scales-lighter.png"
                alt="KBuddy logo" />
        </div>
    );
};

export default CoursePage;
