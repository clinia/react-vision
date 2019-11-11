import React from 'react';
import ReactDOM from 'react-dom';
import ExampleSearchBoxHits from './ExampleSearchBoxHits';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ExampleSearchBoxHits />, div);
  ReactDOM.unmountComponentAtNode(div);
});
