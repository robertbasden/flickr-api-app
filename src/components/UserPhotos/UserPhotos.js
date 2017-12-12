import React, { Component } from 'react';

import './UserPhotos.css';

export default class UserPhotos extends Component {
    render () {
        const photos = this.props.photos.map(photo => {
            const thumbNailUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`;
            return (<img className="user-photos__photo" src={thumbNailUrl} />);
        });
        return (<div className="user-photos">{photos}</div>)
    }
}
