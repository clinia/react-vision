import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SearchBox } from 'react-vision-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('SearchBox', module);

stories.add('default', () => (
  <WrapWithHits
    searchBox={false}
    hasPlayground={true}
    linkedStoryGroup="SearchBox"
  >
    <SearchBox showLoadingIndicator={boolean('showLoadingIndicator', true)} />
  </WrapWithHits>
));
