import { useState } from 'react';
import './mainPage.css'



const Tester = ({ chord }) => {

    // Get contentType from Redux store



    return (
        <div className="tester-wrapper">
            <div className="question-box">
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
            <div className="picture-box">
                <img
                    src={`/images/chordImages/${chord}.png`}
                    alt={`${chord} chord diagram`}
                    style={{
                        width: '300px',
                        height: 'auto',
                        maxWidth: '100%'
                    }}
                    onError={(e) => {
                        e.target.src = '/images/chordImages/default.png';
                        e.target.alt = 'Chord diagram not available';
                    }}
                />
            </div>
        </div>
    );
}

export default Tester
