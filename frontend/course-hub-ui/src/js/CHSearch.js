import React, { Component } from 'react';
import queryString from 'query-string';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import CHNavigator from './CHNavigator';
import CHSearchContent from './CHSearchContent';
import ProfilePage from "./CHProfile";
import ProfileNavigator from "./CHProfileNavigator";
import LoginPage from './CHLogin';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';

class CHSearch extends Component {

	constructor(props, context) {
		super(props, context);
		const values = queryString.parse(this.props.location.search);
		this.state = {
			signedIn: values.signedIn === 'y' ? true : false,
			choice: '',
			firstName: values.firstName !== undefined ? values.firstName : null,
			email: values.email !== undefined ? values.email : null,
			queryString: values.searchString
		};

		this.handleClick = this.handleClick.bind(this);
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

	handleClick = (choice, firstName, email, queryString) => {
		this.setState({ choice: choice, firstName: firstName, email: email, queryString: queryString });
	}

	render() {
		const choice = this.state.choice;
		const firstName = this.state.firstName;
		const email = this.state.email;
		const queryString = this.state.queryString;
		const signedIn = this.state.signedIn;

		console.log("Choice:", choice, ", First:", firstName, ", Email:", email, ", SignedIn:", signedIn);
		return (
			<div className="App container-fluid">
				{choice === "home" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={false} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<div className="container-landing my-content-landing" key="keySearchContent">
						<CHSearchContent updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorLoginOverlayOnSearch" />,
					<div className="container-landing my-content-landing" key="keyContentLoginOverlayOnSearch">
						<CHSearchContent updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorSignUpOverlayOnSearch" />,
					<div className="container-landing my-content-landing" key="keyContentSignUpOverlayOnSearch">
						<CHSearchContent updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
					<div className="container-landing my-content-landing" key="keyContentForgotPasswordOverlayOnSearch">
						<CHSearchContent updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterForgotPasswordOverlayOnSearch" />]
				}

				{choice === "profile" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={true} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<div className="profile-container-landing profile-content" key="keySearch">
						<ProfilePage updateContent={this.handleClick} email={email} />
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "homeSignedIn" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={signedIn || firstName != null} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<div className="container-landing my-content-landing" key="keySearchContent">
						<CHSearchContent updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}
			</div>
		);
	}
}

export default CHSearch;