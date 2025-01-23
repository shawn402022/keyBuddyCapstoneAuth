import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSongs, updateSongThunk } from '../../redux/song';
import './CourseInfoPage.css';

function UpdateSongPage({ song }) {
    const dispatch = useDispatch();
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        song_key: song?.song_key || '',
        song: song?.song || '',
        artist: song?.artist || '',
        chords_used: song?.chords_used || '',
        progression_used: song?.progression_used || '',
        description: song?.description || ''
    });

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const success = await dispatch(updateSongThunk(song.id, updateFormData));
        if (success) {
            dispatch(getSongs());
            setShowUpdateForm(false);
        }
    };

    return (
        <div>
            <button className="update-button" onClick={() => setShowUpdateForm(true)}>
                Update Song
            </button>

            {showUpdateForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Update Song</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label>Song Key:</label>
                                <input
                                    type="text"
                                    value={updateFormData.song_key}
                                    onChange={(e) => setUpdateFormData({
                                        ...updateFormData,
                                        song_key: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Song Name:</label>
                                <input
                                    type="text"
                                    value={updateFormData.song}
                                    onChange={(e) => setUpdateFormData({
                                        ...updateFormData,
                                        song: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Artist:</label>
                                <input
                                    type="text"
                                    value={updateFormData.artist}
                                    onChange={(e) => setUpdateFormData({
                                        ...updateFormData,
                                        artist: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Chords Used:</label>
                                <input
                                    type="text"
                                    value={updateFormData.chords_used}
                                    onChange={(e) => setUpdateFormData({
                                        ...updateFormData,
                                        chords_used: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Progression Used:</label>
                                <input
                                    type="text"
                                    value={updateFormData.progression_used}
                                    onChange={(e) => setUpdateFormData({
                                        ...updateFormData,
                                        progression_used: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={updateFormData.description}
                                    onChange={(e) => setUpdateFormData({
                                        ...updateFormData,
                                        description: e.target.value
                                    })}
                                />
                            </div>
                            <div className="button-group">
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <img className="scales"
            src="../dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    );
}

export default UpdateSongPage;
