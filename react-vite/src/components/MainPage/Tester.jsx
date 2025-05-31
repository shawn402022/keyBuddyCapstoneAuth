import './mainPage.css'


const Tester = ({chord}) => {

    // Get contentType from Redux store



    return (
        <div className="tester-wrapper">
            <div className="picture-box">example</div>
            <div className="question-box">

                {/* Display the contentType */}
                {chord && (
                    <div className='test-present' style={{ marginTop: '1px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <strong>Play Chord:</strong> {chord}
                    </div>
                )}
                {!chord && (
                    <div style={{ marginTop: '1px', padding: '1px', color: '#666' }}>
                        No test selected
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tester
