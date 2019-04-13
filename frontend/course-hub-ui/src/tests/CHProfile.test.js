import {shallow, mount} from "enzyme/build";
import React from "react";
import {configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import CHDeactivateCard from "../js/CHDeactivateCard";
import ProfileContent from "../js/CHProfileContent";
import CHProfile from "../js/CHProfile";
import firebaseInitialization from "../FirebaseUtils";


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

configure({ adapter: new Adapter() });

describe('Testing Profile', () => {

    describe('Test User Profile Methods without User Details', () => {
        beforeEach(() => {
            elastic.getUserDetails.mockImplementationOnce(() => {
                return Promise.resolve({"id": 1, "data": {"UserName": {"First": "John", "Last": "Smith"}, "email": "john-smith@edu",
                        "dob": "01/01/1990", "phone": "1234567890", "address": "111-A JK Street"}})
            });
        });


        test('Testing Loading of ProfileContent Component', () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);
            expect(wrapper.exists()).toBe(true);
        });

        test('Testing Fetch User Profile Details - Happy Path', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

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
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

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

            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);
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

            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);
            const instance = wrapper.instance();

            const event = {
                preventDefault() {},
            };

            await instance.handleSubmit(event);
            expect(instance.state.elastic_message).toBe('Update profile exception');
        });

        test('Testing Fetch User Profile Details - Sad Path', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            expect(instance.state.isOpen).toBe(false);
        });

        test('Testing update first name', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);
            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_fname' },
            };
            instance.handleFirstNameChange(event);
            expect(instance.state.firstName).toBe('test_fname');
        });

        test('Testing update last name', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_lname' },
            };
            instance.handleLastNameChange(event);
            expect(instance.state.lastName).toBe('test_lname');
        });

        test('Testing update date of birth', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: '01/01/1990' },
            };
            instance.handleDobChange(event);
            expect(instance.state.dob).toBe('01/01/1990');
        });

        test('Testing update phone number', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: '(123)-456-7890' },
            };
            instance.handlePhoneChange(event);
            expect(instance.state.phone).toBe('(123)-456-7890');
        });

        test('Testing update address', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_address' },
            };
            instance.handleAddressChange(event);
            expect(instance.state.address).toBe('test_address');
        });

        test('Testing update city', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_city' },
            };
            instance.handleCityChange(event);
            expect(instance.state.city).toBe('test_city');
        });

        test('Testing update state', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_state' },
            };
            instance.handleStateChange(event);
            expect(instance.state.state).toBe('test_state');
        });

        test('Testing update zip code', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_zip' },
            };
            instance.handleZipChange(event);
            expect(instance.state.zip_code).toBe('test_zip');
        });

        test('Testing update old password', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_old_password' },
            };
            instance.handleOldPasswordChange(event);
            expect(instance.state.old_password).toBe('test_old_password');
        });

        test('Testing update new password', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_new_password' },
            };
            instance.handlePasswordChange(event);
            expect(instance.state.new_password).toBe('test_new_password');
        });

        test('Testing confirm new password', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_new_password' },
            };
            instance.handleConfirmPasswordChange(event);
            expect(instance.state.confirm_password).toBe('test_new_password');
        });

        test('Testing toggle modal', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            instance.toggleModal();
            expect(instance.state.isOpen).toBe(true);
        });

        test('Testing on drop image', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            const event = {
                target: { files: ['test_on_drop_image'] },
            };
            instance.onDrop(event);
            expect(instance.state.profile_picture).toBe('test_on_drop_image');
        });

        test('Testing update profile image - exist', async () => {
            const handleClick = jest.fn();
            firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve('test_url')});
            const wrapper = mount(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            instance.handleImageChange();

        });

        test('Testing update profile image - not exist', async () => {
            const handleClick = jest.fn();
            firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve(null)});

            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            instance.handleImageChange();

        });

        test('Testing upload profile profile - Happy Path', async () => {
            const handleClick = jest.fn();
            firebase.doUploadProfilePicture.mockImplementationOnce(() => {return Promise.resolve("SUCCESS")});

            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            instance.handleImageUpload();

        });

        test('Testing upload profile profile - Sad Path', async () => {
            const handleClick = jest.fn();
            firebase.doUploadProfilePicture.mockImplementationOnce(() => {return Promise.resolve("FAILURE")});

            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            instance.handleImageUpload();

        });

        test('Testing update password submit - Happy Path', async () => {
            const handleClick = jest.fn();
            firebase.doPasswordUpdate.mockImplementationOnce(() => {return Promise.resolve("SUCCESS")});

            const wrapper = shallow(<ProfileContent updateContent={handleClick} email={"john-smith@edu"}/>);

            const instance = wrapper.instance();
            instance.handlePasswordSubmit();

        });

        test('Testing User Account Delete - Happy Path', async () => {
            const handleClick = jest.fn();
            firebase.reauthenticateWithCredential.mockImplementationOnce(() => {return Promise.resolve(true)});
            elastic.elasticDeleteUser.mockImplementationOnce(() => {{return Promise.resolve(true)}});
            firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve("url")});
            firebase.doDeleteProfilePicture.mockImplementationOnce(() => {return Promise.resolve(true)});
            firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.resolve(true)});

            const wrapper = shallow(<CHDeactivateCard updateContent={handleClick}/>);
            const instance = wrapper.instance();

            await instance.handleDeleteAccount();
            expect(instance.state.elastic_message).toBe("Successfully deleted user data");
        });

        test('Testing User Account Delete - Fail to delete elastic search data', async () => {
            const handleClick = jest.fn();
            firebase.reauthenticateWithCredential.mockImplementationOnce(() => {return Promise.resolve(true)});
            elastic.elasticDeleteUser.mockImplementationOnce(() => {{return Promise.resolve(false)}});

            const wrapper = shallow(<CHDeactivateCard updateContent={handleClick}/>);
            const instance = wrapper.instance();

            await instance.handleDeleteAccount();
            expect(instance.state.elastic_message).toBe("Couldn't delete elastic search data");
        });

        test('Testing User Account Delete - Exception', async () => {
            const handleClick = jest.fn();
            elastic.elasticDeleteUser.mockImplementationOnce(() => {{return Promise.resolve(true)}});
            firebase.reauthenticateWithCredential.mockImplementationOnce(() => {return Promise.resolve(true)});
            firebase.doGetProfilePicture.mockImplementationOnce(() => {return Promise.resolve("url")});
            firebase.doDeleteProfilePicture.mockImplementationOnce(() => {return Promise.resolve(true)});
            firebase.doDeleteUser.mockImplementationOnce(() => {throw new Error('Delete exception encountered')});

            const wrapper = shallow(<CHDeactivateCard updateContent={handleClick}/>);
            const instance = wrapper.instance();

            await instance.handleDeleteAccount();
            expect(instance.state.serverErrorMsg).toBe('Delete exception encountered');
        });

        test('Testing update deactivated password', async () => {
            const handleClick = jest.fn();
            const wrapper = shallow(<CHDeactivateCard updateContent={handleClick}/>);

            const instance = wrapper.instance();
            const event = {
                target: { value: 'test_new_password' },
            };
            instance.handlePasswordChange(event);
            expect(instance.state.password).toBe('test_new_password');
        });
    });
});