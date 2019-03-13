import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/profile.css';

import {Navbar, Nav} from "react-bootstrap";

class ProfileNavigator extends Component {

    constructor(props, context) {
        super(props, context);
    }



    render() {
        return (
            <div className="profile-navigator">
                <ul className="navbar">
                    <a href="#" className="navlink">
                        <li href="#" className="nav-listitem">
                            Profile
                        </li>
                    </a>
                    <a href="#" className="navlink">
                        <li className="nav-listitem">
                            Reviews
                        </li>
                    </a>
                    <a href="#" className="navlink">
                        <li className="nav-listitem">
                            Courses
                        </li>
                    </a>
                </ul>
            </div>
        );
    }
}

export default ProfileNavigator;