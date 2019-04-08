import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import '../css/card.css';
import CHNavigator from './CHNavigator';
import LoginPage from './CHLogin';
import SignupPage from './CHSignup';
import ForgotPasswordPage from './CHForgotPassword';
import CHDealsCard from './CHDealsCard';
import CHAddDeal from './CHAddDeal';
import CHDealsFilter from './CHDealsFilter';
import { Modal, Button, Table, Image, Pagination } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';
const fetch = require('node-fetch');

class CHDealsContent extends Component{
    constructor (props, context){
        super(props, context);
        this.state = {
            currentLayout: this.props.pageType,
            totalPages: 1,
            currentPage: 0,
            deals: [],
            pageList: [],
            category: this.props.dealCategory,
            showCompleteDealID : "",
            completeDealData : {},
            subChoice: ""
        };

        this.showDealModal = this.showDealModal.bind(this);
        this.hideCompleteDeal = this.hideCompleteDeal.bind(this);
        this.createPageList = this.createPageList.bind(this);
        console.log("CURRENT LAYOUT IS ", this.state.currentLayout);
        console.log("CURRENT CATEGORY IS ", this.state.category);
        console.log("Current PROPS ARE ", this.props);
    }

    componentWillReceiveProps(nextProps){
        console.log("UPDATED CATEGORY IN CHDEALSCONTENT IS : ", nextProps.dealCategory, nextProps.pageNumber);
        this.setState({category: nextProps.dealCategory, currentPage: nextProps.pageNumber});
        const payload = {
            "category": nextProps.dealCategory,
            "page_number": nextProps.pageNumber || 0
        }

        fetch(process.env.REACT_APP_GET_DEALS, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(dealsData => {
            this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals, pageList: this.createPageList(dealsData.current_page, dealsData.number_of_pages) });
            if (dealsData.deals.length == 0){
                this.setState({currentLayout : "nodeal"});
            }else{
                this.setState({currentLayout : "deals"});
            }
        }).catch(error => {
            console.log("Error in searchquery backend ", error);
        });
    }

    componentDidMount() {
        // console.log("In CHSearchContent, componentDidMount");
        const payload = {
            "category": this.state.category,
            "page_number": this.props.pageNumber || 0
        }
        console.log("payload is ", payload);

        fetch(process.env.REACT_APP_GET_DEALS, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(dealsData => {
            console.log("DATA IS DID MOUNT", dealsData);
            this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals, pageList: this.createPageList(dealsData.current_page, dealsData.number_of_pages) });
            if (dealsData.deals.length == 0){
                this.setState({currentLayout : "nodeal"});
            }else{
                this.setState({currentLayout : "deals"});
            }
        }).catch(error => {
            console.log("Error in searchquery backend ", error);
        });
    }

    createPageList = (page, total) => {
        var pageList = [];
        var curr = page;
        var pages = total;
        if(curr>-1) {
            pageList.push(curr);
            var i=curr, j=curr;
            // console.log("Entered, curr: ", curr, ", pageList: ", pageList);
            while(pageList.length < 10 && pageList.length <= pages) {
                console.log("PAGE LIST length IS ", pageList.length, i, j);
                --i;
                ++j;
                if (i<0 && j>=pages){
                    break;
                }
                if(i>=0 && j<pages) {
                    pageList.push(i);
                    pageList.push(j);
                } else if(i<0 && j<pages) {
                    pageList.push(j);
                } else if(i>=0 && j>=pages) {
                    pageList.push(i);
                }
            }
            pageList.sort((a, b) => {return a-b});
        }
        console.log("PAGE LIST IS ", pageList);
        return pageList;
    }

    // Display Modal for Deal
    showDealModal = (courseID) => {
        const payload = {
            query : {
                term : { _id : courseID }
            }
        }
        
        fetch(process.env.REACT_APP_SEARCH_DEALS, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(dealData => {
            console.log("deal complete data is", dealData);
            console.log("course data ", dealData['hits']['hits'][0]['_source']);
            this.setState({
                subChoice: "showCompleteDeal",
                showCompleteDealID : courseID,
                completeDealData : {
                    data : dealData['hits']['hits'][0]['_source']
                }
            }, () => {
                console.log('THIS.STATE IS ',this.state);
            });
        }).catch(error => {
            console.log("Error in searchquery backend ", error);
        });
    }

    // Hiding Deal
    hideCompleteDeal = (e) => {
        console.log("Hide complete deal called ");
        this.setState({
            subChoice: "",
            showCompleteDealID : "",
            completeDealData : {}
        });
    }

    render() {
        var choice = this.state.currentLayout;
        var subChoice = this.state.subChoice;
        var floatLeft = {
            'float': 'left'
        };

        return (
            <div className="my-content-landing">
                { choice === "deals" &&
                    [
                        <div className="dealsPage">
                            <CHDealsFilter updatePage={this.props.handlePageUpdate} key='keyDealsFilter' updateDeals={this.props.updateDealCategory}/>
                            {
                                this.state.deals.length > 0 ?
                                    this.state.deals.map((item, index) => {
                                        return (
                                            <div key={'keyDealsCard'+(index+1)} className={"deals-landing-"+(index+1)}>
                                                <CHDealsCard showDeal={this.showDealModal} title={item.title} provider={item.provider} description={item.description} datePosted={item.datePosted} originalPrice={item.originalPrice} discountedPrice={item.discountedPrice} imageLink={item.imageLink} thumbsUp={item.thumbsUp} thumbsDown={item.thumbsDown} id={item.id} key={'keyDealsCard'+(index+10)} />
                                            </div>);
                                    }) :
                                    []
                            },
                            
                            { subChoice === "showCompleteDeal" &&
                                [<div className="dealsPage">
                                        <Modal
                                            show={true}>
                                            <Modal.Header>
                                                <Modal.Title id="sign-up-title">
                                                <img src={this.state.completeDealData.data.imageLink} alt="Card image cap" width='46px' height='30px' />
                                                &nbsp;{this.state.completeDealData.data.provider}
                                                </Modal.Title>
                                                <Button variant="danger" onClick={(e) => this.hideCompleteDeal(e)}>
                                                    X
                                                </Button>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <h5>{this.state.completeDealData.data.title}</h5>
                                                {this.state.completeDealData.data.description}
                                                <br />
                                                <br />
                                                <br />
                                                <Button href={this.state.completeDealData.data.link} target="_blank" variant="info"> Get Deal </Button>
                                                <hr />
                                                <small className="text-muted">Posted : <b>{this.state.completeDealData.data.datePosted}</b></small>
                                                <br />
                                                <div className="deal-strike-through">${this.state.completeDealData.data.originalPrice}</div>
                                                &nbsp;&nbsp;&nbsp;
                                                <div className="deal-notstrike-through">${this.state.completeDealData.data.discountedPrice}</div>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <i>&#128077;+{this.state.completeDealData.data.thumbsUp}</i>
                                                &nbsp;&nbsp;&nbsp;
                                                <i>👎 +{this.state.completeDealData.data.thumbsDown}</i>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                            ]}
                        </div>
                    ]
                }

                {   choice === "nodeal" &&
                    [
                        <CHDealsFilter updatePage={this.props.handlePageUpdate} key='keyDealsFilter' updateDeals={this.props.updateDealCategory}/>,
                            <div className="deal_success_alert">
                            <Alert variant="danger">
                                <Alert.Heading style={floatLeft}>Oh snap! No new Deals!!!</Alert.Heading>
                                <br /><br />
                                <p style={floatLeft}>
                                    All the Deals are expired!!!
                                </p>
                                <br />
                                <hr />
                            </Alert>
                        </div>]
                }

                {   choice === "addnewdeal" && 
                    [<div className="dealsPage">
                        <CHDealsFilter updatePage={this.props.handlePageUpdate} key='keyDealsFilter' updateDeals={this.props.updateDealCategory}/>
                        <CHAddDeal updatePage={this.props.handleAddDeal}  key='keyAddDeals' />
                    </div>]
                }

                {   choice === "adddealsuccessfull" && 
                    [<div className="dealsPage">
                        <CHDealsFilter updatePage={this.props.handlePageUpdate} key='keyDealsFilter' updateDeals={this.props.updateDealCategory}/>
                        <div className="deal_success_alert">
                            <Alert variant="success">
                                <Alert.Heading style={floatLeft}>SUCCESS!!!</Alert.Heading>
                                <br /><br />
                                <p style={floatLeft}>
                                    Deal Added Successfully in the Database.
                                </p>
                                <br />
                                <hr />
                            </Alert>
                        </div>
                    </div>]
                }

                {   choice === "adddealunsuccessfull" && 
                    [<div className="dealsPage">
                        <CHDealsFilter updatePage={this.props.handlePageUpdate} key='keyDealsFilter' updateDeals={this.props.updateDealCategory} />
                        <div className="deal_success_alert">
                            <Alert variant="danger">
                                <Alert.Heading style={floatLeft}>Oh snap! You got an error!</Alert.Heading>
                                <br /><br />
                                <p style={floatLeft}>
                                    Cannot Add Deal in the Database.
                                </p>
                                <br />
                                <hr />
                            </Alert>
                        </div>
                    </div>]
                }

                { choice === "deals" && 
                    <div id="deals-pagination">
                        <tfoot>
                            <tr>
                                <td colSpan="2" >
                                    <Pagination >
                                        <Pagination.First  onClick={() => this.props.updatePage(this.state.category, 0)}/>
                                        {this.props.pageNumber <= 0 && <Pagination.Prev disabled />}
                                        {this.props.pageNumber > 0 && <Pagination.Prev onClick={() => this.props.updatePage(this.state.category, this.state.currentPage-1)}/>}
                                        <Pagination.Item key={this.state.currentPage+1} active>{this.state.currentPage + 1}</Pagination.Item>
                                        {this.props.pageNumber >= this.state.totalPages-1 && <Pagination.Next disabled />}
                                        {this.props.pageNumber < this.state.totalPages-1 && <Pagination.Next onClick={() => this.props.updatePage(this.state.category, this.state.currentPage+1)}/>}
                                        <Pagination.Last onClick={() => this.props.updatePage(this.state.category, this.state.totalPages-1)}/>
                                    </Pagination>
                                </td>
                            </tr>
                        </tfoot>
                    </div>
                }
                
                
            </div>
        )
    }
}

export default CHDealsContent;