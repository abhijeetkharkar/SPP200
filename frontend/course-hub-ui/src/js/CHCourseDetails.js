import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import CHNavigator from './CHNavigator';
import CHCourseTile from './CHCourseTile';
import LoginPage from './CHLogin';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import ProfilePage from "./CHProfile";
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';

class CHCourseDetails extends Component {

    constructor(props, context) {
        super(props, context);
        var values = queryString.parse(this.props.location.search)
        this.state = {
            choice: '',
            firstName: '',
            email: '',
			searchString: '',
			pageNumber: 0,
			courseproviders: values.courseproviders || "",
            minprice: values.minPrice ? parseInt(values.minPrice): 0,
            maxprice: values.maxPrice ? parseInt(values.maxPrice): 0,
            startdate: values.startDate || '',
			enddate: values.endDate || '',
			filtersApplied: values.courseproviders || values.minPrice || values.maxPrice || values.startDate || values.endDate,
            courseId: values.courseId
        }
        // console.log(query.courseId)
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
		this.handlePagination = this.handlePagination.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
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

    handleClick = (choice, firstName, email, searchString, courseId) => {
        console.log(choice, "::", firstName, "::", email, "::", searchString, "::", courseId);
        this.setState({ choice: choice, firstName: firstName, email: email, searchString: searchString, courseId: courseId });
    }

	handlePagination = (searchString, pageNumber) => {
		// console.log("In CHSearch, before history, searchString:", searchString, ", pageNumber:", pageNumber);
		this.setState({pageNumber: pageNumber, searchString: searchString});
		this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
		// this.forceUpdate();
	}

	handleFilter = (searchString,pageNumber,filters) =>{
		this.setState({pageNumber: pageNumber});
		this.setState({
			courseproviders: filters.courseproviders, 
			minprice:filters.minprice, 
			maxprice:filters.maxprice,
			startdate:filters.startdate,
			enddate:filters.enddate, 
			filtersApplied: true});

		this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber+
		"&courseproviders" + filters.courseproviders.toString() +
		"&minPrice" + filters.minprice + 
		"&maxPrice" + filters.maxprice +
		"&startDate" + filters.startdate +
		"&endDate" + filters.enddate);
	}

    render() {
        const choice = this.state.choice;
        const firstName = this.state.firstName;
        const email = this.state.email;
        var courseId = this.state.courseId;
        courseId = courseId.replace(" ", "+");
        // console.log('In CHCourseDetails, render', courseId);
        return (
            <div>
                {choice === "home" &&
                    [<CHNavigator updateContent={this.handleClick} courseId={courseId} signedIn={false} caller={"search"} firstName={firstName} email={email} key="course-details-header"/>,
                    <div className="my-content-landing" key="course-details-content">
                        <CHCourseTile updateContent={this.handleClick} updatePage={this.handlePagination} courseId={courseId} signedIn={false} caller={"coursedesc"} firstName={firstName} email={email} dummy={Date.now()} />
                    </div>,
                    <CHFooter key="course-details-footer" />]
                }

                {choice === "loginScreen" &&
                    [<LoginPage updateContent={this.handleClick} courseId={courseId} key="course-details-overlay"/>,
                    <CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} courseId={courseId} signedIn={false} caller={"app"} key="course-details-header" />,
                    <div className="my-content-landing" key="course-details-content">
                        <CHCourseTile updateContent={this.handleClick} courseId={courseId} signedIn={firstName != null} caller={"coursedesc"} firstName={firstName} email={email} dummy={Date.now()} />
                    </div>,
                    <CHFooter key="course-details-footer" />]
                }

                {choice === "signupScreen" &&
                    [<SignupPage updateContent={this.handleClick} courseId={courseId} key="course-details-overlay" />,
                    <CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} courseId={courseId} signedIn={false} caller={"app"} key="course-details-header" />,
                    <div className="my-content-landing" key="course-details-content">
                        <CHCourseTile updateContent={this.handleClick} courseId={courseId} signedIn={firstName != null} caller={"coursedesc"} firstName={firstName} email={email} dummy={Date.now()} />
                    </div>,
                    <CHFooter key="course-details-footer" />]
                }

                {choice === "forgotPasswordScreen" &&
                    [<ForgotPasswordPage updateContent={this.handleClick} courseId={courseId} key="course-details-overlay" />,
                    <CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} courseId={courseId} signedIn={false} caller={"app"} key="course-details-header" />,
                    <div className="my-content-landing" key="course-details-content">
                        <CHCourseTile updateContent={this.handleClick} courseId={courseId} signedIn={firstName != null} caller={"coursedesc"} firstName={firstName} email={email} dummy={Date.now()} />
                    </div>,
                    <CHFooter key="course-details-footer" />]
                }

                {choice === "homeSignedIn" &&
                    [<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} courseId={courseId} signedIn={firstName != null} caller={"search"} firstName={firstName} email={email} key="course-details-header" />,
                    <div className="my-content-landing" key="course-details-content">
                        <CHCourseTile updateContent={this.handleClick} courseId={courseId} signedIn={firstName != null} caller={"coursedesc"} firstName={firstName} email={email} dummy={Date.now()} />
                    </div>,
                    <CHFooter key="course-details-footer" />]
                }

                {choice === "profile" &&
                  [<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} courseId={courseId} signedIn={true} caller={"app"} firstName={optional1} email={optional2} key="course-details-header" />,
                  <div className="profile-content" key="course-details-content">
                    <ProfilePage updateContent={this.handleClick} courseId={courseId} email={optional2} />
                  </div>,
                  <CHFooter key="course-details-footer"/>]
                }
        
                {choice === "searchResults" &&
                  this.props.history.push('/search?searchString=' + optional3 + "&pageNumber=0")}
        
                {choice === "deals" &&
                  this.props.history.push('/deals')}
                
            </div>
        );
    }
}

export default CHCourseDetails;