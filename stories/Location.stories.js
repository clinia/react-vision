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

const renderSuggestion = suggestion => {
  return (
    <div>
      <b>{suggestion.type}</b> - {suggestion.suggestion}
    </div>
  );
};

stories.addParameters({ jest: ['Location'] }).add('Custom Location', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <Location
      translations={{ placeholder: 'Custom placeholder' }}
      renderSuggestion={renderSuggestion}
    />
  </Vision>
));
