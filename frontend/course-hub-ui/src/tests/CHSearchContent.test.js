import React from 'react';
import CHSearchContent from '../js/CHSearchContent';
import { shallow } from 'enzyme';

test('Loading Home Page', () => {
  
	const wrapper = shallow(<CHSearchContent />);
	expect(wrapper.exists()).toBe(true);
  });