import React from 'react';
import { storiesOf } from '@storybook/react';
import { Hits, Vision } from 'react-vision-dom';
import { object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Hits', module);
const mockResult = [
  {
    data: {
      attributes: {
        firstName: 'That',
        lastName: 'OtherProfessional',
        professionalTitle: 'DR',
        practiceNumber: '12345',
        contacts: {
          phones: [
            {
              number: '(765) 434-5678',
              type: 'MOBILE',
            },
            {
              number: '(234) 234-2342',
              type: 'PAGER',
            },
          ],
          emails: ['test@clinia.ca'],
        },
        casesToRefer: 'test',
        modalities: 'test',
      },
      type: 'professionalProfiles',
    },
  },
];

stories.addParameters({ jest: ['Hits'] }).add('Default Hits', () => (
  <Vision
    indexName="health_facility"
    searchClient={{
      search() {
        return Promise.resolve({
          results: [{ records: [{ name: 'Fake result' }] }],
        });
      },
    }}
  >
    <Hits
      style={object('style', {
        backgroundColor: 'white',
      })}
      results={object('results', mockResult)}
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

const CustomHitComponent = ({ searchResult }) => (
  <div style={style}>
    <h3>Custom Hit Component Header</h3>
    {JSON.stringify(searchResult, null, 2)}
  </div>
);

stories.add('Custom Hits', () => (
  <Vision
    indexName="health_facility"
    searchClient={{
      search() {
        return Promise.resolve({
          results: [{ records: [{ name: 'Fake result' }] }],
        });
      },
    }}
  >
    <Hits
      style={object('style', {
        backgroundColor: 'white',
      })}
      results={object('results', mockResult)}
      onClick={action('onClick')}
      noResultsFound={<CustomNoResultsFound />}
      hit={searchResult => <CustomHitComponent searchResult={searchResult} />}
    />
  </Vision>
));
