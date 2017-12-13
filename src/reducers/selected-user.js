const defaultState = {
    id: null,
    details: null,
    photos: null
};

export default (state = defaultState, action) => {

    switch(action.type) {

        case 'SET_SELECTED_USER':
            return { id: action.payload, details: null, photos: null };

        case 'CLEAR_SELECTED_USER':
            return defaultState;

        case 'SELECTED_USER_DETAILS_FETCHED':
            return { ...state, details: action.payload };

        case 'SELECTED_USER_DETAILS_ERROR':
            return { ...state, details: null };

        case 'SELECTED_USER_PHOTOS_FETCHED':
            return { ...state, photos: action.payload };

        default:
            return state;

    };

};
