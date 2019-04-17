import React from 'react';
import CHDeals from '../js/CHDeals';
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
test('Loading Degree Page ', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    expect(wrapper.exists()).toBe(true);
})


test('User should not be able to go to submit deal page if not logged in', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();

    instance.handlePageUpdate();
    expect(instance.state.choice).toBe('deals');
})

test('User should be able to go to submit deal page if not logged in', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    instance.setState({
        firstName: 'Nabeel'
    })
    instance.handlePageUpdate();
    expect(instance.state.choice).toBe('addnewdeal');
})


test('User should be able to see deals in pagination', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    var dealCategory = "all";
    var pageNumber = 1;
    instance.handlePagination(dealCategory, pageNumber);
    expect(instance.state.dealCategory).toBe('all');
    expect(instance.state.pagenumber).toBe(1);
})

test('User should be able to see Success message after adding the deal in the database', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    
    instance.handleAddDeal(true);
    expect(instance.state.choice).toBe('adddealsuccessfull');
});

test('User should be able to see UnSuccessful message if the deal cannot be added to database', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    
    instance.handleAddDeal(false);
    expect(instance.state.choice).toBe('adddealunsuccessfull');
});

test('User should be able to see selected deal category with choice and pagenumber reset to initial parameters', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    
    instance.updateDealCategory("Software");
    expect(instance.state.dealCategory).toBe('Software');
    expect(instance.state.choice).toBe('deals');
    expect(instance.state.pagenumber).toBe(0);
});

test('user should be able to see the modal ', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    
    instance.showDealModal("demo-course-id");
    expect(instance.state.pageType).toBe('showCompleteDeal');
    expect(instance.state.courseID).toBe('demo-course-id');
})

test('User should be able to update the choice in the page ', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    
    instance.handleClick('home', '', '', '');
    expect(instance.state.choice).toBe('deals');
})

test('state should be updated if user is logged in', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    var user = {
        displayName: 'testDisplayName',
        email: 'test@test.com',
        emailVerified: true
    };
    elastic.searchUser.mockImplementationOnce(() => { return Promise.resolve("test-name") });
    instance.handleAuthStateChange(user);
    expect(instance.state.choice).toBe('deals');
})

test('state should be updated if user is not logged in', () => {
    const wrapper = shallow(<CHDeals location={location} />);
    const instance = wrapper.instance();
    
    elastic.searchUser.mockImplementationOnce(() => { return Promise.resolve("test-name") });
    instance.handleAuthStateChange();
    expect(instance.state.choice).toBe('deals');
})