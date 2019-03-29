import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import CHNavigator from './CHNavigator';
import CHCourseTile from './CHCourseTile'
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';

const fetch = require('node-fetch');

class CHCourseDetails extends Component {

    constructor(props, context) {
        super(props, context); 
        var query=queryString.parse(this.props.location.search) 
        this.state = {
            choice: '',
            firstName: '',
            email: '',
            CourseId:query.courseId
        }
        console.log(query.courseId) 
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this. handleCourseClick = this.handleCourseClick.bind(this);
    }

    componentWillMount() {
        const self = this;
        firebaseInitialization.auth().onAuthStateChanged(user => self.handleAuthStateChange(user));
    }

    handleAuthStateChange = user => {
        if (user) {
            var email = user.email;
            var payloadSearch = {
                query: {
                    term: { Email: email }
                }
            }
            searchUser(payloadSearch).then(first => {
                this.setState({
                    choice: "homeSignedIn",
                    firstName: first,
                    email: email
                });
            });
        } else {
            this.setState({
                choice: "home"
            });
        }
    }

    handleCourseClick =()=>{

    }

    render() {
        const choice = this.state.choice;
		const firstName = this.state.firstName;
        const email = this.state.email;
        var courseId=this.state.CourseId;
        courseId=courseId.replace(" ","+")
        console.log('render',courseId)
        return(
        <div className="course_details">
            {choice === "home" &&
                [<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"search"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
                <div className="my-content-landing">
                    <CHCourseTile updateCourseTile={this.handleCourseClick} courseId={courseId} key="courseTile"/>
                </div>,
                <CHFooter key="keyFooterSearch" />]
            }
            {choice === "homeSignedIn" &&
                [<CHNavigator updateContent={this.handleClick} signedIn={firstName != null} caller={"search"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
                <CHCourseTile updateCourseTile={this.handleCourseClick} courseId={courseId} key="courseTile"/>,
                <CHFooter key="keyFooterSearch" />]
            }

        </div>
        );
    }
}

export default CHCourseDetails;