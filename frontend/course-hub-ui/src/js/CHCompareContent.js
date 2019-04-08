import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/compare.css';
import {Image, Col, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import StarRatingComponent from 'react-star-rating-component';

class CHCompareContent extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            compareList: (JSON.parse(sessionStorage.getItem("compareList"))) ?
                JSON.parse(sessionStorage.getItem("compareList")) : [],
        };
    }

    render() {
        return (
            <div className="compare-main-table">
                <div style={{textAlign: "center"}}>
                    <h1 className="compare-table-heading">Compare Courses</h1>
                </div>
                <hr/>
                <div>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Course</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <Row>
                                            <Image className="compare-table-course-image" width={150} height={130} src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                                        </Row>
                                        <Row>
                                            <a className="compare-table-course-title" href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                        </Row>
                                        <Row>
                                            By <p className="compare-table-course-text">"{item.CourseProvider}"</p>
                                        </Row>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Category</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <p className="compare-table-course-text">{item.Category.length != 0 ? item.Category: "None"}</p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Duration</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <p className="compare-table-course-text">
                                            <FontAwesomeIcon icon={['fa', 'clock']} color='rgb(207, 204, 19)' />{item.CourseDuration? " " + item.CourseDuration.Value + " " + item.CourseDuration.Unit: " 1 hr"}
                                        </p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Price</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <p className="compare-table-course-text">
                                            ${item.Price}
                                        </p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Difficuly</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <p className="compare-table-course-text">
                                            {item.Difficulty ? item.Difficulty.toUpperCase(): "None"}
                                        </p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Instructors</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <p className="compare-table-course-text">
                                            {item.Instructors? item.Instructors.map(item => ("  " + item.InstructorName)).toString(): ""}
                                        </p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="compare-table-row">
                        <Col md={2}><h5 className="compare-table-row-heading">Ratings</h5></Col>
                        {this.state.compareList.map(item => {
                            return (
                                <Col md={Math.floor(9 / this.state.compareList.length)} className="compare-table-col">
                                    <div className="compare-table-course-summary">
                                        <StarRatingComponent
                                            starCount={5}
                                            value={item.Rating + 1}
                                            editing={false}
                                            emptyStarColor={"#5e5d25"}
                                            style = {{position: "inherit !important"}}
                                            size='2x'
                                        />
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </div>

            </div>
        );
    }
}

export default CHCompareContent;