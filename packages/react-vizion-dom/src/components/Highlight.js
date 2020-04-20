import React from 'react';
import { createClassNames } from '../core/utils';
import Highlighter from './Highlighter';

const cx = createClassNames('highlight');

const Highlight = props => (
  <Highlighter {...props} highlightProperty="_highlight" cx={cx} />
);

export default Highlight;
