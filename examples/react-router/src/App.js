import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { HomePage, SearchPage } from './pages';
import { Vision } from 'react-vision-dom';
import cliniasearch from 'cliniasearch/lite';
import './App.css';

const searchClient = cliniasearch(
  'demo-pharmacies',
  'KcLxBhVFP8ooPgQODlAxWqfNg657fTz9'
);

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : '';
const urlToSearchState = location => qs.parse(location.search.slice(1));

class App extends Component {
  state = {
    searchState: urlToSearchState(this.props.location),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.setState({ searchState: urlToSearchState(this.props.location) });
    }
  }

  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, updateAfter);

    this.setState({ searchState });
  };

  render() {
    return (
      <Vision
        searchClient={searchClient}
        indexName="health_facility"
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={createURL}
      >
        <SearchPage />
      </Vision>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.object.isRequired,
};

export default App;
