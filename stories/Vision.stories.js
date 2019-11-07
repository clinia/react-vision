import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, SearchBox, Hits } from 'react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = cliniasearch('TODO', 'test', {
  protocol: 'http',
  hosts: {
    read: ['localhost:5000'],
    write: ['localhost:5000'],
  },
});

const customHit = record => {
  return (
    <div>
      <h4>{record.name}</h4>
    </div>
  );
};

stories.add('default', () => (
  <Vision searchClient={searchClient} indexName="health_facility">
    <SearchBox />
    <Hits hit={customHit} />
  </Vision>
));

// visionManager ->
// widgetsManager ->
