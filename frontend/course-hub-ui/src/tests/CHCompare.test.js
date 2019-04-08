import {configure, shallow} from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";
import React from "react";
import CHCompare from "../js/CHCompare";
import firebaseInitialization from "../FirebaseUtils";

configure({ adapter: new Adapter() });


const firebase = require('../FirebaseUtils');
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
        const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
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
    })
});