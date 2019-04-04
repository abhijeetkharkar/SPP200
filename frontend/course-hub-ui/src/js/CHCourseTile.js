import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import '../css/coursedetails.css'
import { Table, Button, Image, Card, Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarRatings from 'react-star-ratings';
import { getCourseDetail } from '../elasticSearch';
import CHReview from './CHReviews'
import Gauge from 'react-radial-gauge';
const fetch = require('node-fetch');

class CHCourseTile extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            Title: '',
            Description: '',
            Category: null,
            CourseDuration: null,
            CourseImage: null,
            CourseProvider: '',
            Instructors: null,
            Paid: false,
            Price: 0.0,
            PriceCurrency: '',
            Rating: 0.0,
            SelfPaced: true,
            StartDate: null,
            URL: null,
            last_updated: null,
            Difficulty: '',
            imgHeight: 0,
            imgWidth: 0,
            email:'',
            signedIn:'',
            firstName:'',
            courseId:''
        }
        this.onImageLoad = this.onImageLoad.bind(this);
    }
    onImageLoad({ target: img }) {
        this.setState({ imgHeight: img.offsetHeight, imgWidth: img.offsetWidth });
    }

    getWidthAndHeight() {
        console.log("'" + this.name + "' is " + this.width + " by " + this.height + " pixels in size.");
        return true;
    }
    componentDidMount() {
        // console.log("In CHSearchContent, componentDidMount");
        console.log('course tile: ', this.props.courseId)
        var payload = {
            "query": {
                "term": { "CourseId": this.props.courseId }
            }
        }
        console.log(JSON.stringify(payload))
        fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "courses/_search/",
            {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return response.json();
            }).then(coursees => {
                var coursehits = coursees.hits.hits
                var courseInfo = {}
                if (coursehits.length > 0) {
                    courseInfo = coursehits[0]._source
                    this.setState({
                        Title: courseInfo.Title, Description: courseInfo.Description, Category: courseInfo.Category,
                        CourseDuration: courseInfo.CourseDuration, CourseImage: courseInfo.CourseImage, CourseProvider: courseInfo.CourseProvider
                        , Instructors: courseInfo.Instructors, Paid: courseInfo.Paid, Price: courseInfo.Price, PriceCurrency: courseInfo.PriceCurrency,
                        Rating: courseInfo.Rating, SelfPaced: courseInfo.SelfPaced, StartDate: courseInfo.StartDate, URL: courseInfo.URL, last_updated: courseInfo.last_updated,
                        Difficulty: courseInfo.Difficulty
                    });
                }
            }).catch(error => {
                console.log("Error in elastic search api is ", error)
                return false;
            });
    }

    render() {
        console.log("render method called");
        var customStyle = {
            marginTop: window.outerHeight * 0.11
        }
        return (
            <div className='course-tile' style={customStyle}>
                <div className='course-tile-card'>
                    <div className="course-image-div">
                        <img className="course-image" onLoad={this.onImageLoad} src={this.state.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                    </div>
                    <div className="course-features" style={{ height: this.state.imgHeight }}>
                        <span className='rating-div' >
                        <StarRatings rating={this.state.Rating} starRatedColor="#CCCC00" starHoverColor="#CCCC00" starEmptyColor="grey" changeRating={true} numberOfStars={5} name='rating' starDimension="30px" starSpacing="4px" />
                        <Badge pill variant="info" style={{display:"inline", float:"right",paddingRight:"3%",fontSize:"20px",color:"white",backgroundColor:"black"}}>{this.state.Rating}/5.0</Badge>
                        </span>
                        <div className="course-price-details">
                            {this.state.Price > 0 && <span className='price-span'><FontAwesomeIcon className="price-button-font" icon={['fa', 'money-check-alt']} size='2x' color='rgb(0, 0, 0)' /><text className='price-tag'>{this.state.Price}</text></span>}
                            {this.state.Price === 0 && <span className='price-span'><FontAwesomeIcon className="price-button-font" icon={['fa', 'money-check-alt']} size='2x' color='rgb(0, 0, 0)' /><text className='price-tag'>Free</text></span>}
                        </div>
                        <div className="course-duration">
                            {this.state.CourseDuration &&
                                <span className='duration-span'>
                                    <FontAwesomeIcon className="duration-button-font" icon={['fa', 'clock']} size='2x' color='rgb(0, 0, 0)' />
                                    <p className='duration-tag'>&nbsp;{this.state.CourseDuration.Value}&nbsp;{this.state.CourseDuration.Unit}</p>
                                </span>
                            }
                        </div>
                        <div className="course-difficulty">
                            {(this.state.Difficulty.toLowerCase() === "advanced" || this.state.Difficulty.toLowerCase() === "hard") && <OverlayTrigger className="redirect-badge" placement="top" overlay={<Tooltip id="tooltip-difficulty" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Difficulty</strong></Tooltip>}><span> <Gauge className="gauge-icon" currentValue={100} size={37} progressColor="red" /><p className="diff-text">Advanced</p></span></OverlayTrigger>}
                            {(this.state.Difficulty.toLowerCase() === "intermediate" || this.state.Difficulty.toLowerCase() === "medium") && <OverlayTrigger className="redirect-badge" placement="top" overlay={<Tooltip id="tooltip-difficulty" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Difficulty</strong></Tooltip>}><span> <Gauge className="gauge-icon" currentValue={100} size={37} progressColor="#CCCC00" /><p className="diff-text">Intermediate</p></span></OverlayTrigger>}
                            {(this.state.Difficulty.toLowerCase() === "easy" || this.state.Difficulty.toLowerCase() === "introductory") && <OverlayTrigger className="redirect-badge" placement="top" overlay={<Tooltip id="tooltip-difficulty" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Difficulty</strong></Tooltip>}><span> <Gauge className="gauge-icon" currentValue={100} size={37} progressColor="green" /><p className="diff-text">Introductory</p></span></OverlayTrigger>}

                        </div>
                        <div className="course-pace">
                            {this.state.SelfPaced &&<OverlayTrigger className="redirect-badge" placement="right" overlay={<Tooltip id="tooltip-pace" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Pace</strong></Tooltip>}><span className="pace-span" ><FontAwesomeIcon className="pace-icon" icon={['fa', 'walking']} size='1x' color='rgb(0, 0, 0)' /><text className="pace-text">Self Paced</text></span></OverlayTrigger>}
                            {!this.state.SelfPaced && <OverlayTrigger className="redirect-badge" placement="right" overlay={<Tooltip id="tooltip-pace" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Pace</strong></Tooltip>}><span className="pace-span" ><FontAwesomeIcon className="pace-icon" icon={['fa', 'walking']} size='1x' color='rgb(0, 0, 0)' /><text className="pace-text">Supervised</text></span></OverlayTrigger>}
                        

                        </div>
                        <div className="course-posted">
                            {
                                !this.state.last_updated &&<OverlayTrigger className="redirect-badge" placement="right" overlay={<Tooltip id="tooltip-calendar" className="course-tooltip" style={{opacity:"0.6"}}><strong>Date Posted</strong></Tooltip>}>
                            <span className="calendar-span" ><FontAwesomeIcon className="calendar-icon" icon={['fa', 'calendar']} size='1x' color='rgb(0, 0, 0)' /><text className="calendar-text">03-27-2019</text></span></OverlayTrigger>
                        }
                        </div>

                    </div>
                    <div className="course-tile-body">
                        <div className="author-image-div">
                            <text style={{fontSize:"12px"}}><strong >Authors:</strong></text>
                            {(this.state.Instructors != null && this.state.Instructors.length > 0) ?
                                this.state.Instructors.map(item => {
                                    return (
                                        <span className="author-span" style={{fontSize:"12px"}} > <Image className="author-image" roundedCircle src={item.ProfilePic
                                            || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3vYRkfHteVj3g5Vd_-tRnHhSgLSJHL2IUDU0pOQCFDyWk7_9seQ'} fluid={true} />&nbsp;&nbsp;<strong>{item.InstructorName}</strong></span>

                                    );
                                }) : []
                            }
                        </div>
                        <br></br>
                        <OverlayTrigger className="redirect-badge" placement="left" overlay={<Tooltip id="tooltip" className="course-tooltip" style={{opacity:"0.6"}}><strong>Visit Course</strong></Tooltip>}>
                        <span className="course-title">
                            <a style={{float:"left",fontSize:"20pt",color:"blue"}} href={this.state.URL} target="_blank">{this.state.Title}</a>
                        </span>
                        </OverlayTrigger>
                        <span className="course-desc-span">
                            <p style={{ marginTop: "5%" }} className="course-details"><div dangerouslySetInnerHTML={{ __html: this.state.Description }} /></p>
                        </span>
                        <hr />
                        <div className="reviews-div">
                            {this.props.signedIn && <CHReview signedIn={true} courseId={this.props.courseId} firstName={this.props.firstName} email={this.props.email} key="courseReview"/>}
                            {!this.props.signedIn && <CHReview signedIn={false} courseId={this.props.courseId} firstName={"Anonymus"} email={''} key="courseReview"/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CHCourseTile;