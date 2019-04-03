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
			pagenumber: 0,
			dealCategory: 'all'
		};

		this.handleClick = this.handleClick.bind(this);
		this.handlePagination = this.handlePagination.bind(this);
		this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
		this.updateDealCategory = this.updateDealCategory.bind(this);
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
				choice: "deals"
			});
		}
	}

	// handleClick = (choice, firstName, email) => {
	// 	this.setState({ choice: choice, firstName: firstName, email: email});
	// }

    //TODO: Update pagination as per deals API
	handlePagination = (searchString, pageNumber) => {
		// console.log("In CHSearch, before history, searchString:", searchString, ", pageNumber:", pageNumber);
		this.setState({pageNumber: pageNumber, searchString: searchString});
		this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
		// this.forceUpdate();
	}

	handleClick = (choice, firstName, email, queryString) => {
		if (choice == 'home'){
			choice = 'deals';
		}
		this.setState({ choice: choice, dealCategory: 'all', firstName: firstName, email: email, queryString: queryString});
	}

	handlePageUpdate = () => {
		console.log("UPDATE FUNCTION CALLED in CHDEALS");
		this.setState({
			choice: 'addnewdeal'
		})
	}

	handleAddDeal = (response) => {
		console.log("HANDLE ADD DEAL CALLED IN MAIN PAGE ");
		if (response === true){
			this.setState({
				choice: 'adddealsuccessfull'
			})
		}else{
			this.setState({
				choice: 'adddealunsuccessfull'
			})
		}
	}

	updateDealCategory = (updatedCategory) => {
		this.setState({
			dealCategory : updatedCategory,
			choice: 'deals'
		});
	}

	render() {
		const choice = this.state.choice;
		const firstName = this.state.firstName;
		const email = this.state.email;
		const pageNumber = this.state.pagenumber;

		return (
			<div className="App container-fluid">
				{choice === "deals" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='deals' key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "addnewdeal" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handleSignUp={this.handleSignUp} pageType='addnewdeal' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "adddealsuccessfull" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handleSignUp={this.handleSignUp} pageType='adddealsuccessfull' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory}  updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "adddealunsuccessfull" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handleSignUp={this.handleSignUp} pageType='adddealunsuccessfull' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" searchString=""/>,
					<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorLoginOverlayOnSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handleSignUp={this.handleSignUp} pageType='deals' key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" searchString="" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorSignUpOverlayOnSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handleSignUp={this.handleSignUp} pageType='deals' key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" searchString="" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
					<CHDealsContent updateContent={this.handleClick} updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handleSignUp={this.handleSignUp} pageType='deals' key='keyDealsContent'  updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHFooter key="keyFooterForgotPasswordOverlayOnSearch" />]
				}

				{choice === "profile" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={true} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "homeSignedIn" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={firstName != null} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					
					<CHFooter key="keyFooterSearch" />]
				}
			</div>
		);
	}
}

export default CHDeals;