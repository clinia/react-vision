import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, SearchBox, Hits } from 'react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

stories
  .add('default', () => (
    <Vision searchClient={searchClient}>
      <SearchBox />
      <Hits />
    </Vision>
  ))
  .add('with custom search client', () => (
    <Vision
      indexName="instant_search"
      searchClient={{
        search() {
          return Promise.resolve({
            results: [{ hits: [{ name: 'Fake result' }] }],
          });
        },
      }}
    >
      <SearchBox />
      <Hits />
    </Vision>
  ));
