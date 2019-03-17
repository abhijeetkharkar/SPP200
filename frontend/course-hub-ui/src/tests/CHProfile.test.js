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

    describe('Test User Profile Methods without User Details', () => {
        beforeEach(() => {
            elastic.getUserDetails.mockImplementationOnce(() => {
                return Promise.resolve({})
            });
        });

        test('Testing User profile update onSubmit - Happy Path', async () => {
            const handleClick = jest.fn();
            elastic.updateUser.mockImplementationOnce(() => {
                {
                    return Promise.resolve(true)
                }
            });
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);

            const instance = wrapper.instance();
            const event = {
                preventDefault() {
                },
            };

            await instance.handleSubmit(event);
            expect(instance.state.elastic_message).toBe('Profile Updated Successfully');
        });

        test('Testing User profile update onSubmit - Sad Path', async () => {
            const handleClick = jest.fn();
            elastic.updateUser.mockImplementationOnce(() => {{return Promise.resolve(false)}});

            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
            const instance = wrapper.instance();

            const event = {
                preventDefault() {},
            };

            await instance.handleSubmit(event);
            expect(instance.state.elastic_message).toBe('Unable to update Profile');
        });

        test('Testing User profile update onSubmit - Exception', async () => {
            const handleClick = jest.fn();
            elastic.updateUser.mockImplementationOnce(() => {{throw new Error('Update profile exception')}});

            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
            const instance = wrapper.instance();

            const event = {
                preventDefault() {},
            };

            await instance.handleSubmit(event);
            expect(instance.state.elastic_message).toBe('Update profile exception');
        });

        test('Testing Fetch User Profile Details - Sad Path', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);

            const instance = wrapper.instance();
            expect(instance.state.isOpen).toBe(false);
        });

        test('Testing update first name', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_fname' },
            };
            instance.handleFirstNameChange(event);
            expect(instance.state.firstName).toBe('test_fname');
        });

        test('Testing update last name', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_lname' },
            };
            instance.handleLastNameChange(event);
            expect(instance.state.lastName).toBe('test_lname');
        });

        test('Testing update date of birth', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfilePage updateContent={handleClick}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: '01/01/1990' },
            };
            instance.handleDobChange(event);
            expect(instance.state.dob).toBe('01/01/1990');
        });
    });
});