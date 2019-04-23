import {configure, shallow} from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
import React from "react";
import CHSearch from '../js/CHSearch';
import firebaseInitialization from "../FirebaseUtils";

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

describe('Testing Course Lists', () => {

    test('Testing addCourseToList function of search component - Favorite List', async () => {
        window.alert = () => {};
        elastic.updateUser.mockImplementationOnce(() => {
            {
                return Promise.resolve(false)
            }
        });

        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "xyz"};
        instance.addCourseToList("1", item);
        expect(instance.state.favoriteList.includes(item)).toBe(true);
    });

    test('Testing addCourseToList function of search component - In Progress List', async () => {
        window.alert = () => {};
        elastic.updateUser.mockImplementationOnce(() => {
            {
                return Promise.resolve(false)
            }
        });

        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "xyz"};
        instance.addCourseToList("2", item);
        expect(instance.state.inProgressList.includes(item)).toBe(true);
    });

    test('Testing addCourseToList function of search component - In Progress List', async () => {
        window.alert = () => {};
        elastic.updateUser.mockImplementationOnce(() => {
            {
                return Promise.resolve(false)
            }
        });

        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "xyz"};
        instance.addCourseToList("3", item);
        expect(instance.state.completedList.includes(item)).toBe(true);
    });



});