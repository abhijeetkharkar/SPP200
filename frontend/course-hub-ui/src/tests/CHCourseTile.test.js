import React from 'react';
import CHCourseTile from '../js/CHCourseTile';
import { shallow } from 'enzyme';

const elastic = require('../elasticSearch');

const courseDetailsResponse = {
    "id": "nsifneifn1212nnf",
    "CourseId": "EDX-ColumbiaX+CSMM.102x",
    "CourseProvider": "EDX",
    "Title": "Machine Learning",
    "Category": [
        "computer-science"
    ],
    "CourseDuration": {
        "Value": 120,
        "Unit": "hrs"
    },
    "Paid": false,
    "Price": 0,
    "PriceCurrency": "USD",
    "Instructors": [
        {
            "InstructorId": "3215d653-1403-45f7-9ded-56392de5faa3",
            "InstructorName": "John W. Paisley",
            "ProfilePic": "https://prod-discovery.edx-cdn.org/media/people/profile_images/3215d653-1403-45f7-9ded-56392de5faa3-37bfc1c6107d.jpg"
        }
    ],
    "URL": "https://www.edx.org/course/machine-learning?utm_source=abhijeetkharkar-university-of-iowa&utm_medium=affiliate_partner",
    "Rating": 0,
    "NoofRatings": 0,
    "hits": 0,
    "Description": "Some Description",
    "CourseImage": "https://prod-discovery.edx-cdn.org/media/course/image/a35c8b84-f0ef-4eb0-ad44-52f4bc61d7df-0cabf26a4f9c.small.jpg",
    "StartDate": "2019-2-4",
    "EndDate": "2019-5-6",
    "SelfPaced": false,
    "Difficulty": "Advanced",
    "last_updated": "2019-4-10"
};

jest.mock('../FirebaseUtils');
jest.mock('../elasticSearch');

test('Testing Course Details', async () => {
    const handleClick = jest.fn();
    elastic.getCourseDetails.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(courseDetailsResponse))});
    const wrapper = shallow(<CHCourseTile updateContent={handleClick} signedIn={false} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    expect(wrapper.exists()).toBe(true);
});

test('Testing search results componentWillReceiveProps', async () => {
    const handleClick = jest.fn();
    elastic.getCourseDetails.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(courseDetailsResponse))});
    const wrapper = shallow(<CHCourseTile updateContent={handleClick} signedIn={false} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    instance.componentWillReceiveProps();
    expect(wrapper.exists()).toBe(true);
});

test('Testing onImageLoad', async () => {
    const handleClick = jest.fn();
    elastic.getCourseDetails.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(courseDetailsResponse))});
    const wrapper = shallow(<CHCourseTile updateContent={handleClick} signedIn={false} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    instance.onImageLoad({target: {offsetHeight: 400, offsetWidth: 600}});
    expect(instance.state.imgHeight).toEqual(400);
});

test('Testing handleWriteReviewClick', async () => {
    const handleClick = jest.fn();
    elastic.getCourseDetails.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(courseDetailsResponse))});
    const wrapper = shallow(<CHCourseTile updateContent={handleClick} signedIn={false} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    instance.handleWriteReviewClick();
    expect(instance.state.writeReview).toEqual(true);
});

test('Testing Review Click feature', async () => {
    const handleClick = jest.fn();
    elastic.getCourseDetails.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(courseDetailsResponse))});
    const wrapper = shallow(<CHCourseTile updateContent={handleClick} signedIn={false} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} courseId="test course" />);
    const instance = wrapper.instance();
    wrapper.find('#write-review-button').simulate("click");
});