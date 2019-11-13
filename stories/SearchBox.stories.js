// import React, { Component } from 'react';
// import { storiesOf } from '@storybook/react';
// import { object, boolean, text } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { SearchBox } from 'react-vision-dom';
// import { WrapWithHits } from './utils';

// const stories = storiesOf('SearchBox', module);

// stories.addParameters({ jest: ['SearchBox'] }).add('Default SearchBox', () => (
//   <WrapWithHits
//     searchBox={false}
//     hasPlayground={true}
//     linkedStoryGroup="SearchBox"
//   >
//     <SearchBox
//       showLoadingIndicator={boolean('showLoadingIndicator', true)}
//       loading={boolean('loading', true)}
//       searchAsYouType={boolean('searchAsYouType', true)}
//       placeholder={text('placeholder', 'Default')}
//       onInput={action('onInput')}
//       onSubmit={action('onSubmit')}
//     />
//   </WrapWithHits>
// ));

// const CustomButton = () => (
//   <button style={{ backgroundColor: 'blue', color: 'white' }}>
//     Custom Search Button
//   </button>
// );

// const CustomClearButton = () => (
//   <button type="reset">Custom clear button</button>
// );

// const CustomLoadingIndicator = () => (
//   <span style={{ backgroundColor: 'seagreen', width: '10px' }} />
// );

// stories.add('Custom SearchBox', () => (
//   <WrapWithHits
//     searchBox={false}
//     hasPlayground={true}
//     linkedStoryGroup="SearchBox"
//   >
//     <SearchBox
//       showLoadingIndicator={boolean('showLoadingIndicator', true)}
//       loading={boolean('loading', true)}
//       searchAsYouType={boolean('searchAsYouType', true)}
//       placeholder={text('placeholder', 'Custom placeholder')}
//       submitButton={<CustomButton />}
//       clearButton={clearSearch => (
//         <CustomClearButton clearSearch={clearSearch} />
//       )}
//       loadingIndicator={<CustomLoadingIndicator />}
//       onBlur={action('customOnBlur')}
//       onChange={action('customOnChange')}
//       onClear={action('customOnClear')}
//       onFocus={action('customOnFocus')}
//       onKeyPress={action('customOnKeyPress')}
//       onInput={action('customOnInput')}
//       onSubmit={action('customOnSubmit')}
//     />
//   </WrapWithHits>
// ));
