import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { create } from '@storybook/theming';

addParameters({
  options: {
    panelPosition: 'bottom',
    theme: create({
      base: 'light',
      brandTitle: 'react-vision',
      brandUrl: 'https://github.com/clinia/react-vision',
    }),
  },
});

addDecorator(withKnobs);
addDecorator(withA11y);

const req = require.context('../stories', true, /\.stories\.(js|ts|tsx)$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
