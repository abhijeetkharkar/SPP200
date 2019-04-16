import React from 'react';
import CHDealsContent from '../js/CHDealsContent';
import { shallow } from 'enzyme';
import firebaseInitialization from '../FirebaseUtils';
const elastic = require('../elasticSearch');

jest.mock('../elasticSearch');

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
})

// Testing Loading of Deals Page 
test('Loading DegreeContent ', () => {
    const wrapper = shallow(<CHDealsContent location={location} />);
    expect(wrapper.exists()).toBe(true);
})