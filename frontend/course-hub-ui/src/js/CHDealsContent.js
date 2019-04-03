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
import { Table, Image, Pagination } from 'react-bootstrap';
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
            category: "all",
        }
        this.createPageList = this.createPageList.bind(this);
        console.log("CURRENT LAYOUT IS ", this.state.currentLayout);
        console.log("CURRENT CATEGORY IS ", this.state.category);
    }

    componentWillReceiveProps(nextProps){
        // this.setState({category: nextProps.dealCategory});
        console.log("UPDATED CATEGORY IN CHDEALSCONTENT IS : ", nextProps.dealCategory);
        const payload = {
            "category": nextProps.dealCategory,
            "page_number": this.props.pageNumber || 0
        }

        fetch(process.env.REACT_APP_GET_DEALS, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(dealsData => {
            console.log("DATA IS RECEIVE PROPS ", dealsData);
            this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals, pageList: this.createPageList(dealsData.current_page, dealsData.number_of_pages) });
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

        fetch(process.env.REACT_APP_GET_DEALS, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(dealsData => {
            console.log("DATA IS DID MOUNT", dealsData);
            this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals, pageList: this.createPageList(dealsData.current_page, dealsData.number_of_pages) });
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

    showCompleteDeal = () => {
        console.log("SHOW COMPLETE FUNCRTUON IS CALLED ");
    }

    render() {
        var choice = this.state.currentLayout;
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
                                                <CHDealsCard title={item.title} provider={item.provider} description={item.description} datePosted={item.datePosted} originalPrice={item.originalPrice} discountedPrice={item.discountedPrice} imageLink={item.imageLink} thumbsUp={item.thumbsUp} id={item.id} showCompleteDeal={this.showCompleteDeal} key={'keyDealsCard'+(index+10)} />
                                            </div>);
                                    }) :
                                    []
                            },
                            { this.state.deals.length == 0 &&
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
                                </div>
                            }
                        </div>
                    ]
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
                                        <Pagination.First  onClick={() => this.props.updatePage(this.props.searchString, 0)}/>
                                        {this.props.pageNumber <= 0 && <Pagination.Prev disabled />}
                                        {this.props.pageNumber > 0 && <Pagination.Prev onClick={() => this.props.updatePage(this.props.searchString, this.props.pageNumber-1)}/>}

                                        {
                                            this.state.pageList.map(page => {
                                                if(page === this.props.pageNumber)
                                                    return <Pagination.Item key={page} active onClick={() => this.props.updatePage(this.props.searchString, page)}>{page+1}</Pagination.Item>;
                                                else
                                                    return <Pagination.Item key={page} onClick={() => this.props.updatePage(this.props.searchString, page)}>{page+1}</Pagination.Item>;
                                            })
                                        }

                                        {this.props.pageNumber >= this.state.totalPages-1 && <Pagination.Next disabled />}
                                        {this.props.pageNumber < this.state.totalPages-1 && <Pagination.Next onClick={() => this.props.updatePage(this.props.searchString, this.props.pageNumber+1)}/>}
                                        <Pagination.Last onClick={() => this.props.updatePage(this.props.searchString, this.state.totalPages-1)}/>
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