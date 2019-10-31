import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, SearchBox, Hits } from 'react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = cliniasearch('TODO', 'test');

stories
  .add('default', () => (
    <Vision searchClient={searchClient}>
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
            results: [{ hits: [{ name: 'Fake result' }] }],
          });
        },
      }}
    >
      <SearchBox />
      <Hits />
    </Vision>
  ));
