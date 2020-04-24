import React from 'react';
import { storiesOf } from '@storybook/react';
import { Configure } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('Configure', module);

stories.add('default', () => <ConfigureExample />);

class ConfigureExample extends React.Component {
  constructor() {
    super();
    this.state = { perPage: 3 };
  }

  onClick = () => {
    const perPage = this.state.perPage === 3 ? 1 : 3;
    this.setState({ perPage });
  };

  render() {
    return (
      <WrapWithHits linkedStoryGroup="Configure">
        <Configure perPage={this.state.perPage} />
        <button onClick={this.onClick}>Toggle HitsPerPage</button>
      </WrapWithHits>
    );
  }
}
