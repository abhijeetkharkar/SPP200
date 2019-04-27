import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/card.css';
import '../css/microdegree.css';
import Chip from '@material-ui/core/Chip';
import { Modal, Button, Form, Col, Badge } from 'react-bootstrap';
import CHNavigator from './CHNavigator';
import LoginPage from './CHLogin';
import CHDealsContent from './CHDealsContent';
import CHMicroDegreeForm from './CHMicroDegreeForm';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import CHDealsFilter from './CHDealsFilter';
import ProfilePage from "./CHProfile";
import CHAdvertisements from './CHAdvertisements';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser, getMicroDegreeSuggestions } from '../elasticSearch';

class CHMicroDegree extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			choice: '',
			microDegreeChoice: 'form',
			microDegreeSuggestions: [],
			firstName: false,
			email: null,
			pageType: "microDegreeHome",
		};

		this.handleClick = this.handleClick.bind(this);
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
					firstName: first,
					email: email
				});
			});
		} else {
			this.setState({
				firstName: false,
				email: null
			});
		}
	}

	handleClick = (choice, firstName, email, queryString) => {
        // Update this.state here
    }
    
    handleCloseHere = (param) => (e) => {
        console.log("Close function called");
	}
	
	updatePage = (params) => {
		console.log("upDATE pAGE CALLED with params : ", params);
		var payload = {
			duration: params.durations,
			tags : params.chips.join(' ')
		}
		getMicroDegreeSuggestions(payload)
		.then(responseData => {
			console.log("Payload IS ", payload)
			console.log("RESPONSE DATA IS ", responseData)
			var microDegreeSuggestions = []
			for (var key in responseData) {
				microDegreeSuggestions.push(responseData[key])
			}
			this.setState({
				microDegreeChoice: "degreeSuggestions",
				microDegreeSuggestions : microDegreeSuggestions
			})
		});
		// this.setState({
		// 	microDegreeChoice: "degreeSuggestions",
		// 	microDegreeSuggestions : [{
		// 		courseName : "The Python Bible™ | Everything You Need to Program in Python",
		// 		provider : "Udemy",
		// 		difficulty : "Introductory"
		// 	},{
		// 		courseName : "Learnign Python: Python for Beginners",
		// 		provider : "Iversity",
		// 		difficulty : "Intermediate"
		// 	},{
		// 		courseName : "Python Advanced Level ",
		// 		provider : "Coursera",
		// 		difficulty : "Advanced"
		// 	}]
		// })
	}


	render() {
		const choice = this.state.pageType;
		const firstName = this.state.firstName;
		const email = this.state.email;

		return (
			<div className="App container-fluid">
				{choice === "microDegreeHome" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={firstName} caller={"microdegree"} firstName={firstName} email={email} key="microdegreehome" />,
                    <CHMicroDegreeForm onFormSubmit={this.updatePage} choice={this.state.microDegreeChoice} microDegreeSuggestions={this.state.microDegreeSuggestions}/>,
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" searchString=""/>,
                    <CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorLoginOverlayOnSearch" />,
                    
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" searchString="" />,
                    <CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorSignUpOverlayOnSearch" />,
                    
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" searchString="" />,
                    <CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
                    
					<CHFooter key="keyFooterForgotPasswordOverlayOnSearch" />]
				}

				{choice === "profile" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={true} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<div className="profile-content" key="keySearch">
						<ProfilePage updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} searchString="" pageNumber={pageNumber}/>
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}
			</div>
		);
	}
}

export default CHMicroDegree;