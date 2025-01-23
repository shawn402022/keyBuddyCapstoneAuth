import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSongsFetch, getSongs } from '../../redux/song';
import { useNavigate } from 'react-router-dom';
import './CourseInfoPage.css';
const CreateSongPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [songData, setSongData] = useState({
        song: '',
        artist: '',
        chords_used: '',
        progression_used: '',
        song_key: '',
        description:''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await dispatch(createSongsFetch(
                null,
                songData.song,
                songData.artist,
                songData.chords_used,
                songData.progression_used,
                songData.song_key,
                songData.description  // Add this
            ));

            if (result) {
                console.log('Song created:', result);
                await dispatch(getSongs(songData.song_key));
                navigate(`/songs/${songData.song_key}`);
            }
        } catch (error) {
            console.error('Failed to create song:', error);
        }
    };

    return (
        <div className="create-song-container">
            <h1 className="create-song-title">Add New Song</h1>
            <form  className='create-song-form'onSubmit={handleSubmit}>
                <div>
                    <label>Song Name:</label>
                    <input
                        type="text"
                        value={songData.song}
                        onChange={(e) => setSongData({...songData, song: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Artist:</label>
                    <input
                        type="text"
                        value={songData.artist}
                        onChange={(e) => setSongData({...songData, artist: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Song Key:</label>
                    <input
                        type="text"
                        value={songData.song_key}
                        onChange={(e) => setSongData({...songData, song_key: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Chords Used:</label>
                    <input
                        type="text"
                        value={songData.chords_used}
                        onChange={(e) => setSongData({...songData, chords_used: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Progression Used:</label>
                    <input
                        type="text"
                        value={songData.progression_used}
                        onChange={(e) => setSongData({...songData, progression_used: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={songData.description}
                        onChange={(e) => setSongData({...songData, description: e.target.value})}
                        placeholder="Add song details, tips, or notes here"
                        rows="4"
                    />
                </div>
                <button type="submit">Add Song</button>
            </form>
            <img className="scales"
            src="../dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    );
};

export default CreateSongPage;
