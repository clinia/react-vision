import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translatable } from '@clinia/react-vizion-core';
import { createClassNames } from '../core/utils';
import List from './List';
import Link from './Link';

const cx = createClassNames('menu');

class Menu extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    refine: PropTypes.func.isRequired,
    createURL: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        isRefined: PropTypes.bool.isRequired,
      })
    ),
    canRefine: PropTypes.bool.isRequired,
    showMore: PropTypes.bool,
    limit: PropTypes.number,
    showMoreLimit: PropTypes.number,
    transformItems: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  renderItem = item => {
    const { createURL } = this.props;
    const label = item.label;
    return (
      <Link
        className={cx('link')}
        onClick={() => this.selectItem(item)}
        href={createURL(item.value)}
      >
        <span className={cx('label')}>{label}</span>{' '}
        <span className={cx('count')}>{item.count}</span>
      </Link>
    );
  };

  selectItem = item => {
    this.props.refine(item.value);
  };

  render() {
    const {
      translate,
      items,
      showMore,
      limit,
      showMoreLimit,
      canRefine,
      className,
    } = this.props;
    return (
      <List
        renderItem={this.renderItem}
        selectItem={this.selectItem}
        cx={cx}
        translate={translate}
        items={items}
        showMore={showMore}
        limit={limit}
        showMoreLimit={showMoreLimit}
        canRefine={canRefine}
        className={className}
      />
    );
  }
}

export default translatable({
  showMore: extended => (extended ? 'Show less' : 'Show more'),
  noResults: 'No results',
  submit: null,
  reset: null,
})(Menu);
