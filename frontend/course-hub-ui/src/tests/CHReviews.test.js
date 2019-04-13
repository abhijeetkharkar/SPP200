import React from 'react';
import CHReviews from '../js/CHReviews';
import { shallow } from 'enzyme';

const firebase = require('../FirebaseUtils');
const elastic = require('../elasticSearch');

const reviewsResponse = [{
	"ReviewId": "test1@testmail.com$2019-4-8$0:44:6",
	"CourseId": "EDX-IBM+DL0120EN",
	"Description": "Some Review",
	"Rating": 4,
	"UserId": "test1@testmail.com",
	"ParentReviewId": "test1@testmail.com$2019-4-8$0:44:6",
	"Edited": false,
	"PostedByInstructor": false,
	"CommentedOn": {
		"Date": "2019-4-8",
		"Time": "0:44:6"
	},
	"EditedOn": {
		"Date": "2019-4-8",
		"Time": "0:44:6"
	},
	"PostedBy": "Test1",
	"NoofLikes": 1,
	"NoofdisLikes": 0,
	"URL": "some url",
	"id": "uVPFEmoBH8XOSEpf-WOq"
}];

const userReviewLikesResponse = [{
	CourseId: "SomeCourseId",
	UserId: "test1@test.com", ReviewId: "uVPFEmoBH8XOSEpf-WOq",
	id: "zFNuE2oBH8XOSEpfAmPi", Status: "like"
}];

const userReviewLikesMapLike = {
	"test1@test.com#$#uVPFEmoBH8XOSEpf-WOq": {
		id: "zFNuE2oBH8XOSEpfAmPi",
		status: "like"
	}
}

const userReviewLikesMapDislike = {
	"test1@test.com#$#uVPFEmoBH8XOSEpf-WOq": {
		id: "zFNuE2oBH8XOSEpfAmPi",
		status: "dislike"
	}
}

jest.mock('../FirebaseUtils');
jest.mock('../elasticSearch');

test('Testing Reviews Submit Button Click', async () => {
	const handleClick = jest.fn();
	const handleShow = jest.fn();
    // elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={true} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    expect(wrapper.exists()).toBe(true);	
    wrapper.find('#submit-review-button').simulate("click");
});

test('Testing search results componentWillReceiveProps - 1', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
    instance.componentWillReceiveProps({courseId: "someCourseID", writeReview: true});
	expect(instance.state.show).toBe(true);
    expect(wrapper.exists()).toBe(true);
});

test('Testing search results componentWillReceiveProps - 2', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	//elastic.getUserReviewLikes.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(userReviewLikesResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({reviews: reviewsResponse});
    instance.componentWillReceiveProps({courseId: "someCourseID", writeReview: false});
	expect(wrapper.exists()).toBe(true);
	expect(instance.state.reviews).toBe(reviewsResponse);
});

test('Testing search results componentWillReceiveProps - 3', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.getUserReviewLikes.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(userReviewLikesResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={true} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({reviews: reviewsResponse});
    instance.componentWillReceiveProps({courseId: "someCourseID", writeReview: false, signedIn: true});
	expect(wrapper.exists()).toBe(true);
	expect(instance.state.reviews).toBe(reviewsResponse);
});

test('Testing handleShow', async () => {
    const handleClick = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    instance.handleShow();
    expect(instance.state.show).toEqual(true);
});

test('Testing handleHide', async () => {
    const handleClick = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    instance.handleHide();
    expect(instance.state.show).toEqual(false);
});

test('Testing handleCommentChange', async () => {
    const handleClick = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
    instance.handleCommentChange(event);
    expect(instance.state.newComment).toEqual("testComment");
});

test('Testing handleUserRatingChange', async () => {
    const handleClick = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    instance.handleUserRatingChange(5, "ratingName");
    expect(instance.state.userRating).toEqual(5);
});

test('Testing handleReviewSubmit - 1 - Success', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify("someURL"))});
	elastic.addReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateCourseRating.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={true} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
	instance.setState({userRating: 5, newComment: "ReviewReviewReviewReviewReviewReviewReviewReviewReviewReviewReviewReview"});
    instance.handleReviewSubmit(event);
    expect(instance.state.showMessage).toEqual(false);
});

test('Testing handleReviewSubmit - 2 - Not Signed In', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
	instance.setState({userRating: 0, newComment: ""});
    instance.handleReviewSubmit(event);
    expect(instance.state.showMessage).toEqual(true);
});

test('Testing handleReviewSubmit - 3 - SignedIn, But rating 0', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={true} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false}
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
	instance.setState({userRating: 0, newComment: ""});
    instance.handleReviewSubmit(event);
    expect(instance.state.showMessage).toEqual(true);
});

test('Testing handleReviewSubmit - 4 - Signed In, Rating > 0, But review length < 50', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={true} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
	instance.setState({userRating: 5, newComment: "ReviewReview"});
    instance.handleReviewSubmit(event);
    expect(instance.state.showMessage).toEqual(true);
});

test('Testing handleReviewSubmit - 5 - Add Review Failure', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify("someURL"))});
	elastic.addReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(false))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={true} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
	instance.setState({userRating: 5, newComment: "ReviewReviewReviewReviewReviewReviewReviewReviewReviewReviewReviewReview"});
    instance.handleReviewSubmit(event);
    expect(instance.state.showMessage).toEqual(false); //bad
});

test('Testing handleReviewSubmit - 6 - Updating Course rating failure', async () => {
    const handleClick = jest.fn();
	elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify("someURL"))});
	elastic.addReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateCourseRating.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(false))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={true} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	
	const event = {
		target: { value: 'testComment' },
		preventDefault() { }
	};
	instance.setState({userRating: 5, newComment: "ReviewReviewReviewReviewReviewReviewReviewReviewReviewReviewReviewReview"});
    instance.handleReviewSubmit(event);
    expect(instance.state.showMessage).toEqual(false); //bad
});

test('Testing handleThumbsUp - Happy - 1', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapLike});
    instance.handleThumbsUp("uVPFEmoBH8XOSEpf-WOq");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsUp - Happy - 2', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapDislike});
    instance.handleThumbsUp("uVPFEmoBH8XOSEpf-WOq");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsUp - Happy - 3', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.addUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapLike});
    instance.handleThumbsUp("uVPFEmoBH8XOSEpf-WOq1");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsUp - Happy - 4', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.addUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapDislike});
    instance.handleThumbsUp("uVPFEmoBH8XOSEpf-WOq1");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsUp - Sad - 1', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(false))});
	elastic.updateUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapLike});
    instance.handleThumbsUp("uVPFEmoBH8XOSEpf-WOq");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsUp - Sad - 2', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(false))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapLike});
    instance.handleThumbsUp("uVPFEmoBH8XOSEpf-WOq");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsDown - Happy - 1', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapLike});
    instance.handleThumbsDown("uVPFEmoBH8XOSEpf-WOq");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsDown - Happy - 2', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.updateUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapDislike});
    instance.handleThumbsDown("uVPFEmoBH8XOSEpf-WOq");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsDown - Happy - 3', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.addUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapLike});
    instance.handleThumbsDown("uVPFEmoBH8XOSEpf-WOq1");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing handleThumbsDown - Happy - 4', async () => {
    const handleClick = jest.fn();
	//const setTimeout = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    elastic.updateReview.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
	elastic.addUserReviewLike.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(true))});
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
    const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
	instance.setState({userReviewLikeMap: userReviewLikesMapDislike});
    instance.handleThumbsDown("uVPFEmoBH8XOSEpf-WOq1");
    // expect(instance.state.writeReview).toEqual(true);
});

test('Testing Thumbs Up Button Click', async () => {
	const handleClick = jest.fn();
	const handleShow = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={true} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({reviews: reviewsResponse});
    expect(wrapper.exists()).toBe(true);	
    wrapper.find('#review-thumbs-up-0').simulate("click");
});

test('Testing Thumbs Down Button Click', async () => {
	const handleClick = jest.fn();
	const handleShow = jest.fn();
    elastic.getReviews.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(reviewsResponse))});
	const wrapper = shallow(<CHReviews updateContent={handleClick} signedIn={false} 
										elasticId={"someID"} courseId={"someCourseID"} rating={4} 
										numberOfRatings={2} writeReview={false} 
										firstName={"Test1"} email={"test1@test.com"} 
										searchString={"test"} courseId="test course" />);
	const instance = wrapper.instance();
	instance.setState({reviews: reviewsResponse});
    expect(wrapper.exists()).toBe(true);	
    wrapper.find('#review-thumbs-down-0').simulate("click");
});