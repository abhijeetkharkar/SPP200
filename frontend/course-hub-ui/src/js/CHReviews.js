import React,{ Component } from "react";
import CHNavigator from './CHNavigator';
import CHCourseTile from './CHCourseTile'
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { Form, Button, Image, Card, Tooltip, OverlayTrigger, FormControl } from 'react-bootstrap';
import '../App.css';
import '../css/common-components.css';
import '../css/coursedetails.css';
import '../css/coursereviews.css';
import ReadMoreReact from 'read-more-react';

class CHReviews extends Component{
    constructor(props, context) {
        super(props, context); 
        this.state = {
            reviews:null,
            newComment:''
        }
        this.insertNewComment = this.insertNewComment.bind(this);
        this.getComment = this.getComment.bind(this);
    }

    componentDidMount() {
        // console.log("In CHSearchContent, componentDidMount");
        console.log('course tile: ', this.props.courseId)
        var payload = {
            "query": {
                "term": { "CourseId": this.props.courseId }
            }
        }
        console.log("review payload",JSON.stringify(payload))
        fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/_search/",
            {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return response.json();
            }).then(allreviews => {
                var reviewhits = allreviews.hits.hits
                var reviewjson=[]
                for (let i=0;i<reviewhits.length;i++) {
                    reviewjson.push(reviewhits[i]._source)
                } 
                console.log("Reviews:",reviewjson);
                this.setState({reviews: reviewjson});
            }).catch(error => {
                console.log("Error in elastic search api is ", error)
                return false;
            });
    }

    getComment(event){
        this.setState({newComment:event.target.value});
    }

    insertNewComment(){
        console.log('email: ',this.props.email,' course id: ',this.props.courseId);
        console.log('new comment: ',this.state.newComment);
        if(this.state.newComment==null || this.state.newComment.length==0) return
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var ReviewId = this.props.email+'$'+date+'$'+time;
        var ParentReviewId=ReviewId;
        var CourseId=this.props.courseId;
        var Description=this.state.newComment;
        var UserId=this.props.email;
        var PostedBy = this.props.firstName;
        var Edited=false;
        var PostedByInstructor=false;
        var CommentedOn={Date:'',Time:''};
        CommentedOn.Date=date;
        CommentedOn.Time=time;
        var EditedOn={Date:'',Time:''};
        EditedOn.Date=date;
        EditedOn.Time=time;

        var payload={
            "ReviewId":ReviewId,"CourseId":CourseId,"Description":Description,"UserId":UserId,"ParentReviewId":ParentReviewId,
            "Edited":Edited,"PostedByInstructor":PostedByInstructor,"CommentedOn":CommentedOn,"EditedOn":EditedOn,"PostedBy":PostedBy,
            "NoofLikes":0,"NoofdisLikes":0
        }

        console.log(JSON.stringify(payload));
         const response = fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/review",
			{ 
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json'}
            }).then(response => {
                return response.json();
            }).then(elasticData => {
                // console.log("JSON OBJECT IS ")
                console.log("log is ", elasticData)
                if (elasticData.result === "created") {
                    return true;
                } else {
                    return false;
                }
            }).catch(error => {
                // console.log("Error in elastic search api is ", error)
                return false;
            });
	    return response;
    }

    render() {
		return(
                <div className="course-reviews">
                    {(this.state.reviews != null && this.state.reviews.length > 0) ?
                                this.state.reviews.map(item => {
                                    return (
                                        <Card rows="4" cols="50" className="review-card">
                                        <span className="review-span" > <Image className="user-dp" thumbnail src={'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} fluid={true} />
                                            &nbsp;&nbsp;<strong>{item.PostedBy}</strong>
                                        <text className="review-posted" ><strong>Posted On:</strong>{item.CommentedOn.Date} {item.CommentedOn.Time} </text>
                                        <ReadMoreReact text={item.Description}
                                        min={100}
                                        ideal={200}
                                        max={500}
                                        readMoreText="read more"/>
                                        </span> 
                                    </Card>
                                    );
                                }) : []
                            }
                    <span className='new-comment' style={{display:"inline"}}>
                    <textarea className='new-comment-area' rows="5" onChange={this.getComment}/>
                    <Button variant="info" onClick={()=>this.insertNewComment()} size="lg" className="new-comment-button">Review</Button>
                    </span>
                </div>
        );
    }
}
export default CHReviews;