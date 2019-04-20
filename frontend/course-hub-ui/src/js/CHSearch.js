import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import CHNavigator from './CHNavigator';
import LoginPage from './CHLogin';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import ProfilePage from "./CHProfile";
import CHFilters from './CHFilters';
import CHSearchContent from './CHSearchContent';
import CHAdvertisements from './CHAdvertisements';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';
import CHCompareModal from "./CHCompareModal";

class CHSearch extends Component {

	constructor(props, context) {
		super(props, context);
		const values = queryString.parse(this.props.location.search);
		this.state = {
			choice: '',
			firstName: null,
			email: null,
			searchString: values.searchString,
			pageNumber: parseInt(values.pageNumber),
			courseproviders: values.courseproviders || "",
            minprice: values.minPrice ? parseInt(values.minPrice): 0,
            maxprice: values.maxPrice ? parseInt(values.maxPrice): 0,
            startdate: values.startDate || '',
			enddate: values.endDate || '',
			filtersApplied: values.courseproviders || values.minPrice || values.maxPrice || values.startDate || values.endDate,
			isOpen: false,
            compareList: (JSON.parse(sessionStorage.getItem("compareList"))) ?
                JSON.parse(sessionStorage.getItem("compareList")) : [],
			favoriteList: [],
			inProgressList: [],
			completedList: [],
		};
		console.log("In search constructor");
		this.handleClick = this.handleClick.bind(this);
		this.handlePagination = this.handlePagination.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
		this.addCourseToCompare = this.addCourseToCompare.bind(this);
		this.removeCourseFromCompare = this.removeCourseFromCompare.bind(this);
        this.removeCourseFromModal = this.removeCourseFromModal.bind(this);
        console.log("This is my compare list");
        console.log(this.state.compareList);
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
		this.setState({ choice: choice, firstName: firstName, email: email, queryString: queryString});
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

	handlePagination = (searchString, pageNumber) => {
		// console.log("In CHSearch, before history, searchString:", searchString, ", pageNumber:", pageNumber);
		this.setState({pageNumber: pageNumber, searchString: searchString});
		this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
		// this.forceUpdate();
	};

    toggleModal = () => {
        console.log("In toggle modal");
        this.setState({isOpen: !this.state.isOpen})
    };

    addCourseToCompare(item) {
        this.setState({isOpen: false});
        this.state.compareList.push(item);
        sessionStorage.setItem("compareList", JSON.stringify(this.state.compareList));
    }

    removeCourseFromCompare(item) {
        var idx = this.state.compareList.map(function(obj){ return obj.CourseId }).indexOf(item.CourseId);
        this.state.compareList.splice(idx, 1);
        sessionStorage.setItem("compareList", JSON.stringify(this.state.compareList));
        this.setState({isOpen: false});
    }

    removeCourseFromModal(item){
        var idx = this.state.compareList.indexOf(item);
        this.state.compareList.splice(idx, 1);
        sessionStorage.setItem("compareList", JSON.stringify(this.state.compareList));
    }

	render() {
		const choice = this.state.choice;
		const firstName = this.state.firstName;
		const email = this.state.email;
		const searchString = this.state.searchString;
		const pageNumber = this.state.pageNumber;
		const filters = {
			filtersApplied: this.state.filtersApplied,
			courseproviders: this.state.courseproviders,
			minPrice: this.state.minprice,
			maxPrice: this.state.maxprice,
			startDate: this.state.startdate,
			endDate: this.state.enddate
		};

		// console.log("In CHSearch, render called, pagenumber:", pageNumber, ", choice:", choice, ", searchString:", searchString);
		return (
			<div className="App container-fluid">
				{choice === "home" &&
					[<CHNavigator updateContent={this.handleClick} navCallBack={this.toggleModal} updatePage={this.handlePagination} signedIn={false} caller={"search"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
                    <CHCompareModal updateContent={this.handleClick} isModalOpen={this.state.isOpen} closeModal={this.toggleModal} modalCompareList={this.state.compareList} removeFromModal={this.removeCourseFromModal} />,
					<div className="my-content-landing" key="keySearchContent">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString}/>
						<CHSearchContent  updateContent={this.handleClick} searchCompareList={this.state.compareList}
                                          addToCompare={this.addCourseToCompare} removeFromCompare={this.removeCourseFromCompare} updatePage={this.handlePagination} firstName={firstName} email={email} searchString={searchString} pageNumber={pageNumber} filters={filters}
										  favorite_list={this.state.favoriteList} in_progress_list={this.state.inProgressList} completed_list={this.state.completedList}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" searchString={searchString}/>,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"search"} key="keyNavigatorLoginOverlayOnSearch" />,
					<div className="my-content-landing" key="keyContentLoginOverlayOnSearch">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList} updatePage={this.handlePagination} firstName={firstName} email={email} searchString={searchString} pageNumber={pageNumber} filters={filters}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" searchString={searchString} />,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"search"} key="keyNavigatorSignUpOverlayOnSearch" />,
					<div className="my-content-landing" key="keyContentSignUpOverlayOnSearch">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList} updatePage={this.handlePagination} firstName={firstName} email={email} searchString={searchString} pageNumber={pageNumber} filters={filters}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" searchString={searchString} />,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"search"} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
					<div className="my-content-landing" key="keyContentForgotPasswordOverlayOnSearch">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList} updatePage={this.handlePagination} firstName={firstName} email={email} searchString={searchString} pageNumber={pageNumber} filters={filters}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterForgotPasswordOverlayOnSearch" />]
				}

				{choice === "homeSignedIn" &&
					[<CHNavigator updateContent={this.handleClick} navCallBack={this.toggleModal} updatePage={this.handlePagination} signedIn={firstName != null} caller={"search"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
                     <CHCompareModal updateContent={this.handleClick} isModalOpen={this.state.isOpen} closeModal={this.toggleModal} modalCompareList={this.state.compareList} removeFromModal={this.removeCourseFromModal} />, ,
					<div className="my-content-landing" key="keySearchContent">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList}
                                         addToCompare={this.addCourseToCompare} removeFromCompare={this.removeCourseFromCompare} updatePage={this.handlePagination} firstName={firstName} email={email} searchString={searchString} pageNumber={pageNumber} filters={filters}
										 favorite_list={this.state.favoriteList} in_progress_list={this.state.inProgressList} completed_list={this.state.completedList}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}

				{
					choice === "profile" && this.props.history.push('/profile')
				}

				{
					choice === "coursedetails" && this.props.history.push('/course?courseId=' + this.state.queryString )
				}

                {
                    choice === "compareCourses" && this.props.history.push('/compare')
                }
			</div>
		);
	}
}

export default CHSearch;