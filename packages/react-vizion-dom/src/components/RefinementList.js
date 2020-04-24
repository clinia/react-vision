import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translatable } from '@clinia/react-vizion-core';
import { createClassNames } from '../core/utils';
import List from './List';

const cx = createClassNames('refinementlist');

class RefinementList extends PureComponent {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    refine: PropTypes.func.isRequired,
    createURL: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.arrayOf(PropTypes.string).isRequired,
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

  selectItem = item => {
    this.props.refine(item.value);
  };

  renderItem = item => {
    const label = item.label;

    return (
      <label className={cx('label')}>
        <input
          className={cx('checkbox')}
          type="checkbox"
          checked={item.isRefined}
          onChange={() => this.selectItem(item)}
        />
        <span className={cx('labelText')}>{label}</span>{' '}
        <span className={cx('count')}>{item.count.toLocaleString()}</span>
      </label>
    );
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
  resetTitle: 'Clear the search query.',
  submitTitle: 'Submit your search query.',
  placeholder: 'Search here…',
})(RefinementList);
