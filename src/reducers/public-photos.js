import PhotosRequest from '../data/photos-request.js'

const defaultState = { request: PhotosRequest.NotStarted() };

export default (state = defaultState, action) => {

    switch(action.type) {
        case 'FETCH_PHOTOS_STARTED':
            return { request: PhotosRequest.Fetching() };
        case 'FETCH_PHOTOS_COMPLETE':
            return { request: PhotosRequest.Complete(action.payload) };
        case 'FETCH_PHOTOS_ERROR':
            return { request: PhotosRequest.Error('There was a problem fetching photos') };
        default:
            return state;
    }

};
