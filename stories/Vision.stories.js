import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, SearchBox } from 'react-vision-dom';

const stories = storiesOf('<Vision>', module);

const searchClient = cliniasearch('TODO', 'test');

stories.add('default', () => (
  <Vision searchClient={searchClient}>
    <SearchBox />
  </Vision>
));
