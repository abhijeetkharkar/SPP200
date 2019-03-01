import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown } from 'react-bootstrap';
import firebaseInitialization from '../initializeFirebase';

class CHNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleViewProfile = this.handleViewProfile.bind(this);
    }

    handleSignOut = e => {
        const self = this;
        firebaseInitialization.auth().signOut().then(function () {
            self.props.updateContent("home", null, null, null);
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleViewProfile = e => {
        this.props.updateContent("home", null, null, null);
    }

    render() {
        // const self = this;

        return (
            <div id="homeHeader">
                {/* <div id="website-name-container"> */}
                <h1 className="website-name">Course-Hub</h1>
                {/* </div> */}
                <div id="website-navigators-container">
                    {!this.props.signedIn &&
                        <Button className="my-nav-tabs" onClick={(e) => this.props.updateContent("loginScreen", null, null, null)}>
                            <FontAwesomeIcon icon="sign-in-alt" />
                            &nbsp;&nbsp;Login/Signup
                        </Button>
                    }

                    {this.props.signedIn &&
                        <Dropdown>
                            <Dropdown.Toggle className="my-nav-tabs" id="signedInOptions">
                                Hello, Madarchod&nbsp;&nbsp;
                                {/* <FontAwesomeIcon icon="angle-down"/> */}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={this.handleViewProfile}>View Profile</Dropdown.Item>
                                <Dropdown.Item onClick={this.handleSignOut}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }

                    <Button className="my-nav-tabs">Deals</Button>
                </div>
            </div>
        );
    }   
}

export default CHNavigator;