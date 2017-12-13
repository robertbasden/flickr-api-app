import React, { Component } from 'react';

import UserDetails from '../UserDetails/UserDetails.js';
import UserPhotos from '../UserPhotos/UserPhotos.js';

import './UserProfile.css';

export default class UserProfile extends Component {
    render() {

        let details = null;
        if (this.props.userDetails) {

            const user = {
                username: (this.props.userDetails.username == null) ? "" : this.props.userDetails.username._content,
                realname: (this.props.userDetails.realname == null) ? "" : this.props.userDetails.realname._content,
                location: (this.props.userDetails.location == null) ? "" : this.props.userDetails.location._content,
                description: (this.props.userDetails.description == null) ? "" : this.props.userDetails.description._content
            };

            details = (<UserDetails
                thumbNail=""
                username={user.username}
                realname={user.realname}
                location={user.location}
                description={user.description} />);

        }

        let photos = null;
        if (this.props.userPhotos) {
            photos = (<UserPhotos photos={this.props.userPhotos} />);
        }

        return (<div className="user-profile">
            <div className="user-profile__details">{details}</div>
            <div className="user-profile__photos">{photos}</div>
        </div>);
    }
}
