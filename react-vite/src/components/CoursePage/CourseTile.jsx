
const CourseTile = ({ chords, scale, tonic, type, triads }) => {
    const handleAddClick = (contentType, content) => {
        const payload ={
            table_name: `${tonic}${type}_${contentType}`,
            table_description: content.join(', '),
            user_id: user.id
        }

        dispatch(addToUserCourses(payload))
    }
    return (
        <div className="course-tile">
            <h1>{tonic}{type} Courses</h1>
            <div className="content-row">
                <p>Chords: <span className="highlight-text">{chords.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('chords', chords)}>add</button>
            </div>
            <div className="content-row">
                <p>Scale: <span className="highlight-text">{scale.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('scale', scale)}>add</button>
            </div>
            <div className="content-row">
                <p>Triads: <span className="highlight-text">{triads.join(', ')}</span></p>
                <button className="add-button" onClick={() => handleAddClick('triads', triads)}>add</button>
            </div>
            <button>Songs in {tonic} {type}</button>
        </div>
    )
}

export default CourseTile
