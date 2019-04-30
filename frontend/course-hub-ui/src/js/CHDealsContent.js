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
import { searchUser, getDealsfromES, getSpecificDealFromES, getDealVotesFromES, updateDealsinES, addDealVoteinES, updateDealVotesinES } from '../elasticSearch';
const fetch = require('node-fetch');

class CHDealsContent extends Component{
    constructor (props, context){
        super(props, context);
        this.state = {
            dealAdded : this.props.dealAdded,
            currentLayout: this.props.pageType,
            totalPages: 1,
            currentPage: this.props.pageNumber,
            deals: [],
            pageList: [],
            email: this.props.email,
            category: this.props.dealCategory,
            showCompleteDealID : "",
            completeDealData : {},
            subChoice: "",
            upVoteVariant: "light",
            downVoteVariant: "light"
        };

        this.showDealModal = this.showDealModal.bind(this);
        this.hideCompleteDeal = this.hideCompleteDeal.bind(this);
    }

    componentWillReceiveProps(nextProps){
        console.log("IN COMPONENT WILL RECEIVE PROPS 1")
        if (nextProps.pageType == 'addnewdeal'){
            console.log("IN COMPONENT WILL RECEIVE PROPS 2")
            this.setState({currentLayout: nextProps.pageType, currentPage: nextProps.pageNumber});
        }else if (nextProps.pageType == 'adddealsuccessfull'){
            console.log("IN COMPONENT WILL RECEIVE PROPS 3")
            this.setState({currentLayout: nextProps.pageType, currentPage: nextProps.pageNumber, dealAdded : nextProps.dealAdded});
        }else{
            console.log("IN COMPONENT WILL RECEIVE PROPS 4")
            this.setState({category: nextProps.dealCategory, currentPage: nextProps.pageNumber});
            const payload = {
                "category": nextProps.dealCategory,
                "page_number": nextProps.pageNumber || 0
            }
            
            try{
                getDealsfromES(payload)
                .then(dealsData => {
                    this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals });
                    if (dealsData.deals.length == 0){
                        this.setState({currentLayout : "nodeal"});
                    }else{
                        this.setState({currentLayout : "deals"});
                    }
                });
            }catch(error){
                console.log("Error in searchquery backend ", error);
            }
        }
    }

    componentDidMount() {
        if (this.state.currentLayout != 'addnewdeal' && this.state.currentLayout != 'adddealsuccessfull'){
            const payload = {
                "category": this.state.category,
                "page_number": this.props.pageNumber || 0
            }
            console.log("payload is ", payload);
            
            try{
                getDealsfromES(payload)
                .then(dealsData => {
                    // console.log("DATA IS DID MOUNT", dealsData);
                    this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals });
                    if (dealsData.deals.length == 0){
                        this.setState({currentLayout : "nodeal"});
                    }else{
                        this.setState({currentLayout : "deals"});
                    }
                })
            }catch(error){
                console.log("Error in searchquery backend ", error);
            }
        }
    }

    // Display Modal for Deal
    showDealModal = (courseID) => {
        const payload = {
            query : {
                term : { _id : courseID }
            }
        }
        var user = firebaseInitialization.auth().currentUser;
        
        try{
            getSpecificDealFromES(payload)
            .then(dealData => {
                console.log("Course id is ", courseID);
                this.setState({
                    subChoice: "showCompleteDeal",
                    showCompleteDealID : courseID,
                    completeDealData : {
                        data : dealData['hits']['hits'][0]['_source']
                    }
                }, () => {
                    if (user){
                        var payload = {
                            query : {
                                 bool : {
                                    must : [
                                        {
                                             match : { 
                                               dealid : this.state.showCompleteDealID
                                             }
                                        },
                                        {
                                             match : {
                                                 email : user.email
                                             }   
                                        }
                                     ]
                                 }
                            }
                         };
                         
                         getDealVotesFromES(payload)
                         .then(data => {
                            if (data.hits.total == 1){
                                if (data.hits.hits[0]._source.vote == 1){
                                    this.setState({
                                        upVoteVariant: "warning",
                                        downVoteVariant: "light"
                                    });
                                }else{
                                    this.setState({
                                        upVoteVariant: "light",
                                        downVoteVariant: "warning"
                                    });
                                }
                            }else{
                                this.setState({
                                    upVoteVariant: "light",
                                    downVoteVariant: "light"
                                });
                            }
                        })
                    }else{
                        this.setState({
                            upVoteVariant: "light",
                            downVoteVariant: "light"
                        });
                    }
                });
            })
        }catch(error){
            console.log("Error in searchquery backend ", error);
        };
    }

    // Hiding Deal
    hideCompleteDeal = (e) => {
        this.setState({
            subChoice: "",
            showCompleteDealID : "",
            completeDealData : {}
        });
    }

    upVote = (e) => {
        console.log("USER IS ",firebaseInitialization.auth().currentUser);
        var user = firebaseInitialization.auth().currentUser;
        if (user){
            var payload = {
                query : {
                     bool : {
                        must : [
                            {
                                 match : { 
                                   dealid : this.state.showCompleteDealID
                                 }
                            },
                            {
                                 match : {
                                     email : user.email
                                 }   
                            }
                         ]
                     }
                }
             }
             try{
                getDealVotesFromES(payload)
                .then(dealVoteData => {
                   if (dealVoteData.hits.total == 1){
                       if (dealVoteData.hits.hits[0]._source.vote == 1){
                           // Do Nothing
                           this.setState({
                               upVoteVariant: "warning",
                               downVoteVariant: "light"
                           });
                       }else{
                           // Update value to 1
                           var voteID = dealVoteData.hits.hits[0]._id;
                           var payload = {
                               doc : {
                                   vote : 1
                               }
                           };
   
                           updateDealVotesinES(voteID, payload)
                           .then(updateData => {
                               if (updateData._shards.successful == 1){
                                   this.setState({
                                       upVoteVariant: "warning",
                                       downVoteVariant: "light"
                                   });
                               }
                           }).then(data => {
                               // Update data in deals id
                               var thumbsDownVal = 0;
                               if ((this.state.completeDealData.data.thumbsDown-1) < 0){
                                   thumbsDownVal = 0;
                               }
                               else{
                                   thumbsDownVal = this.state.completeDealData.data.thumbsDown-1;
                               }
                               var payload = {
                                   doc : {
                                       thumbsUp : this.state.completeDealData.data.thumbsUp+1,
                                       thumbsDown : thumbsDownVal,
                                   }
                               };
                               
                               var url = process.env.REACT_APP_UPDATE_DEALS + this.state.showCompleteDealID + '/_update';
                               updateDealsinES(url, payload)
                               .then(data => {
                                   if (data._shards.successful == 1){
                                       console.log("DATABASE UPDATED WITH NEW VALUE");
                                   }
                               });
                           });
                       }
                   }else{
                       // Add a record if there isn't any record
                       var payload = {
                           dealid : this.state.showCompleteDealID,
                           email : user.email,
                           vote : 1
                       };
                       
                       addDealVoteinES(payload)
                       .then(addData => {
                           if (addData._shards.successful == 1){
                               this.setState({
                                   upVoteVariant: "warning",
                                   downVoteVariant: "light"
                               });
                           }
                       }).then(data => {
                           var payload = {
                               doc : {
                                   thumbsUp : this.state.completeDealData.data.thumbsUp+1,
                               }
                           };
                           var url = process.env.REACT_APP_UPDATE_DEALS + this.state.showCompleteDealID + '/_update';
                           
                           updateDealsinES(url, payload)
                           .then(data => {
                               if (data._shards.successful == 1){
                                   console.log("DATABASE UPDATED WITH NEW VALUE");
                               }
                           });
                       });
                   }
               })
             }catch(error){
                console.log("Error in searchquery backend ", error);
             }
        }else{
            alert("You should be logged in to UpVote a Deal");
        }
    }

    downVote = (e) => {
        var user = firebaseInitialization.auth().currentUser;
        if (user){
            var payload = {
                query : {
                     bool : {
                        must : [
                            {
                                 match : { 
                                   dealid : this.state.showCompleteDealID
                                 }
                            },
                            {
                                 match : {
                                     email : user.email
                                 }   
                            }
                         ]
                     }
                }
             }
             try {
                getDealVotesFromES(payload)
                .then(dealVoteData => {
                   if (dealVoteData.hits.total == 1){
                       if (dealVoteData.hits.hits[0]._source.vote == -1){
                           // Do Nothing
                           this.setState({
                               upVoteVariant: "light",
                               downVoteVariant: "warning"
                           });
                       }else{
                           // Update value to -1
                           var voteID = dealVoteData.hits.hits[0]._id;
                           var payload = {
                               doc : {
                                   vote : -1
                               }
                           };
   
                           updateDealVotesinES(voteID, payload)
                           .then(updateData => {
                               if (updateData._shards.successful == 1){
                                   this.setState({
                                       upVoteVariant: "light",
                                       downVoteVariant: "warning"
                                   });
                               }
                           }).then(data => {
                               var thumbsUpVal = 0;
                               if ((this.state.completeDealData.data.thumbsUp-1) < 0){
                                   thumbsUpVal = 0;
                               }
                               else{
                                   thumbsUpVal = this.state.completeDealData.data.thumbsUp-1;
                               }
                               var payload = {
                                   doc : {
                                       thumbsUp : thumbsUpVal,
                                       thumbsDown :  this.state.completeDealData.data.thumbsDown+1
                                   }
                               };
                               var url = process.env.REACT_APP_UPDATE_DEALS + this.state.showCompleteDealID + '/_update';
                               
                               updateDealsinES(url, payload)
                               .then(data => {
                                   if (data._shards.successful == 1){
                                       console.log("DATABASE UPDATED WITH NEW VALUE");
                                   }
                               });
                           });
                       }
                   }else{
                       // Add a record if there isn't any record
                       var payload = {
                           dealid : this.state.showCompleteDealID,
                           email : user.email,
                           vote : -1
                       }
                       
                       addDealVoteinES(payload)
                       .then(addData => {
                           if (addData._shards.successful == 1){
                               this.setState({
                                   upVoteVariant: "light",
                                   downVoteVariant: "warning"
                               });
                           }
                       }).then(data => {
                           var payload = {
                               doc : {
                                   thumbsDown : this.state.completeDealData.data.thumbsDown+1,
                               }
                           };
                           var url = process.env.REACT_APP_UPDATE_DEALS + this.state.showCompleteDealID + '/_update';
                           
                           updateDealsinES(url, payload)
                           .then(data => {
                               if (data._shards.successful == 1){
                                   console.log("DATABASE UPDATED WITH NEW VALUE");
                               }
                           });
                       });
                   }
               });
             }catch(error){
                console.log("Error in searchquery backend ", error);
             }
        }else{
            alert("You should be logged in to UpVote a Deal");
        }
    }

    render() {
        var choice = this.state.currentLayout;
        var subChoice = this.state.subChoice;
        var floatLeft = {
            'float': 'left'
        };
        var voteStyle = {
            'font-size' : '10px'
        }

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
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <Button style={voteStyle} onClick={this.upVote} target="_blank" variant={this.state.upVoteVariant}> &#128077;UpVote </Button>
                                                &nbsp;
                                                <Button style={voteStyle} onClick={this.downVote} target="_blank" variant={this.state.downVoteVariant}> 👎DownVote </Button>
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
                        <CHAddDeal updatePage={this.props.handleAddDeal}  key='keyAddDeals' email={this.state.email}/>
                    </div>]
                }

                {   choice === "adddealsuccessfull" && 
                    [<div className="dealsPage">
                        <CHDealsFilter updatePage={this.props.handlePageUpdate} key='keyDealsFilter' updateDeals={this.props.updateDealCategory}/>
                        <div className="deal_success_alert">
                            <Alert variant="success">
                                <Alert.Heading style={floatLeft} id="adddealsuccess">SUCCESS!!!</Alert.Heading>
                                <br /><br />
                                <p style={floatLeft}>
                                    Deal Added Successfully in the Database
                                </p>
                                <br />
                                <hr />
                            </Alert>
                        </div>
                        <div id="dealIDValue" className="hiddenID">
                            {this.state.dealAdded}
                        </div>
                        {/* <input id="dealIDValueInput" name="dealValue" type="hidden" value={this.state.dealAdded} /> */}
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
                        <br />
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