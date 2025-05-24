import './mainPage.css'
import { useSelector } from 'react-redux'


const Tester = () => {

    // Get contentType from Redux store
    const contentType = useSelector(state => state.test.contentType)


    return (
        <div className="tester-wrapper">
            <div className="picture-box">example</div>
            <div className="question-box">

                {/* Display the contentType */}
                {contentType && (
                    <div className='test-present' style={{ marginTop: '1px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <strong>Play Chord:</strong> {contentType}
                    </div>
                )}
                {!contentType && (
                    <div style={{ marginTop: '1px', padding: '1px', color: '#666' }}>
                        No test selected
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tester
