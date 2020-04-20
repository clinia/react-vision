import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { Hits } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('Hits', module);

stories
  .add('default', () => (
    <WrapWithHits linkedStoryGroup="Hits">
      <Hits />
    </WrapWithHits>
  ))
  .add('with custom rendering', () => {
    function HealthFacility({ hit }) {
      return (
        <div>
          <h4>{hit.name}</h4>
        </div>
      );
    }
    HealthFacility.propTypes = {
      hit: PropTypes.object.isRequired,
    };
    return (
      <WrapWithHits linkedStoryGroup="Hits">
        <Hits hit={HealthFacility} />
      </WrapWithHits>
    );
  });
