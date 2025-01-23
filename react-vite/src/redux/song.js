//## ACTION TYPES
const LOAD_SONGS = 'song/LOAD_SONGS';
const CREATE_SONGS = 'song/CREATE_SONGS'
const DELETE_SONGS = 'song/DELETE_SONGS'
const UPDATE_SONGS = 'song/UPDATE_SONGS'
const CLEAR_SONGS = 'song/CLEAR_SONGS'

//## ACTION CREATORS
export const loadSongs = (songs) => ({
    type: LOAD_SONGS,
    payload: songs,
})

export const createSongs = (song) => ({
    type: CREATE_SONGS,
    payload: { song },
})

export const deleteSongs = (song_id) => ({
    type: DELETE_SONGS,
    payload: song_id
})

export const updateSongs = (song_id, song, artist, chords_used, progression_used, song_key, description) => ({
    type: UPDATE_SONGS,
    payload: {
        song_id,
        song_key,
        song,
        artist,
        chords_used,
        progression_used,
        description
    }
})




//## THUNK ACTION CREATORS
//get songs
export const getSongs = (song_key) => async (dispatch) => {
    console.log('Fetching songs for key:', song_key)
    const response = await fetch(`/api/song/${song_key}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data)  // Debug log
        dispatch(loadSongs(data));
    } else {
        console.error('Error fetching songs');
    }
}//create songs
export const createSongsFetch = (song_id, song, artist, chords_used, progression_used, song_key, description) => async (dispatch) => {
    const response = await fetch('/api/song/admin', {
        method: 'POST',
        body: JSON.stringify({
            song_id,
            song,
            artist,
            chords_used,
            progression_used,
            song_key,
            description
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createSongs(data));
        return data;
    }
}
//delete songs
export const deleteSongThunk = (songId) => async (dispatch) => {
    const response = await fetch(`/api/song/admin/${songId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteSongs(songId));
    }
};
//update songs
export const updateSongThunk = (songId, songData) => async (dispatch) => {
    const response = await fetch(`/api/song/admin/${songId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(songData)
    });

    if (response.ok) {
        const updatedSong = await response.json();
        dispatch(updateSongs(
            updatedSong.id,
            updatedSong.song,
            updatedSong.artist,
            updatedSong.chords_used,
            updatedSong.progression_used,
            updatedSong.song_key,
            updatedSong.description
        ));
        return true;
    }
    return false;
};//##REDUCER
export default function songReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_SONGS:
            {
                const newState = { ...state }
                action.payload.forEach(song => {
                    newState[song.id] = song;
                });
                return newState;
            }
        case CREATE_SONGS:
            {
                const newState = { ...state }
                newState[action.payload.song.id] = action.payload.song
                return newState;
            }
        case DELETE_SONGS:
            {
                const newState = { ...state }
                delete newState[action.payload]
                return newState;
            }
        case UPDATE_SONGS: {
                const newState = { ...state };
                newState[action.payload.song_id] = {
                    id: action.payload.song_id,
                    song_key: action.payload.song_key,
                    song: action.payload.song,
                    artist: action.payload.artist,
                    chords_used: action.payload.chords_used,
                    progression_used: action.payload.progression_used,

                    description: action.payload.description
                };
                return newState;
            }
        case CLEAR_SONGS:
                return {}
        default:
            return state;
    }
}
