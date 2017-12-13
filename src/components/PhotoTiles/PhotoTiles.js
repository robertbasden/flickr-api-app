import React, { Component } from 'react';

import './PhotoTiles.css';

class Tile extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
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
    handleClick(e) {
        e.preventDefault();
        this.props.userClicked(this.props.authorId);
    }
    author(author, authorId) {
        const authorName = author.match( /"(.*?)"/ )[1];
        return (<a href={'https://www.flickr.com/photos/' + authorId} onClick={this.handleClick} target="_blank">{authorName}</a>);
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
            <div className="photo-tiles__tile">
                <div className="photo-tiles__tile__image">
                    <a href={this.props.link} target="_blank" style={this.backgroundStyle(this.props.imageUrl)}>
                        {this.props.title}
                    </a>
                </div>
                <div className="photo-tiles__tile__title">
                    <a href={this.props.link} target="_blank">{this.title(this.props.title)}</a> by {this.author(this.props.author, this.props.authorId)}
                </div>
                <div className="photo-tiles__tile__tags">{this.tags(this.props.tags)}</div>
            </div>
        );
    }
}

export default class PhotoTiles extends Component {
    getPhotoKey(photo) {
        return photo.author_id + "_" + photo.media.m;
    }
    render() {
        if(this.props.fetching) {
            return (<div className="photo-tiles__loading">Loading...</div>);
        } else if(this.props.error) {
            return (<div className="photo-tiles__error">There was a problem fetching photos from Flickr!</div>);
        } else {

            const photoTiles = this.props.photos.map(photo => {
                return (<Tile
                    key={this.getPhotoKey(photo)}
                    imageUrl={photo.media.m}
                    link={photo.link}
                    title={photo.title}
                    authorId={photo.author_id}
                    author={photo.author}
                    description={photo.description}
                    tags={photo.tags}
                    userClicked={this.props.userClicked} />);
            })

            return (
                <div className="photo-tiles">{photoTiles}</div>
            );

        }

    }
}
