import React from 'react';
import CHProfileNavigator from '../js/CHProfileNavigator';
import { shallow } from 'enzyme';

test('Testing Loading of Profile Navigator webpage', () => {
    const wrapper = shallow(<CHProfileNavigator />);
    expect(wrapper.exists()).toBe(true);
});