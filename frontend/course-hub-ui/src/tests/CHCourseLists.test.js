import {configure, shallow} from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
import React from "react";
import CHSearch from '../js/CHSearch';
import firebaseInitialization from "../FirebaseUtils";
import CHCourseListsCard from "../js/CHCourseListsCard";

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
        instance.addCourseToList("2", item);
        instance.addCourseToList("3", item);

        instance.addCourseToList("1", item);
        expect(instance.state.favoriteList.includes(item)).toBe(true);
        expect(instance.state.inProgressList.includes(item)).toBe(false);
        expect(instance.state.completedList.includes(item)).toBe(false);
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
        instance.addCourseToList("1", item);
        instance.addCourseToList("3", item);

        instance.addCourseToList("2", item);
        expect(instance.state.favoriteList.includes(item)).toBe(false);
        expect(instance.state.inProgressList.includes(item)).toBe(true);
        expect(instance.state.completedList.includes(item)).toBe(false);
    });

    test('Testing addCourseToList function of search component - Completed List', async () => {
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
        instance.addCourseToList("2", item);

        instance.addCourseToList("3", item);
        expect(instance.state.favoriteList.includes(item)).toBe(false);
        expect(instance.state.inProgressList.includes(item)).toBe(false);
        expect(instance.state.completedList.includes(item)).toBe(true);
    });

    test('Testing clearCourseFromLists function of search component - Favourite List', async () => {
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
        instance.clearCourseFromLists(item);
        expect(instance.state.favoriteList.includes(item)).toBe(false);
    });

    test('Testing clearCourseFromLists function of search component - InProgress List', async () => {
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
        instance.clearCourseFromLists(item);
        expect(instance.state.inProgressList.includes(item)).toBe(false);
    });

    test('Testing clearCourseFromLists function of search component - Completed List', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        elastic.updateUser.mockImplementationOnce(() => {
            {throw new Error('Exception encountered')}
        });

        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "xyz"};
        instance.addCourseToList("3", item);
        instance.clearCourseFromLists(item);
        expect(instance.state.completedList.includes(item)).toBe(false);
    });

    test('Testing updateUser function of lists - Sad Path', async () => {
        window.alert = () => {};
        elastic.updateUser.mockImplementationOnce(() => {throw new Error('Exception encountered')});

        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var item = {"CourseId": "xyz"};
        instance.addCourseToList("3", item);
        expect(instance.state.completedList.includes(item)).toBe(true);
    });

    test('Testing getUserCoursesLists function', async () => {
        elastic.getUserDetails.mockImplementationOnce(() => {
            return Promise.resolve({"id": 1, "data": {"FavouriteCourses": ["1", "2"], "CoursesinProgress": [],
                    "CoursesTaken": []}});
        });

        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } };
        const wrapper = shallow(<CHSearch location={location} />);
        const instance = wrapper.instance();

        var email = "test@example.com";
        await instance.getUserCoursesLists(email);
        expect(instance.state.favoriteList.includes("1")).toBe(true);
    });

    test('Testing switchList function - InProgressList', async () => {
        elastic.updateUser.mockImplementationOnce(() => {return Promise.resolve(true)});

        const wrapper = shallow(<CHCourseListsCard favoriteList={[]} inProgressList={[]} completedList={[]}/>);
        const instance = wrapper.instance();

        var item = {"title": "test@title"};
        await instance.switchList("1", "2", item);
        expect(instance.props.inProgressList.includes(item)).toBe(true);
    });

    test('Testing switchList function - FavouritesList', async () => {
        elastic.updateUser.mockImplementationOnce(() => {return Promise.resolve(true)});

        const wrapper = shallow(<CHCourseListsCard favoriteList={[]} inProgressList={[]} completedList={[]}/>);
        const instance = wrapper.instance();

        var item = {"title": "test@title"};
        await instance.switchList("2", "1", item);
        expect(instance.props.favoriteList.includes(item)).toBe(true);
    });

    test('Testing switchList function - CompletedList', async () => {
        elastic.updateUser.mockImplementationOnce(() => {return Promise.resolve(false)});

        const wrapper = shallow(<CHCourseListsCard favoriteList={[]} inProgressList={[]} completedList={[]}/>);
        const instance = wrapper.instance();

        var item = {"title": "test@title"};
        await instance.switchList("2", "3", item);
        expect(instance.props.completedList.includes(item)).toBe(true);
    });

    test('Testing switchList updateUser function - Sad path', async () => {
        elastic.updateUser.mockImplementationOnce(() => {throw new Error('Exception encountered')});

        const wrapper = shallow(<CHCourseListsCard favoriteList={[]} inProgressList={[]} completedList={[]}/>);
        const instance = wrapper.instance();

        var item = {"title": "test@title"};
        await instance.switchList("3", "1", item);
        expect(instance.props.favoriteList.includes(item)).toBe(true);
    });

});