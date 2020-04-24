import React from 'react';
import orderBy from 'lodash.orderby';
import { storiesOf } from '@storybook/react';
import { boolean, number, array } from '@storybook/addon-knobs';
import { Panel, RefinementList, SearchBox } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('RefinementList', module);

stories
  .add('default', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList property="type" />
    </WrapWithHits>
  ))
  .add('with selected item', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList property="type" defaultRefinement={['community']} />
    </WrapWithHits>
  ))
  .add('with show more', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList
        property="type"
        limit={2}
        showMoreLimit={5}
        showMore={true}
      />
    </WrapWithHits>
  ))
  .add('with the sort strategy changed', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList
        property="type"
        transformItems={items =>
          orderBy(items, ['label', 'count'], ['asc', 'desc'])
        }
      />
    </WrapWithHits>
  ))
  .add('with Panel', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <Panel header="Refinement List" footer="Footer">
        <RefinementList property="type" />
      </Panel>
    </WrapWithHits>
  ))
  .add('with Panel but no refinement', () => (
    <WrapWithHits
      searchBox={false}
      linkedStoryGroup="RefinementList"
      hasPlayground={true}
    >
      <Panel header="Refinement List" footer="Footer">
        <RefinementList property="type" />
      </Panel>

      <div style={{ display: 'none' }}>
        <SearchBox defaultRefinement="tutututututu" />
      </div>
    </WrapWithHits>
  ))
  .add('playground', () => (
    <WrapWithHits linkedStoryGroup="RefinementList">
      <RefinementList
        property="type"
        defaultRefinement={array('defaultSelectedItem', ['community', 'clsc'])}
        limit={number('limit', 10)}
        showMoreLimit={number('showMoreLimit', 20)}
        showMore={boolean('showMore', true)}
      />
    </WrapWithHits>
  ));
