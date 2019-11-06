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

stories
  .add('default', () => (
    <Vision searchClient={searchClient} indexName="health_facility">
      <SearchBox />
      <Hits />
    </Vision>
  ))
  .add('with custom search client', () => (
    <Vision
      indexName="health_facility"
      searchClient={{
        search() {
          return Promise.resolve({
            results: [{ records: [{ id: '1', name: 'Fake result' }] }],
          });
        },
      }}
    >
      <SearchBox />
      <Hits />
    </Vision>
  ));
