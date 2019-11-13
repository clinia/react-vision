import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { storiesOf } from '@storybook/react';
import { Vision, AutoComplete } from 'react-vision-dom';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

const stories = storiesOf('AutoComplete', module);

const searchClient = cliniasearch('TODO', 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

stories
  .addParameters({ jest: ['AutoComplete'] })
  .add('Default AutoComplete', () => (
    <Vision searchClient={searchClient} indexName="health_facility">
      <AutoComplete
        onSubmit={action('onSubmit')}
        onClear={action('onClear')}
        onSuggestionSelected={action('onSuggestionSelected')}
        onBlur={action('onBlur')}
        onFocus={action('onFocus')}
        onChange={action('onChange')}
        onKeyDown={action('onKeyDown')}
        showLoadingIndicator={boolean('showLoadingIndicator', true)}
        disabled={boolean('disabled', false)}
      />
    </Vision>
  ));

const CustomButton = () => (
  <button style={{ backgroundColor: 'blue', color: 'white' }}>
    Custom Search Button
  </button>
);

const CustomClearButton = () => (
  <button type="reset">Custom clear button</button>
);

const CustomLoadingIndicator = () => (
  <span style={{ backgroundColor: 'seagreen', width: '10px' }} />
);

const CustomSuggestion = ({ suggestion }) => (
  <div key={suggestion.suggestion} style={{ color: 'blue' }}>
    {suggestion.suggestion}
  </div>
);

stories
  .addParameters({ jest: ['AutoComplete'] })
  .add('Custom AutoComplete', () => (
    <Vision searchClient={searchClient} indexName="health_facility">
      <AutoComplete
        onSubmit={action('onSubmit')}
        onClear={action('onClear')}
        onSuggestionSelected={action('onSuggestionSelected')}
        onBlur={action('onBlur')}
        onFocus={action('onFocus')}
        onChange={action('onChange')}
        onKeyDown={action('onKeyDown')}
        showLoadingIndicator={boolean('showLoadingIndicator', true)}
        disabled={boolean('disabled', false)}
        loadingIndicator={<CustomLoadingIndicator />}
        clear={<CustomClearButton />}
        submit={<CustomButton />}
        renderSuggestion={suggestion => (
          <CustomSuggestion suggestion={suggestion} />
        )}
      />
    </Vision>
  ));
