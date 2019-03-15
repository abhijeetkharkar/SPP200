import React from 'react';
import CHAdvertisements from '../js/CHAdvertisements';
import { shallow } from 'enzyme';

test('Testing Loading of LandingPage', () => {
    const wrapper = shallow(<CHAdvertisements />);
    expect(wrapper.exists()).toBe(true);
});