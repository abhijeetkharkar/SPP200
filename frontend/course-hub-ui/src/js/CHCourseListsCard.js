import {Button, Card, Col, Form, Row} from "react-bootstrap";
import React, {Component} from "react";

class CHCourseListsCard extends Component {

    constructor(props, context) {
        super(props, context);
        this.state ={
            password: "",
            serverErrorMsg: "",
            elastic_message: "",
        }
    }

    render() {
        return(
            <div className="courses-content">
                <Card className="favorites-courses-card">
                    <Card.Title className="card-title">Favorites</Card.Title>
                    <Card.Body>

                    </Card.Body>
                </Card>
                <br/>
                <Card className="taking-courses-card">
                    <Card.Title className="card-title">In Progress</Card.Title>
                    <Card.Body>

                    </Card.Body>
                </Card>
                <br/>
                <Card className="completed-courses-card">
                    <Card.Title className="card-title">Completed</Card.Title>
                    <Card.Body>

                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default CHCourseListsCard;

