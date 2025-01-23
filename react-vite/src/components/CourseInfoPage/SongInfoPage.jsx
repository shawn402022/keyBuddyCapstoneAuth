import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSongs } from '../../redux/song'
import './CourseInfoPage.css'
import { Link } from'react-router-dom'

const SongInfoPage = () => {
    const dispatch = useDispatch()
    const { song_key } = useParams()
    const songs = useSelector(state => state.song)
    const firstChar = song_key[0]

    useEffect(() => {
        dispatch(getSongs(firstChar))

        return () => {
            dispatch({ type: 'song/CLEAR_SONGS' })
        }
    }, [dispatch, firstChar])

    return (
        <div className="song-details-grid">
            <Link to="/addSong">
                Add Song
            </Link>
            <div className='song-details-title'>
                <h2 >Songs in Key of {firstChar}</h2>
            </div>

            {Object.values(songs).length > 0 ? (
                Object.values(songs).map(song => (
                    <div className='song-key-details' key={song.id}>
                        <div className="song-general-details">
                            <h3>{song.song}</h3>
                            <p>{song.artist}</p>
                            <p>{song.song_key}</p>
                            <p>{song.chords_used}</p>
                            <p>{song.progression_used}</p>

                        </div>
                        <div className="song-description">
                            <p> {song.description}</p>
                        </div>
                        <div className='song-button'>
                            <button>Update</button>
                            <button>Delete</button>
                        </div>

                    </div>
                ))
            ) : (
                <h3>Currently no songs in the key of {firstChar} available in this database</h3>
            )}
        </div>
    )
}

export default SongInfoPage
