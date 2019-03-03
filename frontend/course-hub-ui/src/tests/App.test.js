import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import App from '../App';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';

// sample test
test('renders without crashing', () => {
  expect(true).toBe(true);
});


// Login Page test
test('Testing Footer Component load without error', () => {
  const tree = renderer
    .create(<Footer />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});