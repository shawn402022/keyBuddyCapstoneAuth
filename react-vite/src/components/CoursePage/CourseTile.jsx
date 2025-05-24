import { useDispatch } from 'react-redux'
import { addToUserCourses } from '../../redux/userCourses';
import { useNavigate } from 'react-router-dom';
import { thunkSetContentType } from '../../redux/test';

const CourseTile = ({
    tonic = "",
    type = "",
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
    const navigate = useNavigate();

    function startTest(contentType) {

        console.log('Starting test for:', contentType);

        navigate('/mainPage')


        if (contentType === 'triads') {
            contentType = safeJoin(triads)
            console.log('Starting test for:', contentType);
        } else if (contentType === 'chords') {
            contentType = safeJoin(chords)
        } else if (contentType === 'scale') {
            contentType = safeJoin(scale)
        } else if (contentType === 'secondaryDominants') {
            contentType = safeJoin(secondaryDominants)
        } else if (contentType === 'secondaryDominantSupertonics') {
            contentType = safeJoin(secondaryDominantSupertonics)
            console.log('TYPE',typeof(contentType))
        } else if (contentType === 'secondaryDominantMinorRelative') {
            contentType = secondaryDominantsMinorRelative
        } else if (contentType === 'substituteDominantSupertonics ') {
            contentType = safeJoin(substituteDominantSupertonics)
        } else if (contentType === 'substituteDominants') {
            contentType = safeJoin(substituteDominants)
            dispatch(thunkSetContentType(contentType))
        } else if (contentType === 'substituteDominantsMinorRelative') {
            contentType = safeJoin(substituteDominantsMinorRelative)
        }
        dispatch(thunkSetContentType(contentType))

        return console.log(contentType)

    }



    // Helper function to replace empty strings with "NA"
    const replaceEmptyWithNA = (arr) => {
        // If arr is undefined, return an empty array
        if (!arr) return [];

        // Replace empty strings with "NA"
        return arr.map(item => item === '' ? 'NA' : item);
    }

    // Helper function to safely join arrays
    const safeJoin = (arr) => {
        if (!arr) return 'None available';
        const processedArr = replaceEmptyWithNA(arr);
        return processedArr.join(', ');
    }

    const handleAddClick = (contentType, content) => {
        // Process the array before joining for the payload
        startTest(contentType)

        //console.log(`CONTENTTYPES, ${contentType}`)


    }

    return (
        <div className="course-tile">
            <h1>{tonic}{type} Tests</h1>
            <div className="content-row scale">
                <p className='test-name'>Scale: </p>
                <p className="highlight-text">{safeJoin(scale)}</p>
                <button className="add-button" onClick={() => handleAddClick('scale', scale)}>Start Test</button>

            </div>
            <div className="content-row triads">
                <p className='test-name'>Triads: </p>
                <p className="highlight-text">{safeJoin(triads)}</p>
                <button className="add-button" onClick={() => handleAddClick('triads', triads)}>Start Test</button>
            </div>
            <div className="content-row chords">
                <p className='test-name'>Chords:</p>
                <p className="highlight-text">{safeJoin(chords)}</p>
                <button className="add-button" onClick={() => handleAddClick('chords', chords)}>Start Test</button>
            </div>
            <div className="content-row secondary-dominants">
                <p className='test-name'>SecondaryDom: </p>
                <p className="highlight-text">{safeJoin(secondaryDominants)}</p>
                <button className="add-button" onClick={() => handleAddClick('secondaryDominants', secondaryDominants)}>Start Test</button>
            </div>
            <div className="content-row secondary-dominants">
                <p className='test-name'>SecondaryDomSupertonics: </p>
                <p className="highlight-text">{safeJoin(secondaryDominantSupertonics)}</p>
                <button className="add-button" onClick={() => handleAddClick('secondaryDominantSupertonics', secondaryDominantSupertonics)}>Start Test</button>
            </div>
            <div className="content-row secondary-dominants">
                <p className='test-name'>SecondaryDomMinorRelative: </p>
                <p className="highlight-text">{safeJoin(secondaryDominantsMinorRelative)}</p>
                <button className="add-button" onClick={() => handleAddClick('secondaryDominantsMinorRelative', secondaryDominantsMinorRelative)}>Start Test</button>
            </div>
            <div className="content-row secondary-dominants">
                <p className='test-name'>SubDomSupertonics:</p>
                <p className="highlight-text">{safeJoin(substituteDominantSupertonics)}</p>
                <button className="add-button" onClick={() => handleAddClick('substituteDominantSupertonics', substituteDominantSupertonics)}>Start Test</button>
            </div>
            <div className="content-row secondary-dominants">
                <p className='test-name'>subDom: </p>
                <p className="highlight-text">{safeJoin(substituteDominants)}</p>
                <button className="add-button" onClick={() => handleAddClick('substituteDominants', substituteDominants)}>Start Test</button>
            </div>
            <div className="content-row secondary-dominants">
                <p className='test-name'>subDomMinorRelative: </p>
                <p className="highlight-text">{safeJoin(substituteDominantsMinorRelative)}</p>
                <button className="add-button" onClick={() => handleAddClick('substituteDominantsMinorRelative', substituteDominantsMinorRelative)}>Start Test</button>
            </div>

            <button>Songs in {tonic} {type}</button>
        </div>
    )
}

export default CourseTile
