import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import CHNavigator from './CHNavigator';
import LoginPage from './CHLogin';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import CHFilters from './CHFilters';
import CHSearchContent from './CHSearchContent';
import CHAdvertisements from './CHAdvertisements';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import {getUserDetails, searchUser, updateUser} from '../elasticSearch';
import CHCompareModal from "./CHCompareModal";

class CHSearch extends Component {

	constructor(props, context) {
		super(props, context);
		console.log("In search constructor");
		const values = queryString.parse(this.props.location.search);
		this.state = {
		    user_id: null,
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
			sortParam: values.sortParam ? parseInt(values.sortParam): '',
			sortApplied: false
		};

		this.handleClick = this.handleClick.bind(this);
		this.handlePagination = this.handlePagination.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
		this.addCourseToCompare = this.addCourseToCompare.bind(this);
		this.removeCourseFromCompare = this.removeCourseFromCompare.bind(this);
        this.removeCourseFromModal = this.removeCourseFromModal.bind(this);
		this.addCourseToList = this.addCourseToList.bind(this);
		this.clearCourseFromLists = this.clearCourseFromLists.bind(this);
		this.getUserCoursesLists = this.getUserCoursesLists.bind(this);
    }

	componentWillMount() {
		const self = this;
        firebaseInitialization.auth().onAuthStateChanged(user =>  {
            self.handleAuthStateChange(user);
            if(user != null) {
                self.getUserCoursesLists(user.email)
            }
        });
	}

	getUserCoursesLists(email){
        var payload = {
            query : {
                term : { Email : email }
            }
        };
        getUserDetails(payload).then(elasticResponse => {
            this.state.user_id = elasticResponse.id;
            var elasticData = elasticResponse.data;
            this.setState({favoriteList: ((elasticData.FavouriteCourses != null) ? elasticData.FavouriteCourses : [])});
            this.setState({inProgressList: ((elasticData.CoursesinProgress != null) ? elasticData.CoursesinProgress : [])});
            this.setState({completedList: ((elasticData.CoursesTaken != null) ? elasticData.CoursesTaken : [])});
        });
    }

	handleAuthStateChange = user => {
		if (user) {
			var email = user.email;
			var payloadSearch = {
				query: {
					term: { Email: email }
				}
			};
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
	};

	handleClick = (choice, firstName, email, queryString) => {
		this.setState({ choice: choice, firstName: firstName, email: email, queryString: queryString});
    };

	handleFilter = (searchString,pageNumber,filters) =>{
		this.setState({
			pageNumber: pageNumber,
			courseproviders: filters.courseproviders, 
			minprice:filters.minprice, 
			maxprice:filters.maxprice,
			startdate:filters.startdate,
			enddate:filters.enddate, 
			filtersApplied: true}, this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber+
		"&courseproviders=" + filters.courseproviders.toString() +
		"&minPrice=" + filters.minprice + 
		"&maxPrice=" + filters.maxprice +
		"&startDate=" + filters.startdate +
		"&endDate=" + filters.enddate));
	}

	handleSort = (searchString, pageNumber, sortBy) =>{
		// console.log("In CHSearch, handleSort called");
		this.setState({
			pageNumber: pageNumber, 
			sortParam: sortBy,
			sortApplied: true,
			filtersApplied: true},	this.props.history.push('/search?searchString=' + searchString + 
																	"&pageNumber=" + pageNumber+
																	"&courseproviders=" + this.state.courseproviders.toString() +
																	"&minPrice=" + this.state.minprice + 
																	"&maxPrice=" + this.state.maxprice +
																	"&startDate=" + this.state.startdate +
																	"&endDate=" + this.state.enddate +
																	"&sortParam=" + sortBy));
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

	addCourseToList = async (list, item) => {
        let favoriteListMap = this.state.favoriteList.map(function(obj){ return obj.CourseId });
		let inProgressListMap = this.state.inProgressList.map(function(obj){ return obj.CourseId });
		let CompletedListMap = this.state.completedList.map(function(obj){ return obj.CourseId });
		if(list === "1"){
			if(!favoriteListMap.includes(item.CourseId)) {
				this.state.favoriteList.push(item);
				if(inProgressListMap.includes(item.CourseId)){
					let idx = inProgressListMap.indexOf(item.CourseId);
					this.state.inProgressList.splice(idx, 1);
				}
				if(CompletedListMap.includes(item.CourseId)){
					let idx = CompletedListMap.indexOf(item.CourseId);
					this.state.completedList.splice(idx, 1);
				}
			}
		}
		else if(list === "2"){
			if(!inProgressListMap.includes(item.CourseId)) {
				this.state.inProgressList.push(item);
				if(favoriteListMap.includes(item.CourseId)){
					let idx = favoriteListMap.indexOf(item.CourseId);
					this.state.favoriteList.splice(idx, 1);
				}
				if(CompletedListMap.includes(item.CourseId)){
					let idx = CompletedListMap.indexOf(item.CourseId);
					this.state.completedList.splice(idx, 1);
				}
			}
		}
		else if(list === "3"){
			if(!CompletedListMap.includes(item.CourseId)) {
				this.state.completedList.push(item);
				if(favoriteListMap.includes(item.CourseId)){
					let idx = favoriteListMap.indexOf(item.CourseId);
					this.state.favoriteList.splice(idx, 1);
				}
				if(inProgressListMap.includes(item.CourseId)){
					let idx = inProgressListMap.indexOf(item.CourseId);
					this.state.inProgressList.splice(idx, 1);
				}
			}
		}
		this.setState({isOpen: false});
        var payload = {
            "doc": {
                "FavouriteCourses": this.state.favoriteList,
                "CoursesinProgress": this.state.inProgressList,
                "CoursesTaken": this.state.completedList,
            }
        };
        try {
            var response = await updateUser(this.state.user_id, payload);
            // console.log(response);
            if(response === false){
                alert("Error in updating lists in database... Try again");
            }
        } catch (error) {
            alert("Error in updating lists in database... Try again");
        }
	};

	clearCourseFromLists= async (item) => {
        let lists = document.getElementsByClassName("course-radio");
        for(var i = 0; i < lists.length; i++){
            if(lists[i].checked){
                lists[i].checked = false;
                break;
            }
        }

		let favoriteListMap = this.state.favoriteList.map(function(obj){ return obj.CourseId });
		let inProgressListMap = this.state.inProgressList.map(function(obj){ return obj.CourseId });
		let CompletedListMap = this.state.completedList.map(function(obj){ return obj.CourseId });

		if(favoriteListMap.includes(item.CourseId)){
			let idx = favoriteListMap.indexOf(item.CourseId);
			this.state.favoriteList.splice(idx, 1);
		}
		else if(inProgressListMap.includes(item.CourseId)){
			let idx = inProgressListMap.indexOf(item.CourseId);
			this.state.inProgressList.splice(idx, 1);
		}
		else if(CompletedListMap.includes(item.CourseId)){
			let idx = CompletedListMap.indexOf(item.CourseId);
			this.state.completedList.splice(idx, 1);
		}
		this.setState({isOpen: false});
        var payload = {
            "doc": {
                "FavouriteCourses": this.state.favoriteList,
                "CoursesinProgress": this.state.inProgressList,
                "CoursesTaken": this.state.completedList,
            }
        };
        try {
            var response = await updateUser(this.state.user_id, payload);
            if(response === false){
                alert("Error in updating lists in database... Try again");
            }
        } catch (error) {
            alert("Error in updating lists in database... Try again");
            console.log("error is", error);
        }
	};

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
		const sorter = {
			sortApplied: this.state.sortApplied, 
			sortParam: this.state.sortParam
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
										  addToCompare={this.addCourseToCompare} removeFromCompare={this.removeCourseFromCompare} 
										  updatePage={this.handlePagination} firstName={firstName} email={email} 
										  searchString={searchString} pageNumber={pageNumber} filters={filters}
										  updateSort={this.handleSort} sorter={sorter}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSearch" />]
				}

				{choice === "loginScreen" &&
					[<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnSearch" searchString={searchString}/>,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"search"} key="keyNavigatorLoginOverlayOnSearch" />,
					<div className="my-content-landing" key="keyContentLoginOverlayOnSearch">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList} 
										 updatePage={this.handlePagination} firstName={firstName} email={email} 
										 searchString={searchString} pageNumber={pageNumber} filters={filters}
										 updateSort={this.handleSort} sorter={sorter}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterLoginOverlayOnSearch" />]
				}

				{choice === "signupScreen" &&
					[<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnSearch" searchString={searchString} />,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"search"} key="keyNavigatorSignUpOverlayOnSearch" />,
					<div className="my-content-landing" key="keyContentSignUpOverlayOnSearch">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList} 
										 updatePage={this.handlePagination} firstName={firstName} email={email} 
										 searchString={searchString} pageNumber={pageNumber} filters={filters}
										 updateSort={this.handleSort} sorter={sorter}/>
						<CHAdvertisements updateContent={this.handleClick} />
					</div>,
					<CHFooter key="keyFooterSignUpOverlayOnSearch" />]
				}

				{choice === "forgotPasswordScreen" &&
					[<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnSearch" searchString={searchString} />,
					<CHNavigator updateContent={this.handleClick} updatePage={this.handlePagination} signedIn={false} caller={"search"} key="keyNavigatorForgotPasswordOverlayOnSearch" />,
					<div className="my-content-landing" key="keyContentForgotPasswordOverlayOnSearch">
						<CHFilters updateContent={this.handleClick} updateFilter={this.handleFilter} searchString={searchString} />
						<CHSearchContent updateContent={this.handleClick} searchCompareList={this.state.compareList} 
										 updatePage={this.handlePagination} firstName={firstName} email={email} 
										 searchString={searchString} pageNumber={pageNumber} filters={filters}
										 updateSort={this.handleSort} sorter={sorter}/>
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
										 addToCompare={this.addCourseToCompare} removeFromCompare={this.removeCourseFromCompare} 
										 updatePage={this.handlePagination} firstName={firstName} email={email} 
										 searchString={searchString} pageNumber={pageNumber} filters={filters}
										 updateSort={this.handleSort} sorter={sorter}/>
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