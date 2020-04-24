import React from 'react';
import clinia from 'clinia/lite';
import { storiesOf } from '@storybook/react';
import { Vizion, Hits, AutoComplete } from '@clinia/react-vizion-dom';

const stories = storiesOf('<Vizion>', module);

const searchClient = clinia(
  'demo-pharmacies',
  'KcLxBhVFP8ooPgQODlAxWqfNg657fTz9'
);

stories
  .add('default', () => (
    <Vizion searchClient={searchClient} indexName="meta">
      <AutoComplete />
      <Hits />
    </Vizion>
  ))
  .add('with custom search client', () => (
    <Vizion
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
      indexName="meta"
    >
      <AutoComplete />
      <Hits />
    </Vizion>
  ));
