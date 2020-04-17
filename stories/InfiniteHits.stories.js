import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { InfiniteHits, connectInfiniteHits } from '@clinia/react-vision-dom';
import { WrapWithHits } from './utils';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('InfiniteHits', module);

stories
  .add('default', () => (
    <WrapWithHits linkedStoryGroup="InfiniteHits" pagination={false}>
      <InfiniteHits />
    </WrapWithHits>
  ))
  .add('with previous button', () => {
    const urlLogger = action('Routing state');
    return (
      <WrapWithHits
        linkedStoryGroup="InfiniteHits"
        pagination={false}
        initialSearchState={{ page: 3 }}
        onSearchStateChange={({ configure, ...searchState }) => {
          urlLogger(JSON.stringify(searchState, null, 2));
        }}
      >
        <InfiniteHits showPrevious={true} />
      </WrapWithHits>
    );
  })
  .add('with custom rendering', () => {
    const urlLogger = action('Routing state');

    const MyInfiniteHits = ({
      hits,
      hasMore,
      hasPrevious,
      refine,
      refinePrevious,
    }) => (
      <div>
        <button disabled={!hasPrevious} onClick={refinePrevious}>
          Show previous
        </button>
        <ol>
          {hits.map(hit => (
            <li key={hit.id}>{hit.name}</li>
          ))}
        </ol>
        <button disabled={!hasMore} onClick={refine}>
          Show more
        </button>
      </div>
    );

    MyInfiniteHits.propTypes = {
      hits: PropTypes.array.isRequired,
      hasMore: PropTypes.bool.isRequired,
      hasPrevious: PropTypes.bool.isRequired,
      refine: PropTypes.func.isRequired,
      refinePrevious: PropTypes.func.isRequired,
    };

    const CustomInfiniteHits = connectInfiniteHits(MyInfiniteHits);

    return (
      <WrapWithHits
        linkedStoryGroup="InfiniteHits"
        pagination={false}
        initialSearchState={{ page: 3 }}
        onSearchStateChange={({ configure, ...searchState }) => {
          urlLogger(JSON.stringify(searchState, null, 2));
        }}
      >
        <CustomInfiniteHits />
      </WrapWithHits>
    );
  })
  .add('with custom hitComponent', () => {
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
      <WrapWithHits linkedStoryGroup="InfiniteHits">
        <InfiniteHits hitComponent={HealthFacility} />
      </WrapWithHits>
    );
  });
