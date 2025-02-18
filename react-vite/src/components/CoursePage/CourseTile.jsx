import {useDispatch} from 'react-redux'
import { addToUserCourses } from '../../redux/userCourses';

const CourseTile = ({ chords, scale, tonic, type, triads }) => {

    const dispatch = useDispatch()

    const handleAddClick = (contentType, content) => {
        const payload = {
            course_name: `${tonic}${type}_${contentType}`,
            details_of_course: content.join(', ')
        }
        dispatch(addToUserCourses(payload));
    }
    
    return (
        <div className="course-tile">
            <h1>{tonic}{type} Courses</h1>
            <div className="content-row chords">
                <p>Chords: <span className="highlight-text">{chords.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('chords', chords)}>add</button>
            </div>
            <div className="content-row scale">
                <p>Scale: <span className="highlight-text">{scale.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('scale', scale)}>add</button>
            </div>
            <div className="content-row triads">
                <p>Triads: <span className="highlight-text">{triads.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('triads', triads)}>add</button>
            </div>
            <button>Songs in {tonic} {type}</button>
        </div>
    )
}

export default CourseTile
