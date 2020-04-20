import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Location } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('Location', module);

stories
  .add('Default Location', () => (
    <WrapWithHits
      searchBox={false}
      hasPlayground={true}
      linkedStoryGroup="Location"
    >
      <Location />
    </WrapWithHits>
  ))
  .add('User Location', () => (
    <WrapWithHits
      searchBox={false}
      hasPlayground={true}
      linkedStoryGroup="Location"
    >
      <Location
        translations={{ userPosition: 'Current location' }}
        enableUserLocation
      />
    </WrapWithHits>
  ));

const getSuggestionValue = suggestion => {
  if (!suggestion) return null;

  switch (suggestion.type) {
    case 'postcode':
      return suggestion.postalCode;
    case 'place':
      if (suggestion.regionCode) {
        return `${suggestion.place}, ${suggestion.regionCode}`;
      }
      return suggestion.place;
    case 'neighborhood':
      if (suggestion.regionCode && suggestion.place) {
        return `${suggestion.neighborhood}, ${suggestion.place}, ${suggestion.regionCode}`;
      }
      return suggestion.neighborhood;
    default:
      break;
  }

  return null;
};

const renderLocationSuggestion = suggestion => {
  if (!suggestion) return null;
  const value = getSuggestionValue(suggestion);

  if (value) {
    return <div>{value}</div>;
  }

  return null;
};

stories.add('Custom Location', () => (
  <WrapWithHits
    searchBox={false}
    hasPlayground={true}
    linkedStoryGroup="Location"
  >
    <Location
      translations={{ placeholder: 'Custom placeholder' }}
      renderSuggestion={renderLocationSuggestion}
      suggestionValue={getSuggestionValue}
    />
  </WrapWithHits>
));

// with event listeners
// --------------------

class LocationContainer extends Component {
  state = { selectedEvents: { onChange: true } };

  get supportedEvents() {
    return [
      'onChange',
      'onFocus',
      'onBlur',
      'onSelect',
      'onKeyDown',
      'onKeyPress',
      'onSubmit',
      'onReset',
    ];
  }

  handleSelectedEvent = eventName => ({ target: { checked } }) => {
    const { selectedEvents } = this.state;
    this.setState({
      selectedEvents: { ...selectedEvents, [eventName]: checked },
    });
  };

  handleSubmit = event => {
    // we dont want the page to reload after the submit event
    event.preventDefault();
    event.stopPropagation();

    this.logAction('onSubmit')(event);
  };

  logAction = eventName => event => {
    // we dont want to log unselected event
    if (this.state.selectedEvents[eventName]) {
      action(eventName)(event);
    }
  };

  render() {
    return (
      <WrapWithHits
        searchBox={false}
        hasPlayground={true}
        linkedStoryGroup="SearchBox"
      >
        <div
          style={{
            color: '#999',
            borderBottom: '1px solid #E4E4E4',
            marginBottom: 10,
          }}
        >
          {/* events checkboxes */}
          {this.supportedEvents.map(eventName => (
            <label key={eventName} style={{ marginRight: 10 }}>
              <input
                name={`selectEvent-${eventName}`}
                type="checkbox"
                checked={this.state.selectedEvents[eventName]}
                onChange={this.handleSelectedEvent(eventName)}
              />
              {eventName}
            </label>
          ))}

          <div style={{ marginBottom: 5, marginTop: 5, fontSize: 12 }}>
            <em>
              (Click on the action logger tab of the right sidebar to see event
              logs)
            </em>
          </div>
        </div>

        <Location
          onSubmit={this.handleSubmit}
          onReset={this.logAction('onReset')}
          onChange={this.logAction('onChange')}
          onFocus={this.logAction('onFocus')}
          onBlur={this.logAction('onBlur')}
          onSelect={this.logAction('onSelect')}
          onKeyDown={this.logAction('onKeyDown')}
          onKeyPress={this.logAction('onKeyPress')}
        />
      </WrapWithHits>
    );
  }
}

stories.add('with event listeners', () => <LocationContainer />);
