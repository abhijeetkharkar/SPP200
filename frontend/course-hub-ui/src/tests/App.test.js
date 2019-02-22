import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
// const edxMocks = require('./tests/__mocks__/');

jest.mock('./SomeComponent', () => () => 'SomeComponent');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//"test": "react-scripts test",