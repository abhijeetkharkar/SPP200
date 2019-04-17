import React from 'react';
import CHDealsFilter from '../js/CHDealsFilter';
import { shallow } from 'enzyme';

// Testing Loading of Deals Page
test('Loading DealsFilter ', () => {
    const updateDeals = jest.fn();
    const wrapper = shallow(<CHDealsFilter />);
    expect(wrapper.exists()).toBe(true);
})

test('Testing Button CLick for new Deal categories ', () => {
    const updateDeals = jest.fn();
    const wrapper = shallow(<CHDealsFilter updateDeals={updateDeals} updatePage={updateDeals}/>);
    wrapper.find('#all-deals').simulate("click");
    wrapper.find('#general-deals').simulate("click");
    wrapper.find('#computerscience-deals').simulate("click");
    wrapper.find('#business-deals').simulate("click");
    wrapper.find('#humanities-deals').simulate("click");
    wrapper.find('#datascience-deals').simulate("click");
    wrapper.find('#personaldevelopment-deals').simulate("click");
    wrapper.find('#artanddesign-deals').simulate("click");
    wrapper.find('#programming-deals').simulate("click");
    wrapper.find('#engineering-deals').simulate("click");
    wrapper.find('#healthandscience-deals').simulate("click");
    wrapper.find('#mathematics-deals').simulate("click");
    wrapper.find('#science-deals').simulate("click");
    wrapper.find('#socialscience-deals').simulate("click");
    wrapper.find('#personaldevelopment-deals').simulate("click");
    wrapper.find('#educationandteaching-deals').simulate("click");
    wrapper.find('#dealSubmitButton').simulate("click");
})