import React, {Component} from 'react';
import '../css/profile.css';
import {
    Container,
    Row,
    Col,
    Card,
} from "react-bootstrap";

class ProfilePage extends Component {
    constructor(props, context) {
        console.log("CHProfile Constructor");
        super(props, context);
    }
    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Row>
                        <Col md={8}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>Ali Asgher</Card.Title>

                                    <Card.Link href="#">Card Link</Card.Link>
                                    <Card.Link href="#">Another Link</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card
                                title="Tasks"
                                category="Backend development"
                                stats="Updated 3 minutes ago"
                                statsIcon="fa fa-history"
                                content={
                                    <div className="profile_card">
                                        <h1 className="name">{"Ali Asgher"}</h1>
                                        <label>Email: </label><p className="email">{"ali-asgher@coursehub.edu"}</p>
                                        <p className="Bio">{"Hi, I am blah blah blah..."}</p>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProfilePage;