import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { Highlight, Hits } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('Highlight', module);

const Default = ({ hit }) => (
  <article>
    <p>
      <Highlight property="name" hit={hit} />
    </p>
  </article>
);

Default.propTypes = {
  hit: PropTypes.object.isRequired,
};

const StrongHits = ({ hit }) => (
  <article>
    <p>
      <Highlight
        property="name"
        tagName={text('tag name (title)', 'strong')}
        hit={hit}
      />
    </p>
  </article>
);

StrongHits.propTypes = {
  hit: PropTypes.object.isRequired,
};

stories
  .add('default', () => (
    <WrapWithHits hasPlayground={true} linkedStoryGroup="Highlight">
      <Hits hitComponent={Default} />
    </WrapWithHits>
  ))
  .add('playground', () => (
    <WrapWithHits linkedStoryGroup="Highlight">
      <Hits hitComponent={StrongHits} />
    </WrapWithHits>
  ));
