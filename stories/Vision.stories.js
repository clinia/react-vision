import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, Hits, AutoComplete } from 'react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = cliniasearch(
  'demo-pharmacies',
  'KcLxBhVFP8ooPgQODlAxWqfNg657fTz9'
);

stories
  .add('default', () => (
    <Vision searchClient={searchClient} indexName="health_facility">
      <AutoComplete />
      <Hits />
    </Vision>
  ))
  .add('with custom search client', () => (
    <Vision
      searchClient={{
        search() {
          return Promise.resolve({
            results: [{ records: [{ name: 'Fake result' }] }],
          });
        },
        initPlaces() {
          return {};
        },
      }}
      indexName="health_facility"
    >
      <AutoComplete />
      <Hits />
    </Vision>
  ));
