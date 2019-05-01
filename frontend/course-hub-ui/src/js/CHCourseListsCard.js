import {Card, Col, Image, Row, Button} from "react-bootstrap";
import React, {Component} from "react";
import {faClock, faExchangeAlt} from "@fortawesome/free-solid-svg-icons";
import {faWater} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import StarRatingComponent from 'react-star-rating-component';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import '../css/profile.css';
import {updateUser} from "../elasticSearch";


class CHCourseListsCard extends Component {

    constructor(props, context) {
        super(props, context);
    }

    switchList = async (removeList, addList, item) => {
        var prevListMap;
        switch(removeList){
            case "1":
                prevListMap = this.props.favoriteList.map(function(obj){ return obj.CourseId });
                break;
            case "2":
                prevListMap = this.props.inProgressList.map(function(obj){ return obj.CourseId });
                break;
            case "3":
                prevListMap = this.props.completedList.map(function(obj){ return obj.CourseId });
        }

        let idx = prevListMap.indexOf(item.CourseId);
        prevListMap.splice(idx, 1);
        switch(removeList){
            case "1":
                this.props.favoriteList.splice(idx, 1);
                break;
            case "2":
                this.props.inProgressList.splice(idx, 1);
                break;
            case "3":
                this.props.completedList.splice(idx, 1);
        }

        if (addList != null){
            switch(addList){
                case "1":
                    this.props.favoriteList.push(item);
                    break;
                case "2":
                    this.props.inProgressList.push(item);
                    break;
                case "3":
                    this.props.completedList.push(item);
            }
        }

        this.setState({isOpen: false});
        var payload = {
            "doc": {
                "FavouriteCourses": this.props.favoriteList,
                "CoursesinProgress": this.props.inProgressList,
                "CoursesTaken": this.props.completedList,
            }
        };
        try {
            var response = await updateUser(this.props.user_id, payload);
            // console.log(response);
            if(response === false){
                alert("Error in updating lists in database... Try again");
            }
        } catch (error) {
            alert("Error in updating lists in database... Try again");
        }
    };

    render() {
        return(
            <div className="courses-content">
                <Card className="favorites-courses-card">
                    <Card.Title className="card-title">Favorites</Card.Title>
                    <Card.Body>
                        {
                            this.props.favoriteList.map((item, index) => {
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
                                                            <DropdownToggle id={"course-list-button-id-" + index} className="course-list-button" style={{float: "right"}}>
                                                                    <span style={{fontSize: "27px", padding: "0"}}>
                                                                        <FontAwesomeIcon icon={faExchangeAlt} style={{color: "grey", height: "20px"}} className="exchange-sign"/>
                                                                    </span>
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{marginLeft: "66%", marginTop: "7%", zIndex: "1"}}>
                                                                <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Switch List</DropdownItem>
                                                                <DropdownItem onClick={() => {this.switchList("1", "2", item)}}>Move to In-Progress List</DropdownItem>
                                                                <DropdownItem onClick={() => {this.switchList("1", "3", item)}}>Move to Completed List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <div className="course-list-remove-button">
                                                                    <Button id={"course-list-remove-button-id-" + index} variant="danger" onClick={() => {this.switchList("1", null, item)}}>Remove</Button>
                                                                </div>

                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Col>
                                                </Row>
                                                <Row className="profile-list-course-title">
                                                    <a id={"profile-list-course-title-"+index} href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                                </Row>
                                                <Row>
                                                    <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                    <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => " " + item.InstructorName ).splice(0, 3).toString(): " ")}
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
                                                            <DropdownMenu style={{marginLeft: "66%", marginTop: "7%", zIndex: "1"}}>
                                                                <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Switch List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => {this.switchList("2", "1", item)}}>Move to Favorites List</DropdownItem>
                                                                <DropdownItem onClick={() => {this.switchList("2", "3", item)}}>Move to Completed List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <div className="course-list-remove-button">
                                                                    <Button variant="danger" onClick={() => {this.switchList("2", null, item)}}>Remove</Button>
                                                                </div>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Col>
                                                </Row>
                                                <Row className="profile-list-course-title">
                                                    <a href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                                </Row>
                                                <Row>
                                                    <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                    <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => " " + item.InstructorName ).splice(0, 3).toString(): " ")}
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
                                                            <DropdownMenu style={{marginLeft: "66%", marginTop: "7%", zIndex: "1"}}>
                                                                <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Switch List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <DropdownItem onClick={() => {this.switchList("3", "1", item)}}>Move to Favorites List</DropdownItem>
                                                                <DropdownItem onClick={() => {this.switchList("3", "2", item)}}>Move to In-Progress List</DropdownItem>
                                                                <DropdownItem divider />
                                                                <div className="course-list-remove-button">
                                                                    <Button variant="danger" onClick={() => {this.switchList("3", null, item)}}>Remove</Button>
                                                                </div>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Col>
                                                </Row>
                                                <Row className="profile-list-course-title">
                                                    <a href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                                </Row>
                                                <Row>
                                                    <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                    <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => " " + item.InstructorName ).splice(0, 3).toString(): " ")}
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

