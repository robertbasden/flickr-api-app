import React, { Component } from 'react';

import './UserDetails.css';

export default class UserDetails extends Component {
    descriptionMarkup(description) {
        return { __html: description };
    }
    render() {
        return (
            <div className="user-details">
                <div className="user-details__description">
                    <div className="user-details__description__username">{this.props.username}</div>
                    <div>{this.props.realname}</div>
                    <div>{this.props.location}</div>
                    <div dangerouslySetInnerHTML={this.descriptionMarkup(this.props.description)}></div>
                </div>
            </div>
        );
    }
}
