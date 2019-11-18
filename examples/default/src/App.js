import React, { useRef } from 'react';
import Example from './examples/Example';
import { Vision, AutoComplete, SearchBox } from 'react-vision-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import logo from './static/images/logo.svg';
import searchClient from './searchClientExample';
import './App.css';

const exampleRoute = '/example';

const Home = () => {
  let history = useHistory();
  let autoCompleteInputRef;

  const onSubmit = event => {
    event.preventDefault();
    goToExamplePage();
  };

  const goToExamplePage = () => {
    let queryParams = '';

    if (autoCompleteInputRef.value) {
      queryParams = `speciality=${autoCompleteInputRef.value}`;
    }

    history.push(`${exampleRoute}?${queryParams}`);
  };

  return (
    <div className="home">
      <div className="home-header">
        <img src={logo} />
      </div>
      <div className="home-container">
        <h1>
          Find a <br /> ressource
        </h1>
        <h3>Find and book a trusted professional now</h3>
        <Vision searchClient={searchClient} indexName="health_facility">
          <AutoComplete
            onSubmit={onSubmit}
            __inputRef={ref => (autoCompleteInputRef = ref)}
            triggerSubmitOnSuggestionSelected
          />
        </Vision>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path={exampleRoute}>
          <Example />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
