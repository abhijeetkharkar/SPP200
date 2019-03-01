import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import {Navbar, Nav} from "react-bootstrap";

class ProfileNavigator extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div id="profile-navigator">
                <Navbar bg="light" expand="lg">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Profile</Nav.Link>
                            <Nav.Link href="#link">Courses</Nav.Link>
                            <Nav.Link href="#link">Reviews</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default ProfileNavigator;