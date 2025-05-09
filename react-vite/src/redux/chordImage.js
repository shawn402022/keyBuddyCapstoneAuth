

// Action Types
const SAVE_CHORD_IMAGE = 'chordImage/SAVE_CHORD_IMAGE';
const LOAD_CHORD_IMAGES = 'chordImage/LOAD_CHORD_IMAGES';

// Action Creators
export const saveChordImage = (image) => ({
    type: SAVE_CHORD_IMAGE,
    payload: image
});

export const loadChordImages = (images) => ({
    type: LOAD_CHORD_IMAGES,
    payload: images
});

// Thunk Action Creators
export const saveChordImageToDatabase = (chordId, imageData, key) => async (dispatch) => {
    try {
        const response = await fetch('/api/chord-image/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chordId,
                imageData,
                key
            })
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(saveChordImage({
                chordId,
                imageData,
                key
            }));
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save chord image');
        }
    } catch (error) {
        console.error('Error saving chord image:', error);
        throw error;
    }
};

export const fetchChordImagesByKey = (key) => async (dispatch) => {
    try {
        const response = await fetch(`/api/chord-image?key=${key}`);

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.images) {
                // Format images for the store
                const formattedImages = {};
                data.images.forEach(img => {
                    formattedImages[img.chordId] = {
                        id: img.id,
                        chordId: img.chordId,
                        imageData: img.imageData,
                        key: img.key
                    };
                });

                dispatch(loadChordImages(formattedImages));
                return formattedImages;
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch chord images');
        }
    } catch (error) {
        console.error('Error fetching chord images:', error);
        throw error;
    }
};

// Reducer
const initialState = {
    byChordId: {}
};

export default function chordImageReducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_CHORD_IMAGE: {
            const { chordId, imageData, key } = action.payload;
            return {
                ...state,
                byChordId: {
                    ...state.byChordId,
                    [chordId]: {
                        chordId,
                        imageData,
                        key
                    }
                }
            };
        }
        case LOAD_CHORD_IMAGES: {
            return {
                ...state,
                byChordId: {
                    ...state.byChordId,
                    ...action.payload
                }
            };
        }
        default:
            return state;
    }
}
