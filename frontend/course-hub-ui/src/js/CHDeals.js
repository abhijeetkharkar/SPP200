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
import { searchUser } from '../elasticSearch';

class CHDeals extends Component {

	constructor(props, context) {
		super(props, context);
		const values = queryString.parse(this.props.location.search);
		this.state = {
			choice: '',
			firstName: false,
			email: null,
			pagenumber: 0,
			dealCategory: 'all',
			courseID: "",
			pageType: "deals",
		};

		this.handleClick = this.handleClick.bind(this);
		this.handlePagination = this.handlePagination.bind(this);
		this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
		this.updateDealCategory = this.updateDealCategory.bind(this);
		this.showDealModal = this.showDealModal.bind(this);
	}

	handlePagination = (category, pageNumber) => {
		console.log("page number is ", pageNumber);
		this.setState({dealCategory: category, pagenumber: pageNumber});
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
					choice: "deals",
					firstName: first,
					email: email
				});
				console.log("IN HANDLE AUTH CHANGE CHDEALS 3", this.state);
			});
		} else {
			this.setState({
				choice: "deals"
			});
		}
	}

	handleClick = (choice, firstName, email, queryString) => {
		if (choice === 'home' || choice === 'homeSignedIn'){
			choice = 'deals';
		}
		console.log
		this.setState({ choice: choice, dealCategory: 'all', firstName: firstName, email: email});
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
			});
		}else{
			this.setState({
				choice: 'adddealunsuccessfull'
			});
		}
	}

	updateDealCategory = (updatedCategory) => {
		this.setState({
			dealCategory : updatedCategory,
			choice: 'deals',
			pagenumber: 0
		});
	}

	showDealModal = (courseID) => {
        console.log("Show Deal Modal function call");
        console.log("Deal id is ", courseID);
        this.setState({
			pageType : "showCompleteDeal",
			courseID: courseID
        });
        // Create a fetch Request to download data from Elastic Search
        // Setting up dummy values for now
        console.log("This state is ", this.state);
    }

	render() {
		const choice = this.state.choice;
		const firstName = this.state.firstName;
		const email = this.state.email;
		const pageNumber = this.state.pagenumber;

		return (
			<div className="App container-fluid">
				{choice === "deals" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={firstName} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					<CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='deals' courseID={this.state.courseID} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory}/>,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "addnewdeal" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={firstName} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					// <CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='addnewdeal' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='addnewdeal' handleAddDeal={this.handleAddDeal} courseID={this.state.courseID} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "adddealsuccessfull" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={firstName} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					// <CHDealsContent firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} handleSignUp={this.handleSignUp} pageType='adddealsuccessfull' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory}  updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHDealsContent firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} handleSignUp={this.handleSignUp} pageType='adddealsuccessfull' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "adddealunsuccessfull" &&
					[<CHNavigator updateContent={this.handleClick} signedIn={firstName} caller={"deals"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
					// <CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} handleSignUp={this.handleSignUp} pageType='adddealunsuccessfull' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHDealsContent firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} handleSignUp={this.handleSignUp} pageType='adddealunsuccessfull' handleAddDeal={this.handleAddDeal} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,

					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" searchString=""/>,
					<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorLoginOverlayOnSearch" />,
					<CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='deals' courseID={this.state.courseID} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" searchString="" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorSignUpOverlayOnSearch" />,
					<CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='deals' courseID={this.state.courseID} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" searchString="" />,
					<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"deals"} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
					<CHDealsContent updatePage={this.handlePagination} firstName={firstName} email={email} pageNumber={pageNumber} handlePageUpdate={this.handlePageUpdate} pageType='deals' courseID={this.state.courseID} key='keyDealsContent' updateDealCategory={this.updateDealCategory} dealCategory={this.state.dealCategory} />,
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

export default CHDeals;