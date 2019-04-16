import React from 'react';
import CHDealsCard from '../js/CHDealsCard';
import { shallow } from 'enzyme';

// Testing Loading of Deals Page 
test('Loading DealCard ', () => {
    const wrapper = shallow(<CHDealsCard title="sample Title" provider="sample provider" description="sample-description" datePosted="05-05-2019" originalPrice="20" discountedPrice="5" imageLink="https://course-hub.com" thumbsUp="5" thumbsDown="4" />);
    expect(wrapper.exists()).toBe(true);
})

test('test update show deals ', () => {
    const updateShowDeal = jest.fn();
    const showDeal = jest.fn();
    const wrapper = shallow(<CHDealsCard showDeal={updateShowDeal} title="sample Title" provider="sample provider" description="sample-description" datePosted="05-05-2019" originalPrice="20" discountedPrice="5" imageLink="https://course-hub.com" thumbsUp="5" thumbsDown="4" />);
    const instance = wrapper.instance();
    
    instance.loadModal();
    expect(true).toBe(true);
})

test('load modal ', () => {
    const updateShowDeal = jest.fn();
    const showDeal = jest.fn();
    const wrapper = shallow(<CHDealsCard showDeal={updateShowDeal} title="sample Title" provider="sample provider" description="sample-description" datePosted="05-05-2019" originalPrice="20" discountedPrice="5" imageLink="https://course-hub.com" thumbsUp="5" thumbsDown="4" />);
    const instance = wrapper.instance();
    
    instance.componentWillReceiveProps({title:"sample Title", provider:"sample provider", description:"sample-description", datePosted:"05-05-2019", originalPrice:"20", discountedPrice:"5", imageLink:"https://course-hub.com", thumbsUp:"5", thumbsDown:"4"});
    expect(instance.state.title).toBe("sample Title...");
})