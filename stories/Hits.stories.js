import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { Hits } from 'react-vision-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('Hits', module);

stories
  .add('default', () => (
    <WrapWithHits linkedStoryGroup="Hits">
      <Hits />
    </WrapWithHits>
  ))
  .add('with custom rendering', () => {
    function HealthFacility({ record }) {
      return (
        <div>
          <h4>{record.name}</h4>
        </div>
      );
    }
    HealthFacility.propTypes = {
      record: PropTypes.object.isRequired,
    };
    return (
      <WrapWithHits linkedStoryGroup="Hits">
        <Hits hit={HealthFacility} />
      </WrapWithHits>
    );
  });
