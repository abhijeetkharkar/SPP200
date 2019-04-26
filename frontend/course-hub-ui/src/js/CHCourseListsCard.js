import {Card, Col, Image, Row, Button} from "react-bootstrap";
import React, {Component} from "react";
import {faClock, faExchangeAlt} from "@fortawesome/free-solid-svg-icons";
import {faWater} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import StarRatingComponent from 'react-star-rating-component';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import '../css/profile.css';


class CHCourseListsCard extends Component {

    constructor(props, context) {
        super(props, context);
    }

    switchList(){

    }

    render() {
        return(
            <div className="courses-content">
                <Card className="favorites-courses-card">
                    <Card.Title className="card-title">Favorites</Card.Title>
                    <Card.Body>
                        {
                            this.props.favoriteList.map(item => {
                                return (
                                    <div className="profile-course-list-item">
                                        <Row id={item.CourseId} className="modal-body-row">
                                            <Col md={3} >
                                                <Image className="profile-list-course-image" src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                                            </Col>
                                            <Col md={9}>
                                                <Row>
                                                    COURSE
                                                    <Col md={1}></Col>
                                                    <Col md={10}>
                                                        <UncontrolledDropdown >
                                                            <DropdownToggle className="course-list-button" style={{float: "right"}}>
                                                                    <span style={{fontSize: "27px", padding: "0"}}>
                                                                        <FontAwesomeIcon icon={faExchangeAlt} style={{color: "grey", height: "20px"}} className="exchange-sign"/>
                                                                    </span>
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{marginLeft: "66%", marginTop: "7%"}}>
                                                                <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Switch List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem>Move to In-Progress List</DropdownItem>
                                                                <DropdownItem>Move to Completed List</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Col>
                                                </Row>
                                                <Row className="profile-list-course-title">
                                                    <a href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                                </Row>
                                                <Row>
                                                    <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                    <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => item.InstructorName).toString(): "")}
                                                </Row>
                                                <br/>
                                                <Row>
                                                    <FontAwesomeIcon icon={faClock} style={{color: "grey", height: "18px", width: "18px"}}/> &nbsp; {item.CourseDuration? " " + item.CourseDuration.Value + " " + item.CourseDuration.Unit: " 1 hr"}
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <FontAwesomeIcon icon={faWater} style={{color: "grey", height: "20px", width: "20px", fontWeight: "bold"}}/> &nbsp; {item.Difficulty ? item.Difficulty.toUpperCase(): ""}
                                                    <span className="profile-course-data-rating">
                                                        <StarRatingComponent
                                                            starCount={5}
                                                            value={item.Rating + 1}
                                                            editing={false}
                                                            emptyStarColor={"grey"}
                                                            style = {{position: "inherit !important"}}
                                                            size='2x'
                                                        />
                                                    </span>
                                                </Row>

                                            </Col>
                                        </Row>
                                    </div>
                                );
                            })
                        }
                    </Card.Body>
                </Card>
                <br/>
                <br/>
                <Card className="taking-courses-card">
                    <Card.Title className="card-title">In Progress</Card.Title>
                    <Card.Body>
                        {
                            this.props.inProgressList.map(item => {
                                return (
                                    <div className="profile-course-list-item">
                                        <Row id={item.CourseId} className="modal-body-row">
                                            <Col md={3} >
                                                <Image className="profile-list-course-image" src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                                            </Col>
                                            <Col md={9}>
                                                <Row>
                                                    COURSE
                                                    <Col md={1}></Col>
                                                    <Col md={10}>
                                                        <UncontrolledDropdown >
                                                            <DropdownToggle className="course-list-button" style={{float: "right"}}>
                                                                    <span style={{fontSize: "27px", padding: "0"}}>
                                                                        <FontAwesomeIcon icon={faExchangeAlt} style={{color: "grey", height: "20px"}} className="exchange-sign"/>
                                                                    </span>
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{marginLeft: "66%", marginTop: "7%"}}>
                                                                <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Switch List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem>Move to Favorites List</DropdownItem>
                                                                <DropdownItem>Move to Completed List</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Col>
                                                </Row>
                                                <Row className="profile-list-course-title">
                                                    <a href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                                </Row>
                                                <Row>
                                                    <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                    <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => item.InstructorName).toString(): "")}
                                                </Row>
                                                <br/>
                                                <Row>
                                                    <FontAwesomeIcon icon={faClock} style={{color: "grey", height: "18px", width: "18px"}}/> &nbsp; {item.CourseDuration? " " + item.CourseDuration.Value + " " + item.CourseDuration.Unit: " 1 hr"}
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <FontAwesomeIcon icon={faWater} style={{color: "grey", height: "20px", width: "20px", fontWeight: "bold"}}/> &nbsp; {item.Difficulty ? item.Difficulty.toUpperCase(): ""}
                                                    <span className="profile-course-data-rating">
                                                        <StarRatingComponent
                                                            starCount={5}
                                                            value={item.Rating + 1}
                                                            editing={false}
                                                            emptyStarColor={"grey"}
                                                            style = {{position: "inherit !important"}}
                                                            size='2x'
                                                        />
                                                    </span>
                                                </Row>

                                            </Col>
                                        </Row>
                                    </div>
                                );
                            })
                        }
                    </Card.Body>
                </Card>
                <br/>
                <br/>
                <Card className="completed-courses-card">
                    <Card.Title className="card-title">Completed</Card.Title>
                    <Card.Body>
                        {
                            this.props.completedList.map(item => {
                                return (
                                    <div className="profile-course-list-item">
                                        <Row id={item.CourseId} className="modal-body-row">
                                            <Col md={3} >
                                                <Image className="profile-list-course-image" src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                                            </Col>
                                            <Col md={9}>
                                                <Row>
                                                    COURSE
                                                    <Col md={1}></Col>
                                                    <Col md={10}>
                                                        <UncontrolledDropdown >
                                                            <DropdownToggle className="course-list-button" style={{float: "right"}}>
                                                                    <span style={{fontSize: "27px", padding: "0"}}>
                                                                        <FontAwesomeIcon icon={faExchangeAlt} style={{color: "grey", height: "20px"}} className="exchange-sign"/>
                                                                    </span>
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{marginLeft: "66%", marginTop: "7%"}}>
                                                                <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Switch List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem>Move to Favorites List</DropdownItem>
                                                                <DropdownItem>Move to In-Progress List</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Col>
                                                </Row>
                                                <Row className="profile-list-course-title">
                                                    <a href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                                </Row>
                                                <Row>
                                                    <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                    <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => item.InstructorName).toString(): "")}
                                                </Row>
                                                <br/>
                                                <Row>
                                                    <FontAwesomeIcon icon={faClock} style={{color: "grey", height: "18px", width: "18px"}}/> &nbsp; {item.CourseDuration? " " + item.CourseDuration.Value + " " + item.CourseDuration.Unit: " 1 hr"}
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <FontAwesomeIcon icon={faWater} style={{color: "grey", height: "20px", width: "20px", fontWeight: "bold"}}/> &nbsp; {item.Difficulty ? item.Difficulty.toUpperCase(): ""}
                                                    <span className="profile-course-data-rating">
                                                        <StarRatingComponent
                                                            starCount={5}
                                                            value={item.Rating + 1}
                                                            editing={false}
                                                            emptyStarColor={"grey"}
                                                            style = {{position: "inherit !important"}}
                                                            size='2x'
                                                        />
                                                    </span>
                                                </Row>

                                            </Col>
                                        </Row>
                                    </div>
                                );
                            })
                        }
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default CHCourseListsCard;

