import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import registerServiceWorker from './registerServiceWorker';

import { getPublicPhotoFeed, getInfo, getPublicPhotos } from './flickr-service.js';

import photosReducer from './reducers/public-photos.js';
import selectedUserReducer from './reducers/selected-user.js';

import UserProfile from './components/UserProfile/UserProfile.js';
import PhotoTiles from './components/PhotoTiles/PhotoTiles.js';

import './App.css';

const middleware = applyMiddleware(thunk, logger);
const combinedReducer = combineReducers({ photos: photosReducer, selectedUser: selectedUserReducer });
const store = createStore(combinedReducer, middleware);

store.dispatch(dispatch => {

    dispatch({ type: 'FETCH_PHOTOS_STARTED' });

    getPublicPhotoFeed(function(data) {
        dispatch({ type: 'FETCH_PHOTOS_COMPLETE', payload: data.items });
    }, function(error) {
        dispatch({ type: 'FETCH_PHOTOS_ERROR' });
    });

});

const selectUser = user_id => {

    store.dispatch(dispatch => {

        dispatch({ type: 'SET_SELECTED_USER', payload: user_id });

        getInfo(user_id, function(data) {
            dispatch({ type: 'SELECTED_USER_DETAILS_FETCHED', payload: data.person });
        }, function(error) {
            dispatch({ type: 'SELECTED_USER_DETAILS_ERROR' });
        });

        getPublicPhotos(user_id, function(data) {
            dispatch({ type: 'SELECTED_USER_PHOTOS_FETCHED', payload: data.photos.photo.slice(0, 5) });
        }, function(error) {
            //Do nothing
        });

    });

}

const cancelSelectUser = () => {
    store.dispatch({ type: 'CLEAR_SELECTED_USER' });
}

const ConnectedPhotoTiles = connect(
    state => {
        return {
            photos: state.photos.data
        }
    }, dispatch => {
        return {
            userClicked: userId => {
                selectUser(userId);
            }
        };
    }
)(PhotoTiles)

const ConnectedUserProfile = connect(
    state => {
        return {
            userDetails: state.selectedUser.details,
            userPhotos: state.selectedUser.photos
        }
    } , dispatch => {
        return {};
    }
)(UserProfile);

class App extends Component {
    getSelectedUserPopup() {
        if(this.props.userIsSelected) {
            return (<div>
                <div className="user-profile-popup-blocker" onClick={this.props.cancelSelectedUser}></div>
                <div className="user-profile-popup">
                    <ConnectedUserProfile />
                </div>
            </div>);
        } else {
            return null;
        }
    }
    getContent() {
        if(this.props.fetching) {
            return (<div className="loading">Loading...</div>);
        } else if (this.props.error) {
            return (<div className="error">There was a problem fetching photos from Flickr!</div>);
        } else {
            return (<ConnectedPhotoTiles />);
        }
    }
    render() {

        return (
            <div className="app">
                {this.getSelectedUserPopup()}
                {this.getContent()}
            </div>
        );
    }
}

const ConnectedApp = connect(
    state => {
        return {
            fetching: state.photos.fetching,
            error: state.photos.error,
            userIsSelected: state.selectedUser.id != null
        }
    }, dispatch => {
        return {
            cancelSelectedUser: () => {
                cancelSelectUser();
            }
        }
    }
)(App)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
