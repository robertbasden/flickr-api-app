import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import registerServiceWorker from './registerServiceWorker';
import jsonp from 'jsonp'

import './App.css';

const defaultState = {
    photos: [],
    fetching: false,
    error: false
};

const flickrReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'FETCH_STARTED':
            return { photos: [], fetching: true, error: true }
        case 'DATA_FETCHED':
            return { photos: action.payload, fetching: false, error: false };
            break;
        case 'DATA_ERROR':
            return { photos: [], fetching: false, error: true }
        default:
            return state;
            break;
    }
}

const middleware = applyMiddleware(thunk, logger);
const store = createStore(flickrReducer, middleware);

store.dispatch(dispatch => {
    dispatch({ type: 'FETCH_STARTED' });
    jsonp("https://api.flickr.com/services/feeds/photos_public.gne?format=json", {
        name: "jsonFlickrFeed"
    }, function(err, data) {
        if(err != null) {
            dispatch({ type: 'DATA_ERROR' });
        } else {
            dispatch({ type: 'DATA_FETCHED', payload: data.items });
        }
    });
});



class Tile extends Component {
    backgroundStyle(image) {
        const style = { backgroundImage: "url(" + image + ")" };
        return style;
    }
    title(title) {
        if (title.length > 0) {
            return title;
        } else {
            return "Untitled";
        }
    }
    author(author, author_id) {
        const authorName = author.match( /"(.*?)"/ )[1];
        return (<a href={'https://www.flickr.com/photos/' + author_id} target="_blank">{authorName}</a>);
    }
    tags(tags) {
        if(tags.length > 0) {
            return "Tags: " + tags.trim().split(" ").join(", ");
        } else {
            return "";
        }
    }
    render() {
        return (
            <div className="tile">
                <div className="image">
                    <a href={this.props.link} target="_blank" style={this.backgroundStyle(this.props.imageUrl)}></a>
                </div>
                <div className="title">
                    <a href={this.props.link} target="_blank">{this.title(this.props.title)}</a> by {this.author(this.props.author, this.props.author_id)}
                </div>
                <div className="tags">{this.tags(this.props.tags)}</div>
            </div>
        );
    }
}

class PhotoTiles extends Component {
    getPhotoKey(photo) {
        return photo.author_id + "_" + photo.media.m;
    }
    render() {
        const photoTiles = this.props.photos.map(photo => {
            return (<Tile
                key={this.getPhotoKey(photo)}
                imageUrl={photo.media.m}
                link={photo.link}
                title={photo.title}
                author_id={photo.author_id}
                author={photo.author}
                description={photo.description}
                tags={photo.tags} />);
        })
        return (
            <div className="tiles">{photoTiles}</div>
        );
    }
}

const mapStateToProps = state => {
    return {
        photos: state.photos
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const ConnectedPhotoTiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotoTiles)

class App extends Component {
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
                {this.getContent()}
            </div>
        );
    }
}

const appMapStateToProps = state => {
    return {
        fetching: state.fetching,
        error: state.error
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
