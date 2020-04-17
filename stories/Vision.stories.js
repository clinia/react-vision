import React from 'react';
import clinia from 'clinia/lite';
import { storiesOf } from '@storybook/react';
import { Vision, Hits, AutoComplete } from '@clinia/react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = clinia(
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
            results: [{ hits: [{ name: 'Fake result' }] }],
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
