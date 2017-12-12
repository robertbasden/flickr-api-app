import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import registerServiceWorker from './registerServiceWorker';

import { getPublicPhotoFeed, getInfo, getPublicPhotos } from './flickr-service.js';
import './App.css';

import UserDetails from './components/UserDetails/UserDetails.js';
import UserPhotos from './components/UserPhotos/UserPhotos.js';
import PhotoTiles from './components/PhotoTiles/PhotoTiles.js';

const defaultState = {
    photos: [],
    fetching: false,
    error: false
};

const photosReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'FETCH_STARTED':
            return { data: [], fetching: true, error: true }
        case 'DATA_FETCHED':
            return { data: action.payload, fetching: false, error: false };
            break;
        case 'DATA_ERROR':
            return { data: [], fetching: false, error: true }
        default:
            return state;
            break;
    }
}

const defaultSelectedUserState = {
    user: null,
    photos: null
};

const selectedUserReducer = (state = defaultSelectedUserState, action) => {
    switch(action.type) {
        case 'FETCH_USER_CANCELLED':
            return { user: null, fetching: false, error: false, photos: null };
        case 'FETCH_USER_STARTED':
            return { ...state, user: null, fetching: true, error: false, photos: null };
        case 'FETCH_USER_COMPLETE':
            return {...state, user: action.payload, fetching: false, error: false };
            break;
        case 'FETCH_USER_ERROR':
            return { ...state, user: null, fetching: false, error: true, photos: null };
        case 'FETCH_USER_PHOTOS_COMPLETE':
            return {...state, photos: action.payload };
        default:
            return state;
            break;
    }
}



const middleware = applyMiddleware(thunk, logger);
const combinedReducer = combineReducers({ photos: photosReducer, selectedUser: selectedUserReducer });
const store = createStore(combinedReducer, middleware);

store.dispatch(dispatch => {

    dispatch({ type: 'FETCH_STARTED' });

    getPublicPhotoFeed(function(data) {
        dispatch({ type: 'DATA_FETCHED', payload: data.items });
    }, function(error) {
        dispatch({ type: 'DATA_ERROR' });
    });

});

const selectUser = user_id => {

    store.dispatch(dispatch => {

        dispatch({ type: 'FETCH_USER_STARTED' });

        getInfo(user_id, function(data) {
            dispatch({ type: 'FETCH_USER_COMPLETE', payload: data.person });
        }, function(error) {
            dispatch({ type: 'FETCH_USER_ERROR' });
        });

        getPublicPhotos(user_id, function(data) {
            dispatch({ type: 'FETCH_USER_PHOTOS_COMPLETE', payload: data.photos.photo.slice(0, 5) });
        }, function(error) {
            //Do nothing
        });

    });

}

const cancelSelectUser = () => {
    store.dispatch({ type: 'FETCH_USER_CANCELLED' });
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

class App extends Component {
    cancel() {
        cancelSelectUser();
    }
    getThumbnailUrl() {
        return
    }
    photos() {
        if(this.props.selectedUserPhotos != null) {
            return (<UserPhotos photos={this.props.selectedUserPhotos} />);
        } else {
            return;
        }
    }
    getSelectedUserPopup() {
        console.log(this.props.selectedUser);
        if(this.props.selectedUser == null) {
            return (<div></div>)
        } else {
            const user = {
                username: (this.props.selectedUser.username == null) ? "" : this.props.selectedUser.username._content,
                realname: (this.props.selectedUser.realname == null) ? "" : this.props.selectedUser.realname._content,
                location: (this.props.selectedUser.location == null) ? "" : this.props.selectedUser.location._content,
                description: (this.props.selectedUser.description == null) ? "" : this.props.selectedUser.description._content
            };
            return (<div>
                <div className="user-details-blocker" onClick={this.cancel}></div>
                <div className="user-details">
                    <UserDetails
                        thumbNail={this.getThumbnailUrl()}
                        username={user.username}
                        realname={user.realname}
                        location={user.location}
                        description={user.description} />
                    {this.photos()}
                </div>
            </div>);
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

const appMapStateToProps = state => {
    return {
        fetching: state.photos.fetching,
        error: state.photos.error,
        selectedUser: state.selectedUser.user,
        selectedUserPhotos: state.selectedUser.photos
    }
}

const appMapDispatchToProps = dispatch => {
    return {}
}

const ConnectedApp = connect(
  appMapStateToProps,
  appMapDispatchToProps
)(App)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
