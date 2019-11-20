import React, { useRef } from 'react';
import Example from './examples/Example';
import { Vision, AutoComplete, Location } from 'react-vision-dom';
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
  let locationInputRef;

  const onSubmit = event => {
    event.preventDefault();
    goToExamplePage();
  };

  const goToExamplePage = () => {
    let queryParams = '';

    if (autoCompleteInputRef.value) {
      queryParams += `speciality=${autoCompleteInputRef.value}`;
    }

    if (locationInputRef.value) {
      queryParams += `&location=${locationInputRef.value}`;
    }

    history.push(`${exampleRoute}?${queryParams}`);
  };

  return (
    <div className="home">
      <div className="home-bg" />
      <div className="home-header">
        <img src={logo} />
      </div>
      <div className="home-container">
        <h1>
          Find a <br /> ressource
        </h1>
        <h3>Find and book a trusted professional now</h3>
        <div className="search">
          <Vision searchClient={searchClient} indexName="health_facility">
            <div className="example-autoComplete">
              <div className="autocomplete-label">What</div>
              <AutoComplete
                __inputRef={ref => (autoCompleteInputRef = ref)}
                submit={null}
                clear={null}
              />
            </div>
            <div className="example-location">
              <div className="autocomplete-label">Where</div>
              <Location
                __inputRef={ref => (locationInputRef = ref)}
                onSubmit={onSubmit}
                types={['postcode', 'place', 'neighborhood']}
                country={['CA']}
                locale="en"
              />
            </div>
          </Vision>
        </div>
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
