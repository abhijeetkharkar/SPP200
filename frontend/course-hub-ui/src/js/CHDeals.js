import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/card.css';
import CHNavigator from './CHNavigator';
import LoginPage from './CHLogin';
import CHDealsContent from './CHDealsContent';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import CHDealsFilter from './CHDealsFilter';
import ProfilePage from "./CHProfile";
import CHAdvertisements from './CHAdvertisements';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';

class CHDeals extends Component {

	constructor(props, context) {
		super(props, context);
		const values = queryString.parse(this.props.location.search);
		this.state = {
			choice: '',
			firstName: null,
			email: null,
			pagenumber: 1,
		};

		this.handleClick = this.handleClick.bind(this);
		this.handlePagination = this.handlePagination.bind(this);
		this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
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

	handleClick = (choice, firstName, email) => {
		this.setState({ choice: choice, firstName: firstName, email: email});
	}

    //TODO: Update pagination as per deals API
	handlePagination = (searchString, pageNumber) => {
		// console.log("In CHSearch, before history, searchString:", searchString, ", pageNumber:", pageNumber);
		this.setState({pageNumber: pageNumber, searchString: searchString});
		this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
		// this.forceUpdate();
	}

	handleClick = (choice, firstName, email, queryString) => {
		this.setState({ choice: choice, firstName: firstName, email: email, queryString: queryString});
	}

	handleFilter = () =>{
		
	}

	render() {
		const choice = this.state.choice;
		const firstName = this.state.firstName;
		const email = this.state.email;
		const pageNumber = this.state.pagenumber;

		// console.log("In CHSearch, render called, pagenumber:", pageNumber, ", choice:", choice, ", searchString:", searchString);
		return (
			<div className="App container-fluid">
				{choice === "home" &&
					[<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber}/>,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" searchString={searchString}/>,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"deals"} key="keyNavigatorLoginOverlayOnSearch" />,
					<div className="container-landing" key="keyContentLoginOverlayOnSearch">
						Empty Landing Page
					</div>,
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" searchString={searchString} />,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"deals"} key="keyNavigatorSignUpOverlayOnSearch" />,
					<div className="container-landing" key="keyContentSignUpOverlayOnSearch">
						Empty Landing Page
					</div>,
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" searchString={searchString} />,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"deals"} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
					<div className="container-landing" key="keyContentForgotPasswordOverlayOnSearch">
						Empty Landing Page
					</div>,
					<CHFooter key="keyFooterForgotPasswordOverlayOnSearch" />]
				}

				{choice === "profile" &&
					[<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={true} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<div className="profile-container-landing profile-content" key="keySearch">
						<ProfilePage updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} searchString={searchString} pageNumber={pageNumber}/>
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "homeSignedIn" &&
					[<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={firstName != null} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<div className="container-landing" key="keySearchContent">
						Empty Landing Page
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}
			</div>
		);
	}
}

export default CHDeals;