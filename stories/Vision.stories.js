import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, SearchBox, Hits, connectAutoComplete } from 'react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = cliniasearch('TODO', 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

class AutoComplete extends React.Component {
  state = {
    query: '',
  };

  onChange = event => {
    const { searchForSuggestions, onChange } = this.props;
    const query = event.target.value;

    this.setState({ query });
    searchForSuggestions(query);

    if (onChange) {
      onChange(event);
    }
  };

  render() {
    const { suggestions } = this.props;
    const query = this.state.query;

    return (
      <>
        <input
          ref={this.onInputMount}
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          required
          maxLength={512}
          value={query}
          onChange={this.onChange}
        />
        <ul>
          {suggestions.map(suggestion => (
            <li key={suggestion.suggestion}>{suggestion.suggestion}</li>
          ))}
        </ul>
      </>
    );
  }
}

const ConnectAutoComplete = connectAutoComplete(AutoComplete);

stories.add('default', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <ConnectAutoComplete />
    <Hits />
  </Vision>
));
