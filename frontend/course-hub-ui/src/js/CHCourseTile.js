import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import '../css/coursedetails.css'
import { Table, Button, Card, Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCourseDetail } from '../elasticSearch';
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
            Difficulty: ''
        }
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
        var customStyle = {
            marginTop: window.outerHeight * 0.11
        }
        return (
            <div className='course-tile' style={customStyle}>
                <Card className='course-tile-card'>
                    <Card.Img variant="top" src={this.state.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                    <Card.Body className="course-tile-body">
                        <span className="course-title-rating">
                            <Card.Title style={{float: "left"}}>{this.state.Title}</Card.Title>
                            <span className="course-rating-span">
                                <StarRatingComponent 
                                        name={"course-rating"} 
                                        starCount={5} 
                                        value={1} 
                                        editing={true} 
                                        emptyStarColor={"#5e5d25"} 
                                        size='2x'/>
                            </span>
                        </span>
                        <span className="course-desc-span">
                            <Card.Text style={{marginTop:"4%"}} className="course-details"><strong>Description: </strong>{this.state.Description}</Card.Text>
                            <br></br>
                        </span>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip"><strong>Visit Page</strong></Tooltip>}>
                        <Badge pill variant="info" style={{fontSize:"15pt"}} className='course-website'><a href={this.state.URL} target="_blank"><FontAwesomeIcon className="redirect-button-font" icon={['fa', 'external-link-alt']} /></a></Badge></OverlayTrigger>

                        {this.state.Price > 0 && <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-price' ><FontAwesomeIcon className="price-button-font" icon={['fa', 'money-check-alt']} color='rgb(207, 204, 19)' />&nbsp;${this.state.Price}</Badge>}
                        {this.state.Price === 0 && <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-price' ><FontAwesomeIcon className="price-button-font" icon={['fa', 'money-check-alt']} color='rgb(207, 204, 19)' />&nbsp;$0</Badge>}

                        {this.state.CourseDuration && <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-duration' ><FontAwesomeIcon className="duration-button-font" icon={['fa', 'clock']} color='rgb(207, 204, 19)' />
                            &nbsp;{this.state.CourseDuration.Value} {this.state.CourseDuration.Unit}</Badge>}

                        <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-difficulty' >Level: {this.state.Difficulty}</Badge>
                        {this.state.last_updated && <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-posted'>Posted On: {this.state.last_updated}</Badge>}
                        {this.state.SelfPaced && <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-selfpaced'>Self Paced</Badge>}
                        {!this.state.SelfPaced && <Badge pill variant="info" style={{fontSize:"13pt"}} className='course-selfpaced'>SuperVised</Badge>}
                        
                    </Card.Body>
                </Card>;
            </div>
        );
    }
}

export default CHCourseTile;