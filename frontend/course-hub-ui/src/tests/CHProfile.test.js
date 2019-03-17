import {shallow, render, mount} from "enzyme/build";
import React from "react";
import ProfilePage from "../js/CHProfile";
import {configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';


const firebase = require('../FirebaseUtils');
const elastic = require('../elasticSearch');

jest.mock('../elasticSearch');
jest.mock('../FirebaseUtils');

configure({ adapter: new Adapter() })

describe('Testing Profile', () => {

    describe('Test User Profile Methods without User Details', () => {
        beforeEach(() => {
            elastic.getUserDetails.mockImplementationOnce(() => {
                return Promise.resolve({"id": 1, "data": {"UserName": {"First": "John", "Last": "Smith"}, "email": "john-smith@edu",
                        "dob": "01/01/1990", "phone": "1234567890", "address": "111-A JK Street"}})
            });
        });

        test('Testing Loading of ProfilePage', () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
            expect(wrapper.exists()).toBe(true);
        });

        test('Testing Fetch User Profile Details - Happy Path', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);

            const instance = wrapper.instance();
            expect(instance.state.isOpen).toBe(false);
        });
    });
});