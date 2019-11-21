import React from 'react';
import PropTypes from 'prop-types';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, connectLocation } from 'react-vision-dom';

const stories = storiesOf('Location', module);

const searchClient = cliniasearch('TODO', 'AAW3nfvI79tj4LzECYZSEbDP7lqBpFd5', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

class AutoComplete extends React.Component {
  static propTypes = {
    searchForLocations: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func,
    refine: PropTypes.func,
  };

  state = {
    query: '',
  };

  onChange = event => {
    const { searchForLocations, onChange } = this.props;
    const query = event.target.value;

    this.setState({ query });
    searchForLocations(query);

    if (onChange) {
      onChange(event);
    }
  };

  onSubmit = event => {
    event.preventDefault();
    event.stopPropagation();
    const { refine } = this.props;

    refine(this.state.query);
  };

  render() {
    const { suggestions } = this.props;
    const query = this.state.query;

    return (
      <>
        <form onSubmit={this.onSubmit}>
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
        </form>

        <ul>
          {suggestions.map(suggestion => (
            <li key={suggestion.formattedAddress}>
              {suggestion.formattedAddress}
            </li>
          ))}
        </ul>
      </>
    );
  }
}

const Location = connectLocation(AutoComplete);

stories.add('default', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <Location />
  </Vision>
));
