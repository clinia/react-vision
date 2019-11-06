import React from 'react';
import { Vision, Hits, SearchBox } from 'react-vision-dom';
import cliniasearch from 'cliniasearch/lite';

const searchClient = cliniasearch('TODO', 'test');

const App = props => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <div></div>
  </Vision>
);

export default App;
