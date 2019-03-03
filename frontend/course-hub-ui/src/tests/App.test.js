import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import {shallow} from 'enzyme';

test('renders without crashing', () => {
  // const div = document.createElement('div');
  const app = shallow(
    <App />
  );
  // ReactDOM.render(app);
  // ReactDOM.unmountComponentAtNode(div);
  expect(true).toBe
});

//"test": "react-scripts test",