import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CHNavigator extends Component {
    render() {

        return (
            <div id="homeHeader">
                {/* <div id="website-name-container"> */}
                    <h1 className="website-name">Course-Hub</h1>
                {/* </div> */}
                <div id="website-navigators-container">
                    <button className="my-nav-tabs"><FontAwesomeIcon icon="sign-in-alt" /> Login/Signup</button>
                    <button className="my-nav-tabs">Deals</button>
                </div>
            </div>
        );
    }
}

/* export class CHNavigatorLanding extends Component {
    render() {

        return (
            <div id="homeHeader">
                <div id="website-navigators-container">
                    <button className="my-nav-tabs"><FontAwesomeIcon icon="sign-in-alt" /> Login/Signup</button>
                    <button className="my-nav-tabs">Deals</button>
                </div>
            </div>
        );
    }
} */

export default CHNavigator;