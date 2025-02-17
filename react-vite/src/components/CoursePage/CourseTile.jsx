
const CourseTile = ({ chords, scale, tonic, type, triads }) => {
    return (
        <div className="course-tile">
            <h1>{tonic}{type} Courses</h1>
            <div className="content-row">
                <p>Chords: <span className="highlight-text">{chords.join(', ')}</span></p>
                <button className="add-button">add</button>
            </div>
            <div className="content-row">
                <p>Scale: <span className="highlight-text">{scale.join(', ')}</span></p>
                <button className="add-button">add</button>
            </div>
            <div className="content-row">
                <p>Triads: <span className="highlight-text">{triads.join(', ')}</span></p>
                <button className="add-button">add</button>
            </div>
            <button>Songs in {tonic} {type}</button>
        </div>
    )
}

export default CourseTile
