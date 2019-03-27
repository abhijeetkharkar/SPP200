import React, {Component} from 'react';
import '../css/profile.css';
import {
    Container,
} from "react-bootstrap";

class SettingsPage extends Component {
    constructor(props, context) {
        console.log("CHSettings Constructor");
        super(props, context);

        this.state = {
        };
    }

    componentDidMount() {
        console.log(this.props.email);
    }

    render() {
        return (
            <div className="content">
                <Container fluid>

                </Container>
            </div>
        );
    }
}

export default SettingsPage;