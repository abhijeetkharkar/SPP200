import React, { Component } from "react";
import { doGetProfilePicture } from '../FirebaseUtils';
import { addReview, updateCourseRating, updateReview, getReviews } from '../elasticSearch';
import { Form, Button, Image, Modal, Overlay, Tooltip } from 'react-bootstrap';
import '../App.css';
import '../css/common-components.css';
import '../css/course-details.css';
import '../css/course-reviews.css';
import ReadMoreReact from 'read-more-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarRatingComponent from 'react-star-rating-component';

class CHReviews extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            reviews: null,
            newComment: '',
            userRating: 0,
            serverErrorMsg: '',
            showMessage: false
        }
        this.attachRef = target => this.setState({ target });
        this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleUserRatingChange = this.handleUserRatingChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.handleThumbsUp = this.handleThumbsUp.bind(this);
        this.handleThumbsDown = this.handleThumbsDown.bind(this);
    }

    /* componentDidMount() {
        console.log("In CHReviews, componentDidMount");
        console.log('course tile: ', this.props.courseId)
        var payload = {
            "query": {
                "term": { "CourseId": this.props.courseId }
            }
        }
        
        fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/_search/",
            {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return response.json();
            }).then(allreviews => {
                var reviewhits = allreviews.hits.hits
                var reviewjson = []
                for (let i = 0; i < reviewhits.length; i++) {
                    reviewjson.push(reviewhits[i]._source)
                }
                // console.log("Reviews:", reviewjson);
                this.setState({ reviews: reviewjson });
            }).catch(error => {
                console.log("CHReviews, componentDidMount, elasticsearch error: ", error)
            });
    } */

    componentWillReceiveProps(nextProps) {
        console.log("In CHReviews, componentWillReceiveProps", nextProps.courseId, ", writeReview: ", nextProps.writeReview);

        if (nextProps.writeReview) {
            this.handleShow();
        } else {

            var payload = {
                "query": {
                    "term": { "CourseId": nextProps.courseId }
                }
            }

            getReviews(payload).then(reviews => {
                this.setState({ show: false, showMessage: false, newComment: "", userRating: 0, reviews: reviews });
            }).catch(error => {
                console.log("CHReviews, componentWillReceiveProps, elasticsearch error: ", error)
            });
        }
    }

    handleShow = () => {
        this.setState({ show: true, showMessage: false });
    };

    handleHide = () => {
        // console.log("Called");
        this.setState({ show: false, showMessage: false, newComment: "", userRating: 0 });
        // this.props.updateContent("home", null, null, this.props.searchString != undefined? this.props.searchString: null);
    };

    handleCommentChange = e => {
        this.setState({ newComment: e.target.value });
    }

    handleUserRatingChange = (userRating, name) => {
        // console.log("Rating:", userRating);
        this.setState({ userRating: userRating });
    }

    handleReviewSubmit = e => {
        e.preventDefault();
        // console.log('email: ', this.props.email, ' course id: ', this.props.courseId);
        // console.log('new comment: ', this.state.newComment, ", rating:", this.state.userRating);
        if (!this.props.signedIn) {
            // console.log("CHReviews, not signed in");
            this.setState({ serverErrorMsg: "Please sign-in to write a review", showMessage: true, newComment: "", userRating: 0 });
        } else {
            if (this.state.userRating === 0) {
                this.setState({ serverErrorMsg: "Rating should be from 1-5", showMessage: true });
            } else if (this.state.newComment.length < 50) {
                this.setState({ serverErrorMsg: "Review should be at least 50 characters in length", showMessage: true });
            } else {
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var reviewId = this.props.email + today;
                var parentReviewId = reviewId;
                var courseId = this.props.courseId;
                var description = this.state.newComment;
                var rating = this.state.userRating;
                var userId = this.props.email;
                var postedBy = this.props.firstName;
                var edited = false;
                var postedByInstructor = false;
                var commentedOn = { Date: date, Time: time };
                var editedOn = { Date: date, Time: time };

                var payloadCourse = {
                    "doc": {
                        "Rating": (((this.props.rating * this.props.numberOfRatings) + rating)/(this.props.numberOfRatings+1)),
                        "NoofRatings":(this.props.numberOfRatings+1) 
                    }
                };

                console.log("Inside", payloadCourse)

                doGetProfilePicture().then(url => {
                    // console.log("In CHReview, handleSubmitReview, imageURL: ", url);
                    var payload = {
                        "ReviewId": reviewId, "CourseId": courseId, "Description": description, "Rating": rating, "UserId": userId, "ParentReviewId": parentReviewId,
                        "Edited": edited, "PostedByInstructor": postedByInstructor, "CommentedOn": commentedOn, "EditedOn": editedOn, "PostedBy": postedBy,
                        "NoofLikes": 0, "NoofdisLikes": 0, "URL": url
                    };
                    return addReview(payload);
                }).then(success => {
                    // console.log("JSON OBJECT IS ")
                    // console.log("log is ", elasticData);
                    if (success) {
                        console.log("Inside elastic data");
                        updateCourseRating(this.props.elasticId, payloadCourse).then(successCourse => {
                            if(successCourse) {
                                this.setState({ show: false, newComment: "", userRating: 0, serverErrorMsg: "", showMessage: false },
                                    this.props.updateContent(this.props.signedIn ? "homeSignedIn" : "home",
                                        this.props.firstName,
                                        this.props.email,
                                        null,
                                        this.props.courseId));
                            } else {
                                this.setState({
                                    serverErrorMsg: "Your review could not be submitted at the moment. Please try again later.",
                                    showMessage: true
                                });
                            }
                        });                        
                    } else {
                        this.setState({
                            serverErrorMsg: "Your review could not be submitted at the moment. Please try again later.",
                            showMessage: true
                        });
                    }
                }).catch((error) => {
                    console.log("CHReviews, handleReviewSubmit, error: ", error);
                    this.setState({
                        serverErrorMsg: "Your review could not be submitted at the moment. Please try again later.",
                        showMessage: true
                    });
                });
            }
        }
    }

    handleThumbsUp = async (likes, reviewId) => {
        var payloadReview = {
            "doc": {
                "NoofLikes": likes
            }
        };

        updateReview(reviewId, payloadReview).then(response => {
            if(!response)
                console.log("In CHReviews, handleThumbsUp, LAFDA in updateReview");
            this.forceUpdate();
        });
    }

    handleThumbsDown = async (dislikes, reviewId) => {
        var payloadReview = {
            "doc": {
                "NoofdisLikes": dislikes
            }
        };

        updateReview(reviewId, payloadReview).then(response => {
            if(!response)
                console.log("In CHReviews, handleThumbsDown, LAFDA in updateReview");
            this.forceUpdate();
        });
    }

    render() {
        const { serverErrorMsg, showMessage, target, userRating } = this.state;
        // console.log("Write Review:", this.props.writeReview, ", Show:", this.state.show);
        console.log("In CHReviews, render method, errorMessage: ", serverErrorMsg, ", showMessage: ", showMessage, ", rating: ", userRating);
        return (
            <div className="course-reviews">
                {this.props.writeReview &&
                    <Modal
                        show={this.state.show}
                        onHide={this.handleHide}
                        dialogClassName="modal-90w"
                        aria-labelledby="example-custom-modal-styling-title">

                        <Modal.Header>
                            <Modal.Title size="lg">Write a Review</Modal.Title>
                            <Button id="writeReviewCloseButton" variant="danger" onClick={this.handleHide}>
                                X
                            </Button>
                        </Modal.Header>

                        <Modal.Body>
                            <Form noValidate onSubmit={this.handleReviewSubmit}>
                                <Form.Row>
                                    <Form.Label>How would you rate this course?</Form.Label>
                                </Form.Row>
                                <Form.Row>
                                    <StarRatingComponent
                                        name={"review-course-user-editable-rating"}
                                        className="submit-review-rating"
                                        starCount={5}
                                        value={this.state.userRating}
                                        editing={true}
                                        emptyStarColor={"#5e5d25"}
                                        style={{ position: "inherit !important" }}
                                        onStarClick={this.handleUserRatingChange}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>Your Review</Form.Label>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Control as="textarea" className='review-area' rows="5" required value={this.state.newComment} onChange={this.handleCommentChange} />
                                </Form.Row>
                                <Form.Row>
                                    <Button id="submit-review-button" ref={this.attachRef} className="submit-review-button" variant="success" type="submit">Submit Review</Button>
                                    <Overlay target={target} show={showMessage} placement="top">
                                        {props => (
                                            <Tooltip id="passwordResetOverlay" {...props}>
                                                {serverErrorMsg}
                                            </Tooltip>
                                        )}
                                    </Overlay>
                                </Form.Row>
                            </Form>
                        </Modal.Body>
                    </Modal>
                }

                <table className="review-table">
                    <tbody>
                        {(this.state.reviews != null && this.state.reviews.length > 0) ?
                            this.state.reviews.map((item, index) => {
                                return (

                                    <tr className="review-table-row" key={"review-table-row-" + index}>

                                        <td className="review-user-lane">
                                            <Image className="review-user-dp" roundedCircle
                                                src={item.URL || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                                            <p className="review-div-user-name">{item.PostedBy}</p>
                                        </td>

                                        <td className="review-details-lane">
                                            {/* <div className="review-details-lane"> */}
                                            <div className="review-details-header">
                                                <StarRatingComponent
                                                    className="review-rating"
                                                    name={"review-course-user-rating"}
                                                    starCount={5}
                                                    value={item.Rating || 1}
                                                    editing={false}
                                                    emptyStarColor={"#5e5d25"}
                                                    style={{ position: "inherit !important", float: "left" }}
                                                />
                                                <p className="review-posted-on">Last Edited:&nbsp;{item.CommentedOn.Date + " " + item.CommentedOn.Time}</p>
                                            </div>
                                            <div className="review-details-body">
                                                <ReadMoreReact text={item.Description}
                                                    min={100}
                                                    ideal={200}
                                                    max={500}
                                                    readMoreText="Read more v" />
                                            </div>
                                            <div className="review-details-footer">
                                                <div className="review-helpful">
                                                    <p className="review-likes-number">{item.NoofLikes}</p>
                                                    <p className="review-likes-text">people found this review helpful</p>
                                                </div>
                                                <div className="review-up-down-vote">
                                                    <Button id={"review-thumbs-up-" + index} className="review-thumbs-up" onClick={() => this.handleThumbsUp(item.NoofLikes + 1, item.id)}><FontAwesomeIcon icon={['fa', 'thumbs-up']} size='lg' color='rgb(0, 0, 0)' />&nbsp;+{item.NoofLikes}</Button>
                                                    <Button id={"review-thumbs-down-" + index} className="review-thumbs-down" onClick={() => this.handleThumbsDown(item.NoofdisLikes + 1, item.id)}><FontAwesomeIcon icon={['fa', 'thumbs-down']} size='lg' color='rgb(0, 0, 0)' />&nbsp;+{item.NoofdisLikes}</Button>
                                                </div>
                                            </div>
                                            {/* </div> */}
                                        </td>
                                    </tr>
                                );
                            }) : []
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
export default CHReviews;