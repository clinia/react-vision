import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translatable } from '@clinia/react-vision-core';
import { createClassNames } from '../core/utils';

const cx = createClassNames('Stats');

class Stats extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    took: PropTypes.number.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { translate, total, took, className } = this.props;

    return (
      <div className={classNames(cx(''), className)}>
        <span className={cx('text')}>{translate('stats', total, took)}</span>
      </div>
    );
  }
}

export default translatable({
  stats: (n, ms) =>
    `${n.toLocaleString()} results found in ${ms.toLocaleString()}ms`,
})(Stats);
