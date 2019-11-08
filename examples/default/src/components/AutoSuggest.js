import React from 'react';
import Autosuggest from 'react-autosuggest';
import { escapeRegExp } from '../utils';

export default class AutoComplete extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onChange = (_, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    const results = await this.props.client.search(value, {
      queryType: 'prefix_last',
    });

    let suggestions = [];

    if (results && results.records) {
      suggestions = results.records.map(result => ({ name: result.name }));
    }

    this.setState({
      suggestions,
    });
  };

  renderSuggestion = suggestion => {
    const { value } = this.state;

    const highlightedSuggestion = suggestion.name.replace(
      new RegExp(escapeRegExp(value), 'gi'),
      match => {
        return `<strong>${match}</strong>`;
      }
    );

    return <div dangerouslySetInnerHTML={{ __html: highlightedSuggestion }} />;
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange,
      className: 'cvi-AutoComplete-input',
      type: 'search',
    };

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          getSuggestionValue={suggestion => suggestion.name}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}
