import {configure, shallow} from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
import React from "react";
import CHCompare from "../js/CHCompare";
import firebaseInitialization from "../FirebaseUtils";
import CHCompareContent from "../js/CHCompareContent";
import CHCompareModal from "../js/CHCompareModal";
import CHSearch from '../js/CHSearch';

configure({ adapter: new Adapter() });

const elastic = require('../elasticSearch');

jest.mock('../elasticSearch');
jest.mock('../FirebaseUtils');

const onAuthStateChanged = jest.fn(() => {
    return Promise.resolve({
        displayName: 'testDisplayName',
        email: 'test@test.com',
        emailVerified: true
    })
});

jest.spyOn(firebaseInitialization, 'auth').mockImplementation(() => {
    return {
        onAuthStateChanged,
        currentUser: {
            displayName: 'testDisplayName',
            email: 'test@test.com',
            emailVerified: true
        }
    }
});

describe('Testing Compare', () => {
    test('Testing Loading of Compare main component', () => {
        const wrapper = shallow(<CHCompare />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing handleAuthStateChange', async () => {
        const wrapper = shallow(<CHCompare />);
        const instance = wrapper.instance();
        elastic.searchUser.mockImplementationOnce(() => { return Promise.resolve("Test1") });
        instance.handleAuthStateChange({
            displayName: 'testDisplayName',
            email: 'test@test.com',
            emailVerified: true
        });
        expect(instance.state.choice).toBe("");
    });

    test('Testing Compare handle click', async () => {
        const wrapper = shallow(<CHCompare />);
        const instance = wrapper.instance();
        instance.handleClick("Compare", "test", "test@test.edu");
        expect(instance.state.choice).toBe("Compare");
        expect(instance.state.firstName).toBe("test");
        expect(instance.state.email).toBe("test@test.edu");
    });

    test('Testing Loading of Compare content component', () => {
        const handleClick = jest.fn();
        sessionStorage.setItem("compareList", JSON.stringify([{"CourseId": "1", "CourseProvider": "idx", "Title": "xyz",
            "Category": "abc", "Price": 1, "Instructors": [{"InstructorName": "ins"}]}]));

        const wrapper = shallow(<CHCompareContent updateContent={handleClick}/>);
        expect(wrapper.exists()).toBe(true);
        sessionStorage.clear()
    });

    test('Testing Loading of Compare Modal component', () => {
        const handleClick = jest.fn();
        var compareList = [{"CourseId": "1", "Title": "xyz", "CourseProvider": "idx", "Category": "abc", "Price": 1,
            "Instructors": [{"InstructorName": "ins"}]}];

        const wrapper = shallow(<CHCompareModal updateContent={handleClick} modalCompareList={compareList}/>);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing Loading of Compare main component', () => {
        const wrapper = shallow(<CHCompare />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing toggle Modal function of search component', async () => {
        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();
        instance.toggleModal();
        expect(instance.state.isOpen).toBe(true);
    });

    test('Testing addCourseToCompare function of search component', async () => {
        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "123"};
        instance.addCourseToCompare(item);
        expect(instance.state.compareList.includes(item)).toBe(true);
    });

    test('Testing removeCourseFromCompare function of search component', async () => {
        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "xyz"};
        instance.addCourseToCompare(item);
        instance.removeCourseFromCompare(item);
        expect(instance.state.compareList.includes(item)).toBe(false);
    });


});