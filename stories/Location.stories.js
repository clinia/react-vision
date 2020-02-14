import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, Location } from 'react-vision-dom';

const stories = storiesOf('Location', module);

const searchClient = cliniasearch(
  'demo-pharmacies',
  'KcLxBhVFP8ooPgQODlAxWqfNg657fTz9'
);

stories.addParameters({ jest: ['Location'] }).add('Default Location', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <Location />
  </Vision>
));

stories.addParameters({ jest: ['Location'] }).add('User Location', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <Location
      translations={{ userPosition: 'Current location' }}
      enableUserLocation
    />
  </Vision>
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

stories.addParameters({ jest: ['Location'] }).add('Custom Location', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <Location
      translations={{ placeholder: 'Custom placeholder' }}
      renderSuggestion={renderLocationSuggestion}
      suggestionValue={getSuggestionValue}
    />
  </Vision>
));
