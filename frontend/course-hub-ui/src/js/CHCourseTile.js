import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import '../css/course-details.css'
import { Button, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarRatings from 'react-star-ratings';
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
            courseId:'',
            writeReview: false
        }
        this.onImageLoad = this.onImageLoad.bind(this);
        this.handleWriteReviewClick = this.handleWriteReviewClick.bind(this);
    }

    onImageLoad({ target: img }) {
        this.setState({ imgHeight: img.offsetHeight, imgWidth: img.offsetWidth });
    }

    getWidthAndHeight() {
        // console.log("'" + this.name + "' is " + this.width + " by " + this.height + " pixels in size.");
        return true;
    }

    componentWillMount() {
        console.log("In CHCourseTile, componentWillMount");
        // console.log('course tile: ', this.props.courseId);
        var payload = {
            "query": {
                "term": { "CourseId": this.props.courseId }
            }
        }
        // console.log(JSON.stringify(payload))
        fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "courses/_search/",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(coursees => {
            var coursehits = coursees.hits.hits;
            var courseInfo = {};
            if (coursehits.length > 0) {
                courseInfo = coursehits[0]._source;
                this.setState({
                    Title: courseInfo.Title, Description: courseInfo.Description, Category: courseInfo.Category,
                    CourseDuration: courseInfo.CourseDuration, CourseImage: courseInfo.CourseImage, 
                    CourseProvider: courseInfo.CourseProvider, Instructors: courseInfo.Instructors, 
                    Paid: courseInfo.Paid, Price: courseInfo.Price, PriceCurrency: courseInfo.PriceCurrency,
                    Rating: courseInfo.Rating, SelfPaced: courseInfo.SelfPaced, StartDate: courseInfo.StartDate, 
                    URL: courseInfo.URL, last_updated: courseInfo.last_updated, Difficulty: courseInfo.Difficulty
                });
            }
        }).catch(error => {
            console.log("Error in elastic search api is ", error);
        });
    }

    componentWillReceiveProps() {
        console.log("In CHCourseTile, componentWillReceiveProps");
        this.setState({writeReview: false});
    }

    handleWriteReviewClick = () => {
        this.setState({writeReview: true});
    }

    render() {
        console.log("In CHCourseTile, render method called");
        var customStyle = {
            marginTop: window.outerHeight * 0.11
        }
        return (            
            <div className='course-tile-card' style={customStyle}>
                
                <div className="course-image-div">
                    <img className="course-image" onLoad={this.onImageLoad} src={this.state.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                </div>

                <div className="course-features" style={{ height: this.state.imgHeight }}>
                    <span className='rating-div' >
                    <StarRatings rating={this.state.Rating!=0?this.state.Rating:1.5} starRatedColor="#CCCC00" starHoverColor="#CCCC00" starEmptyColor="grey" numberOfStars={5} name='rating' starDimension="30px" starSpacing="4px" />
                    {/* <Badge pill variant="info" style={{display:"inline", float:"right",paddingRight:"3%",fontSize:"20px",color:"white",backgroundColor:"black"}}>{this.state.Rating}/5.0</Badge> */}
                    </span>
                    <div className="course-price-details">
                        {this.state.Price > 0 && <span className='price-span'><FontAwesomeIcon className="price-button-font" icon={['fa', 'money-check-alt']} size='2x' color='rgb(0, 0, 0)' /><p className='price-tag'>{this.state.Price}</p></span>}
                        {this.state.Price === 0 && <span className='price-span'><FontAwesomeIcon className="price-button-font" icon={['fa', 'money-check-alt']} size='2x' color='rgb(0, 0, 0)' /><p className='price-tag'>Free</p></span>}
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
                        {(this.state.Difficulty.toLowerCase() === "advanced" || this.state.Difficulty.toLowerCase() === "hard") && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-difficulty" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Difficulty</strong></Tooltip>}><span className="difficulty-span"> <Gauge className="gauge-icon" currentValue={100} size={37} progressColor="red" /><p className="diff-text">Advanced</p></span></OverlayTrigger>}
                        {(this.state.Difficulty.toLowerCase() === "intermediate" || this.state.Difficulty.toLowerCase() === "medium") && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-difficulty" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Difficulty</strong></Tooltip>}><span className="difficulty-span"> <Gauge className="gauge-icon" currentValue={100} size={37} progressColor="#CCCC00" /><p className="diff-text">Intermediate</p></span></OverlayTrigger>}
                        {(this.state.Difficulty.toLowerCase() === "easy" || this.state.Difficulty.toLowerCase() === "introductory") && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-difficulty" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Difficulty</strong></Tooltip>}><span className="difficulty-span"> <Gauge className="gauge-icon" currentValue={100} size={37} progressColor="green" /><p className="diff-text">Introductory</p></span></OverlayTrigger>}

                    </div>
                    <div className="course-pace">
                        {this.state.SelfPaced &&<OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-pace" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Pace</strong></Tooltip>}><span className="pace-span" ><FontAwesomeIcon className="pace-icon" icon={['fa', 'walking']} size='1x' color='rgb(0, 0, 0)' /><p className="pace-text">Self Paced</p></span></OverlayTrigger>}
                        {!this.state.SelfPaced && <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-pace" className="course-tooltip" style={{opacity:"0.6"}}><strong>Course Pace</strong></Tooltip>}><span className="pace-span" ><FontAwesomeIcon className="pace-icon" icon={['fa', 'walking']} size='1x' color='rgb(0, 0, 0)' /><p className="pace-text">Supervised</p></span></OverlayTrigger>}
                    </div>
                    <div className="course-posted">
                        {
                            !this.state.last_updated &&<OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-calendar" className="course-tooltip" style={{opacity:"0.6"}}><strong>Date Posted</strong></Tooltip>}>
                            <span className="calendar-span" ><FontAwesomeIcon className="calendar-icon" icon={['fa', 'calendar']} size='1x' color='rgb(0, 0, 0)' /><p className="calendar-text">03-27-2019</p></span></OverlayTrigger>
                        }
                    </div>

                </div>

                <div className="course-tile-body">
                    <div className="author-image-div">
                        {(this.state.Instructors != null && this.state.Instructors.length > 0) ?
                            this.state.Instructors.map((item, index) => {
                                return (
                                    <span className="author-span" style={{fontSize:"12px"}} key={index}> <Image className="author-image" roundedCircle src={item.ProfilePic
                                        || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3vYRkfHteVj3g5Vd_-tRnHhSgLSJHL2IUDU0pOQCFDyWk7_9seQ'} fluid={true} />&nbsp;&nbsp;<strong>{item.InstructorName}</strong></span>

                                );
                            }) : []
                        }
                    </div>
                    <br></br>
                    <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip" className="course-tooltip" style={{opacity:"0.6"}}><strong>Visit Course</strong></Tooltip>}>
                        <span className="course-title">
                            <a style={{float:"left",fontSize:"20pt",color:"blue"}} href={this.state.URL} target="_blank">{this.state.Title}&nbsp;<FontAwesomeIcon icon={['fa', 'external-link-alt']} size='sm' color='blue' /></a>
                        </span>
                    </OverlayTrigger>
                    <span className="course-desc-span">
                        <div style={{ marginTop: "10%" }} className="course-details" dangerouslySetInnerHTML={{ __html: this.state.Description }} />
                    </span>
                    <Button className="write-review" onClick={this.handleWriteReviewClick}>
                        <FontAwesomeIcon icon="pencil-alt" />
                        &nbsp;&nbsp;Write a review
                    </Button>
                </div>
                
                <CHReview updateContent={this.props.updateContent} courseId={this.props.courseId} writeReview={this.state.writeReview} signedIn={this.props.signedIn} firstName={this.props.firstName} email={this.props.email} key="courseReview"/>
                
            </div>            
        );
    }
}

export default CHCourseTile;