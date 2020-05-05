import React from 'react';
import { storiesOf } from '@storybook/react';
import { Panel, SortBy } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('SortBy', module);

stories
  .add('default', () => (
    <WrapWithHits linkedStoryGroup="SortBy">
      <SortBy
        items={[
          { value: 'score', label: 'Relevance' },
          { value: 'asc(updatedAt)', label: 'Last updated asc.' },
          { value: 'desc(updatedAt)', label: 'Last updated desc.' },
        ]}
        defaultRefinement="score"
      />
    </WrapWithHits>
  ))
  .add('without label', () => (
    <WrapWithHits linkedStoryGroup="SortBy">
      <SortBy
        items={[
          { value: 'score' },
          { value: 'asc(updatedAt)' },
          { value: 'desc(updatedAt)' },
        ]}
        defaultRefinement="score"
      />
    </WrapWithHits>
  ))
  .add('with Panel', () => (
    <WrapWithHits linkedStoryGroup="SortBy">
      <Panel header="Sort By" footer="Footer">
        <SortBy
          items={[
            { value: 'score', label: 'Relevance' },
            { value: 'asc(updatedAt)', label: 'Last updated asc.' },
            { value: 'desc(updatedAt)', label: 'Last updated desc.' },
          ]}
          defaultRefinement="score"
        />
      </Panel>
    </WrapWithHits>
  ));
