import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import App from '../App';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';


test('Loading Home Page', () => {
  
  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "home", optional1: "", optional2 : "", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

// test("test handle click", () => {
//   var app = new App();
//   app.handleClick("home", "", "", "");
//   expect(app.state.choice).toBe("");
// });