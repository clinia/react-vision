import React from 'react';

import Search from '../components/Search';
import Hits from '../components/Hits';

class List extends React.Component {
  render() {
    return (
      <Search>
        <Hits />
      </Search>
    );
  }
}

export default List;
