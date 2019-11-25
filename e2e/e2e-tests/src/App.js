import React from 'react';
import { Vision, SearchBox, Hits, AutoComplete } from 'react-vision-dom';
import cliniasearch from 'cliniasearch/lite';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const searchClient = cliniasearch('TODO', 'AAW3nfvI79tj4LzECYZSEbDP7lqBpFd5', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

const AutoCompleteHitsExample = () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <AutoComplete />
    <Hits />
  </Vision>
);

const SearchBoxHitsExample = () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <SearchBox />
    <Hits />
  </Vision>
);

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/autocomplete">
          <AutoCompleteHitsExample />
        </Route>
        <Route path="/searchbox">
          <SearchBoxHitsExample />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
