import React from 'react';
import { storiesOf } from '@storybook/react';
import { Hits, Vision, InfiniteHits } from 'react-vision-dom';
import { object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import cliniasearch from 'cliniasearch/lite';

const stories = storiesOf('Hits', module);

const searchClient = cliniasearch('TODO', 'AAW3nfvI79tj4LzECYZSEbDP7lqBpFd5', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

stories.addParameters({ jest: ['Hits'] }).add('Default Hits', () => (
  <Vision indexName="health_facility" searchClient={searchClient}>
    <Hits
      style={object('style', {
        backgroundColor: 'white',
      })}
      onClick={action('onClick')}
    />
  </Vision>
));

/* Custom Hits story */

//Temporarily until we have the styles decided
const style = {
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  width: '40%',
  borderRadius: '5px',
  padding: '2px 16px',
  whiteSpace: 'pre-wrap',
};

const CustomNoResultsFound = () => (
  <div style={style}>0 results were found</div>
);

const CustomHitComponent = ({ record }) => (
  <div style={style}>
    <h3>Custom Hit Component Header</h3>
    {JSON.stringify(record, null, 2)}
  </div>
);

stories.add('Custom Hits', () => (
  <Vision indexName="health_facility" searchClient={searchClient}>
    <Hits
      style={object('style', {
        backgroundColor: 'white',
      })}
      onClick={action('onClick')}
      noResultsFound={<CustomNoResultsFound />}
      hit={searchResult => <CustomHitComponent searchResult={searchResult} />}
    />
  </Vision>
));

stories.add('InfinitHits', () => (
  <Vision indexName="health_facility" searchClient={searchClient}>
    <InfiniteHits
      onClick={action('onClick')}
      showPrevious={boolean('showPrevious', false)}
    />
  </Vision>
));
