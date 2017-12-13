const defaultState = {
    photos: [],
    fetching: false,
    error: false
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'FETCH_PHOTOS_STARTED':
            return { data: [], fetching: true, error: true }
        case 'FETCH_PHOTOS_COMPLETE':
            return { data: action.payload, fetching: false, error: false };
        case 'FETCH_PHOTOS_ERROR':
            return { data: [], fetching: false, error: true }
        default:
            return state;
    }
}
