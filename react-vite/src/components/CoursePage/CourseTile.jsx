import { useDispatch } from 'react-redux'
import { addToUserCourses } from '../../redux/userCourses';

const CourseTile = ({
    tonic = '',
    type = '',
    triads = [],
    chords = [],
    secondaryDominantSupertonics = [],
    secondaryDominants = [],
    secondaryDominantsMinorRelative = [],
    substituteDominantSupertonics = [],
    substituteDominants = [],
    substituteDominantsMinorRelative = [],
    scale = []
}) => {

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
            <div className="content-row scale">
                <p>Scale: <span className="highlight-text">{scale.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('scale', scale)}>add</button>
            </div>
            <div className="content-row triads">
                <p>Triads: <span className="highlight-text">{triads.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('triads', triads)}>add</button>
            </div>
            <div className="content-row chords">
                <p>Chords: <span className="highlight-text">{chords.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('chords', chords)}>add</button>
            </div>
            <div className="content-row secondary-dominants">
                <p>SecondaryDom: <span className="highlight-text">{secondaryDominants.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('secondaryDominants', secondaryDominants)}>add</button>
            </div>
            <div className="content-row secondary-dominants">
                <p>SecondaryDomSupertonics: <span className="highlight-text">{secondaryDominantSupertonics.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('secondaryDominantSuperTonics', secondaryDominantSupertonics)}>add</button>
            </div>
            <div className="content-row secondary-dominants">
                <p>SecondaryDomMinorRelative: <span className="highlight-text">{secondaryDominantsMinorRelative.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('secondaryDominantsMinorRelative', secondaryDominantsMinorRelative)}>add</button>
            </div>
            <div className="content-row secondary-dominants">
                <p>SubDomSupertonics: <span className="highlight-text">{substituteDominantSupertonics.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('substituteDominantSupertonics', substituteDominantSupertonics)}>add</button>
            </div>
            <div className="content-row secondary-dominants">
                <p>subDom: <span className="highlight-text">{substituteDominants.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('substituteDominants', substituteDominants)}>add</button>
            </div>
            <div className="content-row secondary-dominants">
                <p>subDomMinorRelative: <span className="highlight-text">{substituteDominantsMinorRelative.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('substituteDominantsMinorRelative', substituteDominantsMinorRelative)}>add</button>
            </div>

            <button>Songs in {tonic} {type}</button>
        </div>
    )
}

export default CourseTile
